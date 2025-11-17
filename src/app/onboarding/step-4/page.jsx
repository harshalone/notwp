'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Database, Shield, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { setCachedInstallationStatus } from '@/lib/installation-check';
import { createClient } from '@supabase/supabase-js';

export default function Step4Page() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Get credentials from session storage before clearing
    const credentialsStr = sessionStorage.getItem('supabaseCredentials');
    if (credentialsStr) {
      try {
        const credentials = JSON.parse(credentialsStr);
        // Save to localStorage for future use
        localStorage.setItem('nwp_supabase_url', credentials.supabaseUrl);
        localStorage.setItem('nwp_supabase_anon_key', credentials.supabaseAnonKey);
      } catch (error) {
        console.error('Error saving credentials:', error);
      }
    }

    // Mark installation as complete
    setCachedInstallationStatus(true);

    // Clear session storage
    return () => {
      sessionStorage.removeItem('supabaseCredentials');
    };
  }, []);

  const handleGetStarted = async () => {
    setIsVerifying(true);

    try {
      // Get credentials from localStorage
      const supabaseUrl = localStorage.getItem('nwp_supabase_url');
      const supabaseAnonKey = localStorage.getItem('nwp_supabase_anon_key');

      if (!supabaseUrl || !supabaseAnonKey) {
        alert('Credentials not found. Please restart the installation.');
        router.push('/onboarding/step-1');
        return;
      }

      // Verify that the nwp_accounts table exists
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await supabase.from('nwp_accounts').select('id').limit(1);

      if (error && !error.message.includes('0 rows')) {
        // Table doesn't exist or there's a real error
        alert('Installation verification failed. The database tables may not have been created. Please check your Supabase SQL editor and ensure the exec_sql function was created, then re-run the installation.');
        setIsVerifying(false);
        return;
      }

      // Everything looks good, redirect to home
      router.push('/');
    } catch (error) {
      console.error('Verification error:', error);
      alert('An error occurred while verifying the installation. Please check the console for details.');
      setIsVerifying(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-stone-900">
            You're All Set!
          </h2>
          <p className="mt-3 text-base text-stone-600">
            NotWordPress has been successfully installed and configured. Your
            database is ready and you can start creating content.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mb-8 space-y-4">
          <div className="flex items-start gap-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white">
              <Database className="h-5 w-5 text-stone-900" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Database Configured
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                All tables, functions, and triggers have been created successfully
                in your Supabase database.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white">
              <Shield className="h-5 w-5 text-stone-900" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Security Enabled
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Row Level Security (RLS) policies are active, protecting your data
                with database-level permissions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white">
              <Zap className="h-5 w-5 text-stone-900" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Ready to Use
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Your credentials have been securely stored and the system is ready
                for user registration and content creation.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 text-sm font-semibold text-blue-900">
            What's Next?
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-900">
                1
              </span>
              <span>Create your administrator account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-900">
                2
              </span>
              <span>Start creating posts and managing content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-900">
                3
              </span>
              <span>Customize your site settings and preferences</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGetStarted}
            disabled={isVerifying}
            className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-6 py-3 text-base font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying Installation...
              </>
            ) : (
              <>
                Get Started
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-stone-500">
          Need help?{' '}
          <a
            href="#"
            className="font-medium text-stone-900 underline hover:text-stone-700"
          >
            View documentation
          </a>{' '}
          or{' '}
          <a
            href="#"
            className="font-medium text-stone-900 underline hover:text-stone-700"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
