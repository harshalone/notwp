'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Database, Shield, Zap, ArrowRight, Loader2, Copy, Check, CloudUpload, RefreshCw, X } from 'lucide-react';
import { setCachedInstallationStatus } from '@/lib/installation-check';
import { createClient } from '@supabase/supabase-js';

export default function Step4Page() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [envFileContent, setEnvFileContent] = useState('');

  useEffect(() => {
    // Get credentials from session storage
    const credentialsStr = sessionStorage.getItem('supabaseCredentials');
    if (credentialsStr) {
      try {
        const creds = JSON.parse(credentialsStr);
        setCredentials(creds);
        // Save to localStorage for future use (only anon key for regular use)
        localStorage.setItem('nwp_supabase_url', creds.supabaseUrl);
        localStorage.setItem('nwp_supabase_anon_key', creds.supabaseAnonKey);
        // Temporarily store service role key for verification
        sessionStorage.setItem('nwp_service_role_key_temp', creds.supabaseServiceRoleKey);

        // Generate .env file content
        const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${creds.supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${creds.supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${creds.supabaseServiceRoleKey}`;
        setEnvFileContent(envContent);
      } catch (error) {
        console.error('Error saving credentials:', error);
      }
    }
  }, []);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleGetStarted = async () => {
    setIsVerifying(true);

    try {
      // Get credentials from localStorage and sessionStorage
      const supabaseUrl = localStorage.getItem('nwp_supabase_url');
      const serviceRoleKey = sessionStorage.getItem('nwp_service_role_key_temp');

      if (!supabaseUrl || !serviceRoleKey) {
        alert('Credentials not found. Please restart the installation.');
        router.push('/install/step-1');
        return;
      }

      // Verify installation using service role key (bypasses RLS)
      const supabase = createClient(supabaseUrl, serviceRoleKey);

      // Check that all tables exist
      const [accountsCheck, postsCheck, settingsCheck] = await Promise.all([
        supabase.from('nwp_accounts').select('id').limit(1),
        supabase.from('nwp_posts').select('id').limit(1),
        supabase.from('nwp_app_settings').select('setting_value').eq('setting_key', 'installation_complete').maybeSingle()
      ]);

      // Check for any errors (except "no rows" which is fine)
      if (accountsCheck.error && !accountsCheck.error.message.includes('0 rows')) {
        console.error('Accounts table verification failed:', accountsCheck.error);
        throw new Error('nwp_accounts table not found');
      }

      if (postsCheck.error && !postsCheck.error.message.includes('0 rows')) {
        console.error('Posts table verification failed:', postsCheck.error);
        throw new Error('nwp_posts table not found');
      }

      if (settingsCheck.error) {
        console.error('Settings table verification failed:', settingsCheck.error);
        throw new Error('nwp_app_settings table not found');
      }

      // Now mark installation as complete in the database
      const completeResponse = await fetch('/api/install/complete-installation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUrl,
          supabaseServiceRoleKey: serviceRoleKey
        })
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json();
        throw new Error(errorData.error || 'Failed to mark installation as complete');
      }

      // Mark installation as complete in cache
      setCachedInstallationStatus(true);

      // Show the restart modal
      setIsVerifying(false);
      setShowRestartModal(true);
    } catch (error) {
      console.error('Verification error:', error);
      alert(`Installation verification failed: ${error.message}. Please check your Supabase SQL editor and ensure all migrations ran successfully.`);
      setIsVerifying(false);
    }
  };

  const handleContinueAfterRestart = () => {
    // Clear temporary credentials
    sessionStorage.removeItem('nwp_service_role_key_temp');
    sessionStorage.removeItem('supabaseCredentials');

    // Redirect to home page
    router.push('/');
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

        {/* Deployment Instructions */}
        {credentials && (
          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
            <div className="mb-4 flex items-start gap-3">
              <CloudUpload className="h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900">
                  Important: Vercel Deployment Setup
                </h3>
                <p className="mt-1 text-sm text-amber-700">
                  Your credentials have been saved to <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">.env.local</code> for local development.
                  To deploy to production on Vercel, you need to add these environment variables to your project settings.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-amber-300 bg-white p-3">
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-stone-700">NEXT_PUBLIC_SUPABASE_URL</label>
                  <button
                    onClick={() => copyToClipboard(credentials.supabaseUrl, 'url')}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs text-amber-700 hover:bg-amber-100"
                  >
                    {copiedField === 'url' ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <code className="block overflow-x-auto rounded bg-stone-50 p-2 text-xs font-mono text-stone-900">
                  {credentials.supabaseUrl}
                </code>
              </div>

              <div className="rounded-lg border border-amber-300 bg-white p-3">
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-stone-700">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
                  <button
                    onClick={() => copyToClipboard(credentials.supabaseAnonKey, 'anon')}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs text-amber-700 hover:bg-amber-100"
                  >
                    {copiedField === 'anon' ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <code className="block overflow-x-auto rounded bg-stone-50 p-2 text-xs font-mono text-stone-900">
                  {credentials.supabaseAnonKey}
                </code>
              </div>

              <div className="rounded-lg border border-amber-300 bg-white p-3">
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-stone-700">SUPABASE_SERVICE_ROLE_KEY</label>
                  <button
                    onClick={() => copyToClipboard(credentials.supabaseServiceRoleKey, 'service')}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs text-amber-700 hover:bg-amber-100"
                  >
                    {copiedField === 'service' ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <code className="block overflow-x-auto rounded bg-stone-50 p-2 text-xs font-mono text-stone-900">
                  {credentials.supabaseServiceRoleKey}
                </code>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-amber-100 p-3">
              <p className="text-xs font-medium text-amber-900">How to add to Vercel:</p>
              <ol className="mt-2 space-y-1 text-xs text-amber-800">
                <li>1. Go to your Vercel Dashboard</li>
                <li>2. Select your project → Settings → Environment Variables</li>
                <li>3. Add each variable above (name + value)</li>
                <li>4. Select all environments (Production, Preview, Development)</li>
                <li>5. Click "Save" and redeploy your application</li>
              </ol>
            </div>
          </div>
        )}

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
              <span>Restart your development server to load the new environment variables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-900">
                2
              </span>
              <span>Create your administrator account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-900">
                3
              </span>
              <span>Start creating posts and managing content</span>
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

      {/* Restart Server Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-3xl rounded-lg border border-stone-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">
                  Installation Marked Complete!
                </h3>
              </div>
              <button
                onClick={() => setShowRestartModal(false)}
                className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-900">
                Your installation has been successfully marked as complete in the database.
                Now you need to restart your server to load the environment variables.
              </p>
            </div>

            {/* Local Development Instructions */}
            <div className="mb-6">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-900">
                <RefreshCw className="h-4 w-4" />
                Local Development - Restart Server
              </h4>
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <ol className="space-y-2 text-sm text-stone-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                      1
                    </span>
                    <span>Stop your development server (Ctrl+C or Cmd+C in terminal)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                      2
                    </span>
                    <span>Run <code className="rounded bg-stone-200 px-2 py-0.5 font-mono text-xs">npm run dev</code> or <code className="rounded bg-stone-200 px-2 py-0.5 font-mono text-xs">yarn dev</code> again</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                      3
                    </span>
                    <span>Click the button below to continue to your website</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Production Deployment Instructions */}
            <div className="mb-6">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-900">
                <CloudUpload className="h-4 w-4" />
                Production Deployment - Copy Environment Variables
              </h4>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="mb-3 text-sm text-amber-900">
                  If deploying to Vercel or other hosting, copy the <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">.env.local</code> content below and add it to your hosting provider:
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg border border-amber-300 bg-white p-4 text-xs font-mono text-stone-900">
                    {envFileContent}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(envFileContent, 'envFile')}
                    className="absolute right-2 top-2 flex items-center gap-1 rounded bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
                  >
                    {copiedField === 'envFile' ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy All
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-3 rounded-lg bg-amber-100 p-3">
                  <p className="text-xs font-medium text-amber-900">For Vercel:</p>
                  <ol className="mt-2 space-y-1 text-xs text-amber-800">
                    <li>1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
                    <li>2. Add each variable (name + value) from above</li>
                    <li>3. Select all environments (Production, Preview, Development)</li>
                    <li>4. Save and redeploy your application</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRestartModal(false)}
                className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Close
              </button>
              <button
                onClick={handleContinueAfterRestart}
                className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-6 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                I've Restarted - Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
