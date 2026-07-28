import type { Metadata } from 'next';
import TemplatesClient from './TemplatesClient';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumemaker.botandguy.com';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Resume Templates | 20+ Free ATS-Friendly CV Templates — Resume Maker',
  description:
    'Browse 20+ free professional ATS-friendly resume templates by Resume Maker. Choose from Minimal, Modern, Executive, Tech, Creative, Academic and more — built to pass ATS screening and impress recruiters.',
  keywords: [
    'Free Resume Templates',
    'ATS Resume Templates',
    'Professional CV Templates',
    'Modern Resume Designs',
    'Best Resume Templates 2024',
    'Free CV Designs',
    'Tech Resume Templates',
    'Executive Resume Templates',
    'Creative Resume Templates',
    'Resume Maker Templates',
  ],
  alternates: {
    canonical: `${appUrl}/templates`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${appUrl}/templates`,
    siteName: 'Resume Maker by Bot&Guy',
    title: 'Resume Templates | 20+ Free ATS-Friendly CV Designs — Resume Maker',
    description:
      '20+ professionally designed, ATS-optimized resume templates. Pick your style, personalize, and export to PDF for free with Resume Maker.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Resume Maker Resume Templates — 20+ Free ATS-Friendly Designs',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@botandguy',
    creator: '@botandguy',
    title: 'Resume Templates | 20+ Free ATS-Friendly Designs — Resume Maker',
    description:
      '20+ free ATS-optimized resume templates to choose from. Personalize & export to PDF instantly.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TemplatesPage() {
  return <TemplatesClient />;
}
