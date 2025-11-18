'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { FileText, Plus, Search, Eye, Calendar, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts on mount and when activeTab changes
  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts when activeTab or searchQuery changes
  useEffect(() => {
    filterPosts();
  }, [activeTab, posts, searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts/list');
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      } else {
        console.error('Failed to fetch posts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    // Filter by status
    if (activeTab === 'draft') {
      filtered = filtered.filter(post => post.post_status === 'draft');
    } else if (activeTab === 'published') {
      filtered = filtered.filter(post => post.post_status === 'published');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      published: 'bg-green-100 text-green-800 border-green-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      private: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${styles[status] || styles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const tabs = [
    { id: 'all', label: 'All Posts', count: posts.length },
    { id: 'draft', label: 'Draft', count: posts.filter(p => p.post_status === 'draft').length },
    { id: 'published', label: 'Published', count: posts.filter(p => p.post_status === 'published').length },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="pt-20 px-8 pb-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Posts</h1>
              <p className="text-stone-600 mt-2">Manage all your blog posts</p>
            </div>
            <Link href="/dadmin/posts/add" className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
              <Plus className="w-4 h-4" />
              Add New Post
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="border-b border-stone-200">
              <nav className="flex gap-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`cursor-pointer pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-stone-900 text-stone-900'
                        : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {tab.label}
                    <span className="ml-2 px-2 py-1 bg-stone-100 rounded text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="bg-white rounded-lg border border-stone-200 p-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-stone-600">Loading posts...</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-lg border border-stone-200 p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-stone-400" />
                </div>
                <h2 className="text-xl font-semibold text-stone-900 mb-2">
                  {searchQuery ? 'No posts found' : 'No posts yet'}
                </h2>
                <p className="text-stone-600 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Get started by creating your first post'
                  }
                </p>
                {!searchQuery && (
                  <Link href="/dadmin/posts/add" className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    Create Your First Post
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredPosts.map((post) => (
                      <tr key={post.post_uid} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-stone-600" />
                            </div>
                            <div>
                              <Link
                                href={`/dadmin/posts/${post.post_uid}`}
                                className="font-medium text-stone-900 hover:text-stone-600 transition-colors"
                              >
                                {post.title}
                              </Link>
                              {post.excerpt && (
                                <p className="text-sm text-stone-500 mt-1 line-clamp-1">
                                  {post.excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(post.post_status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-stone-600">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{post.view_count || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-stone-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {post.post_status === 'published' && post.published_at
                                ? formatDate(post.published_at)
                                : formatDate(post.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/dadmin/posts/${post.post_uid}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
