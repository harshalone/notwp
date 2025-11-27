'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Database, AlertCircle, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export default function Step1Client({ execSqlFunction }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    supabaseUrl: '',
    supabaseAnonKey: '',
    supabaseServiceRoleKey: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [credentialsLoaded, setCredentialsLoaded] = useState(false);
  const [showAlreadyInstalledModal, setShowAlreadyInstalledModal] = useState(false);
  const [checkingInstallation, setCheckingInstallation] = useState(true);

  useEffect(() => {
    // Load saved credentials from localStorage if they exist
    let savedUrl = '';
    let savedAnonKey = '';

    try {
      const savedCredentials = localStorage.getItem('supabase_install_credentials');
      if (savedCredentials) {
        const credentials = JSON.parse(savedCredentials);
        savedUrl = credentials.supabaseUrl || '';
        savedAnonKey = credentials.supabaseAnonKey || '';
        setFormData({
          supabaseUrl: savedUrl,
          supabaseAnonKey: savedAnonKey,
          supabaseServiceRoleKey: credentials.supabaseServiceRoleKey || '',
        });
        setCredentialsLoaded(true);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }

    // Check if database tables already exist
    const checkInstallation = async () => {
      try {
        const response = await fetch(
          `/api/install/check-installation?url=${encodeURIComponent(savedUrl)}&key=${encodeURIComponent(savedAnonKey)}`
        );
        const data = await response.json();

        if (data.installed) {
          setShowAlreadyInstalledModal(true);
        }
      } catch (error) {
        console.error('Error checking installation:', error);
      } finally {
        setCheckingInstallation(false);
      }
    };

    if (savedUrl && savedAnonKey) {
      checkInstallation();
    } else {
      setCheckingInstallation(false);
    }
  }, []);

  const handleClearCredentials = () => {
    localStorage.removeItem('supabase_install_credentials');
    sessionStorage.removeItem('supabaseCredentials');
    setFormData({
      supabaseUrl: '',
      supabaseAnonKey: '',
      supabaseServiceRoleKey: '',
    });
    setCredentialsLoaded(false);
  };

  const handleClearDatabase = () => {
    // Clear all installation-related localStorage
    localStorage.removeItem('supabase_install_credentials');
    localStorage.removeItem('nwp_installation_complete');
    localStorage.removeItem('nwp_supabase_url');
    localStorage.removeItem('nwp_supabase_anon_key');
    sessionStorage.clear();

    setShowAlreadyInstalledModal(false);
    setFormData({
      supabaseUrl: '',
      supabaseAnonKey: '',
      supabaseServiceRoleKey: '',
    });
    setCredentialsLoaded(false);
  };

  const handleGoHome = () => {
    router.push('/');
  };

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

  const handleCopySQL = () => {
    navigator.clipboard.writeText(execSqlFunction);
    setShowCopiedNotification(true);
    setTimeout(() => setShowCopiedNotification(false), 3000);
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

      // Save credentials to both localStorage (for persistence) and sessionStorage (for current session)
      localStorage.setItem('supabase_install_credentials', JSON.stringify(formData));
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
      {/* Already Installed Modal */}
      {showAlreadyInstalledModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-lg rounded-lg border border-red-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-stone-900">
                  Installation Already Complete
                </h3>
                <p className="mt-2 text-sm text-stone-600">
                  Your database already has NotWP tables installed. Running the installation again will cause errors.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-900">
                To reinstall NotWP:
              </p>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-amber-700">
                <li>Go to your Supabase SQL Editor</li>
                <li>Delete all NotWP tables (nwp_accounts, nwp_posts, etc.)</li>
                <li>Clear your browser's localStorage</li>
                <li>Return to this installation wizard</li>
              </ol>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleGoHome}
                className="flex-1 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Go to Home
              </button>
              <button
                onClick={handleClearDatabase}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
              >
                Clear Local Cache & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        {checkingInstallation ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-stone-900"></div>
            <p className="mt-4 text-sm text-stone-600">Checking installation status...</p>
          </div>
        ) : (
          <>
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
                NotWP uses your Supabase service role key to run migrations via REST API.
                All tables, functions, triggers, and security policies will be created automatically.
                Just create one helper function in Step 1, and we'll handle the rest!
              </p>
            </div>
          </div>
        </div>

        {credentialsLoaded && (
          <div className="mb-6 flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Credentials Loaded</p>
                <p className="mt-1 text-sm text-green-700">
                  Your previously saved Supabase credentials have been loaded.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearCredentials}
              className="text-xs text-green-700 hover:text-green-900 underline whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        )}

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
                <div className="mt-3 relative">
                  <div className="rounded bg-stone-900 p-3">
                    <code className="block text-xs text-green-400 font-mono whitespace-pre-wrap">
{execSqlFunction}
                    </code>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={handleCopySQL}
                      className="rounded bg-stone-700 px-2 py-1 text-xs text-white hover:bg-stone-600 cursor-pointer"
                    >
                      Copy
                    </button>
                    {showCopiedNotification && (
                      <div className="absolute top-0 right-full mr-2 whitespace-nowrap rounded bg-green-600 px-2 py-1 text-xs text-white shadow-lg">
                        Copied!
                      </div>
                    )}
                  </div>
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
              className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
          </>
        )}
      </div>
    </div>
  );
}
