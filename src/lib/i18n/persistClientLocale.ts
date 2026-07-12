import { LOCALE_STORAGE_KEY, type Locale } from "@/lib/i18n/config";

const LEGACY_RUBEL_LOCALE_KEY = "rubel-display-locale";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** Single write path for locale persistence (localStorage + legacy key + cookie). */
export function persistClientLocale(locale: Locale): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  window.localStorage.setItem(LEGACY_RUBEL_LOCALE_KEY, locale);
  document.cookie = `${LOCALE_STORAGE_KEY}=${locale};path=/;max-age=${COOKIE_MAX_AGE_SECONDS};samesite=lax`;
}
