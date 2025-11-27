-- Migration: Create SQL execution function
-- Description: This function allows executing raw SQL statements programmatically
-- Created: 2025-11-14
-- IMPORTANT: This must be run FIRST before any other migrations
-- NOTE: This function must be created by the postgres superuser role via SQL Editor in Supabase Dashboard

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a function to execute raw SQL
-- This is needed for the automated migration system to work
-- SECURITY DEFINER makes it run with the privileges of the function owner (postgres)
-- Returns JSON with success status and error message if any
CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
  -- Execute the SQL query
  -- The function runs with postgres privileges due to SECURITY DEFINER
  -- and the owner being set to postgres (which is a superuser)
  EXECUTE sql_query;

  -- Return success result
  RETURN jsonb_build_object(
    'success', true,
    'error', null
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Return error result with details
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'error_detail', SQLSTATE
    );
END;
$$;

-- Set the owner to postgres (superuser) to ensure it has all necessary privileges
-- This is crucial for creating storage policies which require ownership of storage.objects
ALTER FUNCTION public.exec_sql(text) OWNER TO postgres;

-- Grant postgres role the necessary permissions on storage schema
-- This allows the function to create policies on storage.objects
GRANT ALL ON SCHEMA storage TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO postgres;

-- Grant execute permission ONLY to service_role (not to authenticated for security)
-- This function is extremely dangerous and should only be used during installation
-- It will be automatically removed after installation is complete
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
 
