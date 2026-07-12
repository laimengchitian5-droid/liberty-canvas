"use client";

import { useEffect, useRef } from "react";
import { isLocale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useUserStore } from "@/store/userStore";

export function UserStoreBootstrap() {
  const bootstrap = useUserStore((state) => state.bootstrap);
  const setLocaleOverride = useUserStore((state) => state.setLocaleOverride);
  const { locale } = useI18n();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (isLocale(locale)) {
      setLocaleOverride(locale);
    }
  }, [locale, setLocaleOverride]);

  return null;
}
