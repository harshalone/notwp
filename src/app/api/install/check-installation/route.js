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

    // Try to connect and check if nwp_accounts table exists
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Try to query the nwp_accounts table to check if it exists
      // This is the core table that indicates installation is complete
      const { error } = await supabase
        .from('nwp_accounts')
        .select('id')
        .limit(1);

      if (error) {
        // Table doesn't exist or other error - installation needed
        return NextResponse.json({
          installed: false,
          reason: 'Database tables not found',
        });
      }

      // If we can query nwp_accounts, installation is complete
      return NextResponse.json({ installed: true });
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
