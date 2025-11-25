'use client';

import { AuthProvider, useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function DadminContent({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Wait 3 seconds for SSR to verify auth
    const timer = setTimeout(() => {
      setShowLoading(false);
      if (!loading && !user) {
        router.push('/auth');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading, user, router]);

  if (showLoading) {
    return (
      <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-700 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!loading && !user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

export default function DadminLayout({ children }) {
  return (
    <AuthProvider>
      <DadminContent>{children}</DadminContent>
    </AuthProvider>
  );
}
