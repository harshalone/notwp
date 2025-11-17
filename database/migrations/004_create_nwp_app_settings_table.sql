-- Migration: Create nwp_app_settings table
-- Description: This table stores application-wide settings and configuration including Supabase credentials
-- Created: 2025-11-14

-- Create nwp_app_settings table
CREATE TABLE IF NOT EXISTS public.nwp_app_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'encrypted')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_nwp_app_settings_key ON public.nwp_app_settings(setting_key);
CREATE INDEX idx_nwp_app_settings_public ON public.nwp_app_settings(is_public);

-- Apply updated_at trigger to nwp_app_settings
CREATE TRIGGER update_nwp_app_settings_updated_at
    BEFORE UPDATE ON public.nwp_app_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.nwp_app_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy: Public settings can be viewed by anyone
CREATE POLICY "Public settings can be viewed by anyone" ON public.nwp_app_settings
    FOR SELECT
    USING (is_public = TRUE);

-- Policy: Administrators can view all settings
CREATE POLICY "Administrators can view all settings" ON public.nwp_app_settings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid() AND role = 'administrator'
        )
    );

-- Policy: Administrators can insert settings
CREATE POLICY "Administrators can insert settings" ON public.nwp_app_settings
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid() AND role = 'administrator'
        )
    );

-- Policy: Administrators can update settings
CREATE POLICY "Administrators can update settings" ON public.nwp_app_settings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid() AND role = 'administrator'
        )
    );

-- Policy: Allow service_role to update settings during installation
-- This is critical for the initial setup when no admin users exist yet
CREATE POLICY "Service role can update settings" ON public.nwp_app_settings
    FOR UPDATE
    USING (true);

-- Policy: Administrators can delete settings
CREATE POLICY "Administrators can delete settings" ON public.nwp_app_settings
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid() AND role = 'administrator'
        )
    );

-- Insert default settings
INSERT INTO public.nwp_app_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
    ('app_name', 'NotWordPress', 'string', 'Application name', TRUE),
    ('app_version', '1.0.0', 'string', 'Application version', TRUE),
    ('installation_complete', 'false', 'boolean', 'Whether the initial installation is complete', TRUE),
    ('supabase_url', NULL, 'encrypted', 'Supabase project URL', FALSE),
    ('supabase_anon_key', NULL, 'encrypted', 'Supabase anonymous key', FALSE),
    ('supabase_service_role_key', NULL, 'encrypted', 'Supabase service role key', FALSE)
ON CONFLICT (setting_key) DO NOTHING;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.nwp_app_settings TO authenticated;
GRANT SELECT ON public.nwp_app_settings TO anon;
