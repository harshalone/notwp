'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Database,
  FileText,
  Shield,
  Table,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const migrations = [
  {
    id: '001',
    name: 'User Accounts Table',
    description: 'Creates the nwp_accounts table for managing user profiles and account information',
    tables: ['nwp_accounts'],
    functions: ['update_updated_at_column'],
    triggers: ['update_nwp_accounts_updated_at'],
  },
  {
    id: '002',
    name: 'Auth Sync Trigger',
    description: 'Automatically syncs authentication users with account profiles',
    tables: [],
    functions: ['handle_new_user'],
    triggers: ['on_auth_user_created'],
  },
  {
    id: '003',
    name: 'Posts Table',
    description: 'Creates the nwp_posts table for content management',
    tables: ['nwp_posts'],
    functions: [],
    triggers: ['update_nwp_posts_updated_at'],
  },
  {
    id: '004',
    name: 'App Settings Table',
    description: 'Creates the nwp_app_settings table for application configuration',
    tables: ['nwp_app_settings'],
    functions: [],
    triggers: ['update_nwp_app_settings_updated_at'],
  },
];

export default function Step2Page() {
  const router = useRouter();
  const [expandedMigrations, setExpandedMigrations] = useState(new Set());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if we have credentials
    const credentials = sessionStorage.getItem('supabaseCredentials');
    if (!credentials) {
      router.push('/onboarding/step-1');
      return;
    }
    setIsConnected(true);
  }, [router]);

  const toggleMigration = (id) => {
    setExpandedMigrations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleContinue = () => {
    router.push('/onboarding/step-3');
  };

  const handleBack = () => {
    router.push('/onboarding/step-1');
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">
            Connection Successful!
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            We've successfully connected to your Supabase database. Below is a
            summary of what we'll create during the installation.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center gap-2">
              <Table className="h-5 w-5 text-stone-600" />
              <span className="text-sm font-medium text-stone-900">4 Tables</span>
            </div>
            <p className="mt-1 text-xs text-stone-500">Database tables</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-stone-600" />
              <span className="text-sm font-medium text-stone-900">2 Functions</span>
            </div>
            <p className="mt-1 text-xs text-stone-500">Database functions</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-stone-600" />
              <span className="text-sm font-medium text-stone-900">RLS Enabled</span>
            </div>
            <p className="mt-1 text-xs text-stone-500">Row level security</p>
          </div>
        </div>

        {/* Migration Details */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Migration Details
          </h3>
          <div className="space-y-3">
            {migrations.map((migration) => {
              const isExpanded = expandedMigrations.has(migration.id);
              return (
                <div
                  key={migration.id}
                  className="rounded-lg border border-stone-200 bg-white"
                >
                  <button
                    onClick={() => toggleMigration(migration.id)}
                    className="flex w-full items-start justify-between p-4 text-left hover:bg-stone-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-stone-100">
                        <FileText className="h-4 w-4 text-stone-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-stone-900">
                          {migration.name}
                        </h4>
                        <p className="mt-1 text-xs text-stone-600">
                          {migration.description}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0 text-stone-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-stone-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-stone-200 bg-stone-50 px-4 py-3">
                      <dl className="space-y-2">
                        {migration.tables.length > 0 && (
                          <div className="flex gap-2">
                            <dt className="text-xs font-medium text-stone-500">
                              Tables:
                            </dt>
                            <dd className="text-xs text-stone-700">
                              {migration.tables.join(', ')}
                            </dd>
                          </div>
                        )}
                        {migration.functions.length > 0 && (
                          <div className="flex gap-2">
                            <dt className="text-xs font-medium text-stone-500">
                              Functions:
                            </dt>
                            <dd className="text-xs text-stone-700">
                              {migration.functions.join(', ')}
                            </dd>
                          </div>
                        )}
                        {migration.triggers.length > 0 && (
                          <div className="flex gap-2">
                            <dt className="text-xs font-medium text-stone-500">
                              Triggers:
                            </dt>
                            <dd className="text-xs text-stone-700">
                              {migration.triggers.join(', ')}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Security Features</p>
              <p className="mt-1 text-sm text-blue-700">
                All tables will be created with Row Level Security (RLS) enabled,
                ensuring your data is protected. User permissions are enforced at the
                database level for maximum security.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
          >
            Continue to Installation
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
