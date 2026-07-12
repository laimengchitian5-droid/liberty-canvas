"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import {
  LANDING_LOCALES,
  LANDING_LOCALE_META,
  landingLocaleToAppLocale,
  type LandingLocale,
} from "@/lib/landing/landingLocales";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { rubelDs } from "@/lib/rubel/rubelDesignSystem";
import { rubelTheme } from "@/lib/rubel/theme";
import { cn } from "@/lib/utils/cn";

interface SatelliteLandingShellProps {
  locale: LandingLocale;
  slug: string;
  children: ReactNode;
}

export function SatelliteLandingShell({
  locale,
  slug,
  children,
}: SatelliteLandingShellProps) {
  const meta = LANDING_LOCALE_META[locale];
  const { setLocale } = useI18n();

  useEffect(() => {
    document.documentElement.lang = meta.htmlLang;
    setLocale(landingLocaleToAppLocale(locale));
  }, [locale, meta.htmlLang, setLocale]);

  return (
    <div className={cn(rubelTheme.page, meta.fontClass)}>
      <header className={cn("px-4 py-3", rubelDs.glassHeader)}>
        <div className={cn(rubelTheme.container, "flex items-center justify-between gap-3")}>
          <Link href="/" className="text-sm font-semibold text-indigo-300">
            LibertyCanvas
          </Link>
          <nav className="flex gap-1" aria-label="Region">
            {LANDING_LOCALES.map((code) => (
              <Link
                key={code}
                href={`/discover/${code}/${slug}`}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-medium uppercase",
                  code === locale
                    ? "bg-indigo-500 text-white"
                    : "text-slate-400 hover:text-slate-200",
                )}
                hrefLang={LANDING_LOCALE_META[code].htmlLang}
              >
                {code}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className={cn(rubelTheme.container, "py-8")}>{children}</main>
    </div>
  );
}
