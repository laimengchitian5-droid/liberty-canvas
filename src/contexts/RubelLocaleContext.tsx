"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { Locale } from "@/lib/i18n/config";
import {
  DEFAULT_LOCALE,
  type LocaleCode,
  isLocaleCode,
} from "@/types/rubel-i18n";

interface RubelLocaleContextValue {
  locale: LocaleCode;
  setLocale: (next: LocaleCode) => void;
  isReady: boolean;
}

function appLocaleToRubel(locale: Locale): LocaleCode {
  if (locale === "ja") return "ja";
  if (locale === "fr") return "fr";
  if (locale === "ko") return "ko";
  return "en";
}

function rubelLocaleToApp(locale: LocaleCode): Locale {
  if (locale === "ja") return "ja";
  if (locale === "fr") return "fr";
  if (locale === "ko") return "ko";
  if (locale === "es") return "en";
  return "en";
}

/** @deprecated Wrapper kept for backward compatibility — locale is synced via I18nProvider */
const RubelLocaleProvider = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

function useRubelLocale(): RubelLocaleContextValue {
  const { locale, setLocale } = useI18n();

  return {
    locale: appLocaleToRubel(locale),
    setLocale: (next: LocaleCode) => {
      const resolved = isLocaleCode(next) ? next : DEFAULT_LOCALE;
      setLocale(rubelLocaleToApp(resolved));
    },
    isReady: true,
  };
}

export { RubelLocaleProvider, useRubelLocale };
