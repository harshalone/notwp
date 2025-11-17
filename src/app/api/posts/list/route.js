import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/posts/list
 * Fetches posts for the current user with optional status filtering
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'draft', 'published', or null for all

    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Build the query
    let query = supabase
      .from('nwp_posts')
      .select('id, post_uid, title, slug, excerpt, post_status, created_at, updated_at, published_at, view_count')
      .eq('author_uid', user.id)
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (status && (status === 'draft' || status === 'published')) {
      query = query.eq('post_status', status);
    }

    const { data: posts, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching posts:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch posts: ' + fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      posts: posts || [],
    });
  } catch (error) {
    console.error('Error in list posts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
