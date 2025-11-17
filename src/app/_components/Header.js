'use client';

import { useState, useRef, useEffect } from 'react';
import { Eye, Save, Send, ImageIcon, Video } from 'lucide-react';

export default function Header({ onImageClick, onVideoClick, onSave, onPublish, topOffset = '0' }) {
  return (
    <header className={`h-16 bg-white border-b border-stone-200 flex items-center justify-end px-6 fixed right-0 left-64 z-40`} style={{ top: topOffset }}>
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 bg-white text-stone-900 text-sm font-medium border border-stone-300 rounded-md hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>

        <button
          onClick={onSave}
          className="px-4 py-2 bg-white text-stone-900 text-sm font-medium border border-stone-300 rounded-md hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </button>

        <button
          onClick={onPublish}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Publish
        </button>

        <button
          onClick={onImageClick}
          className="px-4 py-2 bg-white text-stone-900 text-sm font-medium border border-stone-300 rounded-md hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-2"
        >
          <ImageIcon className="w-4 h-4" />
          Image
        </button>

        <button
          onClick={onVideoClick}
          className="px-4 py-2 bg-white text-stone-900 text-sm font-medium border border-stone-300 rounded-md hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          Video
        </button>
      </div>
    </header>
  );
}
