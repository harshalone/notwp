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
    id: '000',
    name: 'Exec SQL Function',
    description: 'Creates the exec_sql function for running migrations',
    tables: [],
    functions: ['exec_sql'],
    triggers: [],
  },
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
  {
    id: '006',
    name: 'Pages Table',
    description: 'Creates the nwp_pages table for static page management',
    tables: ['nwp_pages'],
    functions: ['set_page_published_at', 'set_page_published_at_on_insert'],
    triggers: ['update_nwp_pages_updated_at', 'trigger_set_page_published_at', 'trigger_set_page_published_at_on_insert'],
  },
  {
    id: '007',
    name: 'Puck Editor Data',
    description: 'Adds puck_data JSONB column to pages table for visual editing',
    tables: [],
    functions: [],
    triggers: [],
  },
  {
    id: '008',
    name: 'Newsletter Tables',
    description: 'Creates tables for newsletter subscribers, email history, and AWS SES settings',
    tables: ['nwp_newsletter_subscribers', 'nwp_newsletter_emails', 'nwp_newsletter_settings'],
    functions: ['update_newsletter_subscriber_updated_at', 'update_newsletter_settings_updated_at'],
    triggers: ['trigger_newsletter_subscriber_updated_at', 'trigger_newsletter_settings_updated_at'],
  },
  {
    id: '009',
    name: 'Documentation Table',
    description: 'Creates the nwp_documentation table for documentation content management',
    tables: ['nwp_documentation'],
    functions: ['set_documentation_published_at', 'set_documentation_published_at_on_insert'],
    triggers: ['update_nwp_documentation_updated_at', 'trigger_set_documentation_published_at', 'trigger_set_documentation_published_at_on_insert'],
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
      router.push('/install/step-1');
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
    router.push('/install/step-3');
  };

  const handleBack = () => {
    router.push('/install/step-1');
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            Connection Successful!
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            We've successfully connected to your Supabase database. Below is a
            summary of what we'll create during the installation.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
            <div className="flex items-center gap-2">
              <Table className="h-4 w-4 text-stone-600" />
              <span className="text-sm font-medium text-stone-900">8 Tables</span>
            </div>
            <p className="mt-0.5 text-xs text-stone-500">Database tables</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-stone-600" />
              <span className="text-sm font-medium text-stone-900">9 Migrations</span>
            </div>
            <p className="mt-0.5 text-xs text-stone-500">Table migrations</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-stone-600" />
              <span className="text-sm font-medium text-stone-900">RLS Enabled</span>
            </div>
            <p className="mt-0.5 text-xs text-stone-500">Row level security</p>
          </div>
        </div>

        {/* Migration Details */}
        <div className="mb-5">
          <h3 className="mb-3 text-base font-semibold text-stone-900">
            Migration Details
          </h3>
          <div className="space-y-2">
            {migrations.map((migration) => {
              const isExpanded = expandedMigrations.has(migration.id);
              return (
                <div
                  key={migration.id}
                  className="rounded border border-stone-200 bg-white"
                >
                  <button
                    onClick={() => toggleMigration(migration.id)}
                    className="flex w-full items-start justify-between p-3 text-left hover:bg-stone-50 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-100">
                        <FileText className="h-3 w-3 text-stone-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-stone-900">
                          {migration.name}
                        </h4>
                        <p className="mt-0.5 text-xs text-stone-600">
                          {migration.description}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 flex-shrink-0 text-stone-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 flex-shrink-0 text-stone-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-stone-200 bg-stone-50 px-3 py-2">
                      <dl className="space-y-1">
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
                        {migration.policies && migration.policies.length > 0 && (
                          <div className="flex gap-2">
                            <dt className="text-xs font-medium text-stone-500">
                              Policies:
                            </dt>
                            <dd className="text-xs text-stone-700">
                              {migration.policies.join(', ')}
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
        <div className="mb-5 rounded border border-blue-200 bg-blue-50 p-3">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 flex-shrink-0 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-blue-900">Security Features</p>
              <p className="mt-0.5 text-xs text-blue-700">
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
            className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 cursor-pointer"
          >
            Continue to Installation
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
