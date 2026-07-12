"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { normalizeLocaleCandidate } from "@/lib/i18n/resolveAppLocale";

/** Client navigations: keep ?lang= in sync with I18nProvider after router.push. */
export function QueryLocaleSync() {
  const searchParams = useSearchParams();
  const { locale, setLocale } = useI18n();

  useEffect(() => {
    const queryLocale = normalizeLocaleCandidate(searchParams.get("lang"));

    if (queryLocale && queryLocale !== locale) {
      setLocale(queryLocale);
    }
  }, [locale, searchParams, setLocale]);

  return null;
}
