import { listIndexableLandingPages } from "@/lib/landing/landingCatalog";
import { LANDING_LOCALES } from "@/lib/landing/landingLocales";
import { listPlugDiagnosisSlugs } from "@/config/diagnoses";
import { SEED_DIAGNOSES } from "@/lib/rubel/seedDiagnoses";
import { PERSONALITY_CATEGORIES } from "@/types/diagnosis";
import { resolveBrandPath } from "@/lib/brand/urlResolver";
import { getSiteUrl } from "@/lib/site/url";

export interface ResubmitSitemapEntry {
  readonly loc: string;
  readonly changefreq: "daily" | "weekly" | "monthly";
  readonly priority: number;
}

/**
 * Static-safe URL set for GSC resubmission after production deploy.
 * Excludes upcoming specialty landings (noindex) and dynamic apps.
 */
export function buildResubmitSitemapEntries(
  siteUrl = getSiteUrl(),
): readonly ResubmitSitemapEntry[] {
  const origin = siteUrl.replace(/\/$/, "");
  const entries: ResubmitSitemapEntry[] = [
    { loc: origin, changefreq: "daily", priority: 1 },
    { loc: `${origin}/discover`, changefreq: "weekly", priority: 0.9 },
    {
      loc: `${origin}${resolveBrandPath("liberty-play", "hub")}`,
      changefreq: "weekly",
      priority: 0.9,
    },
    { loc: `${origin}/create`, changefreq: "weekly", priority: 0.95 },
    { loc: `${origin}/chat`, changefreq: "weekly", priority: 0.94 },
    { loc: `${origin}/diagnosis`, changefreq: "weekly", priority: 0.7 },
  ];

  for (const locale of LANDING_LOCALES) {
    entries.push({
      loc: `${origin}/discover/${locale}`,
      changefreq: "weekly",
      priority: 0.85,
    });
  }

  for (const page of listIndexableLandingPages()) {
    entries.push({
      loc: `${origin}/discover/${page.locale}/${page.slug}`,
      changefreq: "weekly",
      priority: 0.88,
    });
  }

  for (const slug of listPlugDiagnosisSlugs()) {
    entries.push({
      loc: `${origin}/diagnosis/play/${slug}`,
      changefreq: "weekly",
      priority: 0.93,
    });
  }

  for (const diagnosis of SEED_DIAGNOSES) {
    entries.push({
      loc: `${origin}/play/${diagnosis.id}`,
      changefreq: "weekly",
      priority: 0.92,
    });
  }

  for (const category of PERSONALITY_CATEGORIES) {
    entries.push({
      loc: `${origin}/diagnosis/result/${category}`,
      changefreq: "monthly",
      priority: 0.6,
    });
  }

  const deduped = new Map<string, ResubmitSitemapEntry>();
  for (const entry of entries) {
    deduped.set(entry.loc, entry);
  }

  return [...deduped.values()].sort((a, b) => a.loc.localeCompare(b.loc));
}

export function renderResubmitSitemapXml(
  entries: readonly ResubmitSitemapEntry[],
  lastmod = new Date().toISOString().slice(0, 10),
): string {
  const body = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
