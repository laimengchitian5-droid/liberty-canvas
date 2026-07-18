"use client";

import { Globe2 } from "lucide-react";
import { SUPPORTED_LOCALES, getLocaleLabel, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import a11y from "@/styles/accessibility.module.css";
import styles from "./LocaleSwitcher.module.css";

/**
 * Locale control — controlled via {@link useI18n}; all {@link SUPPORTED_LOCALES}.
 *
 * Rejected sketch defects:
 * - `React.FC` + unused `currentLocale` prop + inline styles
 * - `defaultValue` uncontrolled select (no `setLocale`)
 * - ja/en only · inventing `--lc-size-touch-target` / `--lc-radius-full`
 */

const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  ja: "JA",
  ko: "KO",
  zh: "ZH",
  fr: "FR",
  de: "DE",
  ar: "AR",
  he: "HE",
};

export function LocaleSwitcher() {
  const { locale, messages, setLocale } = useI18n();

  return (
    <div className={`${styles.root} lc-print-hide`}>
      <Globe2 className={styles.icon} aria-hidden="true" />
      <label htmlFor="locale-switcher" className={styles.srOnly}>
        {messages.common.localeLabel}
      </label>
      <select
        id="locale-switcher"
        className={`${styles.select} ${a11y.focusRing}`}
        aria-label={messages.common.localeLabel}
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
      >
        {SUPPORTED_LOCALES.map((entry) => (
          <option key={entry} value={entry}>
            {getLocaleLabel(entry)}
          </option>
        ))}
      </select>
      <span className={styles.shortCode} aria-hidden="true">
        {LOCALE_SHORT[locale]}
      </span>
    </div>
  );
}
