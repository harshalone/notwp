-- Migration: Create SQL execution function
-- Description: This function allows executing raw SQL statements programmatically
-- Created: 2025-11-14
-- IMPORTANT: This must be run FIRST before any other migrations

-- Create a function to execute raw SQL
-- This is needed for the automated migration system to work
CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Grant execute permission ONLY to service_role (not to authenticated for security)
-- This function is extremely dangerous and should only be used during installation
-- It will be automatically removed after installation is complete
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
