-- =====================================================
-- Plugins Feature Migration
-- =====================================================
-- This migration creates the necessary table for the plugins feature
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Create plugins table
CREATE TABLE IF NOT EXISTS nwp_plugins (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    installed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_plugins_category ON nwp_plugins(category);
CREATE INDEX IF NOT EXISTS idx_plugins_installed ON nwp_plugins(installed);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_plugin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_plugin_updated_at
    BEFORE UPDATE ON nwp_plugins
    FOR EACH ROW
    EXECUTE FUNCTION update_plugin_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE nwp_plugins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for nwp_plugins
-- Anyone can view plugins (public access)
CREATE POLICY "Anyone can view plugins"
    ON nwp_plugins
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Only admins can update plugins
CREATE POLICY "Admins can update plugins"
    ON nwp_plugins
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nwp_accounts
            WHERE nwp_accounts.user_uid = auth.uid()
            AND nwp_accounts.role IN ('administrator', 'editor')
        )
    );

-- Only admins can insert plugins
CREATE POLICY "Admins can insert plugins"
    ON nwp_plugins
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nwp_accounts
            WHERE nwp_accounts.user_uid = auth.uid()
            AND nwp_accounts.role IN ('administrator', 'editor')
        )
    );

-- Only admins can delete plugins
CREATE POLICY "Admins can delete plugins"
    ON nwp_plugins
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nwp_accounts
            WHERE nwp_accounts.user_uid = auth.uid()
            AND nwp_accounts.role IN ('administrator', 'editor')
        )
    );
 
-- =====================================================
-- Migration Complete
-- =====================================================
-- Table created:
--   1. nwp_plugins - Stores all available plugins
--
-- Next steps:
--   1. Run this migration in Supabase SQL Editor
--   2. Access plugins via /api/plugins endpoint
--   3. Update the plugins page to fetch from API
-- =====================================================
