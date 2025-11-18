'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function VideoPopup({ isOpen, onClose, onVideoSelect }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Function to extract YouTube video ID and convert to embed URL
  const getYouTubeEmbedUrl = (url) => {
    const ytregex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    const match = url.match(ytregex);

    if (match && match[5]) {
      const videoId = match[5];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  const handleInsert = () => {
    const embedUrl = getYouTubeEmbedUrl(videoUrl);

    if (embedUrl) {
      // Handle video insertion logic here
      if (onVideoSelect) {
        onVideoSelect(embedUrl);
      }
      console.log('Insert YouTube video:', embedUrl);
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
