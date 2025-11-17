'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor from "@/app/_components/editor";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import RightSidebar from "@/app/_components/RightSidebar";
import ImagePopup from "@/app/_components/ImagePopup";
import VideoPopup from "@/app/_components/VideoPopup";
import { getSupabaseClient } from '@/lib/supabase-client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PostEditorPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId;

  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const supabase = getSupabaseClient();

        // Fetch the post by ID
        const { data, error: fetchError } = await supabase
          .from('nwp_posts')
          .select('*')
          .eq('id', postId)
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
          <Link
            href="/dadmin/posts"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

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
          {/* Post Title Display */}
          <div className="mb-6">
            <Link
              href="/dadmin/posts"
              className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Link>
            <h1 className="text-2xl font-bold text-stone-900">{post?.title}</h1>
            <p className="text-sm text-stone-500 mt-1">
              Status: <span className="capitalize">{post?.post_status}</span>
            </p>
          </div>

          <Editor postId={postId} initialContent={post?.content} />
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
