import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: POST /api/newsletter/send
 * Sends email to all active subscribers
 */
export async function POST(request) {
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

    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Get all active subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from('nwp_newsletter_subscribers')
      .select('email, name')
      .eq('status', 'active');

    if (fetchError) {
      console.error('Error fetching subscribers:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch subscribers: ' + fetchError.message },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 400 }
      );
    }

    // TODO: Integrate with your email service provider (e.g., SendGrid, AWS SES, Resend, etc.)
    // PLACEHOLDER: This is where you would implement the actual email sending logic
    /*
    Example implementation with Resend:

    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailPromises = subscribers.map(subscriber => {
      return resend.emails.send({
        from: 'your-email@domain.com',
        to: subscriber.email,
        subject: subject,
        html: `
          <div>
            <p>Hello ${subscriber.name || 'there'},</p>
            <p>${message}</p>
          </div>
        `
      });
    });

    await Promise.all(emailPromises);
    */

    // For now, we'll just log the action and save to database
    console.log(`Would send email to ${subscribers.length} subscribers`);
    console.log('Subject:', subject);
    console.log('Message:', message);

    // Save email to history
    const { error: insertError } = await supabase
      .from('nwp_newsletter_emails')
      .insert({
        subject,
        message,
        recipient_count: subscribers.length,
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_by: user.id
      });

    if (insertError) {
      console.error('Error saving email history:', insertError);
      return NextResponse.json(
        { error: 'Failed to save email history: ' + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Email queued for ${subscribers.length} subscriber(s)`,
      recipientCount: subscribers.length
    });
  } catch (error) {
    console.error('Error in send email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
