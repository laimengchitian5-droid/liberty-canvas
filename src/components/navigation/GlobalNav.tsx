"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { UserAuthPanel } from "@/components/auth/UserAuthPanel";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { deriveCreatorAccent } from "@/lib/rubel/creatorDisplay";
import { DEFAULT_GUEST_USER_ID } from "@/lib/user/constants";
import { selectNavProfile, useUserStore } from "@/store/userStore";
import a11y from "@/styles/accessibility.module.css";
import styles from "./GlobalNav.module.css";

export function GlobalNav() {
  const pathname = usePathname();
  const { messages } = useI18n();
  const { nav } = messages;
  const { userId, status, displayName, avatarInitials, appsAuthored } =
    useUserStore(useShallow(selectNavProfile));

  const accentClass = deriveCreatorAccent(displayName);
  const isGuest = userId === DEFAULT_GUEST_USER_ID;

  const NAV_ITEMS = [
    {
      href: "/",
      label: nav.hub,
      shortLabel: nav.hubShort,
      ariaLabel: nav.hub,
    },
    {
      href: "/diagnosis/play/personality-spectrum",
      label: nav.assessment,
      shortLabel: nav.assessmentShort,
      ariaLabel: nav.assessment,
    },
    {
      href: "/diagnosis",
      label: nav.diagnosis,
      shortLabel: nav.diagnosisShort,
      ariaLabel: nav.diagnosis,
    },
    {
      href: "/create",
      label: nav.create,
      shortLabel: nav.createShort,
      ariaLabel: nav.create,
    },
  ] as const;

  return (
    <nav className={`${styles.bar} lc-print-hide`} aria-label={`${PRODUCT_NAME} navigation`}>
      <div className={styles.barInner}>
        <div className={styles.primaryRow}>
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
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href} className={styles.tabItem}>
                  <Link
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
                  </Link>
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
