import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";

export const EDGE_LOCALE_HEADER = "x-lc-locale";

const DISCOVER_PATH_LOCALES = ["en", "ja", "ko", "zh"] as const;

export function resolveDiscoverPathLocale(pathname: string): Locale | null {
  const match = pathname.match(/^\/discover\/(en|ja|ko|zh)(?:\/|$)/);

  if (!match?.[1]) {
    return null;
  }

  const candidate = match[1];

  return (DISCOVER_PATH_LOCALES as readonly string[]).includes(candidate)
    ? (candidate as Locale)
    : null;
}

export function normalizeLocaleCandidate(value: string | null | undefined): Locale | null {
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

export function resolveAppLocaleFromRequest(input: {
  edgeLocale?: string | null;
  queryLang?: string | null;
  pathLocale?: string | null;
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  const fromEdge = normalizeLocaleCandidate(input.edgeLocale);

  if (fromEdge) {
    return fromEdge;
  }

  const fromQuery = normalizeLocaleCandidate(input.queryLang);

  if (fromQuery) {
    return fromQuery;
  }

  const fromPath = normalizeLocaleCandidate(input.pathLocale);

  if (fromPath) {
    return fromPath;
  }

  const fromCookie = normalizeLocaleCandidate(input.cookieLocale);

  if (fromCookie) {
    return fromCookie;
  }

  if (input.acceptLanguage) {
    const parts = input.acceptLanguage.split(",");

    for (const part of parts) {
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
