import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { credentials, email, password, displayName } = body;

    if (!credentials || !email || !password || !displayName) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
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
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Step 1: Create the user using Admin API
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: displayName,
      }
    });

    if (createError) {
      console.error('Supabase Auth error:', createError);

      // Check if it's the specific "Database error checking email" issue
      if (createError.message?.includes('Database error') ||
          createError.message?.includes('checking email') ||
          createError.message?.includes('finding user') ||
          createError.code === 'unexpected_failure') {
        return NextResponse.json(
          {
            success: false,
            error: 'Database configuration error: Unable to create admin user. This usually happens due to conflicting migrations or triggers from a previous installation attempt. To fix this:\n\n1. Open your Supabase SQL Editor\n2. Run the cleanup script: database/migrations/cleanup/_cleanup_master.sql\n3. Restart the installation from Step 1\n\nSee database/INSTALLATION_TROUBLESHOOTING.md for detailed instructions.'
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Failed to create user account: ${createError.message}`
        },
        { status: 500 }
      );
    }

    if (!userData.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create user account. No user data returned.'
        },
        { status: 500 }
      );
    }

    const userId = userData.user.id;
    console.log('User created successfully:', userId);

    // Step 3: Wait for the trigger to create the account record
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 4: Verify the account was created by trigger, if not create it manually
    const { data: accountData, error: checkError } = await supabase
      .from('nwp_accounts')
      .select('id')
      .eq('user_uid', userId)
      .single();

    if (checkError || !accountData) {
      console.log('Trigger did not create account, creating manually...');

      // Create the account manually
      const { error: insertError } = await supabase
        .from('nwp_accounts')
        .insert({
          user_uid: userId,
          email,
          username: email.split('@')[0],
          display_name: displayName,
          email_verified: true,
          role: 'administrator',
        });

      if (insertError) {
        console.error('Failed to create account manually:', insertError);
        return NextResponse.json(
          {
            success: false,
            error: `User created but failed to set up account: ${insertError.message}`
          },
          { status: 500 }
        );
      }
    } else {
      // Step 5: Update the existing account to administrator
      const { error: updateError } = await supabase
        .from('nwp_accounts')
        .update({
          role: 'administrator',
          display_name: displayName,
          email_verified: true
        })
        .eq('user_uid', userId);

      if (updateError) {
        console.error('Role update error:', updateError);
        console.warn('Warning: Failed to update role to administrator.');
      } else {
        console.log('User role updated to administrator successfully');
      }
    }

    return NextResponse.json({
      success: true,
      userId,
      message: 'Administrator account created successfully'
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
