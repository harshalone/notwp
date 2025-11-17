'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCachedInstallationStatus } from '@/lib/installation-check';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if installation is complete
    const isInstalled = getCachedInstallationStatus();

    if (!isInstalled) {
      // Not installed, redirect to onboarding
      router.push('/onboarding');
    } else {
      // Installed - show admin dashboard (to be implemented)
      // For now, just show a placeholder
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900">Admin Dashboard</h1>
        <p className="mt-2 text-stone-600">Coming soon...</p>
      </div>
    </div>
  );
}
