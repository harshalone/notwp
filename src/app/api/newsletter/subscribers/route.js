import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/newsletter/subscribers
 * Fetches all newsletter subscribers
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

    // Fetch all subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from('nwp_newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching subscribers:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch subscribers: ' + fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscribers: subscribers || [],
    });
  } catch (error) {
    console.error('Error in subscribers API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
