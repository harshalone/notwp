'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor from "@/app/_components/editor";
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import RightSidebar from "@/app/_components/RightSidebar";
import ImagePopup from "@/app/_components/ImagePopup";
import VideoPopup from "@/app/_components/VideoPopup";
import { createClient } from '@/lib/supabase-browser';
import { Loader2 } from 'lucide-react';

export default function PostEditorPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId;

  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Refs to hold the save and publish handlers from RightSidebar
  const saveHandlerRef = useRef(null);
  const publishHandlerRef = useRef(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const supabase = createClient();

        // Fetch the post by post_uid
        const { data, error: fetchError } = await supabase
          .from('nwp_posts')
          .select('*')
          .eq('post_uid', postId)
          .single();

        if (fetchError) {
          console.error('Error fetching post:', fetchError);
          setError('Failed to load post');
          return;
        }

        if (!data) {
          setError('Post not found');
          return;
        }

        setPost(data);

        // Load featured image and video if they exist
        if (data.featured_image_url) {
          setSelectedImage(data.featured_image_url);
        }
        if (data.featured_video_url) {
          setSelectedVideo(data.featured_video_url);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-stone-900 mx-auto mb-4" />
          <p className="text-sm text-stone-600">Loading post...</p>
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
          <Editor postId={postId} initialContent={post?.content} />
        </main>
      </div>

      {/* Right Sidebar */}
      <RightSidebar
        postId={postId}
        post={post}
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
