'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { Mail, Users, Send, Settings, Import, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SubscriberStats from './components/SubscriberStats';
import SubscribersTable from './components/SubscribersTable';

export default function NewsletterPage() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    thisMonth: 0,
    emailsSent: 0
  });
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStats();
    fetchSubscribers();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter/subscribers');
      const data = await response.json();

      if (data.success) {
        setSubscribers(data.subscribers);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    try {
      const response = await fetch(`/api/newsletter/subscribers/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await fetchSubscribers();
        await fetchStats();
      } else {
        alert('Failed to unsubscribe: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Failed to unsubscribe');
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch =
      subscriber.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || subscriber.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubscribers = filteredSubscribers.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="pt-20 px-8 pb-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-stone-900 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-stone-900">Newsletter</h1>
                  <p className="text-stone-600">
                    Manage subscribers and send email campaigns
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/dadmin/newsletter/import-export"
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-stone-200 hover:border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-900 transition-all"
                >
                  <Import className="w-4 h-4" />
                  Import/Export
                </Link>

                <Link
                  href="/dadmin/newsletter/settings"
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-stone-200 hover:border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-900 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <Link
                  href="/dadmin/newsletter/subscribers"
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-stone-200 hover:border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-900 transition-all"
                >
                  <Users className="w-4 h-4" />
                  Subscribers
                </Link>
                <Link
                  href="/dadmin/newsletter/compose"
                  className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 rounded-lg text-sm font-medium text-white transition-all"
                >
                  <Send className="w-4 h-4" />
                  Compose
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="bg-white rounded-lg border border-stone-200 p-12 mb-8">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-stone-600">Loading newsletter data...</p>
              </div>
            </div>
          ) : (
            <>
              <SubscriberStats stats={stats} />

              {/* Subscribers Section */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Recent Subscribers
                    <span className="ml-2 text-sm font-normal text-stone-500">
                      ({filteredSubscribers.length} total)
                    </span>
                  </h2>
                  <Link
                    href="/dadmin/newsletter/subscribers"
                    className="text-sm font-medium text-stone-700 hover:text-stone-900"
                  >
                    View All →
                  </Link>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg border border-stone-200 p-4">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search subscribers by email or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="unsubscribed">Unsubscribed</option>
                    </select>
                  </div>
                </div>

                {/* Subscribers Table */}
                {paginatedSubscribers.length === 0 ? (
                  <div className="bg-white rounded-lg border border-stone-200 p-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-stone-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-stone-900 mb-2">
                        {searchTerm || filterStatus !== 'all' ? 'No subscribers found' : 'No subscribers yet'}
                      </h3>
                      <p className="text-stone-600">
                        {searchTerm || filterStatus !== 'all'
                          ? 'Try adjusting your search or filter criteria'
                          : 'Subscribers will appear here once they sign up for your newsletter'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <SubscribersTable
                      subscribers={paginatedSubscribers}
                      onDelete={handleDeleteSubscriber}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between bg-white rounded-lg border border-stone-200 px-6 py-4">
                        <div className="text-sm text-stone-600">
                          Showing {startIndex + 1} to {Math.min(endIndex, filteredSubscribers.length)} of {filteredSubscribers.length} subscribers
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  currentPage === page
                                    ? 'bg-stone-900 text-white'
                                    : 'text-stone-700 hover:bg-stone-100'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
