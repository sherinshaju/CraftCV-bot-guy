import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumemaker.botandguy.com';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Dashboard | Manage Your Resumes — CraftCV',
  description:
    'Your CraftCV resume dashboard. Create new resumes, use the AI builder, check ATS scores, edit saved CVs, and download PDF exports — all in one place.',
  alternates: {
    canonical: `${appUrl}/dashboard`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${appUrl}/dashboard`,
    siteName: 'CraftCV by Bot&Guy',
    title: 'Dashboard | Manage Your Resumes — CraftCV',
    description:
      'Your personal resume dashboard. Build, edit, duplicate and export professional ATS-ready resumes.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CraftCV Dashboard — Build and Manage Your Resumes',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@botandguy',
    creator: '@botandguy',
    title: 'Dashboard | Manage Your Resumes — CraftCV',
    description:
      'Create, edit, and download your professional ATS-ready resumes from your CraftCV dashboard.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
