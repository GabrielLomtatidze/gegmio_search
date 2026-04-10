import type { MetadataRoute } from "next";

const baseUrl = "https://gegmio.com";
const locales = ["ka", "en"];

type Business = {
  id: string;
  updatedAt?: string;
};

async function getBusinesses(): Promise<Business[]> {
  try {
    const res = await fetch(`${baseUrl}/api/business`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    return await res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const businesses = await getBusinesses();

  const staticRoutes = [
    "/main",
    "/page/main",
    "/page/favorite",
    "/page/profile",
    "/page/privacypolicy",
    "/page/terms",
    "/auth/login",
    "/auth/registration",
    "/auth/otp",
    "/auth/changePassword",
  ];

  const homePages = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  const staticPages = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  const businessPages = locales.flatMap((locale) =>
    businesses.map((b) => ({
      url: `${baseUrl}/${locale}/page/business/${b.id}`,
      lastModified: new Date(b.updatedAt ?? new Date()),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }))
  );

  return [...homePages, ...staticPages, ...businessPages];
}