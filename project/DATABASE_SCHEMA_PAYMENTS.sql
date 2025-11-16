-- Database Schema for Payment System
-- Run this in your Supabase SQL editor

-- Add payment fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_ad_free BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ad_free_plan_id TEXT,
ADD COLUMN IF NOT EXISTS ad_free_purchased_at TIMESTAMP WITH TIME ZONE;

-- Create payment orders table
CREATE TABLE IF NOT EXISTS payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created', -- created, paid, failed, refunded
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    payment_method TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ad-free purchases table
CREATE TABLE IF NOT EXISTS ad_free_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- NULL for lifetime
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment transactions table for audit
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES payment_orders(id) ON DELETE CASCADE,
    payment_id TEXT,
    gateway TEXT NOT NULL DEFAULT 'razorpay',
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL, -- success, failed, refund
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_ad_free_purchases_user_id ON ad_free_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_free_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own payment data
CREATE POLICY "Users can view their own payment orders" ON payment_orders
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own ad-free purchases" ON ad_free_purchases
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payment transactions" ON payment_transactions
    FOR ALL USING (auth.uid() = user_id);

-- Functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_payment_orders_updated_at
    BEFORE UPDATE ON payment_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_free_purchases_updated_at
    BEFORE UPDATE ON ad_free_purchases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user is ad-free
CREATE OR REPLACE FUNCTION is_user_ad_free(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_ad_free BOOLEAN;
BEGIN
    SELECT profiles.is_ad_free INTO is_ad_free
    FROM profiles
    WHERE profiles.id = user_uuid;

    RETURN COALESCE(is_ad_free, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Views for easier queries

-- User payment summary view
CREATE OR REPLACE VIEW user_payment_summary AS
SELECT
    u.id as user_id,
    u.username,
    u.display_name,
    u.is_ad_free,
    u.ad_free_purchased_at,
    COALESCE(p.total_spent, 0) as total_spent,
    COALESCE(p.purchase_count, 0) as purchase_count,
    CASE WHEN u.is_ad_free THEN 'Ad-Free User' ELSE 'Free User' END as user_type
FROM profiles u
LEFT JOIN (
    SELECT
        user_id,
        SUM(amount) as total_spent,
        COUNT(*) as purchase_count
    FROM ad_free_purchases
    WHERE is_active = TRUE
    GROUP BY user_id
) p ON u.id = p.user_id;

-- Grant permissions to authenticated users
GRANT SELECT ON user_payment_summary TO authenticated;