-- Cleanup Migration: Remove all NotWordPress tables, functions, triggers, and policies
-- Description: This will completely remove all database objects created by NotWordPress
-- WARNING: This will delete ALL data! Only run this if you want to start fresh.
-- Created: 2025-11-14

-- Step 1: Drop triggers first (before functions and tables)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS update_nwp_accounts_updated_at ON public.nwp_accounts CASCADE;
DROP TRIGGER IF EXISTS update_nwp_posts_updated_at ON public.nwp_posts CASCADE;
DROP TRIGGER IF EXISTS update_nwp_app_settings_updated_at ON public.nwp_app_settings CASCADE;

-- Step 2: Drop functions with CASCADE to remove all dependencies
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.exec_sql(text) CASCADE;

-- Step 3: Drop all tables with CASCADE (this will force delete everything)
DROP TABLE IF EXISTS public.nwp_posts CASCADE;
DROP TABLE IF EXISTS public.nwp_app_settings CASCADE;
DROP TABLE IF EXISTS public.nwp_accounts CASCADE;

-- Step 4: Revoke any granted permissions (cleanup)
-- Note: If tables are already dropped, these may error but that's okay
DO $$
BEGIN
    -- Revoke on nwp_accounts (if it exists)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'nwp_accounts') THEN
        REVOKE ALL ON public.nwp_accounts FROM authenticated;
        REVOKE ALL ON public.nwp_accounts FROM anon;
    END IF;

    -- Revoke on nwp_posts (if it exists)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'nwp_posts') THEN
        REVOKE ALL ON public.nwp_posts FROM authenticated;
        REVOKE ALL ON public.nwp_posts FROM anon;
    END IF;

    -- Revoke on nwp_app_settings (if it exists)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'nwp_app_settings') THEN
        REVOKE ALL ON public.nwp_app_settings FROM authenticated;
        REVOKE ALL ON public.nwp_app_settings FROM anon;
    END IF;
END $$;

-- Confirmation message
DO $$
BEGIN
    RAISE NOTICE 'NotWordPress cleanup complete. All tables, functions, triggers, and policies have been removed.';
END $$;
