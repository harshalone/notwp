'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, Search, Loader2, Folder, ChevronRight, Home } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import { listFiles, getPublicUrl } from '@/lib/supabase-storage';

export function ImagePickerModal({ isOpen, onClose, onSelect }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [gifSearch, setGifSearch] = useState('');
  const [unsplashSearch, setUnsplashSearch] = useState('');
  const [unsplashResults, setUnsplashResults] = useState([]);
  const [gifResults, setGifResults] = useState([]);
  const [loadingUnsplash, setLoadingUnsplash] = useState(false);
  const [loadingGifs, setLoadingGifs] = useState(false);

  // Media Library states
  const [supabase] = useState(() => createClient());
  const [mediaFiles, setMediaFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Search Unsplash
  const searchUnsplash = async (query) => {
    if (!query.trim()) {
      setUnsplashResults([]);
      return;
    }

    setLoadingUnsplash(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setUnsplashResults(data.results || []);
    } catch (error) {
      console.error('Error searching Unsplash:', error);
      setUnsplashResults([]);
    } finally {
      setLoadingUnsplash(false);
    }
  };

  // Search Tenor GIFs
  const searchGifs = async (query) => {
    if (!query.trim()) {
      setGifResults([]);
      return;
    }

    setLoadingGifs(true);
    try {
      const response = await fetch(
        `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${process.env.NEXT_PUBLIC_TENOR_API_KEY}&limit=30&client_key=notwp_editor`
      );
      const data = await response.json();
      setGifResults(data.results || []);
    } catch (error) {
      console.error('Error searching GIFs:', error);
      setGifResults([]);
    } finally {
      setLoadingGifs(false);
    }
  };

  // Load media library files
  const loadMediaFiles = useCallback(async () => {
    try {
      setLoadingMedia(true);
      const data = await listFiles(supabase, currentPath);
      setMediaFiles(data);
    } catch (error) {
      console.error('Error loading media files:', error);
    } finally {
      setLoadingMedia(false);
    }
  }, [supabase, currentPath]);

  // Debounced search for Unsplash
  useEffect(() => {
    const timer = setTimeout(() => {
      if (unsplashSearch) {
        searchUnsplash(unsplashSearch);
      } else {
        setUnsplashResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [unsplashSearch]);

  // Debounced search for GIFs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (gifSearch) {
        searchGifs(gifSearch);
      } else {
        setGifResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [gifSearch]);

  // Load media files when media tab is active
  useEffect(() => {
    if (activeTab === 'media' && isOpen) {
      loadMediaFiles();
    }
  }, [activeTab, isOpen, loadMediaFiles]);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onSelect(event.target.result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInsert = () => {
    if (imageUrl) {
      onSelect(imageUrl);
      setImageUrl('');
      onClose();
    }
  };

  const handleUnsplashImageSelect = (photo) => {
    onSelect(photo.urls.regular);
    onClose();
    // Trigger download tracking as per Unsplash API guidelines
    if (photo.links?.download_location) {
      fetch(photo.links.download_location, {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        }
      }).catch(err => console.error('Error tracking download:', err));
    }
  };

  const handleGifSelect = (gif) => {
    onSelect(gif.media_formats?.gif?.url || gif.media_formats?.mediumgif?.url);
    onClose();
  };

  // Handle folder navigation in media library
  const navigateToFolder = (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
  };

  const navigateToPath = (index) => {
    if (index === -1) {
      setCurrentPath('');
    } else {
      const pathParts = currentPath.split('/');
      setCurrentPath(pathParts.slice(0, index + 1).join('/'));
    }
  };

  const handleMediaFileSelect = (file) => {
    const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
    const url = getPublicUrl(supabase, filePath);
    onSelect(url);
    onClose();
  };

  // Get breadcrumb path for media library
  const pathParts = currentPath ? currentPath.split('/') : [];
  const folders = mediaFiles.filter(f => f.id === null);
  const regularFiles = mediaFiles.filter(f => f.id !== null && f.name !== '.placeholder');
  const imageFiles = regularFiles.filter(f => f.metadata?.mimetype?.startsWith('image/'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 cursor-pointer" onClick={onClose}>
      <div className="relative w-[1200px] h-[800px] bg-white rounded-xl shadow-2xl overflow-hidden cursor-default" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-200">
          <h2 className="text-2xl font-semibold text-stone-900">Select Image</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-stone-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-6 py-4 text-base font-medium transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Upload className="w-5 h-5 inline-block mr-2" />
            Upload
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 px-6 py-4 text-base font-medium transition-colors cursor-pointer ${
              activeTab === 'media'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <ImageIcon className="w-5 h-5 inline-block mr-2" />
            Media Library
          </button>
          <button
            onClick={() => setActiveTab('gif')}
            className={`flex-1 px-6 py-4 text-base font-medium transition-colors cursor-pointer ${
              activeTab === 'gif'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <ImageIcon className="w-5 h-5 inline-block mr-2" />
            GIF
          </button>
          <button
            onClick={() => setActiveTab('unsplash')}
            className={`flex-1 px-6 py-4 text-base font-medium transition-colors cursor-pointer ${
              activeTab === 'unsplash'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Search className="w-5 h-5 inline-block mr-2" />
            Unsplash
          </button>
        </div>

        {/* Content */}
        <div className="p-12 h-[calc(800px-154px)] overflow-y-auto">
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-full max-w-2xl">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-10 pb-12">
                    <Upload className="w-20 h-20 mb-6 text-stone-400" />
                    <p className="mb-4 text-lg text-stone-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-base text-stone-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
                <div className="mt-8">
                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-stone-300"></div>
                    <span className="mx-6 text-base text-stone-500 flex-shrink">OR</span>
                    <div className="flex-grow border-t border-stone-300"></div>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <input
                      type="text"
                      placeholder="Paste image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-5 py-4 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      onKeyDown={(e) => e.key === 'Enter' && handleUrlInsert()}
                    />
                    <button
                      onClick={handleUrlInsert}
                      className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium cursor-pointer"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="flex flex-col h-full">
              {/* Breadcrumb Navigation */}
              <div className="bg-stone-50 rounded-lg border border-stone-200 px-4 py-3 mb-6">
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

              <div className="flex-1 overflow-y-auto">
                {loadingMedia ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                ) : folders.length === 0 && imageFiles.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-stone-500 text-lg">
                    No images found in media library
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {/* Folders */}
                    {folders.map((folder) => (
                      <div
                        key={folder.name}
                        onClick={() => navigateToFolder(folder.name)}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all group border border-stone-200 bg-stone-50"
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <Folder className="w-16 h-16 text-stone-400" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-3">
                          <p className="text-sm text-stone-900 text-center truncate font-medium">
                            {folder.name}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Images */}
                    {imageFiles.map((file) => {
                      const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
                      const publicUrl = getPublicUrl(supabase, filePath);

                      return (
                        <div
                          key={file.name}
                          onClick={() => handleMediaFileSelect(file)}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all group"
                        >
                          <img
                            src={publicUrl}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs truncate">{file.name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gif' && (
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search for GIFs..."
                    value={gifSearch}
                    onChange={(e) => setGifSearch(e.target.value)}
                    className="w-full pl-14 pr-5 py-4 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loadingGifs ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                ) : gifResults.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {gifResults.map((gif) => (
                      <div
                        key={gif.id}
                        onClick={() => handleGifSelect(gif)}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all group"
                      >
                        <img
                          src={gif.media_formats?.tinygif?.url || gif.media_formats?.nanogif?.url}
                          alt={gif.title || gif.content_description}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-500 text-lg">
                    {gifSearch ? 'No GIFs found' : 'Search for GIFs using Tenor'}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'unsplash' && (
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search Unsplash..."
                    value={unsplashSearch}
                    onChange={(e) => setUnsplashSearch(e.target.value)}
                    className="w-full pl-14 pr-5 py-4 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loadingUnsplash ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                ) : unsplashResults.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {unsplashResults.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => handleUnsplashImageSelect(photo)}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all group"
                      >
                        <img
                          src={photo.urls.small}
                          alt={photo.alt_description || photo.description}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs">Photo by {photo.user.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-500 text-lg">
                    {unsplashSearch ? 'No images found' : 'Search for images on Unsplash'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
