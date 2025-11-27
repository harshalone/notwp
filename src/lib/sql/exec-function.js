import { promises as fs } from 'fs';
import path from 'path';

/**
 * Reads the exec function SQL from the migration file
 * Source: database/migrations/tables/000_create_exec_function.sql
 */
export async function getExecSqlFunction() {
  const filePath = path.join(process.cwd(), 'database', 'migrations', 'tables', '000_create_exec_function.sql');
  const content = await fs.readFile(filePath, 'utf-8');

  // Remove comments and empty lines for cleaner display
  return content
    .split('\n')
    .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
    .join('\n')
    .trim();
}

/**
 * Fallback constant for client-side usage
 * This will be replaced by the server-side read in the actual page
 */
export const EXEC_SQL_FUNCTION_SIMPLIFIED = `CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
  EXECUTE sql_query;

  RETURN jsonb_build_object(
    'success', true,
    'error', null
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'error_detail', SQLSTATE
    );
END;
$$;

ALTER FUNCTION public.exec_sql(text) OWNER TO postgres;

GRANT ALL ON SCHEMA storage TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO postgres;

GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;`;
