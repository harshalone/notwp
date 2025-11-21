import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// Encrypt/decrypt utilities (basic example - in production use proper encryption)
function encrypt(text) {
  // In production, use a proper encryption library like crypto
  // This is a placeholder - you should implement proper encryption
  return Buffer.from(text).toString('base64');
}

function decrypt(text) {
  // In production, use proper decryption
  // This is a placeholder - you should implement proper decryption
  return Buffer.from(text, 'base64').toString('utf-8');
}

// GET - Retrieve settings
export async function GET(request) {
  try {
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { data: settings, error } = await supabase
      .from('nwp_newsletter_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching settings:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    if (!settings) {
      return NextResponse.json({
        success: true,
        settings: null
      });
    }

    // Decrypt sensitive data before sending
    const decryptedSettings = {
      aws_region: settings.aws_region,
      aws_access_key_id: settings.aws_access_key_id ? decrypt(settings.aws_access_key_id) : '',
      aws_secret_access_key: settings.aws_secret_access_key ? decrypt(settings.aws_secret_access_key) : '',
      from_email: settings.from_email,
      from_name: settings.from_name
    };

    return NextResponse.json({
      success: true,
      settings: decryptedSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST - Save settings
export async function POST(request) {
  try {
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { awsRegion, awsAccessKeyId, awsSecretAccessKey, fromEmail, fromName } = body;

    // Validate required fields
    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey || !fromEmail || !fromName) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Encrypt sensitive data
    const encryptedAccessKey = encrypt(awsAccessKeyId);
    const encryptedSecretKey = encrypt(awsSecretAccessKey);

    // Check if settings exist
    const { data: existing } = await supabase
      .from('nwp_newsletter_settings')
      .select('id')
      .eq('id', 1)
      .single();

    if (existing) {
      // Update existing settings
      const { error } = await supabase
        .from('nwp_newsletter_settings')
        .update({
          aws_region: awsRegion,
          aws_access_key_id: encryptedAccessKey,
          aws_secret_access_key: encryptedSecretKey,
          from_email: fromEmail,
          from_name: fromName,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      if (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to update settings' },
          { status: 500 }
        );
      }
    } else {
      // Insert new settings
      const { error } = await supabase
        .from('nwp_newsletter_settings')
        .insert({
          id: 1,
          aws_region: awsRegion,
          aws_access_key_id: encryptedAccessKey,
          aws_secret_access_key: encryptedSecretKey,
          from_email: fromEmail,
          from_name: fromName
        });

      if (error) {
        console.error('Error inserting settings:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to save settings' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully'
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
