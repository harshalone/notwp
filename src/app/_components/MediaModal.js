'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Search, Loader2 } from 'lucide-react';

export function ImageModal({ isOpen, onClose, onInsert }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [gifSearch, setGifSearch] = useState('');
  const [unsplashSearch, setUnsplashSearch] = useState('');
  const [unsplashResults, setUnsplashResults] = useState([]);
  const [gifResults, setGifResults] = useState([]);
  const [loadingUnsplash, setLoadingUnsplash] = useState(false);
  const [loadingGifs, setLoadingGifs] = useState(false);

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

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onInsert(event.target.result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInsert = () => {
    if (imageUrl) {
      onInsert(imageUrl);
      setImageUrl('');
      onClose();
    }
  };

  const handleUnsplashImageSelect = (photo) => {
    onInsert(photo.urls.regular);
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
    onInsert(gif.media_formats?.gif?.url || gif.media_formats?.mediumgif?.url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 cursor-pointer" onClick={onClose}>
      <div className="relative w-[1200px] h-[800px] bg-white rounded-xl shadow-2xl overflow-hidden cursor-default" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-200">
          <h2 className="text-2xl font-semibold text-stone-900">Insert Image</h2>
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

export function YoutubeModal({ isOpen, onClose, onInsert }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInsert = () => {
    const ytregex = new RegExp(
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
    );

    if (videoUrl && ytregex.test(videoUrl)) {
      onInsert(videoUrl);
      setVideoUrl('');
      setError('');
      onClose();
    } else if (videoUrl) {
      setError('Please enter a valid YouTube URL');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 cursor-pointer" onClick={onClose}>
      <div className="relative w-[1200px] h-[800px] bg-white rounded-xl shadow-2xl overflow-hidden cursor-default" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-200">
          <h2 className="text-2xl font-semibold text-stone-900">Embed YouTube Video</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-stone-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-12 flex flex-col items-center justify-center h-[calc(800px-96px)]">
          <div className="w-full max-w-2xl">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-8">
                <svg className="w-16 h-16 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <p className="text-lg text-stone-600 mb-8">
                Enter a YouTube video URL to embed it in your document
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    setError('');
                  }}
                  className={`w-full px-5 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
                    error ? 'border-red-500' : 'border-stone-300'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                  autoFocus
                />
                {error && <p className="mt-3 text-base text-red-600">{error}</p>}
              </div>

              <button
                onClick={handleInsert}
                className="w-full px-5 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium cursor-pointer"
              >
                Embed Video
              </button>

              <div className="text-base text-stone-500 text-center">
                Supports youtube.com and youtu.be links
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TwitterModal({ isOpen, onClose, onInsert }) {
  const [tweetUrl, setTweetUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInsert = () => {
    const tweetRegex = new RegExp(
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?$/
    );

    if (tweetUrl && tweetRegex.test(tweetUrl)) {
      onInsert(tweetUrl);
      setTweetUrl('');
      setError('');
      onClose();
    } else if (tweetUrl) {
      setError('Please enter a valid Twitter/X URL');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 cursor-pointer" onClick={onClose}>
      <div className="relative w-[1200px] h-[800px] bg-white rounded-xl shadow-2xl overflow-hidden cursor-default" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-200">
          <h2 className="text-2xl font-semibold text-stone-900">Embed Tweet</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-stone-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-12 flex flex-col items-center justify-center h-[calc(800px-96px)]">
          <div className="w-full max-w-2xl">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-100 rounded-full mb-8">
                <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <p className="text-lg text-stone-600 mb-8">
                Enter a Twitter/X post URL to embed it in your document
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="https://twitter.com/user/status/..."
                  value={tweetUrl}
                  onChange={(e) => {
                    setTweetUrl(e.target.value);
                    setError('');
                  }}
                  className={`w-full px-5 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
                    error ? 'border-red-500' : 'border-stone-300'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                  autoFocus
                />
                {error && <p className="mt-3 text-base text-red-600">{error}</p>}
              </div>

              <button
                onClick={handleInsert}
                className="w-full px-5 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium cursor-pointer"
              >
                Embed Tweet
              </button>

              <div className="text-base text-stone-500 text-center">
                Supports both twitter.com and x.com links
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
