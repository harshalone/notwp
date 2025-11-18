import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { supabaseUrl, supabaseServiceRoleKey } = body;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: 'Missing required credentials' },
        { status: 400 }
      );
    }

    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Update the installation_complete setting to true
    const { error } = await supabase
      .from('nwp_app_settings')
      .update({ setting_value: 'true' })
      .eq('setting_key', 'installation_complete');

    if (error) {
      console.error('Error marking installation as complete:', error);
      return NextResponse.json(
        { error: 'Failed to mark installation as complete', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Installation marked as complete'
    });
  } catch (error) {
    console.error('Complete installation error:', error);
    return NextResponse.json(
      { error: 'Failed to complete installation', details: error.message },
      { status: 500 }
    );
  }
}
