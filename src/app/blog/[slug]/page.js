import { createClient, createStaticClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { generateHTML } from '@tiptap/html';
import { StarterKit } from '@tiptap/starter-kit';
import { Link as TiptapLink } from '@tiptap/extension-link';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { Underline as TiptapUnderline } from '@tiptap/extension-underline';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Youtube } from '@tiptap/extension-youtube';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';

export const revalidate = 60; // Revalidate every 60 seconds

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = createStaticClient();

  const { data: post } = await supabase
    .from('nwp_posts')
    .select('title, meta_title, meta_description, meta_keywords, og_image_url, excerpt')
    .eq('slug', slug)
    .eq('post_status', 'published')
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || '',
    keywords: post.meta_keywords || '',
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || '',
      images: post.og_image_url ? [post.og_image_url] : [],
    },
  };
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  const supabase = createStaticClient();

  const { data: posts } = await supabase
    .from('nwp_posts')
    .select('slug')
    .eq('post_status', 'published')
    .eq('post_type', 'post');

  if (!posts) return [];

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function getPost(slug) {
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('nwp_posts')
    .select('*')
    .eq('slug', slug)
    .eq('post_status', 'published')
    .single();

  if (error || !post) {
    return null;
  }

  // Increment view count
  await supabase
    .from('nwp_posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id);

  return post;
}

async function getRelatedPosts(currentPostId, limit = 3) {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('nwp_posts')
    .select('id, title, slug, excerpt, featured_image_url, published_at')
    .eq('post_status', 'published')
    .eq('post_type', 'post')
    .neq('id', currentPostId)
    .order('published_at', { ascending: false })
    .limit(limit);

  return posts || [];
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function renderContent(content) {
  // If content is JSONB/JSON (from Tiptap editor), convert it to HTML
  if (typeof content === 'object' && content !== null) {
    try {
      // Configure Tiptap extensions to match the editor
      const extensions = [
        StarterKit.configure({
          bulletList: {
            HTMLAttributes: {
              class: 'list-disc list-outside leading-3 ml-6',
            },
          },
          orderedList: {
            HTMLAttributes: {
              class: 'list-decimal list-outside leading-3 ml-6',
            },
          },
          listItem: {
            HTMLAttributes: {
              class: 'leading-normal',
            },
          },
          blockquote: {
            HTMLAttributes: {
              class: 'border-l-4 border-stone-300 pl-4 italic',
            },
          },
          codeBlock: {
            HTMLAttributes: {
              class: 'rounded-md bg-stone-950 p-5 font-mono text-sm text-stone-50 my-4',
            },
          },
          code: {
            HTMLAttributes: {
              class: 'rounded-md bg-stone-200 px-1.5 py-1 font-mono text-sm text-stone-900',
            },
          },
          heading: {
            HTMLAttributes: {
              class: 'font-bold mb-3 mt-6 text-gray-800',
            },
          },
          paragraph: {
            HTMLAttributes: {
              class: 'mb-4 text-lg leading-relaxed text-gray-800',
            },
          },
        }),
        TiptapLink.configure({
          HTMLAttributes: {
            class: 'text-blue-500 underline underline-offset-[3px] hover:text-blue-600 transition-colors',
          },
        }),
        TiptapImage.configure({
          HTMLAttributes: {
            class: 'rounded-lg border border-stone-200 my-6 max-w-full h-auto',
          },
        }),
        TiptapUnderline,
        TaskList.configure({
          HTMLAttributes: {
            class: 'not-prose pl-0 list-none',
          },
        }),
        TaskItem.configure({
          HTMLAttributes: {
            class: 'flex items-start gap-2 my-2',
          },
        }),
        Youtube.configure({
          HTMLAttributes: {
            class: 'rounded-lg overflow-hidden my-6 w-full aspect-video',
          },
        }),
        TextStyle,
        Color,
        Highlight.configure({
          multicolor: true,
        }),
      ];

      // Generate HTML from Tiptap JSON
      const html = generateHTML(content, extensions);
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">Error rendering content. Please check the console for details.</p>
        </div>
      );
    }
  }

  // If it's a string, render as HTML
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return null;
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Date and Stats - Combined Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.view_count || 0} views
            </span>
            {post.like_count > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {post.like_count} likes
              </span>
            )}
            {post.comment_count > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {post.comment_count} comments
              </span>
            )}
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 pb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </header>

        {/* Featured Media - Show video if available, otherwise show image */}
        {post.featured_video_url ? (
          <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
            <iframe
              src={post.featured_video_url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : post.featured_image_url ? (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12 text-gray-800 text-lg leading-relaxed">
          {post.content_live ? (
            renderContent(post.content_live)
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">This post content is not yet available.</p>
            </div>
          )}
        </div>

        {/* Tags/Keywords */}
        {post.meta_keywords && (
          <div className="mb-8 pb-8 border-b">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.meta_keywords.split(',').map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {relatedPost.featured_image_url ? (
                      <div className="relative w-full h-40 bg-gray-200">
                        <Image
                          src={relatedPost.featured_image_url}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-purple-600" />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}
