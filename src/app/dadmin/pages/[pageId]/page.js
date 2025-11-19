'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PuckEditor from "@/app/_components/puck/PuckEditor";
import { createClient } from '@/lib/supabase-browser';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        const supabase = createClient();

        // Fetch the page by page_uid
        const { data, error: fetchError } = await supabase
          .from('nwp_pages')
          .select('*')
          .eq('page_uid', pageId)
          .single();

        if (fetchError) {
          console.error('Error fetching page:', fetchError);
          setError('Failed to load page');
          return;
        }

        if (!data) {
          setError('Page not found');
          return;
        }

        setPage(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    }

    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-stone-900 mx-auto mb-4" />
          <p className="text-sm text-stone-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-800 font-semibold mb-2">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <button
        onClick={() => router.push('/dadmin/pages')}
        className="cursor-pointer fixed top-3 left-3 z-50 p-2 bg-white border border-stone-200 rounded-lg shadow-sm hover:bg-stone-50 transition-colors"
        aria-label="Back to dashboard"
      >
        <ArrowLeft className="w-5 h-5 text-stone-700" />
      </button>

      {/* Puck Editor - Full Width */}
      <PuckEditor
        pageId={pageId}
        initialData={page?.content}
      />
    </div>
  );
}
