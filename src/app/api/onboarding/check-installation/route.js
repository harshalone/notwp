import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Accept credentials from query params (for post-installation check)
    const url = new URL(request.url);
    let supabaseUrl = url.searchParams.get('url') || process.env.NEXT_PUBLIC_SUPABASE_URL;
    let supabaseAnonKey = url.searchParams.get('key') || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If no credentials provided, installation is needed
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        installed: false,
        reason: 'Missing credentials',
      });
    }

    // Try to connect and check if app_settings table exists
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Try to query the app_settings table
      const { data, error } = await supabase
        .from('nwp_app_settings')
        .select('setting_value')
        .eq('setting_key', 'installation_complete')
        .maybeSingle();

      if (error) {
        // Table doesn't exist or other error
        return NextResponse.json({
          installed: false,
          reason: 'Database not configured',
        });
      }

      // Check if installation is marked as complete
      if (data?.setting_value === 'true') {
        return NextResponse.json({ installed: true });
      }

      return NextResponse.json({
        installed: false,
        reason: 'Installation not complete',
      });
    } catch (dbError) {
      return NextResponse.json({
        installed: false,
        reason: 'Database connection failed',
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        installed: false,
        reason: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
