'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddDocumentationPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/documentation/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create documentation');
      }

      // Redirect to the documentation editor page
      router.push(`/dadmin/documentation/${data.doc.doc_uid}`);
    } catch (err) {
      console.error('Error creating documentation:', err);
      setError(err.message || 'Failed to create documentation. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="pt-20 px-8 pb-8">
          {/* Back Button */}
          <Link
            href="/dadmin/documentation"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Documentation
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900">Create New Documentation</h1>
            <p className="text-stone-600 mt-2">Enter a title to get started</p>
          </div>

          {/* Form Card */}
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg border border-stone-200 p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-stone-600" />
                </div>
                <h2 className="text-xl font-semibold text-stone-900 mb-2">
                  What's your documentation about?
                </h2>
                <p className="text-stone-600 text-sm">
                  Give your documentation a title. You can always change it later.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    Documentation Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your documentation title..."
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 text-lg"
                    disabled={isCreating}
                    autoFocus
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isCreating || !title.trim()}
                    className="flex-1 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed font-medium"
                  >
                    {isCreating ? 'Creating...' : 'Create Documentation'}
                  </button>
                  <Link
                    href="/dadmin/documentation"
                    className="px-6 py-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors font-medium text-stone-700"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>

            {/* Tips Card */}
            <div className="mt-6 bg-stone-100 rounded-lg p-6">
              <h3 className="font-semibold text-stone-900 mb-3">Tips for a great title</h3>
              <ul className="space-y-2 text-sm text-stone-700">
                <li className="flex gap-2">
                  <span className="text-stone-400">•</span>
                  <span>Keep it clear and concise (under 60 characters)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-stone-400">•</span>
                  <span>Make it engaging and descriptive</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-stone-400">•</span>
                  <span>Think about SEO and what users might search for</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
