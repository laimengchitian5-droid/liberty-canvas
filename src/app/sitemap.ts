import type { MetadataRoute } from "next";
import { listIndexableLandingPages } from "@/lib/landing/landingCatalog";
import { LANDING_LOCALES } from "@/lib/landing/landingLocales";
import { listMergedPlugDiagnosisSlugs } from "@/lib/builder/plugCatalog";
import { buildDiagnosisResultPageUrl } from "@/lib/diagnosis/share";
import { listPlugDiagnosisSlugs } from "@/config/diagnoses";
import { listDiagnoses } from "@/lib/rubel/repository";
import { PERSONALITY_CATEGORIES } from "@/types/diagnosis";
import { buildAppPageUrl, buildQuizPageUrl, getSiteUrl } from "@/lib/site/url";
import { resolveBrandPath } from "@/lib/brand/urlResolver";
import { buildStationSitemapEntries } from "@/lib/station/buildStationSitemapEntries";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  let plugPlayRoutes: MetadataRoute.Sitemap = [];

  try {
    const plugSlugs = await listMergedPlugDiagnosisSlugs();
    plugPlayRoutes = plugSlugs.flatMap((slug) => [
      {
        url: `${siteUrl}/diagnosis/play/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.93,
      },
      {
        url: `${siteUrl}/diagnosis/play/${slug}/result`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.88,
      },
    ]);
  } catch (error) {
    console.error("[sitemap] merged plug routes fallback:", error);
    plugPlayRoutes = listPlugDiagnosisSlugs().flatMap((slug) => [
      {
        url: `${siteUrl}/diagnosis/play/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.93,
      },
      {
        url: `${siteUrl}/diagnosis/play/${slug}/result`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.88,
      },
    ]);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...LANDING_LOCALES.map((locale) => ({
      url: `${siteUrl}/discover/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...listIndexableLandingPages().map((page) => ({
      url: page.absoluteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.88,
    })),
    {
      url: `${siteUrl}${resolveBrandPath("liberty-play", "hub")}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/create`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.94,
    },
    {
      url: `${siteUrl}/diagnosis`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...PERSONALITY_CATEGORIES.map((category) => ({
      url: buildDiagnosisResultPageUrl(category),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...buildStationSitemapEntries(siteUrl),
  ];

  let rubelPlayRoutes: MetadataRoute.Sitemap = [];

  try {
    const diagnoses = await listDiagnoses();
    rubelPlayRoutes = diagnoses.map((diagnosis) => ({
      url: `${siteUrl}/play/${diagnosis.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.92,
    }));
  } catch (error) {
    console.error("[sitemap] rubel play routes skipped:", error);
  }

  try {
    const { listApps } = await import("@/lib/apps/repository");
    const apps = await listApps();

    const appRoutes: MetadataRoute.Sitemap = apps.map((app) => ({
      url: buildAppPageUrl(app.id),
      lastModified: new Date(app.updatedAt || Date.now()),
      changeFrequency: "weekly",
      priority: 0.5,
    }));

    const legacyQuizRoutes: MetadataRoute.Sitemap = apps
      .filter((app) => app.appType === "assessment")
      .map((app) => ({
        url: buildQuizPageUrl(app.id),
        lastModified: new Date(app.updatedAt || Date.now()),
        changeFrequency: "weekly",
        priority: 0.45,
      }));

    return [
      ...staticRoutes,
      ...plugPlayRoutes,
      ...rubelPlayRoutes,
      ...appRoutes,
      ...legacyQuizRoutes,
    ];
  } catch (error) {
    console.error("[sitemap] dynamic app routes skipped:", error);
    return [...staticRoutes, ...plugPlayRoutes, ...rubelPlayRoutes];
  }
}
