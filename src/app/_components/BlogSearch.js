'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase-browser';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchPosts = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    try {
      const supabase = createBrowserClient();

      const { data, error } = await supabase
        .from('nwp_posts')
        .select('id, title, slug, excerpt, featured_image_url')
        .eq('post_status', 'published')
        .eq('post_type', 'post')
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
        .limit(5);

      if (error) {
        console.error('Search error:', error);
        setResults([]);
      } else {
        setResults(data || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchPosts(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, searchPosts]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder="Search posts..."
          className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
        {isSearching && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowResults(false)}
          />

          {/* Results Dropdown */}
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-[500px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {query ? 'No posts found' : 'Start typing to search'}
              </div>
            ) : (
              <div className="py-2">
                {results.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    onClick={() => {
                      setShowResults(false);
                      setQuery('');
                    }}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      {post.featured_image_url ? (
                        <div className="relative w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden">
                          <Image
                            src={post.featured_image_url}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                          {post.title}
                        </h4>
                        {post.excerpt && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
