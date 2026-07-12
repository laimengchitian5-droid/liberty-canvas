"use client";

import {
  SUPPORTED_LOCALES,
  getLocaleLabel,
  type Locale,
} from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import styles from "./LocaleSwitcher.module.css";

export function LocaleSwitcher() {
  const { locale, messages, setLocale } = useI18n();

  return (
    <fieldset className={`${styles.bar} lc-print-hide`}>
      <legend className={styles.label}>{messages.common.localeLabel}</legend>
      <select
        id="locale-switcher"
        className={styles.select}
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
    </fieldset>
  );
}
