'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { Loader2 } from 'lucide-react';
import { generateHTML } from '@tiptap/html';
import {
  StarterKit,
  TiptapLink,
  TiptapImage,
  TiptapUnderline,
  TaskList,
  TaskItem,
  HorizontalRule,
  Twitter,
  Youtube,
} from 'novel';
import { ColorExtensions } from '@/app/_components/selectors/color-selector';

// Configure the same extensions used in the editor for rendering
const extensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc list-outside leading-3',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal list-outside leading-3',
      },
    },
    listItem: {
      HTMLAttributes: {
        class: 'leading-normal',
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-stone-300 pl-4',
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: 'rounded-md bg-stone-950 p-5 font-mono text-sm text-stone-50',
      },
    },
    code: {
      HTMLAttributes: {
        class: 'rounded-md bg-stone-200 px-1.5 py-1 font-mono text-sm text-stone-900',
        spellcheck: 'false',
      },
    },
    horizontalRule: false,
  }),
  HorizontalRule.configure({
    HTMLAttributes: {
      class: 'mt-4 mb-6 border-t border-stone-300',
    },
  }),
  TiptapLink.configure({
    HTMLAttributes: {
      class: 'text-blue-500 underline underline-offset-[3px] hover:text-blue-600 transition-colors cursor-pointer',
    },
  }),
  TiptapImage.configure({
    HTMLAttributes: {
      class: 'rounded-lg border border-stone-200',
    },
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: 'not-prose pl-0 list-none',
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: 'flex items-start gap-2 my-2',
    },
    nested: true,
  }),
  TiptapUnderline,
  Twitter,
  Youtube.configure({
    HTMLAttributes: {
      class: 'rounded-lg overflow-hidden',
    },
  }),
  ...ColorExtensions,
];

export default function PreviewPage() {
  const params = useParams();
  const slug = params.slug;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        const supabase = createClient();

        // Fetch the post by slug
        const { data, error: fetchError } = await supabase
          .from('nwp_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (fetchError) {
          console.error('Error fetching post:', fetchError);
          setError('Failed to load post');
          return;
        }

        if (!data) {
          setError('Post not found');
          return;
        }

        setPost(data);

        // Generate HTML from the JSON content
        if (data.content) {
          const html = generateHTML(data.content, extensions);
          setHtmlContent(html);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-stone-900 mx-auto mb-4" />
          <p className="text-sm text-stone-600">Loading preview...</p>
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
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Title */}
        <h1 className="text-5xl font-bold mb-8 text-gray-800 leading-tight">
          {post?.title}
        </h1>

        {/* Featured Media - Video takes priority over Image */}
        {post?.featured_video_url ? (
          <div className="mb-8">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={post.featured_video_url}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : post?.featured_image_url ? (
          <div className="mb-8">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full rounded-lg"
            />
          </div>
        ) : null}

        {/* Content - rendered with ProseMirror styles */}
        <div
          className="ProseMirror prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            fontSize: '1.125rem',
            lineHeight: '1.875',
            color: '#1f2937'
          }}
        />
      </div>
    </div>
  );
}
