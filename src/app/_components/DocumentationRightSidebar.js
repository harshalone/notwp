'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, Calendar, Send, ImageIcon, Video, ChevronDown, ChevronUp, RefreshCw, X, Settings, Search } from 'lucide-react';
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

export default function DocumentationRightSidebar({
  docId,
  doc,
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
  const dropdownRef = useRef(null);
  const [title, setTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isMetaExpanded, setIsMetaExpanded] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [parentDoc, setParentDoc] = useState(null);
  const [allDocs, setAllDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load documentation data when component mounts or doc changes
  useEffect(() => {
    if (doc) {
      setTitle(doc.title || '');
      setSlug(doc.slug || '');
      setMetaTitle(doc.meta_title || '');
      setMetaDescription(doc.meta_description || '');

      // Load parent document if exists
      if (doc.doc_parent) {
        fetchParentDoc(doc.doc_parent);
      }
    }
  }, [doc]);

  // Fetch all documentation for parent dropdown
  useEffect(() => {
    fetchAllDocs();
  }, [docId]);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Fetch all documentation
  const fetchAllDocs = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('nwp_documentation')
        .select('id, doc_uid, title, slug')
        .neq('doc_uid', docId) // Exclude current doc
        .order('title');

      if (error) {
        console.error('Error fetching documentation:', error);
        return;
      }

      setAllDocs(data || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Fetch parent documentation details
  const fetchParentDoc = async (parentId) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('nwp_documentation')
        .select('id, doc_uid, title, slug')
        .eq('id', parentId)
        .single();

      if (error) {
        console.error('Error fetching parent doc:', error);
        return;
      }

      setParentDoc(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Update dependency array to include selectedImage, selectedVideo and parentDoc
  useEffect(() => {
    if (onSaveReady) {
      onSaveReady(handleSave);
    }
    if (onPublishReady) {
      onPublishReady(handlePublish);
    }
  }, [onSaveReady, onPublishReady, title, slug, metaTitle, metaDescription, docId, selectedImage, selectedVideo, parentDoc]);

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
      .from('nwp_documentation')
      .select('doc_uid')
      .eq('slug', slugToCheck)
      .neq('doc_uid', docId) // Exclude current documentation
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
    window.open(`/dadmin/documentation/preview/${slug}`, '_blank');
  };

  // Save documentation data
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const supabase = createClient();
      const { error } = await supabase
        .from('nwp_documentation')
        .update({
          title,
          slug,
          meta_title: metaTitle,
          meta_description: metaDescription,
          featured_image_url: selectedImage || null,
          featured_video_url: selectedVideo || null,
          doc_parent: parentDoc?.id || null,
        })
        .eq('doc_uid', docId);

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
        alert('Please add a slug before publishing. The slug field is required for publishing documentation.');
        return;
      }

      // Check if slug already exists for another documentation
      const slugExists = await checkSlugExists(slug);
      if (slugExists) {
        const userResponse = confirm(
          `The slug "${slug}" is already in use by another documentation. Please edit the slug to make it unique before publishing.`
        );
        if (userResponse) {
          // Focus on the slug input
          document.querySelector('input[placeholder="doc-slug-url"]')?.focus();
        }
        return;
      }

      setIsSaving(true);
      setSaveMessage('');

      const supabase = createClient();

      // First, get the current documentation to access its content
      const { data: currentDoc, error: fetchError } = await supabase
        .from('nwp_documentation')
        .select('content, doc_status')
        .eq('doc_uid', docId)
        .single();

      if (fetchError) {
        setSaveMessage('Error fetching documentation content');
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
        doc_status: 'published',
        content_live: currentDoc.content, // Copy content to content_live
        featured_image_url: selectedImage || null,
        featured_video_url: selectedVideo || null,
        doc_parent: parentDoc?.id || null,
      };

      // If this is the first time publishing, set published_at timestamp
      if (currentDoc.doc_status !== 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('nwp_documentation')
        .update(updateData)
        .eq('doc_uid', docId);

      if (error) {
        showToastNotification('Error publishing documentation');
        console.error('Publish error:', error);
      } else {
        showToastNotification('Documentation published successfully!');
      }
    } catch (err) {
      showToastNotification('Error publishing documentation');
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

        {/* Documentation Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
            Documentation Details
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
              placeholder="Enter documentation title"
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
              placeholder="doc-slug-url"
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

          {/* Collapsible Settings Section */}
          <div className="border border-stone-200 rounded-lg">
            <button
              type="button"
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className="w-full flex items-center justify-between p-3 text-sm font-semibold text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
              {isSettingsExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {isSettingsExpanded && (
              <div className="p-3 pt-0 space-y-4">
                {/* Parent Documentation */}
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Parent Documentation
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-left flex items-center justify-between bg-white hover:bg-stone-50 transition-colors"
                    >
                      <span className={parentDoc ? 'text-stone-900' : 'text-stone-400'}>
                        {parentDoc ? parentDoc.title : 'Select parent documentation'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-2 border-b border-stone-200">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-stone-400" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search documentation..."
                              className="w-full pl-8 pr-3 py-1.5 border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-48 overflow-y-auto">
                          {/* None option */}
                          <button
                            type="button"
                            onClick={() => {
                              setParentDoc(null);
                              setIsDropdownOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 transition-colors flex items-center gap-2"
                          >
                            <span className="text-stone-500 italic">None</span>
                          </button>

                          {/* Filtered Documentation List */}
                          {allDocs
                            .filter(doc =>
                              doc.title.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((doc) => (
                              <button
                                key={doc.id}
                                type="button"
                                onClick={() => {
                                  setParentDoc(doc);
                                  setIsDropdownOpen(false);
                                  setSearchQuery('');
                                }}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-stone-50 transition-colors ${
                                  parentDoc?.id === doc.id ? 'bg-blue-50 text-blue-700' : 'text-stone-900'
                                }`}
                              >
                                {doc.title}
                              </button>
                            ))}

                          {/* No results message */}
                          {allDocs.filter(doc =>
                            doc.title.toLowerCase().includes(searchQuery.toLowerCase())
                          ).length === 0 && searchQuery && (
                            <div className="px-3 py-2 text-sm text-stone-500 italic">
                              No documentation found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    Set a parent to create a hierarchical documentation tree
                  </p>
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
