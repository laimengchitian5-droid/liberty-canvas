import { getSiteUrl } from "@/lib/site/url";

/** Locales exposed in hreflang alternates (discover + landing matrix). */
export const HREFLANG_LOCALES = ["ja", "en", "ko", "zh"] as const;

export type HreflangLocale = (typeof HREFLANG_LOCALES)[number];

export function buildHreflangAlternates(
  path: string,
  options?: { queryParamLang?: boolean },
): Record<string, string> {
  const siteUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const useQuery = options?.queryParamLang ?? true;

  const languages: Record<string, string> = {};

  for (const locale of HREFLANG_LOCALES) {
    if (useQuery) {
      languages[locale] =
        locale === "ja"
          ? `${siteUrl}${normalizedPath}`
          : `${siteUrl}${normalizedPath}?lang=${locale}`;
    } else {
      languages[locale] = `${siteUrl}/discover/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
    }
  }

  languages["x-default"] = `${siteUrl}${normalizedPath}`;

  return languages;
}

export function buildDiscoverLocaleAlternates(): Record<string, string> {
  const siteUrl = getSiteUrl();
  const languages: Record<string, string> = {};

  for (const locale of HREFLANG_LOCALES) {
    languages[locale] = `${siteUrl}/discover/${locale}`;
  }

  languages["x-default"] = `${siteUrl}/discover/ja`;

  return languages;
}
