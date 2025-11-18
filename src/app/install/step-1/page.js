'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Key, AlertCircle, ArrowRight } from 'lucide-react';
import { getCachedInstallationStatus } from '@/lib/installation-check';

export default function Step1Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    supabaseUrl: '',
    supabaseAnonKey: '',
    supabaseServiceRoleKey: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInstalled = getCachedInstallationStatus();
    if (isInstalled) {
      router.push('/');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supabaseUrl) {
      newErrors.supabaseUrl = 'Supabase URL is required';
    } else if (!formData.supabaseUrl.match(/^https?:\/\/.+\.supabase\.co$/)) {
      newErrors.supabaseUrl = 'Please enter a valid Supabase URL (e.g., https://your-project.supabase.co)';
    }

    if (!formData.supabaseAnonKey) {
      newErrors.supabaseAnonKey = 'Anonymous key is required';
    }

    if (!formData.supabaseServiceRoleKey) {
      newErrors.supabaseServiceRoleKey = 'Service role key is required for installation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Test the connection
      const response = await fetch('/api/install/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrors({ general: result.error || 'Failed to connect to Supabase' });
        return;
      }

      // Save credentials to session storage for next step
      sessionStorage.setItem('supabaseCredentials', JSON.stringify(formData));

      // Navigate to step 2
      router.push('/install/step-2');
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100">
            <Database className="h-6 w-6 text-stone-900" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">
            Connect to Supabase
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Enter your Supabase project credentials to get started. You can find
            these in your Supabase project settings.
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Simple 2-Step Installation
              </p>
              <p className="mt-1 text-sm text-blue-700">
                NotWordPress uses your Supabase service role key to run migrations via REST API.
                All tables, functions, triggers, and security policies will be created automatically.
                Just create one helper function in Step 1, and we'll handle the rest!
              </p>
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-900">Connection Failed</p>
              <p className="mt-1 text-sm text-red-700">{errors.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Supabase URL */}
          <div>
            <label
              htmlFor="supabaseUrl"
              className="block text-sm font-medium text-stone-900"
            >
              Supabase Project URL
            </label>
            <div className="mt-2">
              <input
                type="url"
                id="supabaseUrl"
                name="supabaseUrl"
                value={formData.supabaseUrl}
                onChange={handleChange}
                placeholder="https://your-project.supabase.co"
                className={`block w-full rounded-md border px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                  errors.supabaseUrl
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900'
                }`}
              />
              {errors.supabaseUrl && (
                <p className="mt-2 text-sm text-red-600">{errors.supabaseUrl}</p>
              )}
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Found in Settings → Data API → URL
            </p>
          </div>

          {/* Anon Key */}
          <div>
            <label
              htmlFor="supabaseAnonKey"
              className="block text-sm font-medium text-stone-900"
            >
              Anonymous Key (Public)
            </label>
            <div className="mt-2">
              <input
                type="password"
                id="supabaseAnonKey"
                name="supabaseAnonKey"
                value={formData.supabaseAnonKey}
                onChange={handleChange}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className={`block w-full rounded-md border px-3 py-2 text-sm font-mono placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                  errors.supabaseAnonKey
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900'
                }`}
              />
              {errors.supabaseAnonKey && (
                <p className="mt-2 text-sm text-red-600">{errors.supabaseAnonKey}</p>
              )}
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Found in Settings → Data API → Project API keys → anon public
            </p>
          </div>

          {/* Service Role Key */}
          <div>
            <label
              htmlFor="supabaseServiceRoleKey"
              className="block text-sm font-medium text-stone-900"
            >
              Service Role Key (Secret)
            </label>
            <div className="mt-2">
              <input
                type="password"
                id="supabaseServiceRoleKey"
                name="supabaseServiceRoleKey"
                value={formData.supabaseServiceRoleKey}
                onChange={handleChange}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className={`block w-full rounded-md border px-3 py-2 text-sm font-mono placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                  errors.supabaseServiceRoleKey
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900'
                }`}
              />
              {errors.supabaseServiceRoleKey && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.supabaseServiceRoleKey}
                </p>
              )}
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Found in Settings → Data API → Project API keys → service_role secret
            </p>
          </div>

          {/* SQL Setup Instructions */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">
                  Before You Continue: Create Helper Function
                </p>
                <p className="mt-2 text-sm text-amber-700">
                  Open your Supabase SQL Editor and run this SQL command:
                </p>
                <div className="mt-3 rounded bg-stone-900 p-3">
                  <code className="block text-xs text-green-400 font-mono whitespace-pre-wrap">
{`CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;`}
                  </code>
                </div>
                <p className="mt-2 text-sm text-amber-700">
                  This function allows the installation wizard to run migrations using your service role key.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>Testing Connection...</>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
