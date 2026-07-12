"use client";

import { Suspense, type ReactNode } from "react";
import { PlatformProvider } from "@/store/PlatformContext";
import { UserStoreBootstrap } from "@/components/auth/UserStoreBootstrap";
import { AppShell } from "@/components/AppShell";
import { QueryLocaleSync } from "@/components/i18n/QueryLocaleSync";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import type { Locale } from "@/lib/i18n/config";

export function Providers({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <PlatformProvider>
        <UserStoreBootstrap />
        <Suspense fallback={null}>
          <QueryLocaleSync />
        </Suspense>
        <AppShell>{children}</AppShell>
      </PlatformProvider>
    </I18nProvider>
  );
}
