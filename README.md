# NotWordPress - Open Source CMS

This is a [Next.js](https://nextjs.org) based CMS project with Supabase backend.

## Installation

Follow the installation wizard at `/install` after setting up your development environment.

### Database Setup

The database migrations will automatically create:
- All required tables (`nwp_accounts`, `nwp_posts`, `nwp_pages`, etc.)
- Row Level Security (RLS) policies
- Storage buckets for media
- **A default administrator account**

### Default Administrator Credentials

After running the database migrations in Step 3 of the installation, a default admin account is created:

- **Email:** `admin@notwp.com`
- **Password:** `admin`

**⚠️ IMPORTANT SECURITY NOTICE:**
These are default credentials for initial setup only. You **must** change the password immediately after your first login.

### Changing Your Password

1. Log in to the admin panel at `/dadmin/auth/login` using the default credentials
2. Navigate to **Settings** in the admin panel
3. Update your email address and password
4. Configure your profile information (display name, bio, avatar, etc.)

Alternatively, you can use Supabase Auth dashboard to manage user accounts and reset passwords.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
