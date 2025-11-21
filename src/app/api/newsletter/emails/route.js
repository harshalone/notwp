import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/newsletter/emails
 * Fetches email history
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

    // Fetch email history
    const { data: emails, error: fetchError } = await supabase
      .from('nwp_newsletter_emails')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(10);

    if (fetchError) {
      console.error('Error fetching emails:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch emails: ' + fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emails: emails || [],
    });
  } catch (error) {
    console.error('Error in emails API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
