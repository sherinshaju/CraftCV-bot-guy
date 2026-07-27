import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#0c0c0c] text-slate-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/10 p-1.5 flex items-center justify-center">
                <Image src="/logo.png" alt="CraftCV Logo" width={32} height={32} className="object-contain" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Craft<span className="text-[#febc04]">CV</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Build ATS-ready, job-winning professional resumes in minutes with live real-time previews and crisp PDF exports.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/#features" className="hover:text-white transition-colors">Resume Builder</Link></li>
              <li><Link href="/#templates" className="hover:text-white transition-colors">Resume Templates</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Resume Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ATS Best Practices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cover Letter Builder</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career Advice</a></li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">
              <a href="https://botandguy.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#febc04] transition-colors">Bot&amp;Guy</a>
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="https://botandguy.com/about" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">About Bot&amp;Guy</a></li>
              <li><a href="https://botandguy.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="https://botandguy.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="https://botandguy.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CraftCV by <a href="https://botandguy.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline transition-colors">Bot&amp;Guy</a>. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="h-3.5 w-3.5 text-[#febc04] fill-[#febc04]" /> by <a href="https://botandguy.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline transition-colors">Bot&amp;Guy Team</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
