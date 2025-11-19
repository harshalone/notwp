import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: POST /api/pages/create
 * Creates a new page with just a title and redirects to the editor
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

    // Create the page
    const { data: page, error: insertError } = await supabase
      .from('nwp_pages')
      .insert([
        {
          author_uid: user.id,
          title: title.trim(),
          slug: uniqueSlug,
          content: '',
          page_status: 'draft',
        },
      ])
      .select('id, page_uid')
      .single();

    if (insertError) {
      console.error('Error creating page:', insertError);
      return NextResponse.json(
        { error: 'Failed to create page: ' + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      page: {
        id: page.id,
        page_uid: page.page_uid,
      },
    });
  } catch (error) {
    console.error('Error in create page API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
