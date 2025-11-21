'use client';

import { Mail, Calendar, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function SubscribersTable({ subscribers, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to unsubscribe this user?')) return;

    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      unsubscribed: 'bg-stone-100 text-stone-800'
    };
    return colors[status] || colors.active;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                Subscribed Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-stone-900">
                    <Mail className="w-4 h-4 mr-2 text-stone-400" />
                    {subscriber.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-stone-900">
                    {subscriber.name || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(subscriber.status)}`}>
                    {subscriber.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-stone-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(subscriber.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(subscriber.id)}
                    disabled={deletingId === subscriber.id}
                    className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
