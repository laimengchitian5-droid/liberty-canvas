import type { Locale } from "@/lib/i18n/config";

/**
 * Whitelist of font utility classes injectable into the isolation root.
 * Prevents arbitrary className injection if a manifest is ever misconfigured.
 */
export const SERVICE_FONT_CLASSES = [
  "font-sans",
  "font-sans-jp",
  "font-sans-ko",
  "font-sans-zh",
  "font-serif",
  "font-mono",
] as const;

export type ServiceFontClass = (typeof SERVICE_FONT_CLASSES)[number];

const FONT_CLASS_SET: ReadonlySet<string> = new Set(SERVICE_FONT_CLASSES);

/** Locale → script-appropriate font (O(1) record lookup). */
const LOCALE_FONT: Readonly<Record<Locale, ServiceFontClass>> = {
  en: "font-sans",
  ja: "font-sans-jp",
  ko: "font-sans-ko",
  zh: "font-sans-zh",
  fr: "font-sans",
  de: "font-sans",
  ar: "font-sans",
  he: "font-sans",
};

export function resolveServiceFontClass(candidate: string): ServiceFontClass {
  if (FONT_CLASS_SET.has(candidate)) {
    return candidate as ServiceFontClass;
  }
  return "font-sans";
}

export function resolveLocaleFontClass(locale: Locale): ServiceFontClass {
  return LOCALE_FONT[locale];
}

/**
 * Prefer locale script font; fall back to service theme font when locale is Latin
 * and the service specifies a distinct face.
 */
export function resolveServiceLocaleFontClass(
  locale: Locale,
  themeFontClass: string,
): ServiceFontClass {
  const localeFont = resolveLocaleFontClass(locale);
  if (locale === "ja" || locale === "ko" || locale === "zh") {
    return localeFont;
  }
  return resolveServiceFontClass(themeFontClass);
}
