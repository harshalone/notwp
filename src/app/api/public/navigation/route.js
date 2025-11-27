import { NextResponse } from 'next/server';
import { createStaticClient } from '@/lib/supabase-server';

/**
 * API Route: GET /api/public/navigation
 * Returns public app settings and navigation items (no auth required)
 */
export async function GET() {
  try {
    const supabase = createStaticClient();

    // Fetch public settings (logo_url, brand_name, website_name)
    const { data: settings, error: settingsError } = await supabase
      .from('nwp_app_settings')
      .select('setting_key, setting_value')
      .eq('is_public', true)
      .in('setting_key', ['logo_url', 'brand_name', 'website_name', 'app_name']);

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
    }

    // Fetch all navigation items ordered by order field
    const { data: items, error: navError } = await supabase
      .from('nwp_navigation')
      .select('id, label, url, target, order, parent_id')
      .order('order', { ascending: true });

    if (navError) {
      console.error('Error fetching navigation items:', navError);
    }

    // Convert settings array to object for easier access
    const settingsObj = {};
    if (settings) {
      settings.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });
    }

    return NextResponse.json({
      success: true,
      settings: settingsObj,
      navigation: items || [],
    });
  } catch (error) {
    console.error('Error in public navigation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
