import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase-server';

/**
 * POST /api/auth/setup-account
 * Creates or updates user account in nwp_accounts table
 * Assigns admin role to the first user
 */
export async function POST(request) {
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

    // Use admin client to bypass RLS for checking total users
    const adminSupabase = createAdminClient();

    // Check if this is the first user
    const { count, error: countError } = await adminSupabase
      .from('nwp_accounts')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error checking existing accounts:', countError);
    }

    const isFirstUser = count === 0;
    const role = isFirstUser ? 'administrator' : 'subscriber';

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
      // Create new account - always use admin client to bypass RLS
      // This is necessary because the user doesn't have an account yet to check permissions
      const { data: newAccount, error: insertError } = await adminSupabase
        .from('nwp_accounts')
        .insert([
          {
            user_uid: user.id,
            email: user.email,
            display_name: user.email.split('@')[0],
            role: role,
            status: 'active',
            email_verified: true,
            last_login_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating account:', insertError);
        console.error('Insert error details:', JSON.stringify(insertError, null, 2));
        return NextResponse.json(
          { error: `Failed to create account: ${insertError.message}` },
          { status: 500 }
        );
      }

      accountData = newAccount;
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
        isFirstUser: isFirstUser,
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
