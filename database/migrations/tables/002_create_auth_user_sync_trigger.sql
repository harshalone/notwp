-- Migration: Create trigger to auto-sync auth.users to nwp_accounts
-- Description: Automatically creates a record in nwp_accounts when a user signs up
-- Created: 2025-11-14
--
-- IMPORTANT: auth.users and auth.identities tables should NEVER have RLS enabled
-- They are managed by Supabase Auth and have their own security mechanisms
-- DO NOT run: ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
-- DO NOT run: ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

-- Function to handle new user signup
-- Simplified version: only copies user_uid and email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Simple upsert with explicit conflict handling
    INSERT INTO public.nwp_accounts (
        user_uid,
        email,
        created_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        NEW.created_at
    )
    ON CONFLICT (user_uid) DO NOTHING;  -- Silently ignore if record already exists

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the auth user creation
        RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Create trigger on auth.users for new signups
-- Using regular AFTER INSERT trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to handle user updates (email verification, etc.)
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update nwp_accounts when auth.users email is updated
    UPDATE public.nwp_accounts
    SET
        email = NEW.email,
        updated_at = NEW.updated_at
    WHERE user_uid = NEW.id;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the auth user update
        RAISE NOTICE 'Error in handle_user_update: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Create trigger on auth.users for updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.email IS DISTINCT FROM NEW.email)
    EXECUTE FUNCTION public.handle_user_update();

-- Function to update last_login_at
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update last_login_at when last_sign_in_at changes
    IF OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at THEN
        UPDATE public.nwp_accounts
        SET last_login_at = NEW.last_sign_in_at
        WHERE user_uid = NEW.id;
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the auth user update
        RAISE NOTICE 'Error in update_last_login: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Create trigger for tracking last login
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
    EXECUTE FUNCTION public.update_last_login();

-- Grant execute permissions on functions to all relevant roles
-- This ensures the trigger can execute regardless of who initiates the auth signup
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

GRANT EXECUTE ON FUNCTION public.handle_user_update() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_user_update() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_user_update() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_user_update() TO service_role;

GRANT EXECUTE ON FUNCTION public.update_last_login() TO postgres;
GRANT EXECUTE ON FUNCTION public.update_last_login() TO anon;
GRANT EXECUTE ON FUNCTION public.update_last_login() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_last_login() TO service_role;

-- Ensure the service_role can insert into nwp_accounts
GRANT ALL ON public.nwp_accounts TO service_role;
GRANT USAGE, SELECT ON SEQUENCE nwp_accounts_id_seq TO service_role;
 

-- ============================================================================
-- VERIFICATION QUERIES (Optional - for debugging)
-- ============================================================================
-- Uncomment and run these queries to verify the setup:
--
-- 1. Check if trigger exists and is enabled:
-- SELECT tgname, tgenabled FROM pg_trigger WHERE tgname = 'on_auth_user_created';
--
-- 2. Check if function exists:
-- SELECT proname, prosecdef FROM pg_proc WHERE proname = 'handle_new_user';
--
-- 3. Check table permissions:
-- SELECT grantee, privilege_type FROM information_schema.table_privileges
-- WHERE table_name = 'nwp_accounts' ORDER BY grantee;
--
-- 4. Check sequence permissions:
-- SELECT grantee, privilege_type FROM information_schema.usage_privileges
-- WHERE object_name = 'nwp_accounts_id_seq' ORDER BY grantee;
--
-- 5. Check function permissions:
-- SELECT routine_name, grantee, privilege_type FROM information_schema.routine_privileges
-- WHERE routine_name = 'handle_new_user' ORDER BY grantee;
