'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import {
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  Folder,
  FolderPlus,
  Upload,
  Download,
  Trash2,
  Move,
  ChevronRight,
  Home,
  X,
  Check,
  File as FileIcon,
  Loader2,
  MoreVertical,
  Eye,
  FolderOpen,
  Copy
} from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import {
  listFiles,
  uploadFile,
  deleteFile,
  deleteFolder,
  getPublicUrl,
  downloadFile,
  moveFile,
  searchFiles
} from '@/lib/supabase-storage';

export default function MediaPage() {
  const [supabase] = useState(() => createClient());
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Modal states
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [moveToPath, setMoveToPath] = useState('');
  const [moveModalPath, setMoveModalPath] = useState('');
  const [moveModalFolders, setMoveModalFolders] = useState([]);

  // Load files for current path
  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const data = searchTerm
        ? await searchFiles(supabase, searchTerm, currentPath)
        : await listFiles(supabase, currentPath);
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, currentPath, searchTerm]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Handle file upload
  const handleFileUpload = async (fileList) => {
    const filesArray = Array.from(fileList);
    setUploading(true);
    setUploadProgress(filesArray.map((f) => ({ name: f.name, progress: 0 })));

    try {
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        await uploadFile(supabase, file, currentPath);
        setUploadProgress(prev =>
          prev.map((p, idx) => idx === i ? { ...p, progress: 100 } : p)
        );
      }
      await loadFiles();
      setTimeout(() => setUploadProgress([]), 2000);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Handle folder navigation
  const navigateToFolder = (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
    setSelectedFiles(new Set());
  };

  const navigateToPath = (index) => {
    if (index === -1) {
      setCurrentPath('');
    } else {
      const pathParts = currentPath.split('/');
      setCurrentPath(pathParts.slice(0, index + 1).join('/'));
    }
    setSelectedFiles(new Set());
  };

  // Handle file selection
  const toggleFileSelection = (fileName, isFolder) => {
    const fileKey = currentPath ? `${currentPath}/${fileName}` : fileName;
    const newSelection = new Set(selectedFiles);

    if (newSelection.has(fileKey)) {
      newSelection.delete(fileKey);
    } else {
      newSelection.add(fileKey);
    }

    setSelectedFiles(newSelection);
  };

  // Handle delete
  const handleDelete = async () => {
    if (selectedFiles.size === 0) return;

    try {
      const filesToDelete = Array.from(selectedFiles);

      for (const filePath of filesToDelete) {
        const file = files.find(f => {
          const fullPath = currentPath ? `${currentPath}/${f.name}` : f.name;
          return fullPath === filePath;
        });

        if (file && file.id === null) {
          // It's a folder
          await deleteFolder(supabase, filePath);
        } else {
          await deleteFile(supabase, filePath);
        }
      }

      setSelectedFiles(new Set());
      setShowDeleteConfirm(false);
      await loadFiles();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting files: ' + error.message);
    }
  };

  // Handle download
  const handleDownload = async (fileName) => {
    try {
      const filePath = currentPath ? `${currentPath}/${fileName}` : fileName;
      const blob = await downloadFile(supabase, filePath);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file: ' + error.message);
    }
  };

  // Handle new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      // Create a placeholder file to establish the folder
      const folderPath = currentPath
        ? `${currentPath}/${newFolderName}`
        : newFolderName;

      // Use image/png as the MIME type since the bucket only allows image/*, video/*, and application/pdf
      const placeholderFile = new File([''], '.placeholder', { type: 'image/png' });
      await uploadFile(supabase, placeholderFile, folderPath);

      setNewFolderName('');
      setShowNewFolderModal(false);
      await loadFiles();
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Error creating folder: ' + error.message);
    }
  };

  // Load folders for move modal
  const loadMoveModalFolders = useCallback(async (path = '') => {
    try {
      const data = await listFiles(supabase, path);
      const folders = data.filter(f => f.id === null);
      setMoveModalFolders(folders);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  }, [supabase]);

  // Handle opening move modal
  const handleOpenMoveModal = () => {
    setMoveModalPath('');
    setMoveToPath('');
    loadMoveModalFolders('');
    setShowMoveModal(true);
  };

  // Navigate in move modal
  const navigateInMoveModal = (folderName) => {
    const newPath = moveModalPath ? `${moveModalPath}/${folderName}` : folderName;
    setMoveModalPath(newPath);
    loadMoveModalFolders(newPath);
  };

  const navigateToMoveModalPath = (index) => {
    if (index === -1) {
      setMoveModalPath('');
      loadMoveModalFolders('');
    } else {
      const pathParts = moveModalPath.split('/');
      const newPath = pathParts.slice(0, index + 1).join('/');
      setMoveModalPath(newPath);
      loadMoveModalFolders(newPath);
    }
  };

  // Handle move files
  const handleMove = async () => {
    if (selectedFiles.size === 0) return;

    try {
      for (const fromPath of selectedFiles) {
        const fileName = fromPath.split('/').pop();
        const toPath = moveToPath ? `${moveToPath}/${fileName}` : fileName;
        await moveFile(supabase, fromPath, toPath);
      }

      setSelectedFiles(new Set());
      setShowMoveModal(false);
      setMoveToPath('');
      setMoveModalPath('');
      await loadFiles();
    } catch (error) {
      console.error('Error moving files:', error);
      alert('Error moving files: ' + error.message);
    }
  };

  // Preview file
  const handlePreview = (file) => {
    const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
    const url = getPublicUrl(supabase, filePath);
    setPreviewFile({ ...file, url, path: filePath });
    setShowPreviewModal(true);
  };

  // Get breadcrumb path
  const pathParts = currentPath ? currentPath.split('/') : [];

  // Filter folders and files
  const folders = files.filter(f => f.id === null);
  const regularFiles = files.filter(f => f.id !== null && f.name !== '.placeholder');

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="pt-20 px-8 pb-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Media</h1>
              <p className="text-stone-600 mt-2">Manage your images and files</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                New Folder
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload Files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept="image/*,video/*,application/pdf"
                />
              </label>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="bg-white rounded-lg border border-stone-200 px-4 py-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => navigateToPath(-1)}
                className="flex items-center cursor-pointer gap-1 text-stone-600 hover:text-stone-900 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              {pathParts.map((part, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                  <button
                    onClick={() => navigateToPath(index)}
                    className="text-stone-600 cursor-pointer hover:text-stone-900 transition-colors"
                  >
                    {part}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-3 flex-1">
                <div className="flex-1 relative max-w-md">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                {selectedFiles.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-stone-600">
                      {selectedFiles.size} selected
                    </span>
                    <button
                      onClick={handleOpenMoveModal}
                      className="flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      <Move className="w-4 h-4" />
                      Move
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedFiles(new Set())}
                      className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-1 border border-stone-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
              <div className="space-y-2">
                {uploadProgress.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-stone-700">{file.name}</span>
                        <span className="text-sm text-stone-500">{file.progress}%</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div
                          className="bg-stone-900 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                    {file.progress === 100 && <Check className="w-5 h-5 text-green-600" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drop Zone Overlay */}
          {dragActive && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="bg-white rounded-2xl p-12 border-4 border-dashed border-stone-400">
                <Upload className="w-16 h-16 text-stone-600 mx-auto mb-4" />
                <p className="text-2xl font-semibold text-stone-900">Drop files to upload</p>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className="bg-white rounded-lg border border-stone-200 p-6 min-h-[500px]"
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
              </div>
            ) : folders.length === 0 && regularFiles.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-stone-400" />
                </div>
                <h2 className="text-xl font-semibold text-stone-900 mb-2">No files yet</h2>
                <p className="text-stone-600 mb-6">Upload your first files or create a folder</p>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {/* Folders */}
                    {folders.map((folder) => {
                      const folderPath = currentPath ? `${currentPath}/${folder.name}` : folder.name;
                      const isSelected = selectedFiles.has(folderPath);

                      return (
                        <div
                          key={folder.name}
                          className={`group relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                            isSelected
                              ? 'border-stone-900 bg-stone-50'
                              : 'border-stone-200 hover:border-stone-400 hover:shadow-md'
                          }`}
                          onClick={(e) => {
                            if (e.shiftKey || e.metaKey) {
                              toggleFileSelection(folder.name, true);
                            } else {
                              navigateToFolder(folder.name);
                            }
                          }}
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFileSelection(folder.name, true);
                            }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-stone-900 border-stone-900'
                                : 'border-stone-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>

                          <div className="aspect-square bg-stone-100 flex items-center justify-center">
                            <Folder className="w-12 h-12 text-stone-400" />
                          </div>

                          <div className="p-3 bg-white">
                            <p className="text-sm text-stone-900 text-center truncate font-medium">
                              {folder.name}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Files */}
                    {regularFiles.map((file) => {
                      const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
                      const isSelected = selectedFiles.has(filePath);
                      const publicUrl = getPublicUrl(supabase, filePath);
                      const isImage = file.metadata?.mimetype?.startsWith('image/');

                      return (
                        <div
                          key={file.name}
                          className={`group relative border-2 rounded-lg overflow-hidden transition-all ${
                            isSelected
                              ? 'border-stone-900 bg-stone-50'
                              : 'border-stone-200 hover:border-stone-400 hover:shadow-md'
                          }`}
                        >
                          <div
                            onClick={() => toggleFileSelection(file.name, false)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-stone-900 border-stone-900'
                                : 'border-stone-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>

                          <div
                            className="aspect-square bg-stone-100 flex items-center justify-center cursor-pointer"
                            onClick={() => handlePreview(file)}
                          >
                            {isImage ? (
                              <img
                                src={publicUrl}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileIcon className="w-12 h-12 text-stone-400" />
                            )}
                          </div>

                          <div className="p-3 bg-white">
                            <p className="text-sm text-stone-900 truncate font-medium">
                              {file.name}
                            </p>
                            <p className="text-xs text-stone-500 mt-1">
                              {formatFileSize(file.metadata?.size)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-1">
                    {folders.map((folder) => {
                      const folderPath = currentPath ? `${currentPath}/${folder.name}` : folder.name;
                      const isSelected = selectedFiles.has(folderPath);

                      return (
                        <div
                          key={folder.name}
                          className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'bg-stone-100' : 'hover:bg-stone-50'
                          }`}
                          onClick={() => navigateToFolder(folder.name)}
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFileSelection(folder.name, true);
                            }}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? 'bg-stone-900 border-stone-900'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <Folder className="w-8 h-8 text-stone-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 truncate">
                              {folder.name}
                            </p>
                          </div>
                          <div className="text-sm text-stone-500">Folder</div>
                        </div>
                      );
                    })}

                    {regularFiles.map((file) => {
                      const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
                      const isSelected = selectedFiles.has(filePath);

                      return (
                        <div
                          key={file.name}
                          className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'bg-stone-100' : 'hover:bg-stone-50'
                          }`}
                          onClick={() => toggleFileSelection(file.name, false)}
                        >
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? 'bg-stone-900 border-stone-900'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <FileIcon className="w-8 h-8 text-stone-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 truncate">
                              {file.name}
                            </p>
                          </div>
                          <div className="text-sm text-stone-500">
                            {formatFileSize(file.metadata?.size)}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(file.name);
                            }}
                            className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4 text-stone-700" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <Modal onClose={() => setShowNewFolderModal(false)} title="Create New Folder">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            autoFocus
          />
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowNewFolderModal(false)}
              className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </Modal>
      )}

      {/* Move Modal */}
      {showMoveModal && (
        <Modal onClose={() => setShowMoveModal(false)} title="Move Files" large>
          <div className="space-y-4">
            <p className="text-sm text-stone-600">
              Moving {selectedFiles.size} item(s) to: <span className="font-medium text-stone-900">
                {moveToPath || '/root'}
              </span>
            </p>

            {/* Breadcrumb Navigation */}
            <div className="bg-stone-50 rounded-lg border border-stone-200 px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => navigateToMoveModalPath(-1)}
                  className="flex items-center cursor-pointer gap-1 text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Root</span>
                </button>
                {moveModalPath && moveModalPath.split('/').map((part, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                    <button
                      onClick={() => navigateToMoveModalPath(index)}
                      className="text-stone-600 cursor-pointer hover:text-stone-900 transition-colors"
                    >
                      {part}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Location Selector */}
            <div className="bg-white border border-stone-200 rounded-lg p-4">
              <button
                onClick={() => setMoveToPath(moveModalPath)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                  moveToPath === moveModalPath
                    ? 'border-stone-900 bg-stone-50'
                    : 'border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-stone-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-stone-900">
                      Move to current location
                    </p>
                    <p className="text-xs text-stone-500">
                      {moveModalPath || 'Root folder'}
                    </p>
                  </div>
                </div>
                {moveToPath === moveModalPath && (
                  <Check className="w-5 h-5 text-stone-900" />
                )}
              </button>
            </div>

            {/* Folders List */}
            <div className="border border-stone-200 rounded-lg">
              <div className="bg-stone-50 px-4 py-2 border-b border-stone-200">
                <p className="text-sm font-medium text-stone-700">
                  Folders {moveModalFolders.length > 0 && `(${moveModalFolders.length})`}
                </p>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {moveModalFolders.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-sm">
                    No subfolders in this location
                  </div>
                ) : (
                  <div className="divide-y divide-stone-200">
                    {moveModalFolders.map((folder) => {
                      const folderFullPath = moveModalPath
                        ? `${moveModalPath}/${folder.name}`
                        : folder.name;
                      const isSelected = moveToPath === folderFullPath;

                      return (
                        <div
                          key={folder.name}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                            isSelected ? 'bg-stone-100' : 'hover:bg-stone-50'
                          }`}
                        >
                          <div
                            onClick={() => navigateInMoveModal(folder.name)}
                            className="flex items-center gap-3 flex-1"
                          >
                            <Folder className="w-5 h-5 text-stone-400 flex-shrink-0" />
                            <p className="text-sm text-stone-900 font-medium">
                              {folder.name}
                            </p>
                            <ChevronRight className="w-4 h-4 text-stone-400" />
                          </div>
                          <button
                            onClick={() => setMoveToPath(folderFullPath)}
                            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                              isSelected
                                ? 'bg-stone-900 text-white'
                                : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {isSelected ? (
                              <span className="flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Selected
                              </span>
                            ) : (
                              'Select'
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowMoveModal(false);
                  setMoveToPath('');
                  setMoveModalPath('');
                }}
                className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMove}
                disabled={moveToPath === ''}
                className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Move Here
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)} title="Confirm Delete">
          <p className="text-sm text-stone-700 mb-2">
            Are you sure you want to delete {selectedFiles.size} item(s)?
          </p>
          <p className="text-sm text-stone-600">
            This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewFile && (
        <Modal
          onClose={() => setShowPreviewModal(false)}
          title={previewFile.name}
          large
        >
          <div className="space-y-4">
            <div className="bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
              {previewFile.metadata?.mimetype?.startsWith('image/') ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full max-h-[600px] object-contain"
                />
              ) : (
                <div className="text-center p-12">
                  <FileIcon className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                  <p className="text-stone-600">Preview not available</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-stone-600">Size:</span>
                <span className="ml-2 text-stone-900 font-medium">
                  {formatFileSize(previewFile.metadata?.size)}
                </span>
              </div>
              <div>
                <span className="text-stone-600">Type:</span>
                <span className="ml-2 text-stone-900 font-medium">
                  {previewFile.metadata?.mimetype || 'Unknown'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewFile.url);
                  // Optional: You could add a toast notification here
                  alert('URL copied to clipboard!');
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy URL
              </button>
              <button
                onClick={() => handleDownload(previewFile.name)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <a
                href={previewFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Open in New Tab
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Modal Component
function Modal({ children, onClose, title, large = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-xl shadow-2xl ${
          large ? 'max-w-4xl' : 'max-w-md'
        } w-full max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h3 className="text-xl font-semibold text-stone-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes) {
  if (!bytes) return 'Unknown';
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
