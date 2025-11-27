'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ImageIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  FolderOpen,
  Code,
  ExternalLink,
} from 'lucide-react';

export default function Step4Page() {
  const router = useRouter();
  const [credentials, setCredentials] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [bucketCreated, setBucketCreated] = useState(false);
  const [policiesApplied, setPoliciesApplied] = useState(false);

  useEffect(() => {
    // Check if we have credentials
    const credentialsStr = sessionStorage.getItem('supabaseCredentials');
    if (!credentialsStr) {
      router.push('/install/step-1');
      return;
    }

    try {
      const creds = JSON.parse(credentialsStr);
      setCredentials(creds);
    } catch (error) {
      console.error('Error parsing credentials:', error);
      router.push('/install/step-1');
    }
  }, [router]);

  const storagePolicySQL = `-- Storage Policies for media bucket
-- Note: These policies allow authenticated users to manage media files

-- Policy: Authenticated users can read all files in media bucket
CREATE POLICY "Authenticated users can read media files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'media');

-- Policy: Authenticated users can upload files to media bucket
CREATE POLICY "Authenticated users can upload media files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Policy: Authenticated users can update their own files
CREATE POLICY "Authenticated users can update media files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

-- Policy: Authenticated users can delete files
CREATE POLICY "Authenticated users can delete media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');`;

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleContinue = () => {
    if (bucketCreated && policiesApplied) {
      router.push('/install/step-5');
    }
  };

  const handleBack = () => {
    router.push('/install/step-3');
  };

  if (!credentials) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <ImageIcon className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            Setup Media Storage
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Create a storage bucket in Supabase for managing your media files (images, videos, documents).
          </p>
        </div>

        {/* Info Box */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <FolderOpen className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">What is Media Storage?</p>
              <p className="mt-1 text-sm text-blue-700">
                The media storage bucket will store all your uploaded files including images, videos, documents, and other media assets.
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Create Storage Bucket */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
              1
            </div>
            <h3 className="text-base font-semibold text-stone-900">
              Create Storage Bucket
            </h3>
          </div>

          <div className="ml-8 space-y-3">
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <p className="mb-3 text-sm text-stone-700">
                Follow these steps in your Supabase Dashboard:
              </p>
              <ol className="space-y-2 text-sm text-stone-700">
                <li className="flex items-start gap-2">
                  <span className="font-medium">1.</span>
                  <span>Go to <strong>Storage</strong> section in your Supabase Dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">2.</span>
                  <span>Click <strong>New bucket</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">3.</span>
                  <span>Name the bucket: <code className="rounded bg-stone-200 px-1.5 py-0.5 font-mono text-xs">media</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">4.</span>
                  <span>Enable <strong>Public bucket</strong> option</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">5.</span>
                  <span>Click <strong>Create bucket</strong></span>
                </li>
              </ol>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-3">
              <a
                href={`${credentials.supabaseUrl.replace('.supabase.co', '.supabase.co/project/')}/storage/buckets`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 cursor-pointer"
              >
                Open Supabase Storage
                <ExternalLink className="h-4 w-4" />
              </a>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bucket-created"
                  checked={bucketCreated}
                  onChange={(e) => setBucketCreated(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-purple-600 focus:ring-purple-600 cursor-pointer"
                />
                <label htmlFor="bucket-created" className="text-sm font-medium text-stone-700 cursor-pointer">
                  I've created the bucket
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Apply Storage Policies */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
              2
            </div>
            <h3 className="text-base font-semibold text-stone-900">
              Apply Storage Policies
            </h3>
          </div>

          <div className="ml-8 space-y-3">
            <p className="text-sm text-stone-700">
              Copy and run the SQL below in your Supabase SQL Editor to set up storage policies:
            </p>

            <div className="relative">
              <div className="rounded-lg border border-stone-300 bg-stone-900 p-4">
                <pre className="overflow-x-auto text-xs text-stone-100 font-mono">
                  {storagePolicySQL}
                </pre>
              </div>
              <button
                onClick={() => copyToClipboard(storagePolicySQL, 'sql')}
                className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-stone-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-600 cursor-pointer transition-colors"
              >
                {copiedField === 'sql' ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy SQL
                  </>
                )}
              </button>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-start gap-2">
                <Code className="h-4 w-4 flex-shrink-0 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium text-amber-900">How to run the SQL:</p>
                  <ol className="mt-1 space-y-1">
                    <li>1. Go to <strong>SQL Editor</strong> in Supabase Dashboard</li>
                    <li>2. Paste the copied SQL</li>
                    <li>3. Click <strong>Run</strong></li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-3">
              <a
                href={`${credentials.supabaseUrl.replace('.supabase.co', '.supabase.co/project/')}/sql/new`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 cursor-pointer"
              >
                Open SQL Editor
                <ExternalLink className="h-4 w-4" />
              </a>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="policies-applied"
                  checked={policiesApplied}
                  onChange={(e) => setPoliciesApplied(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-purple-600 focus:ring-purple-600 cursor-pointer"
                />
                <label htmlFor="policies-applied" className="text-sm font-medium text-stone-700 cursor-pointer">
                  I've applied the policies
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {bucketCreated && policiesApplied && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">Media Storage Setup Complete!</p>
              <p className="mt-0.5 text-sm text-green-700">
                Your media storage bucket has been created and configured. You can now proceed to the next step.
              </p>
            </div>
          </div>
        )}

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
            disabled={!bucketCreated || !policiesApplied}
            className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
