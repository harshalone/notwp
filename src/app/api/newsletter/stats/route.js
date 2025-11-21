import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/newsletter/stats
 * Fetches newsletter statistics
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

    // Get total subscribers
    const { count: totalCount } = await supabase
      .from('nwp_newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    // Get active subscribers
    const { count: activeCount } = await supabase
      .from('nwp_newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get subscribers from this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: thisMonthCount } = await supabase
      .from('nwp_newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    // Get total emails sent
    const { count: emailsSentCount } = await supabase
      .from('nwp_newsletter_emails')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent');

    return NextResponse.json({
      success: true,
      stats: {
        total: totalCount || 0,
        active: activeCount || 0,
        thisMonth: thisMonthCount || 0,
        emailsSent: emailsSentCount || 0
      }
    });
  } catch (error) {
    console.error('Error in stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
