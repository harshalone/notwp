-- =====================================================
-- Newsletter Feature Migration
-- =====================================================
-- This migration creates the necessary tables for the newsletter feature
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS nwp_newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);

-- Create newsletter_emails table (email history)
CREATE TABLE IF NOT EXISTS nwp_newsletter_emails (
    id BIGSERIAL PRIMARY KEY,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    recipient_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    sent_by BIGINT REFERENCES nwp_accounts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON nwp_newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON nwp_newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON nwp_newsletter_subscribers(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_emails_sent_at ON nwp_newsletter_emails(sent_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_emails_sent_by ON nwp_newsletter_emails(sent_by);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_newsletter_subscriber_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();

    -- Set unsubscribed_at when status changes to unsubscribed
    IF NEW.status = 'unsubscribed' AND OLD.status != 'unsubscribed' THEN
        NEW.unsubscribed_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_newsletter_subscriber_updated_at
    BEFORE UPDATE ON nwp_newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_newsletter_subscriber_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE nwp_newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE nwp_newsletter_emails ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for newsletter_subscribers
-- Admins can view all subscribers
CREATE POLICY "Admins can view all subscribers"
    ON nwp_newsletter_subscribers
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nwp_accounts
            WHERE nwp_accounts.user_uid = auth.uid()
            AND nwp_accounts.role IN ('administrator', 'editor')
        )
    );

-- Admins can update subscribers (for unsubscribing)
CREATE POLICY "Admins can update subscribers"
    ON nwp_newsletter_subscribers
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nwp_accounts
            WHERE nwp_accounts.user_uid = auth.uid()
            AND nwp_accounts.role IN ('administrator', 'editor')
        )
    );

-- Anyone can insert (for public subscription forms)
CREATE POLICY "Anyone can subscribe"
    ON nwp_newsletter_subscribers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Create RLS policies for newsletter_emails
-- Admins can view email history
CREATE POLICY "Admins can view email history"
    ON nwp_newsletter_emails
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nwp_accounts
            WHERE nwp_accounts.user_uid = auth.uid()
            AND nwp_accounts.role IN ('administrator', 'editor')
        )
    );

-- Admins can insert emails
CREATE POLICY "Admins can send emails"
    ON nwp_newsletter_emails
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nwp_accounts
            WHERE nwp_accounts.user_uid = auth.uid()
            AND nwp_accounts.role IN ('administrator', 'editor')
        )
    );

-- Insert some sample data (optional - remove if not needed)
-- INSERT INTO nwp_newsletter_subscribers (email, name, status)
-- VALUES
--     ('subscriber1@example.com', 'John Doe', 'active'),
--     ('subscriber2@example.com', 'Jane Smith', 'active'),
--     ('subscriber3@example.com', 'Bob Johnson', 'unsubscribed');

-- =====================================================
-- Create Newsletter Settings Table
-- =====================================================

-- Create newsletter_settings table for AWS SES configuration
CREATE TABLE IF NOT EXISTS nwp_newsletter_settings (
  id INT PRIMARY KEY DEFAULT 1,
  aws_region VARCHAR(50) NOT NULL,
  aws_access_key_id TEXT NOT NULL,
  aws_secret_access_key TEXT NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Add comment to table
COMMENT ON TABLE nwp_newsletter_settings IS 'Stores AWS SES configuration for newsletter emails (singleton table)';

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_newsletter_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_newsletter_settings_updated_at
    BEFORE UPDATE ON nwp_newsletter_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_newsletter_settings_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE nwp_newsletter_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for newsletter_settings
-- Only admins can view settings
CREATE POLICY "Admins can view newsletter settings"
    ON nwp_newsletter_settings
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nwp_accounts
            WHERE nwp_accounts.user_uid = auth.uid()
            AND nwp_accounts.role IN ('administrator', 'editor')
        )
    );

-- Only admins can update settings
CREATE POLICY "Admins can update newsletter settings"
    ON nwp_newsletter_settings
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nwp_accounts
            WHERE nwp_accounts.user_uid = auth.uid()
            AND nwp_accounts.role IN ('administrator', 'editor')
        )
    );

-- Only admins can insert settings
CREATE POLICY "Admins can insert newsletter settings"
    ON nwp_newsletter_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nwp_accounts
            WHERE nwp_accounts.user_uid = auth.uid()
            AND nwp_accounts.role IN ('administrator', 'editor')
        )
    );

-- =====================================================
-- Migration Complete
-- =====================================================
-- Tables created:
--   1. nwp_newsletter_subscribers - Stores newsletter subscribers
--   2. nwp_newsletter_emails - Stores email send history
--   3. nwp_newsletter_settings - Stores AWS SES configuration
--
-- Next steps:
--   1. Run this migration in Supabase SQL Editor
--   2. Configure your email service provider in the settings page
--   3. Add a subscription form to your public website
-- =====================================================
