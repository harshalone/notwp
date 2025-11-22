import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/documentation/list
 * Fetches documentation for the current user with optional status filtering
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
      .from('nwp_documentation')
      .select('id, doc_uid, title, slug, excerpt, doc_status, doc_type, created_at, updated_at, published_at, view_count')
      .eq('author_uid', user.id)
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (status && (status === 'draft' || status === 'published')) {
      query = query.eq('doc_status', status);
    }

    const { data: docs, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching documentation:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch documentation: ' + fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      docs: docs || [],
    });
  } catch (error) {
    console.error('Error in list documentation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
