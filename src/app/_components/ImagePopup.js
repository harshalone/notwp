'use client';

import { useState } from 'react';
import { X, Upload, Image as ImageIcon, Search } from 'lucide-react';

export default function ImagePopup({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [gifSearch, setGifSearch] = useState('');
  const [unsplashSearch, setUnsplashSearch] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log('Upload file:', file);
      onClose();
    }
  };

  const handleUrlInsert = () => {
    if (imageUrl) {
      // Handle URL insertion logic here
      console.log('Insert URL:', imageUrl);
      setImageUrl('');
      onClose();
    }
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
              <div className="flex-1 flex items-center justify-center text-stone-500 text-lg">
                GIF search coming soon (integrate with Giphy or Tenor API)
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
              <div className="flex-1 flex items-center justify-center text-stone-500 text-lg">
                Unsplash search coming soon (integrate with Unsplash API)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
