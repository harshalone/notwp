-- Fix RLS policy to allow service_role to update settings during installation
-- This allows the installation process to save credentials even when no admin user exists

-- Drop conflicting policy if it exists
DROP POLICY IF EXISTS "Service role can update settings" ON public.nwp_app_settings;

-- Create policy allowing service_role to update settings
CREATE POLICY "Service role can update settings" ON public.nwp_app_settings
    FOR UPDATE
    USING (true);
