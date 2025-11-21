'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { Search, Users as UsersIcon } from 'lucide-react';
import Link from 'next/link';
import SubscribersTable from '../components/SubscribersTable';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter/subscribers');
      const data = await response.json();

      if (data.success) {
        setSubscribers(data.subscribers);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
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
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-stone-900">Subscribers</h1>
                  <p className="text-stone-600">
                    Manage your newsletter subscribers ({filteredSubscribers.length} {filteredSubscribers.length === 1 ? 'subscriber' : 'subscribers'})
                  </p>
                </div>
              </div>
              <Link
                href="/dadmin/newsletter"
                className="px-4 py-2 bg-white border-2 border-stone-200 hover:border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-900 transition-all"
              >
                Back to Newsletter
              </Link>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
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
          {loading ? (
            <div className="bg-white rounded-lg border border-stone-200 p-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-stone-600">Loading subscribers...</p>
              </div>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="bg-white rounded-lg border border-stone-200 p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-8 h-8 text-stone-400" />
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
            <SubscribersTable
              subscribers={filteredSubscribers}
              onDelete={handleDeleteSubscriber}
            />
          )}
        </main>
      </div>
    </div>
  );
}
