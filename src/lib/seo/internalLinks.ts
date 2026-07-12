import type { LandingLocale } from "@/lib/landing/landingLocales";
import {
  getLandingTopic,
  LANDING_TOPICS,
  type LandingTopicConfig,
  type LandingTopicSlug,
} from "@/lib/landing/landingTopics";
import { buildLandingPath } from "@/lib/landing/landingCatalog";

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
        entry.searchIntent === topic.searchIntent),
  ).slice(0, limit);

  return peers.map((entry) => ({
    slug: entry.slug,
    href: buildLandingPath(locale, entry.slug),
    label: entry.slug.replace(/-/g, " "),
    plugPlayPath: entry.plugPlayPath,
  }));
}

export function listPillarLinks(locale: LandingLocale): Array<{
  href: string;
  label: string;
}> {
  return [
    { href: `/discover/${locale}`, label: "Discover Hub" },
    { href: "/diagnosis", label: "Diagnosis Catalog" },
    { href: "/", label: "LibertyCanvas Home" },
  ];
}

export function resolveTopicSearchIntent(
  topic: LandingTopicConfig,
): LandingTopicConfig["searchIntent"] {
  return topic.searchIntent ?? "informational";
}
