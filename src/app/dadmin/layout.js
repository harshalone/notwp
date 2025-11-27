'use client';

import { AuthProvider, useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function DadminContent({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showLoading, setShowLoading] = useState(true);

  // Check if current path is an auth route
  const isAuthRoute = pathname?.startsWith('/dadmin/auth');

  useEffect(() => {
    // Skip auth check for auth routes
    if (isAuthRoute) {
      setShowLoading(false);
      return;
    }

    // Wait 3 seconds for SSR to verify auth
    const timer = setTimeout(() => {
      setShowLoading(false);
      if (!loading && !user) {
        router.push('/dadmin/auth/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading, user, router, isAuthRoute]);

  // For auth routes, render immediately without auth check
  if (isAuthRoute) {
    return <>{children}</>;
  }

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
