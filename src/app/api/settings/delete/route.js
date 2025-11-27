import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: DELETE /api/settings/delete
 * Deletes a setting from nwp_app_settings table
 */
export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Setting ID is required' },
        { status: 400 }
      );
    }

    // Delete the setting
    const { error: deleteError } = await supabase
      .from('nwp_app_settings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting setting:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete setting: ' + deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Setting deleted successfully',
    });
  } catch (error) {
    console.error('Error in delete settings API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
