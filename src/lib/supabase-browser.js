import { createBrowserClient } from '@supabase/ssr';

/**
 * Create Supabase client for Client Components
 * This handles authentication via cookies automatically in the browser
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase credentials not found!\n\n' +
      'Please complete the installation wizard at /install\n' +
      'or manually add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
