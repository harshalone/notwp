import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * GET /api/auth/session
 * Returns the current user session and account information
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        account: null,
      });
    }

    // Get user account from nwp_accounts
    const { data: account, error: accountError } = await supabase
      .from('nwp_accounts')
      .select('*')
      .eq('user_uid', user.id)
      .single();

    if (accountError) {
      console.error('Error fetching account:', accountError);
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
        },
        account: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
      },
      account: {
        id: account.id,
        email: account.email,
        username: account.username,
        displayName: account.display_name,
        role: account.role,
        status: account.status,
        avatarUrl: account.avatar_url,
      },
    });
  } catch (error) {
    console.error('Error in session check:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
