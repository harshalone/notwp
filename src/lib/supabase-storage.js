/**
 * Supabase Storage Helper Functions for Media Management
 * Handles all file and folder operations in the 'media' bucket
 *
 * Note: The 'media' bucket is created during the database migration process (005_create_media_storage_bucket.sql)
 * Make sure to run all migrations before using these functions.
 */

const BUCKET_NAME = 'media';

/**
 * List all files and folders in a specific path
 */
export async function listFiles(supabase, path = '') {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path, {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });

  if (error) throw error;
  return data || [];
}

/**
 * Upload a file to a specific path
 */
export async function uploadFile(supabase, file, path = '') {
  const filePath = path ? `${path}/${file.name}` : file.name;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data;
}

/**
 * Delete a file or folder
 */
export async function deleteFile(supabase, paths) {
  const pathsArray = Array.isArray(paths) ? paths : [paths];

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(pathsArray);

  if (error) throw error;
  return data;
}

/**
 * Delete a folder and all its contents
 */
export async function deleteFolder(supabase, folderPath) {
  // List all files in the folder recursively
  const files = await listFilesRecursively(supabase, folderPath);

  if (files.length > 0) {
    const filePaths = files.map(f =>
      folderPath ? `${folderPath}/${f.name}` : f.name
    );
    await deleteFile(supabase, filePaths);
  }

  return true;
}

/**
 * List files recursively in a folder
 */
async function listFilesRecursively(supabase, path = '') {
  const items = await listFiles(supabase, path);
  let allFiles = [];

  for (const item of items) {
    if (item.id === null) {
      // It's a folder, recurse into it
      const subPath = path ? `${path}/${item.name}` : item.name;
      const subFiles = await listFilesRecursively(supabase, subPath);
      allFiles = [...allFiles, ...subFiles];
    } else {
      // It's a file
      allFiles.push(item);
    }
  }

  return allFiles;
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(supabase, path) {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Download a file
 */
export async function downloadFile(supabase, path) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(path);

  if (error) throw error;
  return data;
}

/**
 * Move/rename a file
 */
export async function moveFile(supabase, fromPath, toPath) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .move(fromPath, toPath);

  if (error) throw error;
  return data;
}

/**
 * Create a folder (by uploading a placeholder file)
 * Note: Supabase Storage doesn't have explicit folders, they're created implicitly
 */
export async function createFolder(supabase, folderPath) {
  // We'll create folders implicitly when uploading files
  // This function is here for API consistency
  return { path: folderPath, created: true };
}

/**
 * Copy file from one location to another
 */
export async function copyFile(supabase, fromPath, toPath) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .copy(fromPath, toPath);

  if (error) throw error;
  return data;
}

/**
 * Get file metadata
 */
export async function getFileMetadata(supabase, path) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path.split('/').slice(0, -1).join('/'), {
      search: path.split('/').pop()
    });

  if (error) throw error;
  return data?.[0] || null;
}

/**
 * Search files by name
 */
export async function searchFiles(supabase, searchTerm, path = '') {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path, {
      limit: 1000,
      search: searchTerm
    });

  if (error) throw error;
  return data || [];
}
