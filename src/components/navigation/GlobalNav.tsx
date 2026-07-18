"use client";

import { usePathname } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { UserAuthPanel } from "@/components/auth/UserAuthPanel";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { BrandMegaMenu } from "@/components/brand/BrandMegaMenu";
import { BrandNavLink } from "@/components/brand/BrandNavLink";
import { BrandWordmark } from "@/components/brand/BrandWordmark";
import {
  buildDiscoverHubPath,
  buildGlobalNavItems,
} from "@/components/navigation/buildGlobalNavItems";
import { PRODUCT_NAME_SLUG } from "@/lib/brand/constants";
import { resolveBrandId } from "@/lib/brand/resolveBrand";
import { resolveBrandPath } from "@/lib/brand/urlResolver";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { deriveCreatorAccent } from "@/lib/rubel/creatorDisplay";
import { selectNavProfile, useUserStore } from "@/store/userStore";
import a11y from "@/styles/accessibility.module.css";
import styles from "./GlobalNav.module.css";

interface NavSessionBadgeProps {
  readonly displayName: string;
  readonly avatarInitials: string;
  readonly appsAuthored: number;
  readonly accentClass: string;
  readonly isHydrating: boolean;
}

/**
 * Authenticated session chip — sketch `userIdBadge` without emoji / raw IDs.
 */
const NavSessionBadge = ({
  displayName,
  avatarInitials,
  appsAuthored,
  accentClass,
  isHydrating,
}: NavSessionBadgeProps) => (
  <div
    className={styles.sessionBadge}
    role="group"
    aria-label={`${displayName} のプロフィール`}
    aria-busy={isHydrating ? "true" : undefined}
  >
    <div
      className={`${styles.avatar} bg-gradient-to-br ${accentClass}`}
      aria-hidden="true"
    >
      <span className={styles.avatarInitials}>{avatarInitials}</span>
    </div>
    <div className={styles.profileMeta}>
      <span className={styles.profileName}>{displayName}</span>
      <span className={styles.profileStat}>{`${appsAuthored} アプリ`}</span>
    </div>
  </div>
);

/**
 * Site-wide chrome — single GlobalNav (never fork `hub/GlobalNav.tsx`).
 *
 * Sketch map:
 * - `headerContainer` → `.bar` / `.barInner`
 * - `navigationScrollWrapper` → `.tabList` (labels never crush; scroll)
 * - `brandLogo` → {@link BrandWordmark} in `.brandSlot` (outside scroll)
 * - `navLinkItem` → {@link BrandNavLink} + `.tab`
 * - `metaActionGroup` → locale + {@link UserAuthPanel}
 *
 * Rejected sketch defects:
 * - raw `<a href>` / dead routes (`/home`, `/ai-diagnostic`, `/play-room`, …)
 * - hardcoded `/station/ja` (use active locale)
 * - brand inside the scroll rail (would scroll away)
 * - missing `"use client"` / imports / i18n
 */
export function GlobalNav() {
  const pathname = usePathname() ?? "";
  const { locale, messages } = useI18n();
  const { nav } = messages;
  const { status, displayName, avatarInitials, appsAuthored, isGuest } =
    useUserStore(useShallow(selectNavProfile));

  const accentClass = isGuest ? "" : deriveCreatorAccent(displayName);
  const brandId = resolveBrandId(pathname);

  const navItems = buildGlobalNavItems(nav, {
    canvasHub: resolveBrandPath("liberty-canvas", "hub"),
    discoverHub: buildDiscoverHubPath(locale),
    plugEngine: resolveBrandPath("liberty-plug", "engine"),
    playHub: resolveBrandPath("liberty-play", "hub"),
    stationHub: `/station/${locale}`,
    stationDashboard: `/station/${locale}/dashboard`,
    plugCatalog: resolveBrandPath("liberty-plug", "hub"),
    forgeHub: resolveBrandPath("liberty-forge", "hub"),
  });

  return (
    <nav
      className={`${styles.bar} lc-print-hide`}
      aria-label={`${PRODUCT_NAME_SLUG} navigation`}
    >
      <div className={styles.barInner}>
        <div className={styles.navigationGroup}>
          <div className={styles.brandSlot}>
            <BrandWordmark brandId={brandId} locale="ja" href="/" compact />
            <BrandMegaMenu currentPath={pathname} />
          </div>

          {!isGuest ? (
            <NavSessionBadge
              displayName={displayName}
              avatarInitials={avatarInitials}
              appsAuthored={appsAuthored}
              accentClass={accentClass}
              isHydrating={status === "hydrating"}
            />
          ) : null}

          {/* Scroll barrier — flex-shrink:0 tabs; overflow-x on .tabList */}
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

        <div className={styles.metaActionGroup}>
          <LocaleSwitcher />
          <UserAuthPanel />
        </div>
      </div>
    </nav>
  );
}
