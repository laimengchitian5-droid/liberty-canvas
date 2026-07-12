export const LOCALE_STORAGE_KEY = "personality-quiz-locale-v1";

export const SUPPORTED_LOCALES = [
  "en",
  "ja",
  "ko",
  "zh",
  "fr",
  "de",
  "ar",
  "he",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const RTL_LOCALES = new Set<Locale>(["ar", "he"]);

export const DEFAULT_LOCALE: Locale = "ja";

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}

export function getLocaleLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: "English",
    ja: "日本語",
    ko: "한국어",
    zh: "中文",
    ar: "العربية",
    he: "עברית",
    de: "Deutsch",
    fr: "Français",
  };

  return labels[locale];
}
