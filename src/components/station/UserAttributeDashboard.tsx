"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import { resolveStationDashboardCopy } from "@/lib/station/stationDashboardCopy";
import {
  computeStationCompletionRate,
  listCompletedGameIds,
} from "@/lib/station/stationDashboardStats";
import { getRouteManifest } from "@/lib/station/diagnosticStationMaster";
import { resolveLineName } from "@/lib/station/diagnosticStationRegistry";
import type { Locale } from "@/lib/i18n/config";
import type { UserGameProfile, UserProfile } from "@/types/userGameProfile";
import styles from "./UserAttributeDashboard.module.css";

export interface UserAttributeDashboardProps {
  readonly profile: UserGameProfile | UserProfile;
  readonly locale: Locale | string;
}

const FALLBACK_GATE = "#9a6b63";

/**
 * Adult-Cute boarding-history terminal for play-matrix profiles.
 *
 * Rejected sketch defects (do not reintroduce):
 * - `/{locale}/station/{id}` → canonical `/station/{locale}/{id}`
 * - `resolveLineName(route)` → `resolveLineName(id, locale)`
 * - magic `totalRoutesCount = 4` / inflate with non-station ids
 * - `uiText[...] || uiText.en` self-reference
 * - `hasStation = true` hardcode / drop non-station traits
 * - emoji in trait tags / nested stampBody inside stampLink
 */
export const UserAttributeDashboard = ({
  profile,
  locale,
}: UserAttributeDashboardProps) => {
  const resolvedLocale = resolveGameLocale(locale);
  const copy = resolveStationDashboardCopy(resolvedLocale);
  const playedIds = listCompletedGameIds(profile);
  const completionRate = computeStationCompletionRate(profile);
  const dateLocale = resolvedLocale === "ja" ? "ja-JP" : "en-US";

  return (
    <div className={styles.dashboardContainer} lang={resolvedLocale}>
      <header className={styles.header}>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </header>

      <section
        className={styles.progressSection}
        aria-labelledby="station-progress-label"
      >
        <div className={styles.progressLabel} id="station-progress-label">
          <span>{copy.progress}</span>
          <span className={styles.progressPercentage}>{completionRate}%</span>
        </div>
        <div className={styles.progressBarBg}>
          <div
            className={styles.progressBarFill}
            style={{ "--progress": `${completionRate}%` } as CSSProperties}
            role="progressbar"
            aria-valuenow={completionRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={copy.progress}
          />
        </div>
      </section>

      <div className={styles.gridContainer}>
        <section
          className={styles.historyCard}
          aria-labelledby="station-history-heading"
        >
          <h2 className={styles.sectionTitle} id="station-history-heading">
            {copy.historyTitle}
          </h2>

          {playedIds.length === 0 ? (
            <p className={styles.emptyText}>{copy.statusEmpty}</p>
          ) : (
            <ul className={styles.stampList}>
              {playedIds.map((id) => {
                const record = profile.completedGames[id];
                if (!record) {
                  return null;
                }

                const route = getRouteManifest(id);
                const lineName = route
                  ? resolveLineName(route.id, resolvedLocale)
                  : id;
                const gateColor =
                  route?.stationTheme.gateColor ?? FALLBACK_GATE;
                const clearedDate = safeLocaleDate(
                  record.clearedAt,
                  dateLocale,
                );
                const stampStyle = {
                  "--route-color": gateColor,
                } as CSSProperties;
                const stampBody = (
                  <div className={styles.stampBody} style={stampStyle}>
                    <StampInner
                      lineName={lineName}
                      clearedDate={clearedDate}
                      boardedProof={copy.boardedProof}
                    />
                  </div>
                );

                return (
                  <li key={id} className={styles.stampItem}>
                    {route ? (
                      <Link
                        href={`/station/${resolvedLocale}/${route.id}`}
                        className={styles.stampLink}
                        aria-label={`${lineName} — ${copy.openStation}`}
                      >
                        {stampBody}
                      </Link>
                    ) : (
                      stampBody
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section
          className={styles.matrixCard}
          aria-labelledby="station-matrix-heading"
        >
          <h2 className={styles.sectionTitle} id="station-matrix-heading">
            {copy.matrixTitle}
          </h2>
          <div className={styles.matrixBadgeContainer}>
            {playedIds.length === 0 ? (
              <div className={styles.matrixEmptyVisual} aria-hidden />
            ) : (
              playedIds.map((id) => {
                const trait = profile.completedGames[id]?.primaryTrait?.trim();
                if (!trait) {
                  return null;
                }
                return (
                  <span key={id} className={styles.traitTag}>
                    {trait}
                  </span>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const StampInner = ({
  lineName,
  clearedDate,
  boardedProof,
}: {
  readonly lineName: string;
  readonly clearedDate: string;
  readonly boardedProof: string;
}): JSX.Element => (
  <>
    <div className={styles.stampBadge} aria-hidden />
    <div className={styles.stampInfo}>
      <span className={styles.stampLineName}>{lineName}</span>
      <span className={styles.stampDate}>
        {clearedDate} {boardedProof}
      </span>
    </div>
  </>
);

function safeLocaleDate(clearedAt: number, dateLocale: string): string {
  if (!Number.isFinite(clearedAt) || clearedAt < 0) {
    return "—";
  }
  try {
    return new Date(clearedAt).toLocaleDateString(dateLocale);
  } catch {
    return "—";
  }
}
