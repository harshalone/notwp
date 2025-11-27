import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

/**
 * Helper function to execute SQL using Supabase REST API
 * Uses the exec_sql RPC function that the user must create manually before installation
 */
async function executeSQLViaSupabase(supabaseUrl, serviceRoleKey, sql) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ sql_query: sql })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase API error:', errorText);
      return {
        success: false,
        error: `Failed to execute SQL. ${response.status === 404 ? 'Make sure you created the exec_sql function in Step 1.' : `Error: ${errorText}`}`
      };
    }

    // Parse the JSON response from exec_sql function
    const result = await response.json();

    // The exec_sql function now returns a JSON object with success and error fields
    if (result && typeof result === 'object') {
      if (result.success === false) {
        return {
          success: false,
          error: result.error || 'SQL execution failed',
          error_detail: result.error_detail
        };
      }
      return { success: true };
    }

    // If response format is unexpected, assume success for backwards compatibility
    return { success: true };
  } catch (error) {
    console.error('Error executing SQL via Supabase:', error);
    return {
      success: false,
      error: error.message || 'Failed to execute SQL via Supabase API'
    };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { credentials, migrationId, folder } = body;

    if (!credentials || !migrationId) {
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

    // Determine the migration folder (default to 'tables' for backwards compatibility)
    const migrationFolder = folder || 'tables';
    const migrationsDir = path.join(process.cwd(), 'database', 'migrations', migrationFolder);

    // Find the migration file
    const files = await fs.readdir(migrationsDir);
    const migrationFile = files.find((file) => file.startsWith(`${migrationId}_`));

    if (!migrationFile) {
      return NextResponse.json(
        { success: false, error: `Migration file not found for ID: ${migrationId} in folder: ${migrationFolder}` },
        { status: 404 }
      );
    }

    const fullPath = path.join(migrationsDir, migrationFile);
    const sql = await fs.readFile(fullPath, 'utf-8');

    // Execute SQL via Supabase REST API using exec_sql function
    try {
      console.log(`Executing migration ${migrationId}...`);
      const result = await executeSQLViaSupabase(supabaseUrl, supabaseServiceRoleKey, sql);

      if (!result.success) {
        console.error('SQL execution error:', result.error);
        throw new Error(`Migration failed: ${result.error}`);
      }

      // For the app_settings table, also save the credentials
      if (migrationId === '004') {
        // Save the Supabase credentials to the settings table
        const updateSettingsSQL = `
          UPDATE public.nwp_app_settings SET setting_value = '${supabaseUrl}' WHERE setting_key = 'supabase_url';
          UPDATE public.nwp_app_settings SET setting_value = '${credentials.supabaseAnonKey}' WHERE setting_key = 'supabase_anon_key';
          UPDATE public.nwp_app_settings SET setting_value = '${supabaseServiceRoleKey}' WHERE setting_key = 'supabase_service_role_key';
          UPDATE public.nwp_app_settings SET setting_value = 'true' WHERE setting_key = 'installation_complete';
        `;

        const updateResult = await executeSQLViaSupabase(supabaseUrl, supabaseServiceRoleKey, updateSettingsSQL);

        if (!updateResult.success) {
          console.error('Error updating settings:', updateResult.error);
          // Continue anyway - settings can be updated manually if needed
        }
      }

      return NextResponse.json({ success: true });
    } catch (execError) {
      console.error('Migration execution error:', execError);
      return NextResponse.json(
        {
          success: false,
          error:
            execError instanceof Error
              ? execError.message
              : 'Failed to execute migration',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
