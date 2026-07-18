"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
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
import type { Locale } from "@/lib/i18n/config";
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

function resolveAccountTriggerLabel(locale: Locale): string {
  switch (locale) {
    case "ja":
      return "アカウント";
    case "ko":
      return "계정";
    case "zh":
      return "账户";
    default:
      return "Account";
  }
}

/**
 * Site-wide chrome — single {@link GlobalNav} (never fork `GlobalNavbar.tsx`).
 *
 * Sketch map (do NOT ship the thin popover fork):
 * - leftSection / menuList → BrandWordmark + scroll tabs (live routes only)
 * - authWrapper / authTrigger / authPopover → `.authShell` + Escape / outside click
 * - `UserAuthPanel currentLocale` → `layout="popover" | "rail"` (no fake props)
 *
 * Rejected sketch defects:
 * - `@/src/...` · `lib/navigation/buildGlobalNavItems` fork
 * - `React.FC` · `currentLocale` prop (locale from {@link useI18n})
 * - raw `<a href>` + `role="menubar"` · text brand "Liberty" (use BrandWordmark)
 * - emoji `👤 Account` · `role="dialog"` without focus management
 * - toggle via `!isAuthOpen` (use functional `setIsAuthOpen((o) => !o)`)
 * - fake props into LocaleSwitcher / UserAuthPanel · CSS `.navbar` / `.navLink`
 */
export function GlobalNav() {
  const pathname = usePathname() ?? "";
  const { locale, messages } = useI18n();
  const { nav } = messages;
  const { status, displayName, avatarInitials, appsAuthored, isGuest } =
    useUserStore(useShallow(selectNavProfile));

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const authShellRef = useRef<HTMLDivElement>(null);
  const authPanelId = useId();

  const accentClass = isGuest ? "" : deriveCreatorAccent(displayName);
  const brandId = resolveBrandId(pathname);
  const accountLabel = resolveAccountTriggerLabel(locale);

  const closeAuth = useCallback(() => {
    setIsAuthOpen(false);
  }, []);

  useEffect(() => {
    if (!isGuest) {
      setIsAuthOpen(false);
    }
  }, [isGuest]);

  useEffect(() => {
    if (!isAuthOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const root = authShellRef.current;
      if (!root) {
        return;
      }
      if (event.target instanceof Node && !root.contains(event.target)) {
        closeAuth();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAuth();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeAuth, isAuthOpen]);

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

          {isGuest ? (
            <div className={styles.authShell} ref={authShellRef}>
              <button
                type="button"
                className={`${styles.authTrigger} ${a11y.touchTargetInline} ${a11y.focusRing}`}
                aria-expanded={isAuthOpen}
                aria-controls={authPanelId}
                onClick={() => {
                  setIsAuthOpen((open) => !open);
                }}
              >
                {accountLabel}
              </button>
              {isAuthOpen ? (
                <div
                  id={authPanelId}
                  className={styles.authPopover}
                  role="region"
                  aria-label={accountLabel}
                >
                  <UserAuthPanel layout="popover" />
                </div>
              ) : null}
            </div>
          ) : (
            <UserAuthPanel layout="rail" />
          )}
        </div>
      </div>
    </nav>
  );
}
