import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professional Resume Templates | Free ATS Resume Builder & CV Maker',
  description:
    'Explore curated ATS-friendly resume templates. Designed for tech, executive, creative, and academic professionals with instant live preview and vector PDF download.',
  keywords: [
    'Resume Templates',
    'CV Templates',
    'ATS Resume Templates',
    'Free Resume Builder',
    'CV Maker Templates',
    'Executive Resume Template',
    'Tech CV Format',
  ],
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
