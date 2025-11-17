/**
 * Database Status Check Utility
 * Checks if the database is properly configured and the required tables exist
 */

/**
 * Server-side check for database connectivity and table existence
 * This should only be called from API routes or server components
 */
export async function checkDatabaseStatus(supabaseUrl, supabaseAnonKey) {
  try {
    // Use provided credentials or fall back to environment variables
    const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return {
        canConnect: false,
        tablesExist: false,
        isSetup: false,
        error: 'Missing database credentials',
      };
    }

    // Test connection
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);

    // Check if installation is complete by querying the nwp_app_settings table
    const { data: installData, error: installError } = await supabase
      .from('nwp_app_settings')
      .select('setting_value')
      .eq('setting_key', 'installation_complete')
      .maybeSingle();

    if (installError) {
      // Check if it's a table doesn't exist error
      if (installError.message.includes('relation') || installError.message.includes('does not exist')) {
        return {
          canConnect: true,
          tablesExist: false,
          isSetup: false,
          error: 'Required tables do not exist',
        };
      }

      // Some other error (could be permissions, connection, etc.)
      return {
        canConnect: false,
        tablesExist: false,
        isSetup: false,
        error: installError.message,
      };
    }

    // Check if installation_complete is set to 'true'
    if (installData?.setting_value !== 'true') {
      return {
        canConnect: true,
        tablesExist: true,
        isSetup: false,
        error: 'Installation not marked as complete',
      };
    }

    // Success! Installation is complete
    return {
      canConnect: true,
      tablesExist: true,
      isSetup: true,
    };
  } catch (err) {
    return {
      canConnect: false,
      tablesExist: false,
      isSetup: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Client-side check that calls the API route
 */
export async function checkDatabaseStatusClient() {
  try {
    const response = await fetch('/api/db-status');

    if (!response.ok) {
      throw new Error('Failed to check database status');
    }

    const status = await response.json();
    return status;
  } catch (err) {
    return {
      canConnect: false,
      tablesExist: false,
      isSetup: false,
      error: err instanceof Error ? err.message : 'Failed to check database status',
    };
  }
}
