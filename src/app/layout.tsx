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
    default: 'CraftCV | Free ATS Resume Builder, Online CV Maker & Resume Creator',
    template: '%s | CraftCV - Free ATS Resume Builder & CV Maker',
  },
  description:
    '100% Free ATS Resume Builder, Online CV Maker & Resume Creator. Create job-winning, professional ATS-friendly resumes for global & regional careers with real-time multi-page preview and instant pixel-perfect PDF export by Bot&Guy.',
  keywords: [
    'Free Resume Builder',
    'CV Builder',
    'Resume Maker',
    'Free CV Creator',
    'ATS Resume Builder',
    'Online Resume Builder',
    'Professional Resume Maker',
    'Free Resume Generator',
    'ATS CV Maker',
    'Best Free CV Maker',
    'Job Winning Resume Templates',
    'PDF Resume Maker',
    'Dubai Resume Builder',
    'UAE CV Format',
    'CraftCV Bot&Guy',
  ],
  authors: [{ name: 'Bot&Guy', url: 'https://botandguy.com' }],
  creator: 'Bot&Guy',
  publisher: 'Bot&Guy',
  applicationName: 'CraftCV',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon.png',
      },
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['en_AE', 'ar_AE'],
    url: appUrl,
    siteName: 'CraftCV by Bot&Guy',
    title: 'CraftCV | Free ATS Resume Builder, CV Maker & Resume Creator',
    description:
      '100% Free ATS Resume Builder & Online CV Creator. Build job-winning, recruiter-approved resumes with live preview & vector PDF export.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CraftCV - Free ATS Resume Builder & Online CV Maker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CraftCV | Free ATS Resume Builder & CV Maker',
    description:
      '100% Free ATS Resume Builder & Online CV Creator by Bot&Guy.',
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
      'en-US': appUrl,
      'en-AE': appUrl,
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0C0C0C" />
        <StructuredData />
      </head>
      <body className="min-h-screen bg-[#F9F9F9] text-[#0C0C0C] antialiased flex flex-col">
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}

