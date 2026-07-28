import type { Metadata } from 'next';
import LandingPageClient from './LandingPageClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumemaker.botandguy.com';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Resume Maker | Free ATS Resume Builder, Online CV Maker & Resume Creator',
  description:
    '100% Free ATS Resume Builder & Online CV Maker by Bot&Guy. Create job-winning, ATS-friendly professional resumes with 20+ templates, real-time multi-page preview, and instant pixel-perfect PDF export. Build your resume for free today.',
  keywords: [
    'Free Resume Builder',
    'ATS Resume Builder',
    'Online CV Maker',
    'Free CV Creator',
    'Professional Resume Maker',
    'Resume Templates',
    'PDF Resume Download',
    'Job Winning Resume',
    'ATS Friendly Resume',
    'Best Free Resume Builder 2024',
    'Remote Job Resume',
    'Resume Maker',
    'Bot&Guy',
  ],
  alternates: {
    canonical: appUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    siteName: 'Resume Maker by Bot&Guy',
    title: 'Resume Maker | Free ATS Resume Builder & Online CV Maker',
    description:
      'Build job-winning ATS-friendly resumes for free. 20+ professional templates, live preview, AI optimization, and instant PDF export — by Bot&Guy.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Resume Maker — Free ATS Resume Builder & Online CV Maker by Bot&Guy',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@botandguy',
    creator: '@botandguy',
    title: 'Resume Maker | Free ATS Resume Builder & CV Maker',
    description:
      'Build ATS-friendly, job-winning resumes for free. 20+ templates, AI optimization & instant PDF — by Bot&Guy.',
    images: ['/twitter-image.png'],
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
};

export default function HomePage() {
  return <LandingPageClient />;
}
