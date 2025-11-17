import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: POST /api/posts/create
 * Creates a new post with just a title and redirects to the editor
 */
export async function POST(request) {
  try {
    const { title } = await request.json();

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Generate a slug from the title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Add timestamp to slug to ensure uniqueness
    const uniqueSlug = `${slug}-${Date.now()}`;

    // Create the post
    const { data: post, error: insertError } = await supabase
      .from('nwp_posts')
      .insert([
        {
          author_uid: user.id,
          title: title.trim(),
          slug: uniqueSlug,
          content: '',
          post_status: 'draft',
          post_type: 'post',
        },
      ])
      .select('id, post_uid')
      .single();

    if (insertError) {
      console.error('Error creating post:', insertError);
      return NextResponse.json(
        { error: 'Failed to create post: ' + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        post_uid: post.post_uid,
      },
    });
  } catch (error) {
    console.error('Error in create post API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
