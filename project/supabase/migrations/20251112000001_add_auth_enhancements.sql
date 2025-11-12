-- Add authentication enhancements for OAuth and email verification
-- This migration adds support for Google/Apple OAuth and email verification

-- Add authentication-related columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS signup_method TEXT DEFAULT 'email' CHECK (signup_method IN ('email', 'google', 'apple')),
ADD COLUMN IF NOT EXISTS oauth_provider TEXT,
ADD COLUMN IF NOT EXISTS oauth_provider_id TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_verification_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS account_disabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS account_disabled_reason TEXT;

-- Create email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_token CHECK (used_at IS NULL OR expires_at > used_at)
);

-- Create OAuth accounts table for linking multiple OAuth providers
CREATE TABLE IF NOT EXISTS oauth_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'apple')),
    provider_user_id TEXT NOT NULL,
    provider_email TEXT NOT NULL,
    provider_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

-- Create authentication audit log
CREATE TABLE IF NOT EXISTS auth_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL CHECK (action IN ('signup', 'signin', 'signout', 'oauth_signup', 'oauth_signin', 'email_verified', 'password_reset', 'account_disabled', 'account_enabled')),
    provider TEXT DEFAULT 'email',
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires_at ON email_verification_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider ON oauth_accounts(provider);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider_user_id ON oauth_accounts(provider, provider_user_id);

CREATE INDEX IF NOT EXISTS idx_auth_audit_log_user_id ON auth_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_created_at ON auth_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_action ON auth_audit_log(action);

-- Add index for profile authentication columns
CREATE INDEX IF NOT EXISTS idx_profiles_email_confirmed ON profiles(email_confirmed);
CREATE INDEX IF NOT EXISTS idx_profiles_signup_method ON profiles(signup_method);
-- Note: last_active_date index removed - column doesn't exist in current schema

-- Row Level Security (RLS) Policies

-- Enable RLS on new tables
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_verification_tokens
CREATE POLICY "Users can view their own verification tokens"
ON email_verification_tokens FOR SELECT
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own verification tokens"
ON email_verification_tokens FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own verification tokens"
ON email_verification_tokens FOR UPDATE
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own verification tokens"
ON email_verification_tokens FOR DELETE
USING (auth.uid()::text = user_id::text);

-- RLS policies for oauth_accounts
CREATE POLICY "Users can view their own OAuth accounts"
ON oauth_accounts FOR SELECT
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own OAuth accounts"
ON oauth_accounts FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own OAuth accounts"
ON oauth_accounts FOR UPDATE
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own OAuth accounts"
ON oauth_accounts FOR DELETE
USING (auth.uid()::text = user_id::text);

-- RLS policies for auth_audit_log (users can only read their own logs)
CREATE POLICY "Users can view their own audit logs"
ON auth_audit_log FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Service functions for email verification
CREATE OR REPLACE FUNCTION create_email_verification_token(
    p_user_id UUID,
    p_email TEXT
)
RETURNS TABLE(token TEXT) AS $$
BEGIN
    -- Delete any existing unused tokens for this user
    DELETE FROM email_verification_tokens
    WHERE user_id = p_user_id AND used_at IS NULL;

    -- Create new verification token (expires in 24 hours)
    INSERT INTO email_verification_tokens (user_id, token, email, expires_at)
    VALUES (
        p_user_id,
        gen_random_uuid()::text,
        p_email,
        NOW() + INTERVAL '24 hours'
    );

    RETURN QUERY SELECT token FROM email_verification_tokens
    WHERE user_id = p_user_id AND used_at IS NULL
    ORDER BY created_at DESC LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION verify_email_token(
    p_token TEXT
)
RETURNS TABLE(success BOOLEAN, user_id UUID, message TEXT) AS $$
DECLARE
    v_user_id UUID;
    v_expired BOOLEAN;
BEGIN
    -- Check if token exists and is valid
    SELECT user_id, expires_at < NOW() INTO v_user_id, v_expired
    FROM email_verification_tokens
    WHERE token = p_token AND used_at IS NULL;

    IF v_user_id IS NULL THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Invalid verification token'::TEXT;
        RETURN;
    END IF;

    IF v_expired THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Verification token has expired'::TEXT;
        RETURN;
    END IF;

    -- Mark token as used
    UPDATE email_verification_tokens
    SET used_at = NOW()
    WHERE token = p_token;

    -- Update user's email confirmation status
    UPDATE profiles
    SET email_confirmed = TRUE,
        email_verification_sent_at = NOW(),
        updated_at = NOW()
    WHERE id = v_user_id;

    -- Log the verification
    INSERT INTO auth_audit_log (user_id, action, success)
    VALUES (v_user_id, 'email_verified', TRUE);

    RETURN QUERY SELECT TRUE, v_user_id, 'Email verified successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log authentication events
CREATE OR REPLACE FUNCTION log_auth_event(
    p_user_id UUID,
    p_action TEXT,
    p_provider TEXT DEFAULT 'email',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE,
    p_error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO auth_audit_log (
        user_id,
        action,
        provider,
        ip_address,
        user_agent,
        success,
        error_message
    )
    VALUES (
        p_user_id,
        p_action,
        p_provider,
        p_ip_address,
        p_user_agent,
        p_success,
        p_error_message
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired verification tokens
CREATE OR REPLACE FUNCTION cleanup_expired_verification_tokens()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    DELETE FROM email_verification_tokens
    WHERE expires_at < NOW();

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update OAuth account on sign in
CREATE OR REPLACE FUNCTION upsert_oauth_account(
    p_user_id UUID,
    p_provider TEXT,
    p_provider_user_id TEXT,
    p_provider_email TEXT,
    p_provider_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO oauth_accounts (
        user_id,
        provider,
        provider_user_id,
        provider_email,
        provider_data,
        updated_at
    )
    VALUES (
        p_user_id,
        p_provider,
        p_provider_user_id,
        p_provider_email,
        p_provider_data,
        NOW()
    )
    ON CONFLICT (provider, provider_user_id)
    DO UPDATE SET
        user_id = EXCLUDED.user_id,
        provider_email = EXCLUDED.provider_email,
        provider_data = EXCLUDED.provider_data,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp for oauth_accounts
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER oauth_accounts_updated_at
    BEFORE UPDATE ON oauth_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for user authentication statistics
CREATE OR REPLACE VIEW auth_statistics AS
SELECT
    COUNT(DISTINCT p.id) as total_users,
    COUNT(DISTINCT CASE WHEN p.email_confirmed = TRUE THEN p.id END) as verified_users,
    COUNT(DISTINCT CASE WHEN p.signup_method = 'google' THEN p.id END) as google_users,
    COUNT(DISTINCT CASE WHEN p.signup_method = 'apple' THEN p.id END) as apple_users,
    COUNT(DISTINCT CASE WHEN p.signup_method = 'email' THEN p.id END) as email_users,
    COUNT(DISTINCT CASE WHEN p.account_disabled = TRUE THEN p.id END) as disabled_users,
    AVG(p.xp) as avg_xp,
    MAX(p.xp) as max_xp,
    COUNT(DISTINCT o.id) as total_oauth_connections
FROM profiles p
LEFT JOIN oauth_accounts o ON p.id = o.user_id
WHERE p.account_disabled = FALSE;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT SELECT ON auth_statistics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON email_verification_tokens TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON oauth_accounts TO authenticated;
GRANT SELECT ON auth_audit_log TO authenticated;

-- Comments for documentation
COMMENT ON TABLE email_verification_tokens IS 'Stores email verification tokens for user account verification';
COMMENT ON TABLE oauth_accounts IS 'Links OAuth provider accounts to user profiles';
COMMENT ON TABLE auth_audit_log IS 'Audit log for authentication events';
COMMENT ON VIEW auth_statistics IS 'Aggregated authentication and user statistics';

COMMENT ON COLUMN profiles.email_confirmed IS 'Whether the user has verified their email address';
COMMENT ON COLUMN profiles.signup_method IS 'How the user signed up (email, google, apple)';
COMMENT ON COLUMN profiles.oauth_provider IS 'Primary OAuth provider if applicable';
COMMENT ON COLUMN profiles.oauth_provider_id IS 'OAuth provider user ID';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user avatar image';
COMMENT ON COLUMN profiles.last_sign_in_at IS 'Last successful sign in timestamp';
COMMENT ON COLUMN profiles.email_verification_sent_at IS 'When the last verification email was sent';
COMMENT ON COLUMN profiles.account_disabled IS 'Whether the user account is disabled';
COMMENT ON COLUMN profiles.account_disabled_reason IS 'Reason for account being disabled';