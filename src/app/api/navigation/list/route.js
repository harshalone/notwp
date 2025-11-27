import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/navigation/list
 * Returns all navigation items for the current user
 */
export async function GET() {
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

    // Fetch all navigation items for the user, ordered by order field
    const { data: items, error: fetchError } = await supabase
      .from('nwp_navigation')
      .select('*')
      .order('order', { ascending: true });

    if (fetchError) {
      console.error('Error fetching navigation items:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch navigation items: ' + fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      items: items || [],
    });
  } catch (error) {
    console.error('Error in list navigation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
