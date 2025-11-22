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

/**
 * API Route: POST /api/newsletter/subscribers
 * Adds a new newsletter subscriber
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { email, name } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('nwp_newsletter_subscribers')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingSubscriber) {
      // If subscriber exists and is active
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 409 }
        );
      }

      // If subscriber exists but unsubscribed, reactivate them
      if (existingSubscriber.status === 'unsubscribed') {
        const { data: reactivated, error: updateError } = await supabase
          .from('nwp_newsletter_subscribers')
          .update({ status: 'active', updated_at: new Date().toISOString() })
          .eq('id', existingSubscriber.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error reactivating subscriber:', updateError);
          return NextResponse.json(
            { error: 'Failed to reactivate subscription' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Successfully resubscribed!',
          subscriber: reactivated,
        });
      }
    }

    // Add new subscriber
    const { data: newSubscriber, error: insertError } = await supabase
      .from('nwp_newsletter_subscribers')
      .insert([
        {
          email: email.toLowerCase().trim(),
          name: name?.trim() || null,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error adding subscriber:', insertError);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      subscriber: newSubscriber,
    });
  } catch (error) {
    console.error('Error in POST subscribers API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
