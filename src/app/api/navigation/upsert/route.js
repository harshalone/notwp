import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: POST /api/navigation/upsert
 * Creates or updates a navigation item
 */
export async function POST(request) {
  try {
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, label, url, target, order, parent_id } = body;

    // Validate required fields
    if (!label || !url) {
      return NextResponse.json(
        { error: 'Label and URL are required' },
        { status: 400 }
      );
    }

    let result;

    if (id) {
      // Update existing item
      const { data, error } = await supabase
        .from('nwp_navigation')
        .update({
          label,
          url,
          target: target || '_self',
          order: order || 0,
          parent_id: parent_id || null,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating navigation item:', error);
        return NextResponse.json(
          { error: 'Failed to update navigation item: ' + error.message },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new item
      const { data, error } = await supabase
        .from('nwp_navigation')
        .insert({
          user_id: user.id,
          label,
          url,
          target: target || '_self',
          order: order || 0,
          parent_id: parent_id || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating navigation item:', error);
        return NextResponse.json(
          { error: 'Failed to create navigation item: ' + error.message },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json({
      success: true,
      message: id ? 'Navigation item updated successfully' : 'Navigation item created successfully',
      item: result,
    });
  } catch (error) {
    console.error('Error in upsert navigation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
