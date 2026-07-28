import type { Metadata } from 'next';
import RegisterClient from './RegisterClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumemaker.botandguy.com';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Sign Up | Create a Free Resume Maker Account — ATS Resume Builder',
  description:
    'Create your free Resume Maker account and start building ATS-friendly, professional resumes in minutes. Access 20+ templates, AI builder, ATS checker and instant PDF export.',
  alternates: {
    canonical: `${appUrl}/auth/register`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${appUrl}/auth/register`,
    siteName: 'Resume Maker by Bot&Guy',
    title: 'Sign Up Free | Resume Maker — ATS Resume Builder',
    description:
      'Create your free Resume Maker account. Get access to 20+ ATS-friendly resume templates, AI optimization and instant PDF export.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sign Up for Resume Maker — Free ATS Resume Builder',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@botandguy',
    creator: '@botandguy',
    title: 'Sign Up Free | Resume Maker — ATS Resume Builder',
    description: 'Join Resume Maker free and build your professional ATS-ready resume in minutes.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
