import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase-server';

/**
 * POST /api/auth/setup-account
 * Verifies user account exists in nwp_accounts table
 * New account creation is disabled - only existing users can log in
 */
export async function POST() {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Use admin client to bypass RLS
    const adminSupabase = createAdminClient();

    // Check if account already exists
    const { data: existingAccount, error: checkError } = await supabase
      .from('nwp_accounts')
      .select('*')
      .eq('user_uid', user.id)
      .single();

    let accountData;

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking account:', checkError);
      return NextResponse.json(
        { error: 'Failed to check account status' },
        { status: 500 }
      );
    }

    if (existingAccount) {
      // Account exists, just return it
      accountData = existingAccount;
    } else {
      // Account doesn't exist - registration is disabled
      return NextResponse.json(
        { error: 'Account not found. New registrations are disabled. Please contact an administrator.' },
        { status: 403 }
      );
    }

    // Update last login - use admin client to ensure it works
    const { error: updateError } = await adminSupabase
      .from('nwp_accounts')
      .update({ last_login_at: new Date().toISOString() })
      .eq('user_uid', user.id);

    if (updateError) {
      console.error('Error updating last login:', updateError);
    }

    return NextResponse.json({
      success: true,
      account: {
        id: accountData.id,
        email: accountData.email,
        role: accountData.role,
        displayName: accountData.display_name,
      },
    });
  } catch (error) {
    console.error('Error in setup-account:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
