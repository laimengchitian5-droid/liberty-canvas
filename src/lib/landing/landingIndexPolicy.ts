import type { LandingTopicSlug } from "@/lib/landing/landingTopics";
import { LANDING_TOPIC_SLUGS } from "@/lib/landing/landingTopics";
import { getSpecialtyCountry } from "@/lib/specialty/globalSpecialtyTaxonomy";
import { WORLD_SPECIALTY_SOUL_SLUG } from "@/lib/specialty/globalSpecialtyTaxonomy";
import { isSpecialtyDeepDiveLive } from "@/lib/specialty/types";

const SPECIALTY_SLUG_TO_COUNTRY = {
  "jp-sakamai-craft": "jp",
  "us-corn-frontier": "us",
  "ca-maple-resilience": "ca",
  "br-terra-roxa-spirit": "br",
  "fr-terroir-poet": "fr",
  "cl-andes-dualcraft": "cl",
  "md-cellar-guardian": "md",
  "pk-fragrant-earth": "pk",
  "uk-maturation-highlander": "uk",
} as const;

export type SpecialtyCountryLandingSlug = keyof typeof SPECIALTY_SLUG_TO_COUNTRY;

export function isSpecialtyCountryLandingSlug(
  slug: string,
): slug is SpecialtyCountryLandingSlug {
  return Object.prototype.hasOwnProperty.call(SPECIALTY_SLUG_TO_COUNTRY, slug);
}

/**
 * Upcoming country landings promise a deep-dive but route to world entry —
 * keep them out of the index until releasePhase flips to live.
 */
export function isUpcomingSpecialtyLandingSlug(slug: string): boolean {
  if (!isSpecialtyCountryLandingSlug(slug)) {
    return false;
  }
  const country = getSpecialtyCountry(SPECIALTY_SLUG_TO_COUNTRY[slug]);
  return !isSpecialtyDeepDiveLive(country.releasePhase);
}

export function shouldIndexLandingSlug(slug: string): boolean {
  return !isUpcomingSpecialtyLandingSlug(slug);
}

/** Canonical consolidation target for upcoming country landings. */
export function resolveLandingCanonicalPath(locale: string, slug: string): string {
  if (isUpcomingSpecialtyLandingSlug(slug)) {
    return `/discover/${locale}/${WORLD_SPECIALTY_SOUL_SLUG}`;
  }
  return `/discover/${locale}/${slug}`;
}

export function listIndexableLandingTopicSlugs(): readonly LandingTopicSlug[] {
  return LANDING_TOPIC_SLUGS.filter((slug) => shouldIndexLandingSlug(slug));
}
