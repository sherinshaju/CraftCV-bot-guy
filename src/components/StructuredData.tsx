import Script from 'next/script';

export function StructuredData() {
  const websiteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://craftcv.botandguy.com';

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'CraftCV Dubai - #1 ATS Resume Builder & CV Maker',
    'alternateName': ['CraftCV UAE', 'CraftCV Bot&Guy', 'Dubai ATS Resume Generator'],
    'url': websiteUrl,
    'description': 'Build professional, ATS-friendly resumes & CVs tailored for Dubai, Abu Dhabi, UAE & Gulf job markets with real-time multi-page previews and instant PDF exports.',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'All',
    'browserRequirements': 'Requires HTML5 support',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'AED',
    },
    'author': {
      '@type': 'Organization',
      'name': 'Bot&Guy',
      'url': 'https://botandguy.com',
      'areaServed': [
        {
          '@type': 'Country',
          'name': 'United Arab Emirates',
        },
        {
          '@type': 'City',
          'name': 'Dubai',
        },
        {
          '@type': 'City',
          'name': 'Abu Dhabi',
        },
      ],
    },
    'featureList': [
      'Dubai & UAE ATS-Compliant Resume Parsing',
      'Real-Time Multi-Page Visual Preview',
      'Custom Margin & Paper Size Controls (A4, Letter)',
      'Pixel-Perfect PDF Download',
      'Drag & Drop Section Reordering',
      'Multi-Language & GCC Career Template Styles',
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'CraftCV by Bot&Guy',
    'url': websiteUrl,
    'logo': `${websiteUrl}/logo.png`,
    'sameAs': [
      'https://botandguy.com',
    ],
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Dubai',
      'addressCountry': 'AE',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is the best CV format for jobs in Dubai and the UAE?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The ideal Dubai CV format is an ATS-friendly, clean structured layout with clear section headers, highlighted professional accomplishments, contact information, and relevant skills. CraftCV provides pre-built templates specifically tuned to pass ATS filters used by top UAE recruiters, government entities, and MNCs.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Is CraftCV ATS-friendly for Dubai applicant tracking systems?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes! CraftCV uses clean semantic markup and standardized layouts verified against popular ATS software used across the UAE and GCC, including Taleo, Workday, SuccessFactors, Bayt, and LinkedIn recruiter portals.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Can I export high-quality PDF resumes for free in Dubai?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Absolutely. CraftCV allows job seekers in Dubai and worldwide to design, preview, and download vector-based pixel-perfect PDFs ready for direct online submission or email applications.',
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
