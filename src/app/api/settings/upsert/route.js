import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * API Route: POST /api/settings/upsert
 * Creates or updates a setting in nwp_app_settings table
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

    const body = await request.json();
    const { id, setting_key, setting_value, setting_type, description, is_public } = body;

    // Validate required fields
    if (!setting_key) {
      return NextResponse.json(
        { error: 'setting_key is required' },
        { status: 400 }
      );
    }

    // Check if we're updating an existing setting or creating a new one
    if (id) {
      // Update existing setting
      const { data, error } = await supabase
        .from('nwp_app_settings')
        .update({
          setting_key,
          setting_value,
          setting_type: setting_type || 'string',
          description,
          is_public: is_public || false,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating setting:', error);
        return NextResponse.json(
          { error: 'Failed to update setting: ' + error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        setting: data,
        message: 'Setting updated successfully',
      });
    } else {
      // Insert new setting
      const { data, error } = await supabase
        .from('nwp_app_settings')
        .insert({
          setting_key,
          setting_value,
          setting_type: setting_type || 'string',
          description,
          is_public: is_public || false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating setting:', error);
        return NextResponse.json(
          { error: 'Failed to create setting: ' + error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        setting: data,
        message: 'Setting created successfully',
      });
    }
  } catch (error) {
    console.error('Error in upsert settings API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
