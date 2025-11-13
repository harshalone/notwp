'use client';

import { useState } from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';

export default function VideoPopup({ isOpen, onClose }) {
  const [uploadMethod, setUploadMethod] = useState('upload'); // 'upload' or 'url'
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleInsert = () => {
    // Handle video insertion logic here
    console.log('Insert video:', uploadMethod === 'upload' ? selectedFile : videoUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-900">Add Video</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Toggle between Upload and URL */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUploadMethod('upload')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                uploadMethod === 'upload'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-900 border border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Upload className="w-4 h-4 inline-block mr-2" />
              Upload
            </button>
            <button
              onClick={() => setUploadMethod('url')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                uploadMethod === 'url'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-900 border border-stone-300 hover:bg-stone-50'
              }`}
            >
              <LinkIcon className="w-4 h-4 inline-block mr-2" />
              URL
            </button>
          </div>

          {/* Upload Section */}
          {uploadMethod === 'upload' && (
            <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-stone-400 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload className="w-12 h-12 text-stone-400" />
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    Click to upload
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    MP4, WebM, OGG up to 100MB
                  </p>
                </div>
              </label>
              {selectedFile && (
                <p className="mt-4 text-sm text-stone-600 truncate">
                  {selectedFile.name}
                </p>
              )}
            </div>
          )}

          {/* URL Section */}
          {uploadMethod === 'url' && (
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-2">
                Video URL
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent text-sm"
              />
              <p className="mt-2 text-xs text-stone-500">
                Supports YouTube, Vimeo, and direct video URLs
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-stone-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={uploadMethod === 'upload' ? !selectedFile : !videoUrl}
            className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Insert Video
          </button>
        </div>
      </div>
    </div>
  );
}
