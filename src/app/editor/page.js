'use client';

import { useState } from 'react';
import Editor from "@/app/_components/editor";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import RightSidebar from "@/app/_components/RightSidebar";
import ImagePopup from "@/app/_components/ImagePopup";
import VideoPopup from "@/app/_components/VideoPopup";

export default function EditorPage() {
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 mr-80">
        {/* Header */}
        <Header
          onImageClick={() => setIsImagePopupOpen(true)}
          onVideoClick={() => setIsVideoPopupOpen(true)}
        />

        {/* Editor */}
        <main className="pt-20 px-8 pb-8">
          <Editor />
        </main>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />

      {/* Popups */}
      <ImagePopup
        isOpen={isImagePopupOpen}
        onClose={() => setIsImagePopupOpen(false)}
      />
      <VideoPopup
        isOpen={isVideoPopupOpen}
        onClose={() => setIsVideoPopupOpen(false)}
      />
    </div>
  );
}
