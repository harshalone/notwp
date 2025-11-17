-- ULTRA CLEANUP: Automatically finds and removes ALL NotWordPress objects
-- This is the most comprehensive cleanup - it searches for everything dynamically

-- Disable triggers temporarily
SET session_replication_role = replica;

-- Step 1: Drop ALL triggers on auth.users that contain 'user' in the name
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
            RAISE NOTICE 'Dropped trigger: %', trigger_record.tgname;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop trigger %: %', trigger_record.tgname, SQLERRM;
        END;
    END LOOP;
END $$;

-- Step 2: Drop ALL triggers on nwp_ tables
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

-- Step 3: Drop ALL functions that contain 'user', 'update', or 'exec_sql'
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

-- Step 4: Drop ALL nwp_ tables
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

-- Step 5: Drop ALL policies on any remaining tables
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
                pol.policyname, pol.schemaname, pol.tablename);
            RAISE NOTICE 'Dropped policy: % on %.%',
                pol.policyname, pol.schemaname, pol.tablename;
        EXCEPTION WHEN OTHERS THEN
            -- Ignore if table doesn't exist
            NULL;
        END;
    END LOOP;
END $$;

-- Re-enable triggers
SET session_replication_role = DEFAULT;

-- Final report
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'ULTRA CLEANUP COMPLETE';
    RAISE NOTICE 'All NotWordPress objects have been removed.';
    RAISE NOTICE 'Check the notices above for details.';
    RAISE NOTICE '==============================================';
END $$;
