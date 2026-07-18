import { BRAND_LANDING_SLUG } from "@/lib/landing/brandLandingSlug";
import { buildLandingPath } from "@/lib/landing/landingCatalog";
import { getLandingCopy } from "@/lib/landing/landingCopy";
import type { LandingLocale } from "@/lib/landing/landingLocales";
import {
  getLandingTopic,
  LANDING_TOPICS,
  type LandingTopicConfig,
  type LandingTopicSlug,
} from "@/lib/landing/landingTopics";

export interface LandingClusterLink {
  slug: LandingTopicSlug;
  href: string;
  label: string;
  plugPlayPath: string;
}

export function listClusterLinksForTopic(
  slug: string,
  locale: LandingLocale,
  limit = 4,
): LandingClusterLink[] {
  const topic = getLandingTopic(slug);

  if (!topic) {
    return [];
  }

  const peers = LANDING_TOPICS.filter(
    (entry) =>
      entry.slug !== topic.slug &&
      (entry.plugPlayPath === topic.plugPlayPath ||
        entry.searchIntent === topic.searchIntent ||
        entry.slug === BRAND_LANDING_SLUG),
  ).slice(0, limit);

  return peers.map((entry) => ({
    slug: entry.slug,
    href: buildLandingPath(locale, entry.slug),
    label: getLandingCopy(entry.slug, locale).keyword,
    plugPlayPath: entry.plugPlayPath,
  }));
}

export function listPillarLinks(locale: LandingLocale): Array<{
  href: string;
  label: string;
}> {
  const brandLabel =
    locale === "ja" ? "LibertyCanvas とは" : "About LibertyCanvas";

  return [
    {
      href: buildLandingPath(locale, BRAND_LANDING_SLUG),
      label: brandLabel,
    },
    {
      href: `/discover/${locale}`,
      label: locale === "ja" ? "診断ディスカバー" : "Discover Hub",
    },
    {
      href: `/diagnosis?lang=${locale}`,
      label: locale === "ja" ? "診断カタログ" : "Diagnosis Catalog",
    },
    { href: "/", label: locale === "ja" ? "ホーム" : "Home" },
  ];
}

export function resolveTopicSearchIntent(
  topic: LandingTopicConfig,
): LandingTopicConfig["searchIntent"] {
  return topic.searchIntent ?? "informational";
}
