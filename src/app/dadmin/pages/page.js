'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { Layout, Plus, Search, Eye, Calendar, Edit2, Settings } from 'lucide-react';
import Link from 'next/link';

export default function PagesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pagesPerPage = 10;
  const [settingsModal, setSettingsModal] = useState({ isOpen: false, page: null });

  // Fetch pages on mount
  useEffect(() => {
    fetchPages();
  }, []);

  // Filter pages when activeTab or searchQuery changes
  useEffect(() => {
    filterPages();
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeTab, pages, searchQuery]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pages/list');
      const data = await response.json();

      if (data.success) {
        setPages(data.pages);
      } else {
        console.error('Failed to fetch pages:', data.error);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPages = () => {
    let filtered = pages;

    // Filter by status
    if (activeTab === 'draft') {
      filtered = filtered.filter(page => page.page_status === 'draft');
    } else if (activeTab === 'published') {
      filtered = filtered.filter(page => page.page_status === 'published');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(page =>
        page.title.toLowerCase().includes(query)
      );
    }

    setFilteredPages(filtered);
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
      private: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${styles[status] || styles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const tabs = [
    { id: 'all', label: 'All Pages', count: pages.length },
    { id: 'draft', label: 'Draft', count: pages.filter(p => p.page_status === 'draft').length },
    { id: 'published', label: 'Published', count: pages.filter(p => p.page_status === 'published').length },
  ];

  // Pagination calculations
  const totalPages = Math.ceil(filteredPages.length / pagesPerPage);
  const startIndex = (currentPage - 1) * pagesPerPage;
  const endIndex = startIndex + pagesPerPage;
  const currentPages = filteredPages.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const PageSettingsModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      slug: '',
      excerpt: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      page_status: 'draft',
      comment_status: 'closed',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      if (settingsModal.page) {
        setFormData({
          title: settingsModal.page.title || '',
          slug: settingsModal.page.slug || '',
          excerpt: settingsModal.page.excerpt || '',
          meta_title: settingsModal.page.meta_title || '',
          meta_description: settingsModal.page.meta_description || '',
          meta_keywords: settingsModal.page.meta_keywords || '',
          page_status: settingsModal.page.page_status || 'draft',
          comment_status: settingsModal.page.comment_status || 'closed',
        });
      }
    }, [settingsModal.page]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);

      try {
        const response = await fetch('/api/pages/update-settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_uid: settingsModal.page.page_uid,
            ...formData,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Refresh the pages list
          await fetchPages();
          // Close the modal
          setSettingsModal({ isOpen: false, page: null });
        } else {
          alert('Failed to update settings: ' + data.error);
        }
      } catch (error) {
        console.error('Error updating settings:', error);
        alert('Failed to update settings');
      } finally {
        setSaving(false);
      }
    };

    if (!settingsModal.isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">Page Settings</h2>
            <button
              onClick={() => setSettingsModal({ isOpen: false, page: null })}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
                pattern="[a-z0-9-]+"
                title="Slug can only contain lowercase letters, numbers, and hyphens"
              />
              <p className="text-xs text-stone-500 mt-1">
                URL-friendly version (lowercase letters, numbers, and hyphens only)
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                rows="3"
                placeholder="Brief description of the page"
              />
            </div>

            {/* Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Page Status
                </label>
                <select
                  value={formData.page_status}
                  onChange={(e) => setFormData({ ...formData, page_status: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Comment Status
                </label>
                <select
                  value={formData.comment_status}
                  onChange={(e) => setFormData({ ...formData, comment_status: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* SEO Section */}
            <div className="border-t border-stone-200 pt-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">SEO Settings</h3>

              {/* Meta Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  placeholder="SEO title (defaults to page title if empty)"
                />
              </div>

              {/* Meta Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  rows="3"
                  placeholder="Brief description for search engines"
                />
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Comma-separated keywords
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setSettingsModal({ isOpen: false, page: null })}
                className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        {/* Page Settings Modal */}
        <PageSettingsModal />

        <main className="pt-20 px-8 pb-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Pages</h1>
              <p className="text-stone-600 mt-2">Manage your static pages</p>
            </div>
            <Link href="/dadmin/pages/add" className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
              <Plus className="w-4 h-4" />
              Add New Page
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
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Pages List */}
          {loading ? (
            <div className="bg-white rounded-lg border border-stone-200 p-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-stone-600">Loading pages...</p>
              </div>
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="bg-white rounded-lg border border-stone-200 p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layout className="w-8 h-8 text-stone-400" />
                </div>
                <h2 className="text-xl font-semibold text-stone-900 mb-2">
                  {searchQuery ? 'No pages found' : 'No pages yet'}
                </h2>
                <p className="text-stone-600 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Create your first static page like About, Contact, etc.'
                  }
                </p>
                {!searchQuery && (
                  <Link href="/dadmin/pages/add" className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    Create Your First Page
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
                    {currentPages.map((page) => (
                      <tr key={page.page_uid} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Layout className="w-5 h-5 text-stone-600" />
                            </div>
                            <div>
                              <Link
                                href={`/dadmin/pages/${page.page_uid}`}
                                className="font-medium text-stone-900 hover:text-stone-600 transition-colors"
                              >
                                {page.title}
                              </Link>
                              {page.excerpt && (
                                <p className="text-sm text-stone-500 mt-1 line-clamp-1">
                                  {page.excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(page.page_status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-stone-600">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{page.view_count || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-stone-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {page.page_status === 'published' && page.published_at
                                ? formatDate(page.published_at)
                                : formatDate(page.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dadmin/pages/${page.page_uid}`}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => setSettingsModal({ isOpen: true, page })}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                              title="Page Settings"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between">
                  <div className="text-sm text-stone-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredPages.length)} of {filteredPages.length} pages
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        const showEllipsis =
                          (page === 2 && currentPage > 3) ||
                          (page === totalPages - 1 && currentPage < totalPages - 2);

                        if (showEllipsis) {
                          return <span key={page} className="px-2 text-stone-400">...</span>;
                        }

                        if (!showPage) return null;

                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-stone-900 text-white'
                                : 'text-stone-700 bg-white border border-stone-200 hover:bg-stone-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
