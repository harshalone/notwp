import { createClient } from '@supabase/supabase-js';

/**
 * Test Supabase connection with provided credentials
 */
export async function testSupabaseConnection(credentials) {
  try {
    // Test connection by making a simple REST API call
    const response = await fetch(`${credentials.url}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': credentials.anonKey,
        'Authorization': `Bearer ${credentials.anonKey}`,
      },
    });

    // If we get any response (even 404), the connection is working
    // We're just testing if we can reach the server with valid credentials
    if (!response.ok && response.status === 401) {
      return { success: false, error: 'Invalid API key' };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unable to connect to Supabase',
    };
  }
}

/**
 * Test Supabase service role key connection
 */
export async function testServiceRoleConnection(credentials) {
  if (!credentials.serviceRoleKey) {
    return { success: false, error: 'Service role key is required' };
  }

  try {
    // Test service role key by making a REST API call
    const response = await fetch(`${credentials.url}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': credentials.serviceRoleKey,
        'Authorization': `Bearer ${credentials.serviceRoleKey}`,
      },
    });

    // If we get any response (even 404), the connection is working
    if (!response.ok && response.status === 401) {
      return { success: false, error: 'Invalid service role key' };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unable to connect to Supabase',
    };
  }
}

/**
 * Create a Supabase client instance
 */
export function createSupabaseClient(url, key) {
  return createClient(url, key);
}

/**
 * Execute SQL migrations
 */
export async function executeMigration(credentials, sql) {
  if (!credentials.serviceRoleKey) {
    return { success: false, error: 'Service role key is required for migrations' };
  }

  try {
    const supabase = createClient(credentials.url, credentials.serviceRoleKey);

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get all migration files
 */
export function getMigrations() {
  // This will be populated dynamically by reading migration files
  // For now, return the list of migrations we have
  return [
    {
      id: '001',
      name: 'Create nwp_accounts table',
      description: 'Creates the user accounts table with RLS policies',
      sql: '', // Will be loaded from file
    },
    {
      id: '002',
      name: 'Create auth user sync trigger',
      description: 'Syncs auth.users with nwp_accounts',
      sql: '',
    },
    {
      id: '003',
      name: 'Create nwp_posts table',
      description: 'Creates the posts table for content management',
      sql: '',
    },
    {
      id: '004',
      name: 'Create nwp_app_settings table',
      description: 'Creates the app settings table for configuration',
      sql: '',
    },
  ];
}
