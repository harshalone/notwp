import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: POST /api/pages/update-settings
 * Updates page settings including title, slug, excerpt, status, and SEO metadata
 */
export async function POST(request) {
  try {
    const {
      page_uid,
      title,
      slug,
      excerpt,
      meta_title,
      meta_description,
      meta_keywords,
      page_status,
      comment_status,
    } = await request.json();

    if (!page_uid) {
      return NextResponse.json(
        { error: 'Page UID is required' },
        { status: 400 }
      );
    }

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!slug || slug.trim() === '') {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Validate slug format (only lowercase letters, numbers, and hyphens)
    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(slug)) {
      return NextResponse.json(
        { error: 'Slug can only contain lowercase letters, numbers, and hyphens' },
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

    // Check if the slug is already taken by another page
    const { data: existingPage, error: slugCheckError } = await supabase
      .from('nwp_pages')
      .select('page_uid')
      .eq('slug', slug)
      .neq('page_uid', page_uid)
      .single();

    if (slugCheckError && slugCheckError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is what we want
      console.error('Error checking slug:', slugCheckError);
      return NextResponse.json(
        { error: 'Failed to validate slug: ' + slugCheckError.message },
        { status: 500 }
      );
    }

    if (existingPage) {
      return NextResponse.json(
        { error: 'This slug is already in use by another page' },
        { status: 400 }
      );
    }

    // Update the page
    const { data: updatedPage, error: updateError } = await supabase
      .from('nwp_pages')
      .update({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt ? excerpt.trim() : null,
        meta_title: meta_title ? meta_title.trim() : null,
        meta_description: meta_description ? meta_description.trim() : null,
        meta_keywords: meta_keywords ? meta_keywords.trim() : null,
        page_status,
        comment_status,
      })
      .eq('page_uid', page_uid)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating page:', updateError);
      return NextResponse.json(
        { error: 'Failed to update page: ' + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      page: updatedPage,
    });
  } catch (error) {
    console.error('Error in update page settings API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
