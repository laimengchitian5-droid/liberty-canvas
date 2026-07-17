"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import { resolveStationHeaderCopy } from "@/lib/station/stationHeaderCopy";
import type { Locale } from "@/lib/i18n/config";
import styles from "./StationGlobalHeader.module.css";

export interface StationGlobalHeaderProps {
  readonly locale: Locale | string;
}

/**
 * Station-family chrome — one-tap paths to hub + dashboard.
 *
 * Rejected sketch defects (do not reintroduce):
 * - `GlobalHeader` colliding with Rubel → `StationGlobalHeader`
 * - `/{locale}/station` → `/station/{locale}`
 * - `/{locale}` logo → `/` (site home)
 * - `uiText[...] || uiText.en` self-reference → `resolveStationHeaderCopy`
 * - "197 countries" → `SUPPORTED_LOCALES` via `resolveGameLocale`
 * - emoji nav labels
 */
export const StationGlobalHeader = ({ locale }: StationGlobalHeaderProps) => {
  const pathname = usePathname() ?? "";
  const resolvedLocale = resolveGameLocale(locale);
  const copy = resolveStationHeaderCopy(resolvedLocale);
  const hubHref = `/station/${resolvedLocale}`;
  const dashboardHref = `/station/${resolvedLocale}/dashboard`;

  return (
    <header className={styles.header}>
      <nav className={styles.headerNav} aria-label={copy.navLabel}>
        <div className={styles.navContainer}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label={copy.homeAria}
          >
            {PRODUCT_NAME}
          </Link>

          <div className={styles.navLinks}>
            <Link
              href={hubHref}
              className={styles.navItemLink}
              aria-current={pathname === hubHref ? "page" : undefined}
            >
              {copy.stationHub}
            </Link>
            <Link
              href={dashboardHref}
              className={styles.navItemLink}
              aria-current={pathname === dashboardHref ? "page" : undefined}
            >
              {copy.dashboard}
            </Link>
            <Link href="/play" className={styles.navItemLink}>
              {copy.playHub}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

/** Sketch-compatible alias (station-scoped only). */
export const GlobalHeader = StationGlobalHeader;
