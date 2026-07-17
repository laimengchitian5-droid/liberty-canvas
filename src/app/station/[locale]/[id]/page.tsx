import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { DiagnosticStationGateClient } from "@/components/station/DiagnosticStationGateClient";
import { getDirection, isLocale, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import {
  buildStationHreflangLanguages,
  generateStationSEO,
  getAvailableRoutes,
  getRouteManifest,
} from "@/lib/station/diagnosticStationMaster";
import { resolveLineName } from "@/lib/station/diagnosticStationRegistry";
import { resolveStationPageCopy } from "@/lib/station/stationPageCopy";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";
import styles from "./page.module.css";

interface StationPageProps {
  readonly params: Promise<{
    readonly locale: string;
    readonly id: string;
  }>;
}

/**
 * Build-time matrix: locales × platforms (fixed 8×4 = 32).
 * Prefer explicit IDs over per-locale filter for deterministic SSG.
 */
export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    DIAGNOSTIC_PLATFORM_IDS.map((id) => ({ locale, id })),
  );
}

export async function generateMetadata({
  params,
}: StationPageProps): Promise<Metadata> {
  const { locale: localeRaw, id } = await params;

  if (!isLocale(localeRaw) || !getRouteManifest(id)) {
    return { title: "Station | Liberty Canvas" };
  }

  const seo = generateStationSEO(id, localeRaw);
  if (!seo) {
    return { title: "Station | Liberty Canvas" };
  }

  const languages = buildStationHreflangLanguages(id);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      type: "website",
    },
  };
}

export default async function DiagnosticStationPage({ params }: StationPageProps) {
  const { locale: localeRaw, id } = await params;

  if (!isLocale(localeRaw)) {
    notFound();
  }

  const route = getRouteManifest(id);
  if (!route) {
    notFound();
  }

  const locale = localeRaw;
  const copy = resolveStationPageCopy(locale);
  const lineName = resolveLineName(route.id, locale);
  const view = getAvailableRoutes(locale, "with_english_fallback").find(
    (entry) => entry.id === route.id,
  ) ?? {
    ...route,
    isNativeLocale: route.supportedLocales.includes(locale),
    lineName,
  };

  const direction = getDirection(locale);

  return (
    <div
      className={styles.shell}
      lang={locale}
      dir={direction}
      style={
        {
          "--station-page-accent": route.stationTheme.gateColor,
        } as CSSProperties
      }
    >
      <div className={styles.card}>
        <p className={styles.eyebrow}>{lineName}</p>
        <h1 className={styles.welcome}>{copy.welcome}</h1>
        <p className={styles.lead}>{copy.sub}</p>

        <div className={styles.gate}>
          <DiagnosticStationGateClient route={view} locale={locale} />
        </div>

        <div className={styles.footerNav}>
          <Link href="/play" className={styles.internalLink}>
            {copy.internalNav}
          </Link>
        </div>
      </div>
    </div>
  );
}
