"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  getDirection,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import { getMessages, type LocaleMessages } from "@/lib/i18n/messages";

interface I18nContextValue {
  locale: Locale;
  direction: "ltr" | "rtl";
  messages: LocaleMessages;
  setLocale: (locale: Locale) => void;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const LEGACY_RUBEL_LOCALE_KEY = "rubel-display-locale";

function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  if (stored && isLocale(stored)) {
    return stored;
  }

  const legacyRubel = window.localStorage.getItem(LEGACY_RUBEL_LOCALE_KEY);

  if (legacyRubel) {
    const migrated =
      legacyRubel === "ja"
        ? "ja"
        : legacyRubel === "fr"
          ? "fr"
          : "en";

    if (isLocale(migrated)) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, migrated);
      return migrated;
    }
  }

  const browser = window.navigator.language.slice(0, 2);

  if (isLocale(browser)) {
    return browser;
  }

  return DEFAULT_LOCALE;
}

function HtmlLocaleBinder({
  locale,
  direction,
}: {
  locale: Locale;
  direction: "ltr" | "rtl";
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [direction, locale]);

  return null;
}

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
  }, []);

  const direction = getDirection(locale);
  const isRtl = direction === "rtl";

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      window.localStorage.setItem(LEGACY_RUBEL_LOCALE_KEY, nextLocale);
      document.cookie = `${LOCALE_STORAGE_KEY}=${nextLocale};path=/;max-age=31536000;samesite=lax`;
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      direction,
      messages: getMessages(locale),
      setLocale,
      isRtl,
    }),
    [direction, isRtl, locale, setLocale],
  );

  return (
    <I18nContext.Provider value={value}>
      <HtmlLocaleBinder locale={locale} direction={direction} />
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  return context;
}
