-- Migration: Create nwp_accounts table
-- Description: This table stores user account information and links to auth.users via user_uid
-- Created: 2025-11-14

-- Create nwp_accounts table
CREATE TABLE IF NOT EXISTS public.nwp_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_uid UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    website_url VARCHAR(255),
    role VARCHAR(50) DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'contributor', 'author', 'editor', 'administrator')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_nwp_accounts_user_uid ON public.nwp_accounts(user_uid);
CREATE INDEX idx_nwp_accounts_email ON public.nwp_accounts(email);
CREATE INDEX idx_nwp_accounts_username ON public.nwp_accounts(username);
CREATE INDEX idx_nwp_accounts_role ON public.nwp_accounts(role);
CREATE INDEX idx_nwp_accounts_status ON public.nwp_accounts(status);
CREATE INDEX idx_nwp_accounts_created_at ON public.nwp_accounts(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to nwp_accounts
CREATE TRIGGER update_nwp_accounts_updated_at
    BEFORE UPDATE ON public.nwp_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTION TO CHECK ADMIN STATUS (avoids infinite recursion in RLS)
-- ============================================================================
-- This function bypasses RLS to check admin status, breaking circular dependencies

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER  -- This allows the function to bypass RLS
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.nwp_accounts
        WHERE user_uid = user_id AND role = 'administrator'
    );
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;

-- Enable Row Level Security (RLS)
ALTER TABLE public.nwp_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy: Users can view their own account
CREATE POLICY "Users can view own account" ON public.nwp_accounts
    FOR SELECT
    USING (auth.uid() = user_uid);

-- Policy: Users can update their own account
CREATE POLICY "Users can update own account" ON public.nwp_accounts
    FOR UPDATE
    USING (auth.uid() = user_uid);

-- Policy: Administrators can view all accounts (using helper function to avoid recursion)
CREATE POLICY "Administrators can view all accounts" ON public.nwp_accounts
    FOR SELECT
    USING (
        auth.uid() = user_uid OR public.is_admin(auth.uid())
    );

-- Policy: Administrators can update all accounts (using helper function to avoid recursion)
CREATE POLICY "Administrators can update all accounts" ON public.nwp_accounts
    FOR UPDATE
    USING (
        auth.uid() = user_uid OR public.is_admin(auth.uid())
    );

-- Policy: Administrators can delete accounts (using helper function to avoid recursion)
CREATE POLICY "Administrators can delete accounts" ON public.nwp_accounts
    FOR DELETE
    USING (
        public.is_admin(auth.uid())
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.nwp_accounts TO authenticated;
GRANT SELECT ON public.nwp_accounts TO anon;
