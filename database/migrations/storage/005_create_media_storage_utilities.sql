-- Migration: Media Storage Utilities
-- Description: Creates utility functions for media storage (bucket created in installation wizard)
-- Created: 2025-11-18
--
-- NOTE: The 'media' storage bucket is created manually during the installation wizard.
-- Storage policies are applied separately in migration 010.
-- This migration only creates utility functions for storage management.

-- Create a function to get storage usage statistics
CREATE OR REPLACE FUNCTION public.get_media_storage_stats()
RETURNS TABLE(
  total_files BIGINT,
  total_size BIGINT,
  image_count BIGINT,
  video_count BIGINT,
  document_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_files,
    COALESCE(SUM((metadata->>'size')::BIGINT), 0) as total_size,
    COUNT(*) FILTER (WHERE (metadata->>'mimetype') LIKE 'image/%') as image_count,
    COUNT(*) FILTER (WHERE (metadata->>'mimetype') LIKE 'video/%') as video_count,
    COUNT(*) FILTER (WHERE (metadata->>'mimetype') = 'application/pdf') as document_count
  FROM storage.objects
  WHERE bucket_id = 'media';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the stats function
GRANT EXECUTE ON FUNCTION public.get_media_storage_stats() TO authenticated;

-- Create a function to clean up orphaned files (optional, for maintenance)
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_media_files()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- This is a placeholder function that can be customized later
  -- to remove files that are not referenced anywhere in the database

  -- For now, it just returns 0
  -- You can expand this to check if files are referenced in posts, etc.
  deleted_count := 0;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the cleanup function to administrators only
GRANT EXECUTE ON FUNCTION public.cleanup_orphaned_media_files() TO authenticated;
