import { MetadataRoute } from "next";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://resumemaker.botandguy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${appUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${appUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${appUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
