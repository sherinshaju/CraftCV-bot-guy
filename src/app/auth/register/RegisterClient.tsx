'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterClient() {
  const router = useRouter();
  const { user, initialized, loading: authLoading } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialized && !authLoading && user) {
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get('redirect') || '/dashboard';
      router.push(redirectPath);
    }
  }, [user, initialized, authLoading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get('redirect') || '/dashboard';
        router.push(redirectPath);
      } else {
        setSuccessMsg('Account created successfully! Please check your email to verify your account or log in.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0c0c0c] p-1.5 flex items-center justify-center">
              <Image src="/logo.png" alt="CraftCV Logo" width={32} height={32} className="object-contain" />
            </div>
            <span className="font-extrabold text-2xl text-[#0c0c0c] tracking-tight">
              Craft<span className="text-[#febc04]">CV</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#0c0c0c] pt-2">Create Free Account</h2>
          <p className="text-xs text-slate-500">Start building professional resumes in minutes</p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg ? (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">{successMsg}</p>
            <Link href="/auth/login">
              <Button variant="accent" className="w-full">Proceed to Sign In</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <Button variant="accent" size="lg" type="submit" disabled={loading} className="w-full py-6 text-sm font-bold shadow-md">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-[#0c0c0c] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
