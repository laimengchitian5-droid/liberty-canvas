import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import { isLandingLocale, type LandingLocale } from "@/lib/landing/landingLocales";

export const EDGE_LOCALE_HEADER = "x-lc-locale";

const DISCOVER_PATH_LOCALE_RE = /^\/discover\/([a-z]{2})(?:\/|$)/;

export function normalizeLocaleCandidate(
  value: string | null | undefined,
): Locale | null {
  if (!value) {
    return null;
  }

  const primary = value.trim().toLowerCase().slice(0, 2);

  if (primary === "zh") {
    return "zh";
  }

  if (isLocale(primary)) {
    return primary;
  }

  return null;
}

export function firstResolvedLocale(
  ...candidates: Array<string | null | undefined>
): Locale | null {
  for (const candidate of candidates) {
    const resolved = normalizeLocaleCandidate(candidate);

    if (resolved) {
      return resolved;
    }
  }

  return null;
}

export function resolveDiscoverPathLocale(pathname: string): LandingLocale | null {
  const candidate = pathname.match(DISCOVER_PATH_LOCALE_RE)?.[1];

  return candidate && isLandingLocale(candidate) ? candidate : null;
}

export interface AppLocaleRequestInput {
  edgeLocale?: string | null;
  queryLang?: string | null;
  pathLocale?: string | null;
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}

export function resolveAppLocaleFromRequest(input: AppLocaleRequestInput): Locale {
  const explicit = firstResolvedLocale(
    input.edgeLocale,
    input.queryLang,
    input.pathLocale,
    input.cookieLocale,
  );

  if (explicit) {
    return explicit;
  }

  if (input.acceptLanguage) {
    for (const part of input.acceptLanguage.split(",")) {
      const tag = part.split(";")[0]?.trim();
      const resolved = normalizeLocaleCandidate(tag);

      if (resolved) {
        return resolved;
      }
    }
  }

  return DEFAULT_LOCALE;
}

export const PUBLIC_LOCALES = ["ja", "en", "ko", "zh", "fr", "de", "ar", "he"] as const;

export { LOCALE_STORAGE_KEY };
