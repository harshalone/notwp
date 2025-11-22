'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DocumentationEditor from "@/app/_components/DocumentationEditor";
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import DocumentationRightSidebar from "@/app/_components/DocumentationRightSidebar";
import ImagePopup from "@/app/_components/ImagePopup";
import VideoPopup from "@/app/_components/VideoPopup";
import { createClient } from '@/lib/supabase-browser';
import { Loader2 } from 'lucide-react';

export default function DocumentationEditorPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.postId;

  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doc, setDoc] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Refs to hold the save and publish handlers from RightSidebar
  const saveHandlerRef = useRef(null);
  const publishHandlerRef = useRef(null);

  useEffect(() => {
    async function fetchDoc() {
      try {
        const supabase = createClient();

        // Fetch the documentation by doc_uid
        const { data, error: fetchError } = await supabase
          .from('nwp_documentation')
          .select('*')
          .eq('doc_uid', docId)
          .single();

        if (fetchError) {
          console.error('Error fetching documentation:', fetchError);
          setError('Failed to load documentation');
          return;
        }

        if (!data) {
          setError('Documentation not found');
          return;
        }

        setDoc(data);

        // Load featured image and video if they exist
        if (data.featured_image_url) {
          setSelectedImage(data.featured_image_url);
        }
        if (data.featured_video_url) {
          setSelectedVideo(data.featured_video_url);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load documentation');
      } finally {
        setLoading(false);
      }
    }

    if (docId) {
      fetchDoc();
    }
  }, [docId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-stone-900 mx-auto mb-4" />
          <p className="text-sm text-stone-600">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-800 font-semibold mb-2">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 mr-96">
        {/* Admin Header */}
        <AdminHeader />

        {/* Editor */}
        <main className="pt-15">
          <DocumentationEditor docId={docId} initialContent={doc?.content} />
        </main>
      </div>

      {/* Right Sidebar */}
      <DocumentationRightSidebar
        docId={docId}
        doc={doc}
        onSaveReady={(handler) => saveHandlerRef.current = handler}
        onPublishReady={(handler) => publishHandlerRef.current = handler}
        onImageClick={() => setIsImagePopupOpen(true)}
        onVideoClick={() => setIsVideoPopupOpen(true)}
        selectedImage={selectedImage}
        selectedVideo={selectedVideo}
        onImageRemove={() => setSelectedImage(null)}
        onVideoRemove={() => setSelectedVideo(null)}
      />

      {/* Popups */}
      <ImagePopup
        isOpen={isImagePopupOpen}
        onClose={() => setIsImagePopupOpen(false)}
        onImageSelect={(url) => {
          setSelectedImage(url);
          setIsImagePopupOpen(false);
        }}
      />
      <VideoPopup
        isOpen={isVideoPopupOpen}
        onClose={() => setIsVideoPopupOpen(false)}
        onVideoSelect={(url) => {
          setSelectedVideo(url);
          setIsVideoPopupOpen(false);
        }}
      />
    </div>
  );
}
