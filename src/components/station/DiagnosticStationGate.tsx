"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import { resolveLineName } from "@/lib/station/diagnosticStationRegistry";
import {
  buildLibertyCtaLabel,
  buildStationCtaLabel,
  buildStationDisclaimer,
  toSafeExternalHref,
} from "@/lib/station/stationGateCopy";
import type { Locale } from "@/lib/i18n/config";
import type {
  AvailableRouteView,
  DiagnosticRouteManifest,
} from "@/types/diagnosticStation";
import styles from "./DiagnosticStationGate.module.css";

export interface DiagnosticStationGateProps {
  readonly route: AvailableRouteView | DiagnosticRouteManifest;
  readonly locale: Locale | string;
}

/** @deprecated Prefer DiagnosticStationGateProps */
export type StationGateProps = DiagnosticStationGateProps;

function toAvailableView(
  route: AvailableRouteView | DiagnosticRouteManifest,
  locale: Locale,
): AvailableRouteView {
  if ("lineName" in route && typeof route.lineName === "string") {
    return route;
  }

  return {
    ...route,
    isNativeLocale: route.supportedLocales.includes(locale),
    lineName: resolveLineName(route.id, locale),
  };
}

/**
 * Outbound station gate: https-only official link + optional Liberty deep-link.
 * lineName is never read from a missing field — always via AvailableRouteView / resolveLineName.
 */
export const DiagnosticStationGate = ({
  route,
  locale,
}: DiagnosticStationGateProps) => {
  const resolvedLocale = resolveGameLocale(locale);
  const view = toAvailableView(route, resolvedLocale);
  const lineName = view.lineName;
  const externalHref = toSafeExternalHref(view.officialUrl);
  const libertyPath = view.libertyPath;
  const disclaimer = buildStationDisclaimer(lineName, resolvedLocale);

  const rootStyle = {
    "--gate-brand-color": view.stationTheme.gateColor,
  } as CSSProperties;

  if (!externalHref) {
    return (
      <div
        className={styles.gateCard}
        style={rootStyle}
        role="group"
        aria-label={lineName}
      >
        <p className={styles.error} role="alert">
          {resolvedLocale === "ja"
            ? "この路線の公式リンクを安全に開けません。"
            : "This official link could not be opened safely."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={styles.gateCard}
      style={rootStyle}
      role="group"
      aria-label={lineName}
    >
      <div className={styles.badgeWrapper}>
        <span className={styles.lineBadge}>{lineName}</span>
      </div>

      {!view.isNativeLocale ? (
        <p className={styles.fallbackNote}>
          {resolvedLocale === "ja"
            ? "公式サイトはこの言語の専用UIがない場合があります（英語ページへ案内）。"
            : "The official site may open in English for this locale."}
        </p>
      ) : null}

      <div className={styles.actionContainer}>
        <a
          href={externalHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.ctaButton} ${styles.externalLink}`}
        >
          {buildStationCtaLabel(resolvedLocale)}
        </a>

        {libertyPath ? (
          <Link
            href={libertyPath}
            className={`${styles.ctaButton} ${styles.internalLink}`}
          >
            {buildLibertyCtaLabel(resolvedLocale)}
          </Link>
        ) : null}
      </div>

      <footer className={styles.legalDisclaimer}>{disclaimer}</footer>
    </div>
  );
};
