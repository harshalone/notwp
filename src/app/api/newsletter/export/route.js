import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('sb-access-token');

    if (!authCookie) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(authCookie.value);

    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: account } = await supabase
      .from('nwp_accounts')
      .select('role')
      .eq('user_uid', user.id)
      .single();

    if (!account || !['administrator', 'editor'].includes(account.role)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all subscribers
    const { data: subscribers, error } = await supabase
      .from('nwp_newsletter_subscribers')
      .select('email, name, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers:', error);
      return Response.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }

    // Convert to CSV
    const headers = ['email', 'name', 'status', 'created_at'];
    const csvRows = [headers.join(',')];

    for (const subscriber of subscribers) {
      const row = [
        `"${subscriber.email || ''}"`,
        `"${subscriber.name || ''}"`,
        subscriber.status || 'active',
        subscriber.created_at || ''
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    // Return CSV file
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
