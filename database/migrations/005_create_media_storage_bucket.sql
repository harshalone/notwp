-- Migration: Create media storage bucket and policies
-- Description: Creates policies for the 'media' storage bucket for file uploads
-- Created: 2025-11-18
--
-- IMPORTANT: Before running this migration, create the 'media' bucket manually via:
-- 1. Supabase Dashboard > Storage > New Bucket
-- 2. Name: media
-- 3. Public: Yes
-- 4. File size limit: 50MB (52428800 bytes)
-- 5. Allowed MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp,
--    image/svg+xml, video/mp4, video/webm, application/pdf
--
-- OR use the Supabase Storage API/Client library to create it programmatically

-- Verify the bucket exists before creating policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media') THEN
    RAISE EXCEPTION 'Storage bucket "media" does not exist. Please create it via Supabase Dashboard first.';
  END IF;
END $$;

-- Storage policies for the media bucket
-- Policy 1: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media' AND
  EXISTS (
    SELECT 1 FROM public.nwp_accounts
    WHERE user_uid = auth.uid()
    AND role IN ('administrator', 'editor', 'author', 'contributor')
  )
);

-- Policy 2: Allow authenticated users to view their own files
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'media' AND
  auth.uid() = owner
);

-- Policy 3: Allow administrators and editors to view all files
CREATE POLICY "Admins and editors can view all files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'media' AND
  EXISTS (
    SELECT 1 FROM public.nwp_accounts
    WHERE user_uid = auth.uid()
    AND role IN ('administrator', 'editor')
  )
);

-- Policy 4: Allow public access to read files (since bucket is public)
CREATE POLICY "Public can view files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'media');

-- Policy 5: Allow users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media' AND
  auth.uid() = owner
)
WITH CHECK (
  bucket_id = 'media' AND
  auth.uid() = owner
);

-- Policy 6: Allow administrators and editors to update all files
CREATE POLICY "Admins and editors can update all files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media' AND
  EXISTS (
    SELECT 1 FROM public.nwp_accounts
    WHERE user_uid = auth.uid()
    AND role IN ('administrator', 'editor')
  )
)
WITH CHECK (
  bucket_id = 'media' AND
  EXISTS (
    SELECT 1 FROM public.nwp_accounts
    WHERE user_uid = auth.uid()
    AND role IN ('administrator', 'editor')
  )
);

-- Policy 7: Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'media' AND
  auth.uid() = owner
);

-- Policy 8: Allow administrators and editors to delete all files
CREATE POLICY "Admins and editors can delete all files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'media' AND
  EXISTS (
    SELECT 1 FROM public.nwp_accounts
    WHERE user_uid = auth.uid()
    AND role IN ('administrator', 'editor')
  )
);

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
