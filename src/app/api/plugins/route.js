import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/plugins
 * Fetches all plugins (public access)
 */
export async function GET(request) {
  try {
    const supabase = await createClient();

    // Fetch all plugins
    const { data: plugins, error: fetchError } = await supabase
      .from('nwp_plugins')
      .select('*')
      .order('id', { ascending: true });

    if (fetchError) {
      console.error('Error fetching plugins:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch plugins: ' + fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plugins: plugins || [],
    });
  } catch (error) {
    console.error('Error in plugins API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API Route: PATCH /api/plugins
 * Updates a plugin's installed status (admin only)
 */
export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, installed } = body;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Validate input
    if (!id || typeof installed !== 'boolean') {
      return NextResponse.json(
        { error: 'Plugin ID and installed status are required' },
        { status: 400 }
      );
    }

    // Update plugin
    const { data: updatedPlugin, error: updateError } = await supabase
      .from('nwp_plugins')
      .update({ installed, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating plugin:', updateError);
      return NextResponse.json(
        { error: 'Failed to update plugin: ' + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Plugin updated successfully',
      plugin: updatedPlugin,
    });
  } catch (error) {
    console.error('Error in PATCH plugins API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
