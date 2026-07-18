import type { Locale } from "@/lib/i18n/config";
import { normalizeLocaleCandidate } from "@/lib/i18n/resolveAppLocale";
import { isLandingLocale, type LandingLocale } from "@/lib/landing/landingLocales";

export const DISCOVER_FUNNEL_REF_PREFIX = "discover-" as const;
export const DISCOVER_DIRECT_MODE = "direct" as const;

export type DiscoverFunnelSubmitEvent =
  "discover_funnel_submit" | "discover_funnel_direct";

export interface DiscoverFunnelRefParts {
  locale: LandingLocale;
  slug: string;
}

export function buildDiscoverFunnelRef(locale: LandingLocale, slug: string): string {
  const safeSlug = slug.trim().replace(/^\/+|\/+$/g, "");
  return `${DISCOVER_FUNNEL_REF_PREFIX}${locale}-${safeSlug}`;
}

export function isDiscoverFunnelRef(ref: string | null | undefined): ref is string {
  return typeof ref === "string" && ref.startsWith(DISCOVER_FUNNEL_REF_PREFIX);
}

/** Parse `discover-{locale}-{slug}` — locale is the first path segment (no hyphens). */
export function parseDiscoverFunnelRef(
  ref: string | null | undefined,
): DiscoverFunnelRefParts | null {
  if (!isDiscoverFunnelRef(ref)) {
    return null;
  }

  const body = ref.slice(DISCOVER_FUNNEL_REF_PREFIX.length);
  const separator = body.indexOf("-");

  if (separator <= 0 || separator >= body.length - 1) {
    return null;
  }

  const localeCandidate = body.slice(0, separator);
  const slug = body.slice(separator + 1).trim();

  if (!isLandingLocale(localeCandidate) || slug.length === 0) {
    return null;
  }

  return { locale: localeCandidate, slug };
}

export function isDiscoverDirectMode(mode: string | null | undefined): boolean {
  return mode === DISCOVER_DIRECT_MODE;
}

export function resolveHandoffDisplayLocale(
  queryLang: string | null | undefined,
  fallback: Locale,
): Locale {
  const fromQuery = normalizeLocaleCandidate(queryLang);
  return fromQuery ?? fallback;
}

export function toLandingLocale(locale: Locale): LandingLocale | null {
  return isLandingLocale(locale) ? locale : null;
}

export function buildDiscoverPlayHandoffUrl(
  plugPath: string,
  locale: LandingLocale,
  slug: string,
  options?: { direct?: boolean },
): string {
  const path = plugPath.trim() || "/diagnosis";
  const params = new URLSearchParams({
    lang: locale,
    ref: buildDiscoverFunnelRef(locale, slug),
  });

  if (options?.direct) {
    params.set("mode", DISCOVER_DIRECT_MODE);
  }

  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}${params.toString()}`;
}
