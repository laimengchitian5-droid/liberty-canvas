import Link from "next/link";
import type { CSSProperties } from "react";
import { IdentityHubConductor } from "@/components/station/IdentityHubConductor";
import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import { getAvailableRoutes } from "@/lib/station/diagnosticStationMaster";
import {
  countClearedStationRoutes,
  isStationRouteCleared,
  STATION_ROUTE_TOTAL,
} from "@/lib/station/stationDashboardStats";
import { resolveStationHubCopy } from "@/lib/station/stationHubCopy";
import type { Locale } from "@/lib/i18n/config";
import type { AvailableRouteView } from "@/types/diagnosticStation";
import type { UserGameProfile, UserProfile } from "@/types/userGameProfile";
import styles from "./CentralTerminalHub.module.css";

export interface CentralTerminalHubProps {
  readonly locale: Locale | string;
  /** Boarding stamps from server-decrypted matrix cookie only. */
  readonly userProfile: UserGameProfile | UserProfile;
}

const GATE_HEX = /^#[0-9A-Fa-f]{6}$/;

/**
 * Public central terminal — all registry routes + dashboard transfer.
 *
 * Rejected sketch defects (do not reintroduce):
 * - `@/src/...` → `@/lib` / `@/types` / `@/components`
 * - `/{locale}/station/...` → `/station/{locale}/...`
 * - `internalPlayPath` → `libertyPath`
 * - `resolveLineName(route)` → use `AvailableRouteView.lineName`
 * - `playedIds.includes` → O(1) Record lookup via `isStationRouteCleared`
 * - `uiText[...] || uiText.en` self-reference → `resolveStationHubCopy`
 * - emoji status chrome
 * - false O(1) claim on full registry scan — fixed n=15, O(n) is intentional
 */
export const CentralTerminalHub = ({
  locale,
  userProfile,
}: CentralTerminalHubProps) => {
  const resolvedLocale = resolveGameLocale(locale);
  const copy = resolveStationHubCopy(resolvedLocale);
  const allRoutes = getAvailableRoutes(resolvedLocale, "with_english_fallback");
  const clearedCount = countClearedStationRoutes(userProfile);
  const totalLines = Math.max(allRoutes.length, STATION_ROUTE_TOTAL);
  const dashboardHref = `/station/${resolvedLocale}/dashboard`;

  return (
    <div className={styles.terminalContainer} lang={resolvedLocale}>
      <header className={styles.terminalHeader}>
        <h1 className={styles.mainTitle}>{copy.hubTitle}</h1>
        <p className={styles.mainSubtitle}>{copy.hubSubtitle}</p>
      </header>

      <IdentityHubConductor locale={resolvedLocale} />

      <section
        className={styles.dashboardTransferSection}
        aria-label={copy.dashLink}
      >
        <Link href={dashboardHref} className={styles.dashboardLink}>
          <span className={styles.dashboardLinkBody}>
            <span className={styles.dashboardLinkText}>{copy.dashLink}</span>
            <span className={styles.completionBadge}>
              {copy.linesBadge(clearedCount, totalLines)}
            </span>
          </span>
        </Link>
      </section>

      <section
        className={styles.gateMatrixArea}
        aria-labelledby="station-hub-gates"
      >
        <h2 className={styles.sectionTitle} id="station-hub-gates">
          {copy.gateTitle}
        </h2>
        <ul className={styles.terminalGrid}>
          {allRoutes.map((route) => (
            <StationCell
              key={route.id}
              route={route}
              locale={resolvedLocale}
              cleared={isStationRouteCleared(userProfile, route.id)}
              statusCleared={copy.statusCleared}
              statusReady={copy.statusReady}
              gateCta={copy.gateCta}
              studioCta={copy.studioCta}
            />
          ))}
        </ul>
      </section>
    </div>
  );
};

interface StationCellProps {
  readonly route: AvailableRouteView;
  readonly locale: Locale;
  readonly cleared: boolean;
  readonly statusCleared: string;
  readonly statusReady: string;
  readonly gateCta: string;
  readonly studioCta: string;
}

const StationCell = ({
  route,
  locale,
  cleared,
  statusCleared,
  statusReady,
  gateCta,
  studioCta,
}: StationCellProps) => {
  const gateColor = GATE_HEX.test(route.stationTheme.gateColor)
    ? route.stationTheme.gateColor
    : "#9a6b63";
  const cellStyle = { "--route-color": gateColor } as CSSProperties;
  const stationHref = `/station/${locale}/${route.id}`;
  const libertyPath = route.libertyPath;
  const statusLabel = cleared ? statusCleared : statusReady;

  return (
    <li
      className={`${styles.stationCell} ${cleared ? styles.cellCleared : ""}`}
      style={cellStyle}
    >
      <div className={styles.cellHeader}>
        <span
          className={
            cleared ? styles.lineStatusCleared : styles.lineStatusReady
          }
        >
          {statusLabel}
        </span>
        <h3 className={styles.lineNameText}>{route.lineName}</h3>
      </div>

      <div className={styles.cellActionGate} role="group" aria-label={route.lineName}>
        <Link href={stationHref} className={styles.gateLinkButton}>
          {gateCta}
        </Link>
        {libertyPath ? (
          <Link href={libertyPath} className={styles.studioLinkButton}>
            {studioCta}
          </Link>
        ) : null}
      </div>
    </li>
  );
};
