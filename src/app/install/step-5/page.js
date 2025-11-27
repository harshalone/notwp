'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Mail,
  Lock,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export default function Step5Page() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [userUid, setUserUid] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const createAdminAccount = async () => {
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Create service role client for admin operations
      const serviceClient = createClient(
        credentials.supabaseUrl,
        credentials.supabaseServiceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );

      // First, check if user already exists with this email
      const { data: existingUsers, error: listError } = await serviceClient.auth.admin.listUsers();

      if (listError) {
        console.warn('Could not list users:', listError.message);
      }

      const existingUser = existingUsers?.users?.find(u => u.email === email);

      let userUidValue;

      if (existingUser) {
        // User already exists, use their ID
        console.log('User already exists, using existing user:', existingUser.id);
        userUidValue = existingUser.id;

        // Try to update their password and confirm email
        const { error: updateError } = await serviceClient.auth.admin.updateUserById(
          userUidValue,
          {
            password: password,
            email_confirm: true
          }
        );

        if (updateError) {
          console.warn('Could not update existing user:', updateError.message);
        }
      } else {
        // Create new user with service role
        const { data, error: signUpError } = await serviceClient.auth.admin.createUser({
          email: email,
          password: password,
          email_confirm: true,
          user_metadata: {
            installation: true,
            created_via: 'notwp_installer'
          }
        });

        if (signUpError) {
          throw new Error(`Failed to create account: ${signUpError.message}`);
        }

        if (!data.user) {
          throw new Error('Account created but user data is missing');
        }

        userUidValue = data.user.id;
      }

      // Wait for the trigger to execute and copy to nwp_accounts
      let accountData = null;
      let accountError = null;
      let attempts = 0;
      const maxAttempts = 20;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;

        const result = await serviceClient
          .from('nwp_accounts')
          .select('user_uid, email')
          .eq('user_uid', userUidValue)
          .single();

        accountData = result.data;
        accountError = result.error;

        // If we found the record, break out of the loop
        if (accountData && accountData.user_uid) {
          console.log(`Account found after ${attempts} attempts`);
          break;
        }

        console.log(`Attempt ${attempts}: Account not found yet...`);
      }

      if (accountError && accountError.code !== 'PGRST116') {
        throw new Error(`Account created but failed to fetch user data: ${accountError.message}`);
      }

      if (!accountData || !accountData.user_uid) {
        // If trigger didn't work, manually insert the record
        console.warn('Trigger did not execute, manually inserting record...');

        // Check if the record already exists before inserting
        const { data: checkData } = await serviceClient
          .from('nwp_accounts')
          .select('user_uid, email')
          .eq('user_uid', userUidValue)
          .maybeSingle();

        if (checkData) {
          accountData = checkData;
        } else {
          const { data: insertData, error: insertError } = await serviceClient
            .from('nwp_accounts')
            .insert({
              user_uid: userUidValue,
              email: email,
              created_at: new Date().toISOString()
            })
            .select('user_uid, email')
            .single();

          if (insertError) {
            throw new Error(`Failed to create account record: ${insertError.message}`);
          }

          accountData = insertData;
        }
      }

      // Update user role to administrator
      const { error: roleUpdateError } = await serviceClient
        .from('nwp_accounts')
        .update({ role: 'administrator' })
        .eq('user_uid', accountData.user_uid);

      if (roleUpdateError) {
        throw new Error(`Failed to set administrator role: ${roleUpdateError.message}`);
      }

      console.log('User role updated to administrator');

      // Store the user_uid in sessionStorage for Step 6
      sessionStorage.setItem('adminUserUid', accountData.user_uid);
      sessionStorage.setItem('adminEmail', email);

      setUserUid(accountData.user_uid);
      setAccountCreated(true);
    } catch (err) {
      console.error('Account creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create administrator account');
      setAccountCreated(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleContinue = () => {
    if (accountCreated) {
      router.push('/install/step-6');
    }
  };

  const handleBack = () => {
    router.push('/install/step-4');
  };

  if (!credentials) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <UserPlus className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            Create Administrator Account
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Set up your administrator account to manage your NotWP installation.
          </p>
        </div>

        {!accountCreated ? (
          <>
            {/* Form Fields */}
            <div className="mb-5 space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  disabled={isCreating}
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
                  <Lock className="h-4 w-4" />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (min. 6 characters)"
                  disabled={isCreating}
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
                  <Lock className="h-4 w-4" />
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  disabled={isCreating}
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Error</p>
                  <p className="mt-0.5 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">How it works</p>
                  <p className="mt-1 text-sm text-blue-700">
                    When you create an account, it will be automatically synced to your NotWP database via a trigger.
                    Your account will be created in Supabase Auth and copied to the nwp_accounts table.
                  </p>
                </div>
              </div>
            </div>

            {/* Create Account Button */}
            <div className="mb-5">
              <button
                onClick={createAdminAccount}
                disabled={isCreating}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Administrator Account
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Account Created Successfully!</p>
                <p className="mt-0.5 text-sm text-green-700">
                  Your administrator account has been created and synced to the database.
                </p>
              </div>
            </div>

            {/* Display User UID */}
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-semibold text-stone-900">Your Account Details</h3>

              <div className="space-y-3">
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                  <label className="mb-2 flex items-center gap-2 text-xs font-medium text-stone-700">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <code className="block rounded bg-white px-3 py-2 text-sm font-mono text-stone-900 border border-stone-300">
                    {email}
                  </code>
                </div>

                <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                  <label className="mb-2 flex items-center gap-2 text-xs font-medium text-stone-700">
                    <CheckCircle2 className="h-4 w-4" />
                    User UID
                  </label>
                  <code className="block rounded bg-white px-3 py-2 text-sm font-mono text-stone-900 border border-stone-300 break-all">
                    {userUid}
                  </code>
                  <p className="mt-2 text-xs text-stone-600">
                    This is your unique user identifier in the nwp_accounts table.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={isCreating}
            className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!accountCreated || isCreating}
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
