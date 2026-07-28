import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthInitializer } from '@/components/AuthInitializer';
import { StructuredData } from '@/components/StructuredData';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumemaker.botandguy.com';

export const viewport: Viewport = {
  themeColor: '#0C0C0C',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'Resume Maker | Free ATS Resume Builder, Online CV Maker & Resume Creator',
    template: '%s | Resume Maker',
  },
  description:
    '100% Free ATS Resume Builder & Online CV Maker by Bot&Guy. Create job-winning, professional ATS-friendly resumes with 20+ templates, real-time multi-page preview, and instant pixel-perfect PDF export.',
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
    'Resume Maker Bot&Guy',
    'Bot&Guy',
  ],
  authors: [{ name: 'Bot&Guy', url: 'https://botandguy.com' }],
  creator: 'Bot&Guy',
  publisher: 'Bot&Guy',
  applicationName: 'Resume Maker',
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
    url: appUrl,
    siteName: 'Resume Maker by Bot&Guy',
    title: 'Resume Maker | Free ATS Resume Builder, CV Maker & Resume Creator',
    description:
      '100% Free ATS Resume Builder & Online CV Creator. Build job-winning, recruiter-approved resumes with 20+ templates, live preview & instant vector PDF export.',
    images: [
      {
        url: `${appUrl}/og-image.png`,
        secureUrl: `${appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Resume Maker — Free ATS Resume Builder & Online CV Maker by Bot&Guy',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Maker | Free ATS Resume Builder & CV Maker',
    description:
      '100% Free ATS Resume Builder & Online CV Creator by Bot&Guy. Build job-winning resumes with 20+ templates, live preview & instant PDF export.',
    images: [`${appUrl}/twitter-image.png`],
    creator: '@botandguy',
    site: '@botandguy',
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
        {/* Additional OG meta for compatibility with platforms not using Next.js og: */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <StructuredData />
      </head>
      <body className="min-h-screen bg-[#F9F9F9] text-[#0C0C0C] antialiased flex flex-col">
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
