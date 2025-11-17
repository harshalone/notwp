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

-- Policy: Administrators can view all accounts
CREATE POLICY "Administrators can view all accounts" ON public.nwp_accounts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid() AND role = 'administrator'
        )
    );

-- Policy: Administrators can update all accounts
CREATE POLICY "Administrators can update all accounts" ON public.nwp_accounts
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid() AND role = 'administrator'
        )
    );

-- Policy: Administrators can delete accounts
CREATE POLICY "Administrators can delete accounts" ON public.nwp_accounts
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid() AND role = 'administrator'
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.nwp_accounts TO authenticated;
GRANT SELECT ON public.nwp_accounts TO anon;
