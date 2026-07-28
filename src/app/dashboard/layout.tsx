'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Navbar } from '@/components/Navbar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !loading && !user) {
      const currentUrl = window.location.pathname + window.location.search;
      const redirectUrl = currentUrl !== '/dashboard' 
        ? `/auth/login?redirect=${encodeURIComponent(currentUrl)}`
        : '/auth/login';
      router.push(redirectUrl);
    }
  }, [user, loading, initialized, router]);

  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#0c0c0c]" />
          <p className="text-xs font-bold text-slate-500">Loading Resume Maker Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
