/**
 * "Station" metaphor: Liberty Canvas as a transfer hub to major diagnostic platforms.
 * Official URLs are outbound references — we never scrape or mirror their IP.
 */

import type { Locale } from "@/lib/i18n/config";

export const DIAGNOSTIC_PLATFORMS = {
  MBTI_16PERS: "16personalities",
  STRENGTH_FINDER: "strengths-finder",
  ENNEAGRAM: "enneagram",
  BIG_FIVE: "big-five",
} as const;

export type DiagnosticPlatform =
  (typeof DIAGNOSTIC_PLATFORMS)[keyof typeof DIAGNOSTIC_PLATFORMS];

export const DIAGNOSTIC_PLATFORM_IDS = [
  DIAGNOSTIC_PLATFORMS.MBTI_16PERS,
  DIAGNOSTIC_PLATFORMS.STRENGTH_FINDER,
  DIAGNOSTIC_PLATFORMS.ENNEAGRAM,
  DIAGNOSTIC_PLATFORMS.BIG_FIVE,
] as const satisfies readonly DiagnosticPlatform[];

export interface StationTheme {
  /** Banner / gate accent (registry-owned hex only). */
  readonly gateColor: string;
  /** Human line name for UI (locale-resolved separately). */
  readonly lineNameKey: DiagnosticPlatform;
}

export interface DiagnosticRouteManifest {
  readonly id: DiagnosticPlatform;
  /** Official third-party origin (https only). */
  readonly officialUrl: string;
  /** Locales the official site documents as first-class. */
  readonly supportedLocales: readonly Locale[];
  readonly stationTheme: StationTheme;
  /** Optional first-party Liberty deep-link (sanitized internal path). */
  readonly libertyPath?: string;
}

export interface StationSeoPayload {
  readonly title: string;
  readonly description: string;
  readonly canonical: string;
  readonly path: string;
}

export interface AvailableRouteView extends DiagnosticRouteManifest {
  /** True when official UI likely matches user locale; else English fallback. */
  readonly isNativeLocale: boolean;
  readonly lineName: string;
}
