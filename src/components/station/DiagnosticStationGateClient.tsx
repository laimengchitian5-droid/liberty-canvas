"use client";

import Link from "next/link";
import { useTransition, type CSSProperties } from "react";
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

export interface DiagnosticStationGateClientProps {
  readonly route: AvailableRouteView | DiagnosticRouteManifest;
  readonly locale: Locale | string;
}

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
 * Client gate with fire-and-forget gamification sync.
 * NEVER accepts encryption secrets — httpOnly cookie is written by /api/station/gate-pass.
 */
export const DiagnosticStationGateClient = ({
  route,
  locale,
}: DiagnosticStationGateClientProps) => {
  const [isPending, startTransition] = useTransition();
  const resolvedLocale = resolveGameLocale(locale);
  const view = toAvailableView(route, resolvedLocale);
  const lineName = view.lineName;
  const externalHref = toSafeExternalHref(view.officialUrl);
  const libertyPath = view.libertyPath;
  const disclaimer = buildStationDisclaimer(lineName, resolvedLocale);

  const rootStyle = {
    "--gate-brand-color": view.stationTheme.gateColor,
  } as CSSProperties;

  const recordGatePass = (visitType: "external" | "internal") => {
    // Keep navigation instant — sync off the critical path (INP-friendly).
    startTransition(() => {
      void fetch("/api/station/gate-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformId: view.id,
          visitType,
        }),
        keepalive: true,
      }).catch((error: unknown) => {
        console.error("[DiagnosticStationGateClient] gate-pass sync failed:", error);
      });
    });
  };

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
      aria-busy={isPending}
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
          className={`${styles.ctaButton} ${styles.externalLink}${
            isPending ? ` ${styles.loadingEffect}` : ""
          }`}
          onClick={() => {
            recordGatePass("external");
          }}
        >
          {buildStationCtaLabel(resolvedLocale)}
        </a>

        {libertyPath ? (
          <Link
            href={libertyPath}
            className={`${styles.ctaButton} ${styles.internalLink}`}
            onClick={() => {
              recordGatePass("internal");
            }}
          >
            {buildLibertyCtaLabel(resolvedLocale)}
          </Link>
        ) : null}
      </div>

      <footer className={styles.legalDisclaimer}>{disclaimer}</footer>
    </div>
  );
};
