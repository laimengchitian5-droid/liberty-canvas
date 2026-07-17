import type { Locale } from "@/lib/i18n/config";

export const CORE_LANDING_LOCALES = ["en", "ja", "ko", "zh"] as const;

export type CoreLandingLocale = (typeof CORE_LANDING_LOCALES)[number];

export const EUROPEAN_DISCOVER_LOCALES = ["fr", "de"] as const;

export type EuropeanDiscoverLocale = (typeof EUROPEAN_DISCOVER_LOCALES)[number];

export const LANDING_LOCALES = [
  ...CORE_LANDING_LOCALES,
  ...EUROPEAN_DISCOVER_LOCALES,
] as const;

export type LandingLocale = (typeof LANDING_LOCALES)[number];

export function isCoreLandingLocale(value: string): value is CoreLandingLocale {
  return (CORE_LANDING_LOCALES as readonly string[]).includes(value);
}

export function isLandingLocale(value: string): value is LandingLocale {
  return (LANDING_LOCALES as readonly string[]).includes(value);
}

export function resolveCoreLandingLocale(locale: LandingLocale): CoreLandingLocale {
  return isCoreLandingLocale(locale) ? locale : "en";
}

export function isEuropeanDiscoverLocale(value: string): value is EuropeanDiscoverLocale {
  return (EUROPEAN_DISCOVER_LOCALES as readonly string[]).includes(value);
}

export interface LandingLocaleMeta {
  label: string;
  htmlLang: string;
  ogLocale: string;
  dir: "ltr" | "rtl";
  fontClass: string;
}

export const LANDING_LOCALE_META: Record<LandingLocale, LandingLocaleMeta> = {
  en: {
    label: "English",
    htmlLang: "en",
    ogLocale: "en_US",
    dir: "ltr",
    fontClass: "font-sans",
  },
  ja: {
    label: "日本語",
    htmlLang: "ja",
    ogLocale: "ja_JP",
    dir: "ltr",
    fontClass: "font-sans-jp",
  },
  ko: {
    label: "한국어",
    htmlLang: "ko",
    ogLocale: "ko_KR",
    dir: "ltr",
    fontClass: "font-sans-ko",
  },
  zh: {
    label: "中文",
    htmlLang: "zh-Hans",
    ogLocale: "zh_CN",
    dir: "ltr",
    fontClass: "font-sans-zh",
  },
  fr: {
    label: "Français",
    htmlLang: "fr",
    ogLocale: "fr_FR",
    dir: "ltr",
    fontClass: "font-sans",
  },
  de: {
    label: "Deutsch",
    htmlLang: "de",
    ogLocale: "de_DE",
    dir: "ltr",
    fontClass: "font-sans",
  },
};

export function landingLocaleToAppLocale(locale: LandingLocale): Locale {
  return locale;
}
