'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, Calendar, Send, ImageIcon, Video, ChevronDown, ChevronUp, RefreshCw, X } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export default function RightSidebar({
  postId,
  post,
  onSaveReady,
  onPublishReady,
  onImageClick,
  onVideoClick,
  selectedImage,
  selectedVideo,
  onImageRemove,
  onVideoRemove
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isMetaExpanded, setIsMetaExpanded] = useState(false);

  // Load post data when component mounts or post changes
  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setSlug(post.slug || '');
      setMetaTitle(post.meta_title || '');
      setMetaDescription(post.meta_description || '');
    }
  }, [post]);

  // Update dependency array to include selectedImage and selectedVideo
  useEffect(() => {
    if (onSaveReady) {
      onSaveReady(handleSave);
    }
    if (onPublishReady) {
      onPublishReady(handlePublish);
    }
  }, [onSaveReady, onPublishReady, title, slug, metaTitle, metaDescription, postId, selectedImage, selectedVideo]);

  // Handle title change and auto-generate slug if empty
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Auto-generate slug if it's empty
    if (!slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Regenerate slug from current title
  const handleRegenerateSlug = () => {
    if (title) {
      setSlug(generateSlug(title));
    }
  };

  // Check if slug exists in database
  const checkSlugExists = async (slugToCheck) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('nwp_posts')
      .select('post_uid')
      .eq('slug', slugToCheck)
      .neq('post_uid', postId) // Exclude current post
      .single();

    return !!data; // Returns true if slug exists
  };

  // Show toast notification
  const showToastNotification = (message) => {
    setSaveMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Handle preview
  const handlePreview = () => {
    if (!slug || slug.trim() === '') {
      alert('Please add a slug before previewing. The slug is required to generate the preview URL.');
      return;
    }
    // Open preview in a new tab
    window.open(`/dadmin/posts/preview/${slug}`, '_blank');
  };

  // Save post data
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const supabase = createClient();
      const { error } = await supabase
        .from('nwp_posts')
        .update({
          title,
          slug,
          meta_title: metaTitle,
          meta_description: metaDescription,
          featured_image_url: selectedImage || null,
          featured_video_url: selectedVideo || null,
        })
        .eq('post_uid', postId);

      if (error) {
        showToastNotification('Error saving changes');
        console.error('Save error:', error);
      } else {
        showToastNotification('Changes saved successfully');
      }
    } catch (err) {
      showToastNotification('Error saving changes');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle publish with slug validation
  const handlePublish = async () => {
    try {
      // Check if slug is empty
      if (!slug || slug.trim() === '') {
        alert('Please add a slug before publishing. The slug field is required for publishing posts.');
        return;
      }

      // Check if slug already exists for another post
      const slugExists = await checkSlugExists(slug);
      if (slugExists) {
        const userResponse = confirm(
          `The slug "${slug}" is already in use by another post. Please edit the slug to make it unique before publishing.`
        );
        if (userResponse) {
          // Focus on the slug input
          document.querySelector('input[placeholder="post-slug-url"]')?.focus();
        }
        return;
      }

      setIsSaving(true);
      setSaveMessage('');

      const supabase = createClient();

      // First, get the current post to access its content
      const { data: currentPost, error: fetchError } = await supabase
        .from('nwp_posts')
        .select('content, post_status')
        .eq('post_uid', postId)
        .single();

      if (fetchError) {
        setSaveMessage('Error fetching post content');
        console.error('Fetch error:', fetchError);
        setIsSaving(false);
        return;
      }

      // Prepare the update object
      const updateData = {
        title,
        slug,
        meta_title: metaTitle,
        meta_description: metaDescription,
        post_status: 'published',
        content_live: currentPost.content, // Copy content to content_live
        featured_image_url: selectedImage || null,
        featured_video_url: selectedVideo || null,
      };

      // If this is the first time publishing, set published_at timestamp
      if (currentPost.post_status !== 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('nwp_posts')
        .update(updateData)
        .eq('post_uid', postId);

      if (error) {
        showToastNotification('Error publishing post');
        console.error('Publish error:', error);
      } else {
        showToastNotification('Post published successfully!');
      }
    } catch (err) {
      showToastNotification('Error publishing post');
      console.error('Publish error:', err);
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <>
      {/* Toast Notification - Fixed at top center */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideIn">
          <div className="min-w-[320px] rounded-lg shadow-lg overflow-hidden bg-white border border-stone-300">
            <div className="p-4 text-stone-900">
              <div className="flex items-center justify-between">
                <span className="font-medium">{saveMessage}</span>
                <button
                  onClick={() => setShowToast(false)}
                  className="ml-4 text-sm opacity-70 hover:opacity-100"
                >
                  ×
                </button>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-1 bg-stone-200">
              <div
                className="h-full bg-stone-900 animate-reverseProgress"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}

      <aside className="w-96 bg-white border-l border-stone-200 h-screen fixed right-0 top-16 overflow-y-auto">
        <div className="p-6 space-y-6">

        {/* Action Buttons - Top Row */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handlePreview}
            className="px-3 py-2.5 bg-white text-stone-700 text-sm font-medium border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-2.5 bg-white text-stone-700 text-sm font-medium border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            title="Save"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="px-3 py-2.5 bg-blue-600 text-white text-sm font-medium border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            title="Publish"
          >
            <Send className="w-4 h-4" />
            <span>Publish</span>
          </button>
        </div>

        {/* Post Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
            Post Details
          </h3>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter post title"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-stone-900">
                Slug
              </label>
              <button
                type="button"
                onClick={handleRegenerateSlug}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate slug
              </button>
            </div>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="post-slug-url"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <p className="mt-1 text-xs text-stone-500">
              Auto-generated from title. You can edit it before publishing.
            </p>
          </div>

          {/* Collapsible Meta Fields */}
          <div className="border border-stone-200 rounded-lg">
            <button
              type="button"
              onClick={() => setIsMetaExpanded(!isMetaExpanded)}
              className="w-full flex items-center justify-between p-3 text-sm font-semibold text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
            >
              <span>SEO & Metadata</span>
              {isMetaExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {isMetaExpanded && (
              <div className="p-3 pt-0 space-y-4">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="SEO title"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <p className="mt-1 text-xs text-stone-500">
                    {metaTitle.length}/60 characters
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="SEO description"
                    rows={4}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  />
                  <p className="mt-1 text-xs text-stone-500">
                    {metaDescription.length}/160 characters
                  </p>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Categories
                  </label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                    <option>Select category</option>
                    <option>Technology</option>
                    <option>Design</option>
                    <option>Business</option>
                    <option>Lifestyle</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="Add tags, separated by commas"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Media Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onImageClick}
              className="px-3 py-2.5 bg-white text-stone-700 text-sm font-medium border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
              title="Add Image"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Image</span>
            </button>

            <button
              onClick={onVideoClick}
              className="px-3 py-2.5 bg-white text-stone-700 text-sm font-medium border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
              title="Add Video"
            >
              <Video className="w-4 h-4" />
              <span>Video</span>
            </button>
          </div>

          {/* Publish Date */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              Publish Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="datetime-local"
                className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Embed Previews */}
          {(selectedImage || selectedVideo) && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                Media Previews
              </h3>

              {/* Image Preview */}
              {selectedImage && (
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <div className="relative aspect-video bg-stone-100">
                    <img
                      src={selectedImage}
                      alt="Selected image preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={onImageRemove}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="p-3 bg-stone-50 border-t border-stone-200">
                    <p className="text-xs text-stone-600 truncate">{selectedImage}</p>
                  </div>
                </div>
              )}

              {/* Video Preview */}
              {selectedVideo && (
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={selectedVideo}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <button
                      onClick={onVideoRemove}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                      title="Remove video"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="p-3 bg-stone-50 border-t border-stone-200">
                    <p className="text-xs text-stone-600 truncate">{selectedVideo}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
    </>
  );
}
