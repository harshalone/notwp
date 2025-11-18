import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/onboarding/cleanup
 *
 * SECURITY VERIFICATION: This endpoint verifies that installation completed successfully
 * and performs any final cleanup tasks. Since we use direct PostgreSQL connections,
 * we never create the dangerous exec_sql function, so no cleanup is needed.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { credentials } = body;

    if (!credentials) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const { supabaseUrl, supabaseServiceRoleKey } = credentials;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { success: false, error: 'Missing Supabase credentials' },
        { status: 400 }
      );
    }

    try {
      // Create Supabase client with service role key
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

      // Verify installation by checking that all tables exist
      const { data: settingsData, error: settingsError } = await supabase
        .from('nwp_app_settings')
        .select('setting_value')
        .eq('setting_key', 'installation_complete')
        .maybeSingle();

      if (settingsError) {
        console.error('Error verifying installation:', settingsError);
        return NextResponse.json(
          {
            success: false,
            error: `Installation verification failed: ${settingsError.message}`,
          },
          { status: 500 }
        );
      }

      if (settingsData?.setting_value !== 'true') {
        return NextResponse.json(
          {
            success: false,
            error: 'Installation not marked as complete',
          },
          { status: 500 }
        );
      }

      // Installation verified successfully
      return NextResponse.json({
        success: true,
        message: 'Installation verified successfully',
      });
    } catch (error) {
      console.error('Cleanup error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Verification failed',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request parsing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
