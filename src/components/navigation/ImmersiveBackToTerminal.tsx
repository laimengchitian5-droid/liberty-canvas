"use client";

import { BrandNavLink } from "@/components/brand/BrandNavLink";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import { resolveStationHeaderCopy } from "@/lib/station/stationHeaderCopy";
import styles from "./ImmersiveBackToTerminal.module.css";

export interface ImmersiveBackToTerminalProps {
  /** Optional override; defaults to active i18n locale. */
  readonly locale?: string;
}

/**
 * Immersive-shell escape hatch → `/station/{locale}`.
 * Fixed corner chrome (not inlined into game UI); BrandNavLink keeps bridge intact.
 *
 * Rejected sketch defects (do not reintroduce):
 * - `/{locale}/station` → `/station/{locale}`
 * - `uiText[...] || uiText.en` self-reference → `resolveStationHeaderCopy`
 * - raw `<Link>` skipping brand bridge
 * - emoji labels / game-surface inline styles
 * - z-index 50 (loses to sticky immersive bar @ 800)
 */
export const ImmersiveBackToTerminal = ({
  locale: localeOverride,
}: ImmersiveBackToTerminalProps) => {
  const { locale: i18nLocale } = useI18n();
  const locale = resolveGameLocale(localeOverride ?? i18nLocale);
  const copy = resolveStationHeaderCopy(locale);
  const hubHref = `/station/${locale}`;

  return (
    <div className={`${styles.escapeGateContainer} lc-print-hide`}>
      <BrandNavLink
        href={hubHref}
        className={styles.escapeLink}
        aria-label={copy.backToTerminalAria}
      >
        <span className={styles.escapeText}>{copy.backToTerminal}</span>
      </BrandNavLink>
    </div>
  );
};

/** Sketch-compatible alias. */
export const ImmersiveBackButton = ImmersiveBackToTerminal;
