import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";

/**
 * Station sitemap — hub per locale + locale×platform matrix.
 * Canonical shape: /station/[locale] and /station/[locale]/[id]
 * — never /{locale}/station/...
 */
export function buildStationSitemapEntries(
  siteUrl: string,
  lastModified: Date = new Date(),
): MetadataRoute.Sitemap {
  const origin = siteUrl.replace(/\/+$/, "");
  const hubCount = SUPPORTED_LOCALES.length;
  const platformCount =
    SUPPORTED_LOCALES.length * DIAGNOSTIC_PLATFORM_IDS.length;
  const entries: MetadataRoute.Sitemap = new Array(hubCount + platformCount);

  let i = 0;
  for (const locale of SUPPORTED_LOCALES) {
    entries[i] = {
      url: `${origin}/station/${locale}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75,
    };
    i += 1;
  }

  for (const locale of SUPPORTED_LOCALES) {
    for (const id of DIAGNOSTIC_PLATFORM_IDS) {
      entries[i] = {
        url: `${origin}/station/${locale}/${id}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      };
      i += 1;
    }
  }

  return entries;
}
