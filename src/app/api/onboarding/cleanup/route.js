import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/onboarding/cleanup
 *
 * CRITICAL SECURITY CLEANUP: This endpoint removes the dangerous exec_sql function
 * after installation is complete. The exec_sql function allows arbitrary SQL execution
 * and should NEVER remain in a production database.
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

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Drop the exec_sql function for security
    // We use the REST API to execute this SQL directly
    const dropFunctionSQL = `DROP FUNCTION IF EXISTS public.exec_sql(text);`;

    try {
      // Use the exec_sql function one last time to drop itself
      const { error: dropError } = await supabase.rpc('exec_sql', {
        sql_query: dropFunctionSQL
      });

      if (dropError) {
        console.error('Error dropping exec_sql function:', dropError);
        return NextResponse.json(
          {
            success: false,
            error: `Failed to remove exec_sql function: ${dropError.message}`,
          },
          { status: 500 }
        );
      }

      // Verify the function was dropped by trying to call it
      // This should fail, confirming the function no longer exists
      const { error: verifyError } = await supabase.rpc('exec_sql', {
        sql_query: 'SELECT 1'
      });

      // If we DON'T get an error, that means the function still exists (bad!)
      if (!verifyError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Function drop verification failed - function still exists',
          },
          { status: 500 }
        );
      }

      // Good! The function doesn't exist anymore
      return NextResponse.json({
        success: true,
        message: 'exec_sql function successfully removed for security',
      });
    } catch (error) {
      console.error('Cleanup error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Cleanup failed',
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
