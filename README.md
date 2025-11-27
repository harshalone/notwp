# NotWP - Open Source CMS

A modern, open-source Content Management System built with Next.js and Supabase. NotWP provides a powerful, flexible platform for creating and managing content with built-in authentication, media storage, and a beautiful admin interface.

## Features

- 🚀 **Modern Stack**: Built with Next.js 15, React, and Supabase
- 🔐 **Secure Authentication**: Row Level Security (RLS) policies at the database level
- 📝 **Content Management**: Posts, pages, and documentation management
- 🎨 **Visual Page Builder**: Integrated Puck editor for drag-and-drop page building
- 📧 **Newsletter System**: Built-in email management with AWS SES integration
- 🖼️ **Media Management**: Supabase storage for images and files
- 🔌 **Plugin System**: Extensible architecture for custom functionality
- 📱 **Responsive Admin Panel**: Clean, modern interface for content management

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase account and project
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notwp-opensource
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Run the installation wizard**

   Go to [http://localhost:3000/install](http://localhost:3000/install) and follow the 6-step setup process.

## Installation Wizard

NotWP includes a comprehensive installation wizard that guides you through the setup process:

### Step 1: Supabase Credentials
- Enter your Supabase project URL
- Add your anonymous (public) key
- Add your service role (secret) key
- Create the `exec_sql` helper function in your Supabase SQL Editor

### Step 2: Review Setup
- Preview all database migrations
- See what tables, functions, and triggers will be created
- Review security policies

### Step 3: Install Database
- Automatically runs all migrations
- Creates 8 database tables
- Sets up Row Level Security policies
- Configures triggers and functions

### Step 4: Storage Bucket
- Create a 'media' storage bucket in Supabase
- Apply storage policies for authenticated users
- Set up permissions for file uploads

### Step 5: Create Admin Account
- Set up your administrator account
- Configure email and password
- Automatically sync with Supabase Auth

### Step 6: Complete
- Review environment variables
- Get instructions for local development and production deployment
- **Important**: Remove the `exec_sql` function for security
- Restart your development server

## Database Structure

NotWP creates the following tables:

- `nwp_accounts` - User profiles and account information
- `nwp_posts` - Blog posts and articles
- `nwp_pages` - Static pages with visual editor support
- `nwp_app_settings` - Application configuration
- `nwp_documentation` - Documentation content
- `nwp_plugins` - Plugin management
- `nwp_newsletter_subscribers` - Email subscribers
- `nwp_newsletter_emails` - Email campaign history
- `nwp_newsletter_settings` - AWS SES configuration

## Environment Variables

After installation, your `.env.local` file should contain:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### For Production Deployment

When deploying to Vercel or other hosting platforms:

1. Go to your project settings
2. Add all three environment variables
3. Select all environments (Production, Preview, Development)
4. Save and redeploy

## Security Best Practices

### After Installation

1. **Remove the exec_sql function** (Critical!)
   ```sql
   DROP FUNCTION IF EXISTS exec_sql(text);
   ```
   This function allows arbitrary SQL execution and must be removed from production.

2. **Change your admin password immediately**
   - Log in to `/dadmin/auth/login`
   - Go to Settings
   - Update your password

3. **Review RLS policies**
   - All tables have Row Level Security enabled
   - Policies enforce user permissions at the database level

4. **Secure your service role key**
   - Never expose it in client-side code
   - Only use it in API routes and server-side functions

## Admin Panel

Access the admin panel at `/dadmin` after logging in:

- **Dashboard**: Overview of your content and statistics
- **Posts**: Create and manage blog posts
- **Pages**: Build pages with the visual editor
- **Media**: Upload and manage images and files
- **Documentation**: Create help articles and guides
- **Newsletter**: Manage subscribers and send campaigns
- **Plugins**: Install and configure plugins
- **Settings**: Configure your site and profile

## Development

### Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   ├── blog/                # Blog pages
│   ├── dadmin/              # Admin panel
│   ├── install/             # Installation wizard
│   └── _components/         # React components
├── lib/                      # Utility functions
│   └── sql/                 # SQL migration files
database/
└── migrations/              # Database migration files
    ├── tables/              # Table creation scripts
    ├── storage/             # Storage bucket setup
    └── cleanup/             # Cleanup scripts
```

### Running Migrations Manually

All migrations are in the `database/migrations/` directory:

- `tables/` - Core table structures
- `storage/` - Media storage configuration
- `cleanup/` - Scripts to remove tables if needed

### Custom Development

- Edit pages in `src/app/`
- Add components in `src/app/_components/`
- Create API routes in `src/app/api/`
- Customize styles using Tailwind CSS classes

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **Page Builder**: Puck Editor
- **Icons**: Lucide React
- **Email**: AWS SES (via newsletter system)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Puck Editor Documentation](https://puckeditor.com/docs)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Supabase
