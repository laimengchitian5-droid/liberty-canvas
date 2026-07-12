export const LANDING_LOCALES = ["en", "ja", "ko", "zh"] as const;

export type LandingLocale = (typeof LANDING_LOCALES)[number];

export function isLandingLocale(value: string): value is LandingLocale {
  return (LANDING_LOCALES as readonly string[]).includes(value);
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
};

export function landingLocaleToAppLocale(
  locale: LandingLocale,
): "en" | "ja" | "ko" | "zh" {
  if (locale === "ja") return "ja";
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  return "en";
}
