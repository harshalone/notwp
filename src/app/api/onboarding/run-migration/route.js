import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const { credentials, migrationId } = body;

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

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Read migration file
    const migrationPath = path.join(
      process.cwd(),
      'database',
      'migrations',
      `${migrationId}_*.sql`
    );

    // Find the migration file
    const migrationsDir = path.join(process.cwd(), 'database', 'migrations');
    const files = await fs.readdir(migrationsDir);
    const migrationFile = files.find((file) => file.startsWith(`${migrationId}_`));

    if (!migrationFile) {
      return NextResponse.json(
        { success: false, error: `Migration file not found for ID: ${migrationId}` },
        { status: 404 }
      );
    }

    const fullPath = path.join(migrationsDir, migrationFile);
    const sql = await fs.readFile(fullPath, 'utf-8');

    // Execute SQL using the exec_sql function
    // The exec_sql function must be created first in the database
    try {
      // Use the exec_sql RPC function to execute the migration
      const { error: execError } = await supabase.rpc('exec_sql', {
        sql_query: sql
      });

      if (execError) {
        console.error('SQL execution error:', execError);
        throw new Error(`Migration failed: ${execError.message}`);
      }

      // For the app_settings table, also save the credentials
      if (migrationId === '004') {
        // Save the Supabase credentials to the settings table using service role key
        // We need to update each setting individually to bypass RLS during initial setup
        const settingsToUpdate = [
          { key: 'supabase_url', value: supabaseUrl },
          { key: 'supabase_anon_key', value: credentials.supabaseAnonKey },
          { key: 'supabase_service_role_key', value: supabaseServiceRoleKey },
          { key: 'installation_complete', value: 'true' },
        ];

        for (const setting of settingsToUpdate) {
          const { error: updateError } = await supabase
            .from('nwp_app_settings')
            .update({ setting_value: setting.value })
            .eq('setting_key', setting.key);

          if (updateError) {
            console.error(`Error updating ${setting.key}:`, updateError);
            // Continue with other settings even if one fails
          }
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
