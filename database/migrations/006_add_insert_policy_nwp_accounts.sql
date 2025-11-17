-- Migration: Add INSERT policy for nwp_accounts table
-- Description: Allow authenticated users to insert their own account record
-- Created: 2025-11-17

-- Policy: Users can insert their own account
CREATE POLICY "Users can insert own account" ON public.nwp_accounts
    FOR INSERT
    WITH CHECK (auth.uid() = user_uid);

-- Policy: Administrators can insert any account (using helper function to avoid recursion)
CREATE POLICY "Administrators can insert accounts" ON public.nwp_accounts
    FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));
