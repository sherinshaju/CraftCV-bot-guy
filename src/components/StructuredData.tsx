import Script from 'next/script';

export function StructuredData() {
  const websiteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumemaker.botandguy.com';

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'CraftCV - Free ATS Resume Builder, CV Maker & Resume Creator',
    'alternateName': [
      'CraftCV',
      'Free Resume Builder',
      'CV Builder',
      'Resume Maker',
      'Free CV Creator',
      'CraftCV Bot&Guy',
      'ATS Resume Generator',
    ],
    'url': websiteUrl,
    'description':
      '100% Free ATS Resume Builder, Online CV Maker & Resume Creator. Build job-winning, professional ATS-friendly resumes for global and regional careers with live preview and instant vector PDF export by Bot&Guy.',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'All',
    'browserRequirements': 'Requires HTML5 support',
    'offers': [
      {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
      {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'AED',
      },
    ],
    'author': {
      '@type': 'Organization',
      'name': 'Bot&Guy',
      'url': 'https://botandguy.com',
      'areaServed': 'Global',
    },
    'featureList': [
      '100% Free ATS-Compliant Resume Parsing & Structuring',
      'Real-Time Multi-Page Visual Preview',
      'Custom Margin & Paper Size Controls (A4, Letter, Legal)',
      'Pixel-Perfect High-Res PDF Download',
      'Drag & Drop Section Reordering',
      'Curated Professional Resume Templates',
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'CraftCV by Bot&Guy',
    'url': websiteUrl,
    'logo': `${websiteUrl}/logo.png`,
    'sameAs': ['https://botandguy.com'],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is the best resume format to land interviews globally?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Top employers and recruiters globally rely on Applicant Tracking Systems (like Workday, Taleo, Greenhouse, Lever, and LinkedIn). The best format is a clean, structured 1 to 2 page resume with standard font hierarchies, quantified achievements, and clear section headings. CraftCV templates are pre-built to pass all major ATS filters seamlessly.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Will my resume pass Applicant Tracking Systems (ATS) worldwide?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes! CraftCV uses clean semantic markup and standardized layouts verified against popular ATS software used globally, including Workday, Taleo, SuccessFactors, Greenhouse, Lever, and LinkedIn recruiter portals.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Can I export high-quality PDF resumes for free?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Absolutely. CraftCV allows job seekers worldwide to design, preview, and download vector-based pixel-perfect PDFs ready for direct online submission or email applications.',
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
