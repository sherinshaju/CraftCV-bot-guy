import { MetadataRoute } from 'next';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumemaker.botandguy.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/templates', '/auth/register'],
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/api/',
          '/auth/callback',
        ],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
    host: appUrl,
  };
}
