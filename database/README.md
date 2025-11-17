# NotWordPress Database Migrations

This directory contains SQL migration files for the NotWordPress CMS built with Next.js and Supabase.

## Overview

The database schema consists of two main tables with the `nwp_` prefix:

1. **nwp_accounts** - User account management table
2. **nwp_posts** - Content/posts management table

## Migration Files

### 001_create_nwp_accounts_table.sql

Creates the `nwp_accounts` table with the following features:

- **Primary Key**: `id` (BIGSERIAL)
- **Foreign Key**: `user_uid` (UUID) references `auth.users(id)`
- **User Roles**: subscriber, contributor, author, editor, administrator
- **User Status**: active, inactive, suspended, pending
- **Automatic timestamps**: created_at, updated_at (with auto-update trigger)
- **Row Level Security (RLS)**: Enabled with policies for user privacy
- **Indexes**: Optimized for common queries on user_uid, email, username, role, status

**Key Fields**:
- `user_uid` - Links to Supabase auth.users table
- `username` - Unique username for the user
- `email` - User's email address
- `display_name` - Display name for the user
- `role` - User role for permission management
- `status` - Account status
- `avatar_url`, `bio`, `website_url` - Profile information

### 002_create_auth_user_sync_trigger.sql

Creates automatic synchronization between `auth.users` and `nwp_accounts`:

**Functions**:
1. `handle_new_user()` - Automatically creates an nwp_accounts record when a user signs up
2. `handle_user_update()` - Syncs email and verification status updates
3. `update_last_login()` - Tracks user login timestamps

**Triggers**:
- `on_auth_user_created` - Fires on new user signup
- `on_auth_user_updated` - Fires on email/verification changes
- `on_auth_user_login` - Fires on user login

### 003_create_nwp_posts_table.sql

Creates the `nwp_posts` table with the following features:

- **Primary Key**: `id` (BIGSERIAL)
- **Unique ID**: `post_uid` (UUID) for external references
- **Foreign Key**: `author_uid` (UUID) references `auth.users(id)`
- **Post Types**: post, page, draft, custom
- **Post Status**: draft, published, scheduled, private, trash
- **SEO Fields**: meta_title, meta_description, meta_keywords, og_image_url
- **Engagement Metrics**: view_count, like_count, comment_count
- **Full-text Search**: Indexes on title and content
- **Row Level Security (RLS)**: Public can view published posts, authors control their own

**Key Fields**:
- `post_uid` - Unique identifier for the post
- `author_uid` - Links to auth.users (creator of the post)
- `title`, `slug` - Post title and URL-friendly slug
- `content`, `excerpt` - Post content and summary
- `post_type`, `post_status` - Content type and publication status
- `published_at`, `scheduled_at` - Publishing timestamps
- `post_parent` - For hierarchical content structure

## How to Apply Migrations

### Option 1: Supabase Dashboard (SQL Editor)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Execute the migration files in order:
   - First: `001_create_nwp_accounts_table.sql`
   - Second: `002_create_auth_user_sync_trigger.sql`
   - Third: `003_create_nwp_posts_table.sql`

### Option 2: Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Option 3: Manual Execution

Use your preferred PostgreSQL client (psql, pgAdmin, etc.) to execute the SQL files in order.

## Row Level Security (RLS)

Both tables have RLS enabled with the following policies:

### nwp_accounts
- Users can view and update their own account
- Administrators can view, update, and delete all accounts
- Public can view basic account information (for author profiles)

### nwp_posts
- Anyone can view published posts
- Users can create, view, update, and delete their own posts
- Administrators and Editors can view and update all posts
- Administrators can delete any post

## Testing the Setup

After applying migrations, test the automatic user creation:

```sql
-- This should automatically create a record in nwp_accounts
INSERT INTO auth.users (email, encrypted_password)
VALUES ('test@example.com', 'hashed_password');

-- Verify the account was created
SELECT * FROM nwp_accounts WHERE email = 'test@example.com';
```

## Schema Relationships

```
auth.users (Supabase Auth)
    ↓ (user_uid)
nwp_accounts (User Profile)
    ↓ (author_uid via auth.users.id)
nwp_posts (Content)
```

## Future Extensions

Consider adding these additional tables as your CMS grows:

- `nwp_categories` - Post categorization
- `nwp_tags` - Post tagging system
- `nwp_comments` - Comment management
- `nwp_media` - Media library
- `nwp_post_meta` - Additional post metadata
- `nwp_user_meta` - Additional user metadata
- `nwp_taxonomies` - Custom taxonomy system

## Notes

- All tables use the `nwp_` prefix as requested
- UUIDs are used for cross-table references to auth.users
- Timestamps are in UTC (TIMESTAMPTZ)
- Full-text search is enabled on post title and content
- Automatic triggers handle common tasks (updated_at, published_at, user sync)
