import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/documentation/public
 * Fetches all published documentation organized by parent-child hierarchy
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const supabase = await createClient();

    // Build the query for published documentation
    let query = supabase
      .from('nwp_documentation')
      .select('id, doc_uid, title, slug, excerpt, content, doc_type, doc_parent, menu_order, created_at, published_at')
      .eq('doc_status', 'published')
      .order('menu_order', { ascending: true })
      .order('created_at', { ascending: true });

    // Apply search filter if provided
    if (search && search.trim().length > 0) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data: docs, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching documentation:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch documentation: ' + fetchError.message },
        { status: 500 }
      );
    }

    // Organize docs into hierarchy (parent-child structure)
    const docsMap = new Map();
    const rootDocs = [];

    // First pass: create map of all docs
    docs.forEach(doc => {
      docsMap.set(doc.id, { ...doc, children: [] });
    });

    // Second pass: build hierarchy
    docs.forEach(doc => {
      const docWithChildren = docsMap.get(doc.id);
      if (doc.doc_parent) {
        const parent = docsMap.get(doc.doc_parent);
        if (parent) {
          parent.children.push(docWithChildren);
        } else {
          // Parent not found, treat as root
          rootDocs.push(docWithChildren);
        }
      } else {
        rootDocs.push(docWithChildren);
      }
    });

    return NextResponse.json({
      success: true,
      docs: rootDocs,
      total: docs.length,
    });
  } catch (error) {
    console.error('Error in public documentation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
