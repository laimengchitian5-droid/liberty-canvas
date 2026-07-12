import type { Locale } from "@/lib/i18n/config";
import { normalizeLocaleCandidate } from "@/lib/i18n/resolveAppLocale";
import {
  isLandingLocale,
  type LandingLocale,
} from "@/lib/landing/landingLocales";

export const DISCOVER_FUNNEL_REF_PREFIX = "discover-" as const;
export const DISCOVER_DIRECT_MODE = "direct" as const;

export type DiscoverFunnelSubmitEvent =
  | "discover_funnel_submit"
  | "discover_funnel_direct";

export function buildDiscoverFunnelRef(
  locale: LandingLocale,
  slug: string,
): string {
  return `${DISCOVER_FUNNEL_REF_PREFIX}${locale}-${slug}`;
}

export function isDiscoverFunnelRef(ref: string | null | undefined): ref is string {
  return typeof ref === "string" && ref.startsWith(DISCOVER_FUNNEL_REF_PREFIX);
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
  const params = new URLSearchParams({
    lang: locale,
    ref: buildDiscoverFunnelRef(locale, slug),
  });

  if (options?.direct) {
    params.set("mode", DISCOVER_DIRECT_MODE);
  }

  return `${plugPath}?${params.toString()}`;
}
