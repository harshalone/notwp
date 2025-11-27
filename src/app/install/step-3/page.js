'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Loader2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Database,
} from 'lucide-react';

const initialMigrations = [
  { id: '000', name: 'Exec SQL Function', status: 'pending', folder: 'tables' },
  { id: '001', name: 'User Accounts Table', status: 'pending', folder: 'tables' },
  { id: '002', name: 'Auth Sync Trigger', status: 'pending', folder: 'tables' },
  { id: '003', name: 'Posts Table', status: 'pending', folder: 'tables' },
  { id: '004', name: 'App Settings Table', status: 'pending', folder: 'tables' },
  { id: '006', name: 'Pages Table', status: 'pending', folder: 'tables' },
  { id: '007', name: 'Puck Editor Data', status: 'pending', folder: 'tables' },
  { id: '008', name: 'Newsletter Tables', status: 'pending', folder: 'tables' },
  { id: '009', name: 'Documentation Table', status: 'pending', folder: 'tables' },
];

export default function Step3Page() {
  const router = useRouter();
  const [migrations, setMigrations] = useState(initialMigrations);
  const [isInstalling, setIsInstalling] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check if we have credentials
    const credentials = sessionStorage.getItem('supabaseCredentials');
    if (!credentials) {
      router.push('/install/step-1');
    }
  }, [router]);

  const runMigrations = async () => {
    setIsInstalling(true);
    setHasError(false);

    const credentials = sessionStorage.getItem('supabaseCredentials');
    if (!credentials) {
      return;
    }

    try {
      for (let i = 0; i < migrations.length; i++) {
        // Update to running
        setMigrations((prev) =>
          prev.map((m, idx) =>
            idx === i ? { ...m, status: 'running' } : m
          )
        );

        // Run migration
        const response = await fetch('/api/install/run-migration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credentials: JSON.parse(credentials),
            migrationId: migrations[i].id,
            folder: migrations[i].folder || 'tables',
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          // Mark as error
          setMigrations((prev) =>
            prev.map((m, idx) =>
              idx === i
                ? { ...m, status: 'error', error: result.error }
                : m
            )
          );
          setHasError(true);
          setIsInstalling(false);
          return;
        }

        // Mark as success
        setMigrations((prev) =>
          prev.map((m, idx) =>
            idx === i ? { ...m, status: 'success' } : m
          )
        );

        // Small delay for UX
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // All migrations successful
      // Save config to file
      const saveConfigResponse = await fetch('/api/install/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: credentials,
      });

      if (!saveConfigResponse.ok) {
        console.error('Failed to save config file');
      }

      setIsComplete(true);
      setIsInstalling(false);

      // Don't clear session storage yet - Step 4 and 5 need the credentials
      // Step 5 will clear them after the installation is marked complete

      // Auto-redirect to step 4 (storage bucket creation) after 1 second
      setTimeout(() => {
        router.push('/install/step-4');
      }, 1000);
    } catch (error) {
      setHasError(true);
      setIsInstalling(false);
    }
  };

  const handleBack = () => {
    router.push('/install/step-2');
  };

  const allPending = migrations.every((m) => m.status === 'pending');

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
            {isComplete ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : hasError ? (
              <XCircle className="h-5 w-5 text-red-600" />
            ) : isInstalling ? (
              <Loader2 className="h-5 w-5 animate-spin text-stone-900" />
            ) : (
              <Database className="h-5 w-5 text-stone-900" />
            )}
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            {isComplete
              ? 'Installation Complete!'
              : hasError
              ? 'Installation Failed'
              : allPending
              ? 'Ready to Install'
              : 'Installing Database...'}
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            {isComplete
              ? 'Your database has been successfully configured.'
              : hasError
              ? 'An error occurred during installation. Please check the details below.'
              : allPending
              ? 'Click the button below to start the database installation.'
              : 'Please wait while we set up your database tables and functions.'}
          </p>
        </div>

        {/* Migration Progress */}
        <div className="mb-5 space-y-2">
          {migrations.map((migration) => (
            <div
              key={migration.id}
              className="flex items-start justify-between rounded border border-stone-200 p-3"
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  {migration.status === 'pending' && (
                    <div className="h-4 w-4 rounded-full border-2 border-stone-300" />
                  )}
                  {migration.status === 'running' && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                  {migration.status === 'success' && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                  {migration.status === 'error' && (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-900">
                    {migration.name}
                  </h4>
                  {migration.status === 'running' && (
                    <p className="mt-0.5 text-xs text-blue-600">Running...</p>
                  )}
                  {migration.status === 'success' && (
                    <p className="mt-0.5 text-xs text-green-600">Completed</p>
                  )}
                  {migration.status === 'error' && migration.error && (
                    <p className="mt-0.5 text-xs text-red-600">{migration.error}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {hasError && (
          <div className="mb-5 flex items-start gap-2 rounded border border-red-200 bg-red-50 p-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-red-900">
                Installation Error
              </p>
              <p className="mt-0.5 text-xs text-red-700">
                One or more migrations failed to execute. Please check your Supabase
                credentials and try again. If the problem persists, contact support.
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {isComplete && (
          <div className="mb-5 flex items-start gap-2 rounded border border-green-200 bg-green-50 p-3">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-green-900">
                Database Ready
              </p>
              <p className="mt-0.5 text-xs text-green-700">
                All migrations have been successfully applied. Redirecting to admin account creation...
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={isInstalling || isComplete}
            className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {allPending && !isComplete && (
            <button
              onClick={runMigrations}
              disabled={isInstalling}
              className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isInstalling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  Start Installation
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}

          {hasError && (
            <button
              onClick={runMigrations}
              className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 cursor-pointer"
            >
              Retry Installation
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
