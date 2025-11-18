import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create Supabase client for Server Components and API Routes
 * This handles authentication via cookies automatically
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase credentials not found!\n\n' +
      'Please complete the installation wizard at /install\n' +
      'or manually add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file'
    );
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Get Supabase client with service role key (server-side only)
 * Use this for admin operations that bypass RLS
 * WARNING: Only use this when you need to bypass Row Level Security
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Supabase admin credentials not found!\n\n' +
      'Please complete the installation wizard at /install\n' +
      'or manually add SUPABASE_SERVICE_ROLE_KEY to your .env.local file'
    );
  }

  return createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // Service role doesn't need cookies
      },
    },
  });
}

/**
 * Create a simple Supabase client for static generation (build time)
 * Use this for generateStaticParams and generateMetadata
 * This doesn't use cookies and is suitable for public data access
 */
export function createStaticClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase credentials not found!\n\n' +
      'Please complete the installation wizard at /install\n' +
      'or manually add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file'
    );
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // Static generation doesn't need to set cookies
      },
    },
  });
}
