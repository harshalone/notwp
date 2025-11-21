import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: DELETE /api/newsletter/subscribers/[id]
 * Unsubscribes a subscriber
 */
export async function DELETE(request, { params }) {
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

    const { id } = params;

    // Update subscriber status to unsubscribed
    const { error: updateError } = await supabase
      .from('nwp_newsletter_subscribers')
      .update({ status: 'unsubscribed' })
      .eq('id', id);

    if (updateError) {
      console.error('Error unsubscribing:', updateError);
      return NextResponse.json(
        { error: 'Failed to unsubscribe: ' + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscriber unsubscribed successfully'
    });
  } catch (error) {
    console.error('Error in unsubscribe API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
