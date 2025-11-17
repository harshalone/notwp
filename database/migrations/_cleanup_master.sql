-- MASTER CLEANUP: Complete database reset for NotWordPress CMS
-- Description: Comprehensive cleanup that removes ALL NotWordPress objects
-- Purpose: Allows complete database flush and fresh start during development
-- WARNING: This will delete ALL data! Only run this if you want to start fresh.
-- Created: 2025-11-17
--
-- This script combines functionality from all cleanup scripts to ensure:
-- 1. All triggers are dropped (both specific and dynamic discovery)
-- 2. All functions are removed (including security-sensitive ones)
-- 3. All tables are deleted with CASCADE
-- 4. All policies are cleaned up
-- 5. All permissions are revoked
-- 6. Error-tolerant execution (won't fail if objects don't exist)

-- ============================================
-- STEP 1: DISABLE TRIGGERS TEMPORARILY
-- ============================================
SET session_replication_role = replica;

-- ============================================
-- STEP 2: DROP SPECIFIC TRIGGERS (Known objects)
-- ============================================
DO $$
BEGIN
    -- Triggers on auth.users
    EXECUTE 'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE';
    RAISE NOTICE 'Dropped trigger: on_auth_user_created on auth.users';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Trigger on_auth_user_created does not exist or already dropped';
END $$;

DO $$
BEGIN
    -- Triggers on nwp_accounts
    EXECUTE 'DROP TRIGGER IF EXISTS update_nwp_accounts_updated_at ON public.nwp_accounts CASCADE';
    RAISE NOTICE 'Dropped trigger: update_nwp_accounts_updated_at on nwp_accounts';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Trigger update_nwp_accounts_updated_at does not exist or already dropped';
END $$;

DO $$
BEGIN
    -- Triggers on nwp_posts
    EXECUTE 'DROP TRIGGER IF EXISTS update_nwp_posts_updated_at ON public.nwp_posts CASCADE';
    RAISE NOTICE 'Dropped trigger: update_nwp_posts_updated_at on nwp_posts';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Trigger update_nwp_posts_updated_at does not exist or already dropped';
END $$;

DO $$
BEGIN
    -- Triggers on nwp_posts
    EXECUTE 'DROP TRIGGER IF EXISTS update_nwp_app_settings_updated_at ON public.nwp_app_settings CASCADE';
    RAISE NOTICE 'Dropped trigger: update_nwp_app_settings_updated_at on nwp_app_settings';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Trigger update_nwp_app_settings_updated_at does not exist or already dropped';
END $$;

DO $$
BEGIN
    -- Triggers for set_published_at on nwp_posts
    EXECUTE 'DROP TRIGGER IF EXISTS set_published_at_on_insert ON public.nwp_posts CASCADE';
    RAISE NOTICE 'Dropped trigger: set_published_at_on_insert on nwp_posts';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Trigger set_published_at_on_insert does not exist or already dropped';
END $$;

-- ============================================
-- STEP 3: DROP ALL TRIGGERS DYNAMICALLY
-- ============================================
-- Drop any remaining triggers on auth.users that contain 'user' in the name
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN
        SELECT tgname
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'auth' AND c.relname = 'users'
        AND tgname ILIKE '%user%'
    LOOP
        BEGIN
            EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users CASCADE', trigger_record.tgname);
            RAISE NOTICE 'Dropped trigger: % on auth.users', trigger_record.tgname;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop trigger %: %', trigger_record.tgname, SQLERRM;
        END;
    END LOOP;
END $$;

-- Drop all triggers on nwp_ tables
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN
        SELECT n.nspname, c.relname, t.tgname
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public' AND c.relname LIKE 'nwp_%'
    LOOP
        BEGIN
            EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I CASCADE',
                trigger_record.tgname, trigger_record.nspname, trigger_record.relname);
            RAISE NOTICE 'Dropped trigger: % on %.%',
                trigger_record.tgname, trigger_record.nspname, trigger_record.relname;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop trigger %: %', trigger_record.tgname, SQLERRM;
        END;
    END LOOP;
END $$;

-- ============================================
-- STEP 4: DROP SPECIFIC FUNCTIONS (Known functions)
-- ============================================
DO $$
BEGIN
    EXECUTE 'DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE';
    RAISE NOTICE 'Dropped function: handle_new_user()';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Function handle_new_user() does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP FUNCTION IF EXISTS public.handle_user_update() CASCADE';
    RAISE NOTICE 'Dropped function: handle_user_update()';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Function handle_user_update() does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP FUNCTION IF EXISTS public.update_last_login() CASCADE';
    RAISE NOTICE 'Dropped function: update_last_login()';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Function update_last_login() does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE';
    RAISE NOTICE 'Dropped function: update_updated_at_column()';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Function update_updated_at_column() does not exist or already dropped';
END $$;

-- Drop exec_sql function (security cleanup - should not remain in production)
DO $$
BEGIN
    EXECUTE 'DROP FUNCTION IF EXISTS public.exec_sql(text) CASCADE';
    RAISE NOTICE 'Dropped function: exec_sql(text) [SECURITY CLEANUP]';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Function exec_sql(text) does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP FUNCTION IF EXISTS public.set_published_at() CASCADE';
    RAISE NOTICE 'Dropped function: set_published_at()';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Function set_published_at() does not exist or already dropped';
END $$;

-- ============================================
-- STEP 5: DROP ALL FUNCTIONS DYNAMICALLY
-- ============================================
-- Drop all functions that contain 'user', 'update', 'exec_sql', 'handle', or 'published'
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN
        SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND (
            p.proname ILIKE '%user%'
            OR p.proname ILIKE '%update%'
            OR p.proname ILIKE '%exec_sql%'
            OR p.proname ILIKE '%handle%'
            OR p.proname ILIKE '%published%'
        )
    LOOP
        BEGIN
            EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE',
                func_record.nspname, func_record.proname, func_record.args);
            RAISE NOTICE 'Dropped function: %.%(%)',
                func_record.nspname, func_record.proname, func_record.args;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop function %.%: %',
                func_record.nspname, func_record.proname, SQLERRM;
        END;
    END LOOP;
END $$;

-- ============================================
-- STEP 6: DROP SPECIFIC TABLES (Known tables)
-- ============================================
DO $$
BEGIN
    EXECUTE 'DROP TABLE IF EXISTS public.nwp_posts CASCADE';
    RAISE NOTICE 'Dropped table: nwp_posts';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Table nwp_posts does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP TABLE IF EXISTS public.nwp_app_settings CASCADE';
    RAISE NOTICE 'Dropped table: nwp_app_settings';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Table nwp_app_settings does not exist or already dropped';
END $$;

DO $$
BEGIN
    EXECUTE 'DROP TABLE IF EXISTS public.nwp_accounts CASCADE';
    RAISE NOTICE 'Dropped table: nwp_accounts';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Table nwp_accounts does not exist or already dropped';
END $$;

-- ============================================
-- STEP 7: DROP ALL NWP_ TABLES DYNAMICALLY
-- ============================================
-- Drop any remaining nwp_ tables
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname = 'public' AND tablename LIKE 'nwp_%'
    LOOP
        BEGIN
            EXECUTE format('DROP TABLE IF EXISTS %I.%I CASCADE',
                table_record.schemaname, table_record.tablename);
            RAISE NOTICE 'Dropped table: %.%',
                table_record.schemaname, table_record.tablename;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop table %.%: %',
                table_record.schemaname, table_record.tablename, SQLERRM;
        END;
    END LOOP;
END $$;

-- ============================================
-- STEP 8: DROP ALL POLICIES
-- ============================================
-- Drop all policies on nwp_ tables (both specific and dynamic)
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
        AND (tablename LIKE 'nwp_%' OR tablename IN ('nwp_posts', 'nwp_app_settings', 'nwp_accounts'))
    LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
                pol.policyname, pol.schemaname, pol.tablename);
            RAISE NOTICE 'Dropped policy: % on %.%', pol.policyname, pol.schemaname, pol.tablename;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop policy %: %', pol.policyname, SQLERRM;
        END;
    END LOOP;
END $$;

-- ============================================
-- STEP 9: REVOKE PERMISSIONS
-- ============================================
-- Revoke any granted permissions (cleanup)
DO $$
BEGIN
    -- Revoke on nwp_accounts (if it exists)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'nwp_accounts') THEN
        REVOKE ALL ON public.nwp_accounts FROM authenticated;
        REVOKE ALL ON public.nwp_accounts FROM anon;
        RAISE NOTICE 'Revoked permissions on nwp_accounts';
    END IF;

    -- Revoke on nwp_posts (if it exists)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'nwp_posts') THEN
        REVOKE ALL ON public.nwp_posts FROM authenticated;
        REVOKE ALL ON public.nwp_posts FROM anon;
        RAISE NOTICE 'Revoked permissions on nwp_posts';
    END IF;

    -- Revoke on nwp_app_settings (if it exists)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'nwp_app_settings') THEN
        REVOKE ALL ON public.nwp_app_settings FROM authenticated;
        REVOKE ALL ON public.nwp_app_settings FROM anon;
        RAISE NOTICE 'Revoked permissions on nwp_app_settings';
    END IF;
END $$;

-- ============================================
-- STEP 10: RE-ENABLE TRIGGERS
-- ============================================
SET session_replication_role = DEFAULT;

-- ============================================
-- COMPLETION REPORT
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'MASTER CLEANUP COMPLETE';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'All NotWordPress objects have been removed:';
    RAISE NOTICE '  - Triggers (specific and dynamic)';
    RAISE NOTICE '  - Functions (including exec_sql)';
    RAISE NOTICE '  - Tables (all nwp_* tables)';
    RAISE NOTICE '  - Policies';
    RAISE NOTICE '  - Permissions';
    RAISE NOTICE '';
    RAISE NOTICE 'Database is now clean and ready for fresh migrations.';
    RAISE NOTICE 'You can now run your other migration files from scratch.';
    RAISE NOTICE '==============================================';
END $$;
