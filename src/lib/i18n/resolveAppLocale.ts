import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";

const PUBLIC_LOCALES = ["ja", "en", "ko", "zh", "fr", "de", "ar", "he"] as const;

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
  cookieLocale?: string | null;
  queryLang?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  const fromQuery = normalizeLocaleCandidate(input.queryLang);

  if (fromQuery) {
    return fromQuery;
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

export { LOCALE_STORAGE_KEY, PUBLIC_LOCALES };
