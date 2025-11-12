# 🔐 OAuth & Email Setup Guide

This guide will help you configure Google OAuth, Apple Sign-In, and email services for your PyLearn platform.

---

## 📋 Prerequisites

- Supabase project with CLI installed
- Domain name (for production)
- Google Cloud Console account
- Apple Developer account (for Apple Sign-In)
- Email service (Resend, SendGrid, or similar)

---

## 🔧 Google OAuth Setup

### 1. Google Cloud Console Configuration

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable Google+ API**
   ```
   Navigate to: APIs & Services > Library
   Search: "Google+ API"
   Click "Enable"
   ```

3. **Create OAuth Credentials**
   ```
   Navigate to: APIs & Services > Credentials
   Click: "Create Credentials" > "OAuth client ID"
   Application type: "Web application"
   Name: "PyLearn Web App"

   Authorized JavaScript origins:
   - http://localhost:3000 (development)
   - https://yourdomain.com (production)

   Authorized redirect URIs:
   - http://localhost:3000/auth/callback (development)
   - https://yourdomain.com/auth/callback (production)
   ```

4. **Get Your Credentials**
   ```
   Note down:
   - Client ID
   - Client Secret
   ```

### 2. Supabase Google OAuth Configuration

1. **Enable Google Provider in Supabase**
   ```bash
   # Using Supabase CLI
   supabase login
   supabase projects select YOUR_PROJECT_ID

   # Configure Google OAuth
   supabase auth providers enable google
   ```

2. **Set Environment Variables**
   ```bash
   # In your Supabase project settings > Authentication > Providers
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Update Supabase Config**
   ```typescript
   // In supabase/config.toml
   [auth.external.google]
   enabled = true
   client_id = "your_google_client_id"
   secret = "your_google_client_secret"
   redirect_uri = "https://yourdomain.com/auth/callback"
   ```

---

## 🍎 Apple Sign-In Setup

### 1. Apple Developer Configuration

1. **Create App ID**
   ```
   Go to: developer.apple.com
   Navigate to: Certificates, Identifiers & Profiles > Identifiers
   Click: "+" to create new identifier
   Type: "App ID"
   Description: "PyLearn Web App"
   Bundle ID: "com.yourcompany.pylearn"

   Capabilities:
   ✓ Sign In with Apple
   ```

2. **Create Service ID**
   ```
   Navigate to: Identifiers > "+" > "Service ID"
   Description: "PyLearn Web Service"
   Identifier: "com.yourcompany.pylearn.web"

   Configure:
   ✓ Sign In with Apple
   Primary App ID: Select your App ID
   Return URLs:
   - https://yourdomain.com/auth/callback
   - http://localhost:3000/auth/callback
   ```

3. **Generate Private Key**
   ```
   Navigate to: Keys > "+" > "Sign in with Apple"
   Key Name: "PyLearn Apple Sign In Key"
   Download the .p8 file (save it securely!)
   Note down: Key ID
   ```

### 2. Supabase Apple OAuth Configuration

1. **Enable Apple Provider**
   ```bash
   supabase auth providers enable apple
   ```

2. **Set Environment Variables**
   ```bash
   # Upload your private key file to Supabase
   APPLE_CLIENT_ID=com.yourcompany.pylearn.web
   APPLE_CLIENT_SECRET=your_apple_private_key_content
   ```

---

## 📧 Email Service Setup (Resend Recommended)

### 1. Resend Configuration

1. **Create Resend Account**
   ```
   Visit: resend.com
   Sign up and verify your domain
   ```

2. **Verify Your Domain**
   ```
   Navigate to: Domains > Add Domain
   Enter: yourdomain.com
   Add DNS records as instructed
   Wait for verification
   ```

3. **Get API Key**
   ```
   Navigate to: API Keys > Create API Key
   Copy the API key
   ```

### 2. Supabase Email Configuration

1. **Set Environment Variables**
   ```bash
   # In Supabase project settings
   RESEND_API_KEY=re_your_resend_api_key
   SITE_URL=https://yourdomain.com
   EMAIL_SERVICE_KEY=your_secret_service_key
   ```

2. **Configure Email Templates**
   ```sql
   -- Update email templates in Supabase Dashboard
   -- Authentication > Email Templates
   ```

### 3. Edge Function Environment Variables

```bash
# Deploy to Supabase
supabase functions deploy email-service

# Set secrets
supabase secrets set RESEND_API_KEY=re_your_resend_api_key
supabase secrets set EMAIL_SERVICE_KEY=your_secret_service_key
supabase secrets set SITE_URL=https://yourdomain.com
supabase secrets set STREAK_MAINTENANCE_SERVICE_KEY=your_maintenance_key
```

---

## 🔒 Security Configuration

### 1. CORS Settings

```typescript
// Update auth-middleware.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com', // Your domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
}
```

### 2. Environment Variables for Production

```bash
# .env.production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_private_key

# Email Service
RESEND_API_KEY=re_your_resend_api_key
EMAIL_SERVICE_KEY=your_secret_service_key

# Security
STREAK_MAINTENANCE_SERVICE_KEY=your_maintenance_key
ALLOWED_ORIGINS=https://yourdomain.com

# Site Configuration
SITE_URL=https://yourdomain.com
```

---

## 🚀 Deployment Steps

### 1. Update Database
```bash
# Apply authentication migrations
supabase db push
```

### 2. Deploy Edge Functions
```bash
# Deploy all Edge Functions
supabase functions deploy --all

# Set secrets
supabase secrets set RESEND_API_KEY=your_key
supabase secrets set EMAIL_SERVICE_KEY=your_key
supabase secrets set STREAK_MAINTENANCE_SERVICE_KEY=your_key
```

### 3. Test Configuration

1. **Test Google OAuth**
   ```
   Visit: https://yourdomain.com/auth
   Click: "Continue with Google"
   Verify: Redirect and profile creation works
   ```

2. **Test Apple Sign-In**
   ```
   Visit: https://yourdomain.com/auth
   Click: "Continue with Apple"
   Verify: Sign in and profile creation works
   ```

3. **Test Email Verification**
   ```
   Create a new account with email
   Check: Welcome email arrives
   Verify: Verification link works
   ```

---

## 🔍 Troubleshooting

### Common Issues & Solutions

1. **Google OAuth Redirect Error**
   ```
   Problem: redirect_uri_mismatch
   Solution: Check authorized redirect URIs in Google Console
   ```

2. **Apple Sign-In Not Working**
   ```
   Problem: Invalid client_id or client_secret
   Solution: Verify Service ID configuration and private key format
   ```

3. **Emails Not Sending**
   ```
   Problem: API key invalid or domain not verified
   Solution: Check Resend API key and domain verification status
   ```

4. **Verification Links Expired**
   ```
   Problem: Links expire too quickly
   Solution: Adjust expiration time in email_verification_tokens table
   ```

5. **CORS Errors**
   ```
   Problem: Cross-origin requests blocked
   Solution: Update ALLOWED_ORIGINS in Edge Functions
   ```

### Debug Mode

```typescript
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development'

if (DEBUG) {
  console.log('OAuth Debug Info:', { user, session, error })
}
```

---

## 📊 Monitoring & Analytics

### 1. Authentication Events
```sql
-- Monitor authentication events
SELECT
  action,
  provider,
  success,
  COUNT(*) as count,
  created_at::date as date
FROM auth_audit_log
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY action, provider, success, date
ORDER BY date DESC;
```

### 2. Email Verification Stats
```sql
-- Check email verification rates
SELECT
  signup_method,
  email_confirmed,
  COUNT(*) as user_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM profiles
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY signup_method, email_confirmed;
```

### 3. OAuth Provider Usage
```sql
-- OAuth provider statistics
SELECT
  provider,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_connections,
  MAX(created_at) as last_connection
FROM oauth_accounts
GROUP BY provider;
```

---

## 🛡️ Security Best Practices

1. **Regular Key Rotation**
   ```bash
   # Rotate OAuth secrets every 90 days
   # Update environment variables
   # Test in staging first
   ```

2. **Monitor Authentication Logs**
   ```sql
   -- Check for suspicious activity
   SELECT *
   FROM auth_audit_log
   WHERE success = FALSE
   AND created_at >= NOW() - INTERVAL '1 hour'
   ORDER BY created_at DESC;
   ```

3. **Rate Limiting**
   ```typescript
   // Already implemented in auth-middleware.ts
   checkRateLimit(clientIP, 10, 60000) // 10 requests per minute
   ```

4. **Input Validation**
   ```typescript
   // Already implemented in email service
   validateInput(data, rules)
   ```

---

## 📞 Support

If you encounter issues:

1. **Check logs**: Supabase Functions > Logs
2. **Verify environment variables**: All secrets properly set
3. **Test in development**: Local environment first
4. **Review provider settings**: OAuth provider configurations
5. **Check DNS records**: Domain verification for email

Email: support@pylearn.com
Documentation: [PyLearn Docs](https://docs.pylearn.com)