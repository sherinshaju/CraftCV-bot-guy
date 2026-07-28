import type { Metadata } from 'next';
import AtsScoreClient from './AtsScoreClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumemaker.botandguy.com';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'ATS Score Checker | Scan & Optimize Your Resume — Resume Maker',
  description:
    'Free ATS resume score checker by Resume Maker. Paste your resume and job description to get an instant ATS match score, keyword analysis, missing skills, and AI-powered optimization suggestions.',
  keywords: [
    'ATS Score Checker',
    'Resume ATS Scanner',
    'ATS Resume Optimizer',
    'Resume Keyword Checker',
    'Free ATS Tool',
    'Resume Job Match Score',
    'ATS Compatibility Check',
    'Resume Maker ATS',
  ],
  alternates: {
    canonical: `${appUrl}/dashboard/ats-score`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${appUrl}/dashboard/ats-score`,
    siteName: 'Resume Maker by Bot&Guy',
    title: 'ATS Score Checker | Scan & Optimize Your Resume — Resume Maker',
    description:
      'Get an instant ATS compatibility score for your resume vs any job description. Find missing keywords and optimize your CV with AI.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Resume Maker ATS Score Checker — Optimize Your Resume',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@botandguy',
    creator: '@botandguy',
    title: 'Free ATS Score Checker — Resume Maker',
    description:
      'Instantly check how well your resume matches a job description. Get keyword insights & AI optimization.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AtsScorePage() {
  return <AtsScoreClient />;
}
