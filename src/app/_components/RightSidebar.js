'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, Upload, Calendar, Send, ImageIcon, Video } from 'lucide-react';
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

export default function RightSidebar({ postId, post, onSaveReady, onPublishReady, onImageClick, onVideoClick }) {
  const [title, setTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load post data when component mounts or post changes
  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setSlug(post.slug || '');
      setMetaTitle(post.meta_title || '');
      setMetaDescription(post.meta_description || '');
    }
  }, [post]);

  // Handle title change and auto-generate slug if empty
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Auto-generate slug if it's empty
    if (!slug) {
      setSlug(generateSlug(newTitle));
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

  // Save post data
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');

      const supabase = createClient();
      const { error } = await supabase
        .from('nwp_posts')
        .update({
          title,
          slug,
          meta_title: metaTitle,
          meta_description: metaDescription,
        })
        .eq('post_uid', postId);

      if (error) {
        setSaveMessage('Error saving changes');
        console.error('Save error:', error);
      } else {
        setSaveMessage('Changes saved successfully');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      setSaveMessage('Error saving changes');
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
      const { error } = await supabase
        .from('nwp_posts')
        .update({
          title,
          slug,
          meta_title: metaTitle,
          meta_description: metaDescription,
          post_status: 'published',
        })
        .eq('post_uid', postId);

      if (error) {
        setSaveMessage('Error publishing post');
        console.error('Publish error:', error);
      } else {
        setSaveMessage('Post published successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      setSaveMessage('Error publishing post');
      console.error('Publish error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Expose handlers to parent component
  useEffect(() => {
    if (onSaveReady) {
      onSaveReady(handleSave);
    }
    if (onPublishReady) {
      onPublishReady(handlePublish);
    }
  }, [onSaveReady, onPublishReady, title, slug, metaTitle, metaDescription, postId]);

  return (
    <aside className="w-96 bg-white border-l border-stone-200 h-screen fixed right-0 top-16 overflow-y-auto">
      <div className="p-6 space-y-6">

        {/* Action Buttons - Top Row */}
        <div className="grid grid-cols-3 gap-2">
          <button
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

        {/* Save Message */}
        {saveMessage && (
          <div className={`p-3 rounded-lg text-sm ${
            saveMessage.includes('Error')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {saveMessage}
          </div>
        )}

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
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              Slug
            </label>
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
      </div>
    </aside>
  );
}
