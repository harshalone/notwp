'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { Layout, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddPagePage() {
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
      const response = await fetch('/api/pages/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create page');
      }

      // Redirect to the page editor page
      router.push(`/dadmin/pages/${data.page.page_uid}`);
    } catch (err) {
      console.error('Error creating page:', err);
      setError(err.message || 'Failed to create page. Please try again.');
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
            href="/dadmin/pages"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pages
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900">Create New Page</h1>
            <p className="text-stone-600 mt-2">Enter a title to get started</p>
          </div>

          {/* Form Card */}
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg border border-stone-200 p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                  <Layout className="w-8 h-8 text-stone-600" />
                </div>
                <h2 className="text-xl font-semibold text-stone-900 mb-2">
                  What's your page about?
                </h2>
                <p className="text-stone-600 text-sm">
                  Give your page a title. You can always change it later.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    Page Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., About Us, Contact, Privacy Policy..."
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
                    {isCreating ? 'Creating...' : 'Create Page'}
                  </button>
                  <Link
                    href="/dadmin/pages"
                    className="px-6 py-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors font-medium text-stone-700"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>

            {/* Tips Card */}
            <div className="mt-6 bg-stone-100 rounded-lg p-6">
              <h3 className="font-semibold text-stone-900 mb-3">Common pages to create</h3>
              <ul className="space-y-2 text-sm text-stone-700">
                <li className="flex gap-2">
                  <span className="text-stone-400">•</span>
                  <span>About Us - Tell your story and mission</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-stone-400">•</span>
                  <span>Contact - Let visitors get in touch</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-stone-400">•</span>
                  <span>Privacy Policy - Explain data handling practices</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-stone-400">•</span>
                  <span>Terms of Service - Define usage terms</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
