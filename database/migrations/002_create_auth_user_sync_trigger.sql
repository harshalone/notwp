-- Migration: Create trigger to auto-sync auth.users to nwp_accounts
-- Description: Automatically creates a record in nwp_accounts when a user signs up
-- Created: 2025-11-14

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.nwp_accounts (
        user_uid,
        email,
        username,
        display_name,
        email_verified,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        -- Extract username from email (before @) or use email if no @ found
        COALESCE(
            SPLIT_PART(NEW.email, '@', 1),
            NEW.email
        ),
        -- Use raw_user_meta_data for display name if available
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE),
        NEW.created_at,
        NEW.updated_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users for new signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to handle user updates (email verification, etc.)
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Update nwp_accounts when auth.users is updated
    UPDATE public.nwp_accounts
    SET
        email = NEW.email,
        email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE),
        updated_at = NEW.updated_at
    WHERE user_uid = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users for updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.email IS DISTINCT FROM NEW.email OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
    EXECUTE FUNCTION public.handle_user_update();

-- Function to update last_login_at
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    -- Update last_login_at when last_sign_in_at changes
    IF OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at THEN
        UPDATE public.nwp_accounts
        SET last_login_at = NEW.last_sign_in_at
        WHERE user_uid = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for tracking last login
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
    EXECUTE FUNCTION public.update_last_login();

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_user_update() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_last_login() TO service_role;
