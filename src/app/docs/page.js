'use client';

import { useState, useEffect } from 'react';
import Navigation from '../_components/landing/Navigation';
import DocsLeftSidebar from '../_components/docs/DocsLeftSidebar';
import DocsRightSidebar from '../_components/docs/DocsRightSidebar';
import { generateHTML } from '@tiptap/html';
import { StarterKit } from '@tiptap/starter-kit';
import { Link as TiptapLink } from '@tiptap/extension-link';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { Underline as TiptapUnderline } from '@tiptap/extension-underline';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Youtube } from '@tiptap/extension-youtube';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';

export default function DocsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeSlug, setActiveSlug] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  // Load first doc when docs are fetched
  useEffect(() => {
    if (docs.length > 0 && !selectedDoc) {
      // Find the first doc (could be top-level or first child)
      const firstDoc = docs[0];
      if (firstDoc.slug) {
        handleDocSelect(firstDoc.slug);
      }
    }
  }, [docs, selectedDoc]);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documentation/public');
      const data = await response.json();

      if (data.success) {
        setDocs(data.docs);
      }
    } catch (error) {
      console.error('Error fetching documentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/documentation/public?search=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success) {
        // Flatten the hierarchical structure for search results
        const flattenDocs = (docs) => {
          let result = [];
          docs.forEach((doc) => {
            result.push(doc);
            if (doc.children && doc.children.length > 0) {
              result = result.concat(flattenDocs(doc.children));
            }
          });
          return result;
        };
        setSearchResults(flattenDocs(data.docs));
      }
    } catch (error) {
      console.error('Error searching documentation:', error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    handleSearch(query);
  };

  const handleDocSelect = async (slug) => {
    try {
      setLoadingDoc(true);
      setActiveSlug(slug);
      setSearchQuery(''); // Clear search when selecting a doc

      const response = await fetch(`/api/documentation/${slug}`);
      const data = await response.json();

      if (data.success) {
        setSelectedDoc(data.doc);
      }
    } catch (error) {
      console.error('Error fetching documentation:', error);
    } finally {
      setLoadingDoc(false);
    }
  };

  const renderContent = (content) => {
    // If content is JSONB/object (from Tiptap editor), convert it to HTML
    if (typeof content === 'object' && content !== null) {
      try {
        // Configure Tiptap extensions to match the editor
        const extensions = [
          StarterKit.configure({
            heading: {
              levels: [1, 2, 3, 4],
              HTMLAttributes: {
                class: 'font-bold mb-3 mt-6 text-gray-800',
              },
            },
            paragraph: {
              HTMLAttributes: {
                class: 'mb-4 text-base leading-relaxed text-gray-800',
              },
            },
            bulletList: {
              HTMLAttributes: {
                class: 'list-disc list-outside leading-3 ml-6',
              },
            },
            orderedList: {
              HTMLAttributes: {
                class: 'list-decimal list-outside leading-3 ml-6',
              },
            },
            listItem: {
              HTMLAttributes: {
                class: 'leading-normal',
              },
            },
            blockquote: {
              HTMLAttributes: {
                class: 'border-l-4 border-stone-300 pl-4 italic',
              },
            },
            codeBlock: {
              HTMLAttributes: {
                class: 'rounded-md bg-stone-950 p-5 font-mono text-sm text-stone-50 my-4',
              },
            },
            code: {
              HTMLAttributes: {
                class: 'rounded-md bg-stone-200 px-1.5 py-1 font-mono text-sm text-stone-900',
              },
            },
          }),
          TiptapLink.configure({
            HTMLAttributes: {
              class: 'text-blue-500 underline underline-offset-[3px] hover:text-blue-600 transition-colors',
            },
          }),
          TiptapImage.configure({
            HTMLAttributes: {
              class: 'rounded-lg border border-stone-200 my-6 max-w-full h-auto',
            },
          }),
          TiptapUnderline,
          TaskList.configure({
            HTMLAttributes: {
              class: 'not-prose pl-0 list-none',
            },
          }),
          TaskItem.configure({
            HTMLAttributes: {
              class: 'flex items-start gap-2 my-2',
            },
          }),
          Youtube.configure({
            HTMLAttributes: {
              class: 'rounded-lg overflow-hidden my-6 w-full aspect-video',
            },
          }),
          TextStyle,
          Color,
          Highlight.configure({
            multicolor: true,
          }),
        ];

        // Generate HTML from Tiptap JSON
        let html = generateHTML(content, extensions);

        // Add IDs to headings for table of contents
        const headingRegex = /<h([1-4])([^>]*)>(.*?)<\/h\1>/gi;
        let index = 0;

        html = html.replace(headingRegex, (match, level, attrs, text) => {
          // Check if heading already has an ID
          if (attrs.includes('id=')) {
            return match;
          }
          // Generate ID from text (strip HTML tags first)
          const plainText = text.replace(/<[^>]*>/g, '');
          const id = plainText
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() || `heading-${index++}`;

          return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
        });

        return html;
      } catch (error) {
        console.error('Error rendering content:', error);
        return '<div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"><p class="text-red-800">Error rendering content. Please check the console for details.</p></div>';
      }
    }

    // If it's HTML string, ensure headings have IDs for TOC
    if (typeof content === 'string') {
      let processedContent = content;
      const headingRegex = /<h([1-4])([^>]*)>(.*?)<\/h\1>/gi;
      let index = 0;

      processedContent = processedContent.replace(headingRegex, (match, level, attrs, text) => {
        if (attrs.includes('id=')) {
          return match;
        }
        const plainText = text.replace(/<[^>]*>/g, '');
        const id = plainText
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim() || `heading-${index++}`;

        return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
      });

      return processedContent;
    }

    return '';
  };

  return (
    <>
      <Navigation />
      <div className="flex min-h-screen bg-white pt-16">
        {/* Left Sidebar - Compact Navigation */}
        <DocsLeftSidebar docs={docs} activeSlug={activeSlug} onDocSelect={handleDocSelect} />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl">
        {/* Top Search Bar */}
        <div className="sticky top-16 z-10 bg-white border-b border-gray-200 px-8 py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search documentation..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading documentation...</span>
            </div>
          ) : loadingDoc ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          ) : searchQuery ? (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                </p>
              </div>
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((doc) => (
                    <a
                      key={doc.id}
                      href={`/docs/${doc.slug}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {doc.title}
                      </h3>
                      {doc.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2">{doc.excerpt}</p>
                      )}
                      <span className="text-xs text-blue-600 mt-2 inline-block">
                        {doc.doc_type}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 21a9 9 0 100-18 9 9 0 000 18z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          ) : selectedDoc ? (
            <div className="docs-content">
              <div className="max-w-3xl">
                <div className="mb-6">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {selectedDoc.doc_type}
                  </span>
                  <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
                    {selectedDoc.title}
                  </h1>
                  {selectedDoc.excerpt && (
                    <p className="text-xl text-gray-600">
                      {selectedDoc.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    {selectedDoc.published_at && (
                      <span>Published: {new Date(selectedDoc.published_at).toLocaleDateString()}</span>
                    )}
                    {selectedDoc.updated_at && (
                      <span>Updated: {new Date(selectedDoc.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="prose prose-blue max-w-none">
                  {selectedDoc.content && typeof selectedDoc.content === 'object' ? (
                    <div dangerouslySetInnerHTML={{ __html: renderContent(selectedDoc.content) }} />
                  ) : (
                    <div>{selectedDoc.content}</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="docs-content">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to NotWP Documentation
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Everything you need to know about using NotWP. From getting started to advanced features.
                </p>

                <div className="prose prose-blue max-w-none">
                  <h2 id="getting-started">Getting Started</h2>
                  <p>
                    NotWP is a modern content management system that makes it easy to build and manage websites
                    without the complexity of traditional platforms.
                  </p>

                  <h3 id="quick-start">Quick Start</h3>
                  <p>
                    Get up and running in minutes. Browse the documentation on the left to find detailed guides
                    for all features.
                  </p>

                  <h2 id="features">Features</h2>
                  <p>
                    Explore our powerful features including the page builder, content management, and more.
                    Select a topic from the sidebar to learn more.
                  </p>

                  <h3 id="page-builder">Page Builder</h3>
                  <p>
                    Create beautiful pages with our intuitive drag-and-drop page builder.
                  </p>

                  <h3 id="content-management">Content Management</h3>
                  <p>
                    Manage all your content in one place with our streamlined content management system.
                  </p>
                </div>

                {docs.length === 0 && (
                  <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                      No Documentation Available
                    </h3>
                    <p className="text-yellow-800">
                      Documentation will appear here once published. Please check back later or contact support.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - On This Page (Table of Contents) */}
      <DocsRightSidebar content={selectedDoc?.content} />
      </div>
    </>
  );
}
