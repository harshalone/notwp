-- Migration: Add Storage Policies for Media Bucket
-- Description: Adds RLS policies to allow authenticated users to manage media files
-- Created: 2025-11-25
--
-- This migration adds the missing storage policies that allow authenticated users
-- to upload, read, update, and delete files in the media bucket.

-- Storage Policies for media bucket
-- Note: These policies allow authenticated users to manage media files

-- Policy: Authenticated users can read all files in media bucket
CREATE POLICY "Authenticated users can read media files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'media');

-- Policy: Authenticated users can upload files to media bucket
CREATE POLICY "Authenticated users can upload media files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Policy: Authenticated users can update their own files
CREATE POLICY "Authenticated users can update media files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

-- Policy: Authenticated users can delete files
CREATE POLICY "Authenticated users can delete media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');
