import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/plugins
 * Fetches all plugins from notwp.com
 */
export async function GET(request) {
  try {
    // Fetch plugin data from external API
    const response = await fetch('https://www.notwp.com/api/plugins', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching to always get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch plugins: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      plugins: data.plugins || data,
    });
  } catch (error) {
    console.error('Error in plugins API:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
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
