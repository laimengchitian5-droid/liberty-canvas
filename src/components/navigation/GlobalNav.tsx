"use client";

import { usePathname } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { UserAuthPanel } from "@/components/auth/UserAuthPanel";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { BrandMegaMenu } from "@/components/brand/BrandMegaMenu";
import { BrandNavLink } from "@/components/brand/BrandNavLink";
import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { PRODUCT_NAME_SLUG } from "@/lib/brand/constants";
import { resolveBrandId } from "@/lib/brand/resolveBrand";
import { resolveBrandPath } from "@/lib/brand/urlResolver";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { deriveCreatorAccent } from "@/lib/rubel/creatorDisplay";
import { DEFAULT_GUEST_USER_ID } from "@/lib/user/constants";
import { selectNavProfile, useUserStore } from "@/store/userStore";
import a11y from "@/styles/accessibility.module.css";
import styles from "./GlobalNav.module.css";

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly ariaLabel: string;
  readonly isActive: (pathname: string) => boolean;
}

/**
 * Site-wide chrome — includes one-tap gates to station hub / dashboard.
 *
 * Rejected sketch “GlobalHeader” defects (do not reintroduce):
 * - parallel GlobalHeader.tsx duplicating this bar
 * - `/{locale}/station` → `/station/{locale}`
 * - `/{locale}/play` → `/play` (brand hub)
 * - logo `/{locale}` → `/`
 * - `uiText[...] || uiText.en` self-reference → `messages.nav`
 * - emoji nav labels
 */
export function GlobalNav() {
  const pathname = usePathname() ?? "";
  const { locale, messages } = useI18n();
  const { nav } = messages;
  const { userId, status, displayName, avatarInitials, appsAuthored } =
    useUserStore(useShallow(selectNavProfile));

  const accentClass = deriveCreatorAccent(displayName);
  const isGuest = userId === DEFAULT_GUEST_USER_ID;
  const stationHubHref = `/station/${locale}`;
  const stationDashboardHref = `/station/${locale}/dashboard`;
  const canvasHub = resolveBrandPath("liberty-canvas", "hub");
  const plugEngine = resolveBrandPath("liberty-plug", "engine");
  const playHub = resolveBrandPath("liberty-play", "hub");
  const plugCatalog = resolveBrandPath("liberty-plug", "hub");
  const forgeHub = resolveBrandPath("liberty-forge", "hub");

  const navItems: readonly NavItem[] = [
    {
      href: canvasHub,
      label: nav.hub,
      shortLabel: nav.hubShort,
      ariaLabel: nav.hub,
      isActive: (path) => path === "/",
    },
    {
      href: plugEngine,
      label: nav.assessment,
      shortLabel: nav.assessmentShort,
      ariaLabel: nav.assessment,
      isActive: (path) =>
        path === plugEngine || path.startsWith(`${plugEngine}/`),
    },
    {
      href: playHub,
      label: "Play",
      shortLabel: "Play",
      ariaLabel: "Liberty Play",
      isActive: (path) => path === "/play" || path.startsWith("/play/"),
    },
    {
      href: stationHubHref,
      label: nav.station,
      shortLabel: nav.stationShort,
      ariaLabel: nav.station,
      isActive: (path) =>
        path === stationHubHref ||
        (path.startsWith(`${stationHubHref}/`) &&
          !path.startsWith(stationDashboardHref)),
    },
    {
      href: stationDashboardHref,
      label: nav.dashboard,
      shortLabel: nav.dashboardShort,
      ariaLabel: nav.dashboard,
      isActive: (path) =>
        path === stationDashboardHref ||
        path.startsWith(`${stationDashboardHref}/`),
    },
    {
      href: plugCatalog,
      label: nav.diagnosis,
      shortLabel: nav.diagnosisShort,
      ariaLabel: nav.diagnosis,
      isActive: (path) =>
        path === plugCatalog || path.startsWith(`${plugCatalog}/`),
    },
    {
      href: forgeHub,
      label: nav.create,
      shortLabel: nav.createShort,
      ariaLabel: nav.create,
      isActive: (path) => path.startsWith("/create"),
    },
  ];

  const brandId = resolveBrandId(pathname);

  return (
    <nav
      className={`${styles.bar} lc-print-hide`}
      aria-label={`${PRODUCT_NAME_SLUG} navigation`}
    >
      <div className={styles.barInner}>
        <div className={styles.primaryRow}>
          <div className={styles.brandSlot}>
            <BrandWordmark brandId={brandId} locale="ja" href="/" compact />
            <BrandMegaMenu currentPath={pathname} />
          </div>
          <div
            className={styles.profileSlot}
            role="group"
            aria-label={`${displayName} のプロフィール`}
            aria-busy={status === "hydrating" ? "true" : undefined}
          >
            <div
              className={`${styles.avatar} bg-gradient-to-br ${accentClass}`}
              aria-hidden="true"
            >
              <span className={styles.avatarInitials}>{avatarInitials}</span>
            </div>
            <div className={styles.profileMeta}>
              <span className={styles.profileName}>{displayName}</span>
              <span className={styles.profileStat}>
                {isGuest ? "ゲスト" : `${appsAuthored} アプリ`}
              </span>
            </div>
          </div>

          <ul className={styles.tabList}>
            {navItems.map((item) => {
              const isActive = item.isActive(pathname);

              return (
                <li key={item.href} className={styles.tabItem}>
                  <BrandNavLink
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={item.ariaLabel}
                    className={`${styles.tab} ${a11y.touchTargetInline} ${a11y.focusRing} ${
                      isActive ? styles.tabActive : ""
                    }`}
                  >
                    <span className={styles.tabLabelFull}>{item.label}</span>
                    <span className={styles.tabLabelShort} aria-hidden="true">
                      {item.shortLabel}
                    </span>
                  </BrandNavLink>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.authSlot}>
          <LocaleSwitcher />
          <UserAuthPanel />
        </div>
      </div>
    </nav>
  );
}
