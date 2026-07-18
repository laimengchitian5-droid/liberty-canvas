import { BRAND_LANDING_SLUG } from "@/lib/landing/brandLandingSlug";
import {
  listAllLandingPages,
  listLandingStaticParams,
  type LandingPageDefinition,
} from "@/lib/landing/landingCatalog";
import {
  parsePseoManifestEntry,
  type PseoManifestEntry,
  type PseoPageSurface,
  type PseoRouteParams,
} from "@/types/pseoManifest";

/**
 * Station → Discover pSEO projection engine.
 *
 * Source of truth: `listAllLandingPages()` / legal-safe Discover copy + `plugPlayPath`.
 * Tracking for first-party funnels lives in Discover `ref` / analytics — not outbound
 * affiliate query strings on third-party assessment vendors.
 *
 * Rejected sketch defects (do not reintroduce):
 * - `@/src/types` import path · deprecated `PageMetadata` + `targetRedirectUrl`
 * - `BASE_REDIRECT_URLS` → `16personalities.com` (or any external assessment sink)
 * - Hand-authored nested `ReadonlyMap` “197-country” keyword registry
 * - Invented express slugs (`mind-explorer`, `global-identity-core`, …)
 * - Broken nested Map typing on the `en` branch of sketch registries
 */

const CELL_SEP = "\u0000";

function cellKey(locale: string, slug: string): string {
  return `${locale}${CELL_SEP}${slug}`;
}

/** Last-resort first-party cell — never an external assessment vendor. */
const SAFE_FALLBACK_ENTRY: PseoManifestEntry = {
  locale: "en",
  slug: BRAND_LANDING_SLUG,
  surface: {
    title: "Liberty Canvas — Free AI Personality Discover",
    description:
      "One calm answer routes you to a first-party Liberty diagnosis line. No signup required.",
    h1Title: "Your express personality line is ready",
    ctaText: "Start free diagnosis →",
  },
  destinationPath: "/diagnosis",
};

function projectLandingPage(
  page: LandingPageDefinition,
): PseoManifestEntry | null {
  return parsePseoManifestEntry({
    locale: page.locale,
    slug: page.slug,
    surface: {
      title: page.copy.title,
      description: page.copy.metaDescription,
      h1Title: page.copy.headline,
      ctaText: page.copy.submitLabel,
    },
    destinationPath: page.topic.plugPlayPath,
  });
}

function buildRegistry(): ReadonlyMap<string, PseoManifestEntry> {
  const map = new Map<string, PseoManifestEntry>();

  for (const page of listAllLandingPages()) {
    const entry = projectLandingPage(page);
    if (!entry) {
      console.warn(
        `[pseoManifestEngine] skipped invalid landing cell ${page.locale}/${page.slug}`,
      );
      continue;
    }
    map.set(cellKey(entry.locale, entry.slug), entry);
  }

  if (!map.has(cellKey(SAFE_FALLBACK_ENTRY.locale, SAFE_FALLBACK_ENTRY.slug))) {
    map.set(
      cellKey(SAFE_FALLBACK_ENTRY.locale, SAFE_FALLBACK_ENTRY.slug),
      SAFE_FALLBACK_ENTRY,
    );
  }

  return map;
}

let registryCache: ReadonlyMap<string, PseoManifestEntry> | null = null;

function getRegistry(): ReadonlyMap<string, PseoManifestEntry> {
  if (registryCache === null) {
    registryCache = buildRegistry();
  }
  return registryCache;
}

/**
 * O(1) lookup: exact locale×slug → same slug in `en` → brand fallback.
 * Always returns a Zod-validated first-party manifest row.
 */
export function getPseoManifestEntry(
  locale: string,
  slug: string,
): PseoManifestEntry {
  const registry = getRegistry();
  const normalizedLocale = locale.trim().toLowerCase();
  const normalizedSlug = slug.trim().toLowerCase();

  return (
    registry.get(cellKey(normalizedLocale, normalizedSlug)) ??
    registry.get(cellKey("en", normalizedSlug)) ??
    registry.get(cellKey("en", BRAND_LANDING_SLUG)) ??
    SAFE_FALLBACK_ENTRY
  );
}

/** Surface-only view for callers that do not need the destination path. */
export function getPseoPageSurface(
  locale: string,
  slug: string,
): PseoPageSurface {
  return getPseoManifestEntry(locale, slug).surface;
}

/**
 * Flat static-params list for Next.js `generateStaticParams`.
 * Delegates to the Discover catalog — single source of route identity.
 */
export function generateAllPseoRoutes(): PseoRouteParams[] {
  return listLandingStaticParams();
}

/** @deprecated Prefer {@link getPseoManifestEntry} */
export function getPageMetadata(
  locale: string,
  slug: string,
): PseoManifestEntry {
  return getPseoManifestEntry(locale, slug);
}

/** Test helper — clears the lazy registry between cases. */
export function __resetPseoManifestRegistryForTests(): void {
  registryCache = null;
}
