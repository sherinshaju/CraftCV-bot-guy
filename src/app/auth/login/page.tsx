import type { Metadata } from 'next';
import LoginClient from './LoginClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumemaker.botandguy.com';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Login | Sign In to Resume Maker — Free ATS Resume Builder',
  description:
    'Sign in to your Resume Maker account to access your saved resumes, AI builder, ATS checker, and PDF export tools. Build job-winning resumes for free.',
  alternates: {
    canonical: `${appUrl}/auth/login`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${appUrl}/auth/login`,
    siteName: 'Resume Maker by Bot&Guy',
    title: 'Login | Sign In to Resume Maker',
    description:
      'Sign in to access your Resume Maker dashboard and manage your professional resumes.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Resume Maker Login — Access Your Resume Builder',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@botandguy',
    title: 'Login | Resume Maker — Free ATS Resume Builder',
    description: 'Sign in to Resume Maker and start building your professional resume.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
