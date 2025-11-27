import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/settings/list
 * Fetches all settings from nwp_app_settings table
 */
export async function GET(request) {
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

    // Fetch all settings
    const { data: settings, error: fetchError } = await supabase
      .from('nwp_app_settings')
      .select('*')
      .order('setting_key', { ascending: true });

    if (fetchError) {
      console.error('Error fetching settings:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch settings: ' + fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: settings || [],
    });
  } catch (error) {
    console.error('Error in list settings API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
