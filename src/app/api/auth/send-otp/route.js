import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * POST /api/auth/send-otp
 * Sends a 6-digit OTP code to the user's email
 */
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user already exists in auth.users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('Error checking users:', listError);
      // Fall back to checking nwp_accounts table
      const { data: account, error: accountError } = await supabase
        .from('nwp_accounts')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (accountError || !account) {
        return NextResponse.json(
          { error: 'This email is not registered. Only existing users can log in.' },
          { status: 403 }
        );
      }
    } else {
      // Check if user exists in the list
      const userExists = users.some(u => u.email?.toLowerCase() === email.toLowerCase().trim());

      if (!userExists) {
        return NextResponse.json(
          { error: 'This email is not registered. Only existing users can log in.' },
          { status: 403 }
        );
      }
    }

    // Send OTP via Supabase auth - shouldCreateUser is false to prevent new registrations
    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dadmin`,
      },
    });

    if (error) {
      console.error('Error sending OTP:', error);
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully. Please check your email.',
    });
  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
