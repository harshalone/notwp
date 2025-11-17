'use client';

import { AuthProvider } from '@/lib/auth-context';

export default function DadminLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
