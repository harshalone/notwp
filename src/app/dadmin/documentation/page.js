'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { FileText, Plus, Search, Eye, Calendar, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [docs, setDocs] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 10;

  // Fetch documentation on mount
  useEffect(() => {
    fetchDocs();
  }, []);

  // Filter documentation when activeTab or searchQuery changes
  useEffect(() => {
    filterDocs();
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeTab, docs, searchQuery]);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/documentation/list');
      const data = await response.json();

      if (data.success) {
        setDocs(data.docs);
      } else {
        console.error('Failed to fetch documentation:', data.error);
      }
    } catch (error) {
      console.error('Error fetching documentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDocs = () => {
    let filtered = docs;

    // Filter by status
    if (activeTab === 'draft') {
      filtered = filtered.filter(doc => doc.doc_status === 'draft');
    } else if (activeTab === 'published') {
      filtered = filtered.filter(doc => doc.doc_status === 'published');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query)
      );
    }

    setFilteredDocs(filtered);
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
    { id: 'all', label: 'All Documentation', count: docs.length },
    { id: 'draft', label: 'Draft', count: docs.filter(d => d.doc_status === 'draft').length },
    { id: 'published', label: 'Published', count: docs.filter(d => d.doc_status === 'published').length },
  ];

  // Pagination calculations
  const totalPages = Math.ceil(filteredDocs.length / docsPerPage);
  const startIndex = (currentPage - 1) * docsPerPage;
  const endIndex = startIndex + docsPerPage;
  const currentDocs = filteredDocs.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="pt-20 px-8 pb-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Documentation</h1>
              <p className="text-stone-600 mt-2">Manage all your documentation</p>
            </div>
            <Link href="/dadmin/documentation/add" className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
              <Plus className="w-4 h-4" />
              Add New Doc
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
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Documentation List */}
          {loading ? (
            <div className="bg-white rounded-lg border border-stone-200 p-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-stone-600">Loading documentation...</p>
              </div>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="bg-white rounded-lg border border-stone-200 p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-stone-400" />
                </div>
                <h2 className="text-xl font-semibold text-stone-900 mb-2">
                  {searchQuery ? 'No documentation found' : 'No documentation yet'}
                </h2>
                <p className="text-stone-600 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Get started by creating your first documentation'
                  }
                </p>
                {!searchQuery && (
                  <Link href="/dadmin/documentation/add" className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    Create Your First Doc
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
                    {currentDocs.map((doc) => (
                      <tr key={doc.doc_uid} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-stone-600" />
                            </div>
                            <div>
                              <Link
                                href={`/dadmin/documentation/${doc.doc_uid}`}
                                className="font-medium text-stone-900 hover:text-stone-600 transition-colors"
                              >
                                {doc.title}
                              </Link>
                              {doc.excerpt && (
                                <p className="text-sm text-stone-500 mt-1 line-clamp-1">
                                  {doc.excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(doc.doc_status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-stone-600">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{doc.view_count || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-stone-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {doc.doc_status === 'published' && doc.published_at
                                ? formatDate(doc.published_at)
                                : formatDate(doc.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/dadmin/documentation/${doc.doc_uid}`}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between">
                  <div className="text-sm text-stone-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredDocs.length)} of {filteredDocs.length} docs
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
