import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { DiagnosticStationGateClient } from "@/components/station/DiagnosticStationGateClient";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import { getDirection, isLocale, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import {
  buildAvailableRouteView,
  buildStationHreflangLanguages,
  generateStationSEO,
  getRouteManifest,
} from "@/lib/station/diagnosticStationMaster";
import { resolveStationPageCopy } from "@/lib/station/stationPageCopy";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";
import styles from "./page.module.css";

interface StationPageProps {
  readonly params: Promise<{
    readonly locale: string;
    readonly id: string;
  }>;
}

const GATE_HEX = /^#[0-9A-Fa-f]{6}$/;

/**
 * Build-time matrix: SUPPORTED_LOCALES × DIAGNOSTIC_PLATFORM_IDS (8×15 = 120).
 * Never hardcode platform id lists or invent “197 locales”.
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
    return { title: `Station | ${PRODUCT_NAME}` };
  }

  const seo = generateStationSEO(id, localeRaw);
  if (!seo) {
    return { title: `Station | ${PRODUCT_NAME}` };
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

/**
 * /station/[locale]/[id] — pSEO gate shell.
 *
 * Rejected sketch defects (do not reintroduce):
 * - `@/src/...` / `isLocale` from diagnosticStation types
 * - hardcoded id array / “197 countries”
 * - `resolveLineName(route)` arity error
 * - inline fr/LLM locale dictionaries on the page
 * - raw `officialUrl` without https fail-closed (use DiagnosticStationGateClient)
 * - duplicate gate UI / `DiagnosticStationPage.module.css` parallel file
 */
export default async function DiagnosticStationPage({
  params,
}: StationPageProps) {
  const { locale: localeRaw, id } = await params;

  if (!isLocale(localeRaw)) {
    notFound();
  }

  const view = buildAvailableRouteView(id, localeRaw);
  if (!view) {
    notFound();
  }

  const locale = localeRaw;
  const copy = resolveStationPageCopy(locale, view.lineName);
  const direction = getDirection(locale);
  const accent = GATE_HEX.test(view.stationTheme.gateColor)
    ? view.stationTheme.gateColor
    : "#9a6b63";

  return (
    <div
      className={styles.shell}
      lang={locale}
      dir={direction}
      style={{ "--station-page-accent": accent } as CSSProperties}
    >
      <div className={styles.card}>
        <p className={styles.eyebrow}>{view.lineName}</p>
        <h1 className={styles.welcome}>{copy.welcome}</h1>
        <p className={styles.lead}>{copy.sub}</p>

        <div className={styles.gate}>
          <DiagnosticStationGateClient route={view} locale={locale} />
        </div>

        <div className={styles.footerNav}>
          <Link
            href={`/station/${locale}`}
            className={styles.internalLink}
          >
            {copy.internalNav}
          </Link>
        </div>
      </div>
    </div>
  );
}
