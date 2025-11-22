import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: POST /api/documentation/create
 * Creates a new documentation with just a title and redirects to the editor
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

    // Create the documentation
    const { data: doc, error: insertError } = await supabase
      .from('nwp_documentation')
      .insert([
        {
          author_uid: user.id,
          title: title.trim(),
          slug: uniqueSlug,
          content: null,
          doc_status: 'draft',
          doc_type: 'doc',
        },
      ])
      .select('id, doc_uid')
      .single();

    if (insertError) {
      console.error('Error creating documentation:', insertError);
      return NextResponse.json(
        { error: 'Failed to create documentation: ' + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      doc: {
        id: doc.id,
        doc_uid: doc.doc_uid,
      },
    });
  } catch (error) {
    console.error('Error in create documentation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
