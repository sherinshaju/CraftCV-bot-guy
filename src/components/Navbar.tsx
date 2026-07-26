'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, LayoutDashboard, LogOut, User } from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#0c0c0c] p-1.5 shadow-md transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="CraftCV Logo"
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-[#0c0c0c] tracking-tight leading-none">
              Craft<span className="text-[#febc04]">CV</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
              by Bot&amp;Guy
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="/#features" className="hover:text-[#0c0c0c] transition-colors">
            Features
          </Link>
          <Link href="/#templates" className="hover:text-[#0c0c0c] transition-colors">
            Templates
          </Link>
          <Link href="/#pricing" className="hover:text-[#0c0c0c] transition-colors">
            Pricing
          </Link>
          <Link href="/#faq" className="hover:text-[#0c0c0c] transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="default" className="gap-2">
                  <LayoutDashboard className="h-4 w-4 text-[#febc04]" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                title="Sign Out"
                className="text-slate-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-slate-700 font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="accent" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Build Resume
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
