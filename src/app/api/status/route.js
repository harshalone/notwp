import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Get Supabase credentials from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database configuration missing',
          server_status: 'running',
          app_version: null,
        },
        { status: 500 }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Query the app_version from nwp_app_settings table
    const { data, error } = await supabase
      .from('nwp_app_settings')
      .select('setting_value')
      .eq('setting_key', 'app_version')
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: error.message,
          server_status: 'running',
          app_version: null,
        },
        { status: 500 }
      );
    }

    // Return success response with server status and app version
    return NextResponse.json({
      status: 'ok',
      server_status: 'running',
      app_version: data?.setting_value || 'unknown',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        server_status: 'running',
        app_version: null,
      },
      { status: 500 }
    );
  }
}
