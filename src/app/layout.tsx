import type { Metadata } from 'next';
import './globals.css';
import { AuthInitializer } from '@/components/AuthInitializer';

export const metadata: Metadata = {
  title: 'CraftCV by Bot&Guy | AI-Powered ATS Resume Builder',
  description: 'Create professional, ATS-friendly resumes in minutes with live real-time preview, multi-page page breaks, customizable templates, and pixel-perfect PDF export.',
  keywords: ['Resume Builder', 'CV Generator', 'ATS Resume', 'Bot&Guy', 'Career Tools', 'CraftCV'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#F9F9F9] text-[#0C0C0C] antialiased flex flex-col">
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
