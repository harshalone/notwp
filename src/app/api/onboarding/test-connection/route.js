import { NextResponse } from 'next/server';
import { testSupabaseConnection, testServiceRoleConnection } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey } = body;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { success: false, error: 'Missing required credentials' },
        { status: 400 }
      );
    }

    // Test anon key connection
    const anonResult = await testSupabaseConnection({
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    });

    if (!anonResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Anonymous key connection failed: ${anonResult.error}`,
        },
        { status: 400 }
      );
    }

    // Test service role key connection
    const serviceRoleResult = await testServiceRoleConnection({
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      serviceRoleKey: supabaseServiceRoleKey,
    });

    if (!serviceRoleResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Service role key connection failed: ${serviceRoleResult.error}`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
