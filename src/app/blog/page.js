import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Blog',
  description: 'Read our latest articles and posts',
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getPosts() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('nwp_posts')
    .select('*')
    .eq('post_status', 'published')
    .eq('post_type', 'post')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

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

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600">
            Discover our latest articles and insights
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link href={`/blog/${post.slug}`}>
                  {/* Featured Image */}
                  {post.featured_image_url ? (
                    <div className="relative w-full h-48 bg-gray-200">
                      <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600" />
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      <time dateTime={post.published_at}>
                        {formatDate(post.published_at)}
                      </time>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      {post.view_count > 0 && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {post.view_count}
                        </span>
                      )}
                      {post.like_count > 0 && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {post.like_count}
                        </span>
                      )}
                      {post.comment_count > 0 && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          {post.comment_count}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
