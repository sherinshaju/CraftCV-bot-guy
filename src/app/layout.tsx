import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthInitializer } from '@/components/AuthInitializer';
import { StructuredData } from '@/components/StructuredData';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://craftcv.botandguy.com';

export const viewport: Viewport = {
  themeColor: '#0C0C0C',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'CraftCV Dubai | #1 ATS Resume Builder & CV Maker in Dubai & UAE',
    template: '%s | CraftCV Dubai',
  },
  description:
    'Build ATS-friendly, job-winning resumes & CVs tailored for Dubai, Abu Dhabi, UAE & Gulf job markets. Free templates, instant multi-page preview, and pixel-perfect PDF export by Bot&Guy.',
  keywords: [
    'Dubai Resume Builder',
    'UAE CV Format',
    'ATS Resume Builder Dubai',
    'Abu Dhabi CV Maker',
    'GCC Career Tools',
    'CraftCV Bot&Guy',
    'Dubai Job Application CV',
    'UAE Resume Generator',
    'MOHRE Resume Format',
    'Middle East CV Templates',
    'Free CV Maker Dubai',
    'Dubai Executive Resume',
  ],
  authors: [{ name: 'Bot&Guy', url: 'https://botandguy.com' }],
  creator: 'Bot&Guy',
  publisher: 'Bot&Guy',
  applicationName: 'CraftCV Dubai',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    alternateLocale: ['en_US', 'ar_AE'],
    url: appUrl,
    siteName: 'CraftCV by Bot&Guy',
    title: 'CraftCV Dubai | #1 ATS Resume Builder & CV Maker in UAE',
    description:
      'Create top-ranking, ATS-tested CVs tailored for Dubai & UAE recruiters. Real-time preview & instant PDF export.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CraftCV Dubai - #1 ATS Resume Builder & CV Maker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CraftCV Dubai | #1 ATS Resume Builder & CV Maker in UAE',
    description:
      'Build ATS-friendly, job-winning resumes tailored for Dubai & UAE job markets.',
    images: ['/twitter-image.png'],
    creator: '@botandguy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: appUrl,
    languages: {
      'en-AE': appUrl,
      'en-US': appUrl,
      'ar-AE': appUrl,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <StructuredData />
      </head>
      <body className="min-h-screen bg-[#F9F9F9] text-[#0C0C0C] antialiased flex flex-col">
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}

