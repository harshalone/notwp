'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to step 1
    // The step will check if installation is already complete
    router.push('/install/step-1');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900"></div>
        </div>
        <p className="text-sm text-stone-600">Redirecting to installation...</p>
      </div>
    </div>
  );
}
