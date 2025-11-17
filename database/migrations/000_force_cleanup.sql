-- FORCE CLEANUP: Nuclear option to remove everything
-- This script will forcefully delete all NotWordPress objects even if some are missing
-- Run this if the regular cleanup fails due to missing dependencies

-- Disable all triggers temporarily to avoid errors
SET session_replication_role = replica;

-- Drop all triggers (ignore errors if they don't exist)
DO $$
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Trigger on_auth_user_created does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS update_nwp_accounts_updated_at ON public.nwp_accounts CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Trigger update_nwp_accounts_updated_at does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS update_nwp_posts_updated_at ON public.nwp_posts CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Trigger update_nwp_posts_updated_at does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS update_nwp_app_settings_updated_at ON public.nwp_app_settings CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Trigger update_nwp_app_settings_updated_at does not exist or already dropped';
END $$;

-- Drop all functions (ignore errors)
DO $$
BEGIN
    EXECUTE 'DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Function handle_new_user does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP FUNCTION IF EXISTS public.handle_user_update() CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Function handle_user_update does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP FUNCTION IF EXISTS public.update_last_login() CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Function update_last_login does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Function update_updated_at_column does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP FUNCTION IF EXISTS public.exec_sql(text) CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Function exec_sql does not exist or already dropped';
END $$;

-- Drop all tables (ignore errors)
DO $$
BEGIN
    EXECUTE 'DROP TABLE IF EXISTS public.nwp_posts CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Table nwp_posts does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP TABLE IF EXISTS public.nwp_app_settings CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Table nwp_app_settings does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP TABLE IF EXISTS public.nwp_accounts CASCADE';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Table nwp_accounts does not exist or already dropped';
END $$;

-- Re-enable triggers
SET session_replication_role = DEFAULT;

-- Final cleanup: Drop any remaining policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename IN ('nwp_posts', 'nwp_app_settings', 'nwp_accounts')
    LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
                pol.policyname, pol.schemaname, pol.tablename);
            RAISE NOTICE 'Dropped policy % on %.%', pol.policyname, pol.schemaname, pol.tablename;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop policy %: %', pol.policyname, SQLERRM;
        END;
    END LOOP;
END $$;

-- Confirmation
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'FORCE CLEANUP COMPLETE';
    RAISE NOTICE 'All NotWordPress objects have been removed.';
    RAISE NOTICE '==============================================';
END $$;
