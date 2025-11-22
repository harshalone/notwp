import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/documentation/[slug]
 * Fetches a single published documentation by slug
 */
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: doc, error: fetchError } = await supabase
      .from('nwp_documentation')
      .select('id, doc_uid, title, slug, content, excerpt, doc_type, doc_parent, created_at, published_at, updated_at')
      .eq('slug', slug)
      .eq('doc_status', 'published')
      .single();

    if (fetchError || !doc) {
      return NextResponse.json(
        { error: 'Documentation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      doc,
    });
  } catch (error) {
    console.error('Error in documentation slug API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
