-- Migration: Cleanup and remove exec_sql function
-- Description: Removes the dangerous exec_sql function after installation is complete
-- Created: 2025-11-14
-- IMPORTANT: This MUST be run as the FINAL migration after all other migrations are complete

-- Drop the exec_sql function (security cleanup)
-- This function is only needed during installation and should NOT remain in production
DROP FUNCTION IF EXISTS public.exec_sql(text);

-- Verify the function was dropped
-- This comment serves as documentation that the function has been removed for security reasons
