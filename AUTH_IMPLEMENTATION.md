# Supabase SSR Authentication Implementation

This document describes the custom Supabase SSR authentication implementation for the admin panel.

## Overview

The authentication system uses Supabase's email OTP (One-Time Password) flow with SSR (Server-Side Rendering) support. The first user to register automatically receives administrator privileges.

## Architecture

### Components

1. **Supabase Clients** (`src/lib/`)
   - `supabase-browser.js` - Browser client for client components
   - `supabase-server.js` - Server client for server components and API routes
   - `supabase-client.js` - Legacy client (can be replaced)

2. **API Routes** (`src/app/api/auth/`)
   - `send-otp/route.js` - Sends 6-digit OTP code to email
   - `verify-otp/route.js` - Verifies OTP and authenticates user
   - `setup-account/route.js` - Creates/updates nwp_accounts entry, assigns admin to first user
   - `session/route.js` - Returns current user session and account info
   - `logout/route.js` - Signs out the user

3. **Auth Context** (`src/lib/auth-context.js`)
   - Provides auth state management
   - Subscribes to auth state changes
   - Exports `useAuth()` hook for components

4. **Middleware** (`src/middleware.js`)
   - Protects `/dadmin` routes (requires authentication)
   - Allows access to `/dadmin/auth/login`
   - Refreshes user sessions automatically

5. **Login Page** (`src/app/dadmin/auth/login/page.js`)
   - Email input step
   - OTP verification step
   - Handles complete login flow

## Authentication Flow

### Login Process

1. User enters email at `/dadmin/auth/login`
2. System calls `/api/auth/send-otp` which sends 6-digit code via Supabase
3. User receives email with OTP code
4. User enters 6-digit code
5. System calls `/api/auth/verify-otp` to verify the code
6. System calls `/api/auth/setup-account` to:
   - Check if this is the first user
   - Create entry in `nwp_accounts` table
   - Assign `administrator` role to first user, `subscriber` role to others
7. User is redirected to `/dadmin` dashboard

### Session Management

- Middleware automatically refreshes sessions on each request
- Auth context subscribes to Supabase auth state changes
- Session cookie is automatically managed by Supabase SSR

### Logout Process

1. User clicks logout button in admin header
2. System calls `/api/auth/logout`
3. Supabase signs out the user
4. User is redirected to `/dadmin/auth/login`

## Database Schema

The system uses the `nwp_accounts` table to store user information:

```sql
CREATE TABLE public.nwp_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_uid UUID NOT NULL UNIQUE REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'subscriber',
    status VARCHAR(20) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Roles

- `administrator` - Full access (assigned to first user)
- `editor` - Can manage content
- `author` - Can create and edit own content
- `contributor` - Can create content (requires approval)
- `subscriber` - Can read content

## Usage in Components

### Using Auth Hook

```javascript
'use client';

import { useAuth } from '@/lib/auth-context';

export default function MyComponent() {
  const { user, account, loading, signOut } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Welcome, {account?.displayName}!</p>
      <p>Role: {account?.role}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

### Server Components

```javascript
import { createClient } from '@/lib/supabase-server';

export default async function ServerComponent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Fetch user account
  const { data: account } = await supabase
    .from('nwp_accounts')
    .select('*')
    .eq('user_uid', user.id)
    .single();

  return <div>Welcome, {account.display_name}!</div>;
}
```

## Security Features

1. **Row Level Security (RLS)**
   - All database queries respect RLS policies
   - Users can only view/edit their own data (unless admin)
   - Admins have full access

2. **Email Verification**
   - OTP codes are sent via Supabase's secure email system
   - Codes expire after a short time
   - Codes are single-use

3. **Session Management**
   - Sessions are automatically refreshed
   - Sessions expire after inactivity
   - Secure HTTP-only cookies

4. **Middleware Protection**
   - All `/dadmin` routes require authentication
   - Automatic redirect to login page
   - Session refresh on each request

## First User Admin Assignment

The first user to register is automatically assigned the `administrator` role. This is handled in the `setup-account` API route:

```javascript
// Check if this is the first user
const { data: existingAccounts } = await adminSupabase
  .from('nwp_accounts')
  .select('id', { count: 'exact', head: true });

const isFirstUser = !existingAccounts || existingAccounts.length === 0;
const role = isFirstUser ? 'administrator' : 'subscriber';
```

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Testing the Implementation

1. Start your development server
2. Navigate to `/dadmin` - you should be redirected to `/dadmin/auth/login`
3. Enter your email address
4. Check your email for the 6-digit OTP code
5. Enter the OTP code
6. You should be logged in and redirected to `/dadmin`
7. As the first user, you should have administrator privileges

## Troubleshooting

### OTP Not Received

- Check your Supabase email settings
- Verify SMTP configuration in Supabase dashboard
- Check spam/junk folder
- Verify email address is correct

### Authentication Errors

- Check browser console for errors
- Verify environment variables are set
- Check Supabase dashboard for auth logs
- Ensure database migrations are applied

### Session Issues

- Clear browser cookies
- Check middleware configuration
- Verify Supabase URL and keys are correct
- Check for CORS issues

## Future Enhancements

Potential improvements:

1. Add password-based authentication as alternative
2. Implement magic link login
3. Add social auth providers (Google, GitHub, etc.)
4. Add two-factor authentication (2FA)
5. Add password recovery flow
6. Add email change functionality
7. Add account deletion functionality
8. Add session management UI (view all sessions, revoke sessions)
