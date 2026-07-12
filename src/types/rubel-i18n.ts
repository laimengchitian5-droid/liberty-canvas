export type LocaleCode = "en" | "ja" | "es" | "ko" | "fr";

export const SUPPORTED_LOCALES: readonly LocaleCode[] = [
  "en",
  "ja",
  "es",
  "ko",
  "fr",
] as const;

export const DEFAULT_LOCALE: LocaleCode = "ja";

export const LOCALE_LABELS: Record<LocaleCode, string> = {
  en: "English",
  ja: "日本語",
  es: "Español",
  ko: "한국어",
  fr: "Français",
};

export const LOCALE_FLAGS: Record<LocaleCode, string> = {
  en: "🇺🇸",
  ja: "🇯🇵",
  es: "🇪🇸",
  ko: "🇰🇷",
  fr: "🇫🇷",
};

export const RUBEL_LOCALE_STORAGE_KEY = "rubel-display-locale";

export type PlayLocalizationPhase = "locale-select" | "playing";

export interface PlayLocalizationState {
  phase: PlayLocalizationPhase;
  sourceLanguage: LocaleCode;
  displayLanguage: LocaleCode;
}

export interface SearchResult {
  diagnosisId: string;
  score: number;
  matchedTokens: string[];
  title: string;
  language: LocaleCode;
}

export interface LocalizedDiagnosisMeta {
  sourceLanguage: LocaleCode;
  displayLanguage: LocaleCode;
  wasTranslated: boolean;
}

export function isLocaleCode(value: string): value is LocaleCode {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function resolveLocale(value: string | null | undefined): LocaleCode {
  if (value && isLocaleCode(value)) {
    return value;
  }

  return DEFAULT_LOCALE;
}

export function detectBrowserLocale(): LocaleCode {
  if (typeof navigator === "undefined") {
    return DEFAULT_LOCALE;
  }

  const primary = navigator.language.split("-")[0]?.toLowerCase();

  if (primary && isLocaleCode(primary)) {
    return primary;
  }

  return DEFAULT_LOCALE;
}
