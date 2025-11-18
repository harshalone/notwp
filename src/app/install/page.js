'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkInstallation, getCachedInstallationStatus } from '@/lib/installation-check';

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verify() {
      // First check cache for immediate redirect
      const cachedStatus = getCachedInstallationStatus();

      if (cachedStatus === true) {
        // Likely installed, verify with API
        const isInstalled = await checkInstallation();
        if (isInstalled) {
          router.push('/');
          return;
        }
      }

      // Not installed, redirect to step 1
      router.push('/install/step-1');
      setChecking(false);
    }

    verify();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900"></div>
          </div>
          <p className="text-sm text-stone-600">Checking installation status...</p>
        </div>
      </div>
    );
  }

  return null;
}
