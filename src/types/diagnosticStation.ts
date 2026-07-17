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
  DISC: "disc",
  VIA_STRENGTHS: "via-strengths",
  PF16: "16pf",
  ANIMAL_PSYCHOLOGY: "animal-psychology",
  RIASEC: "riasec",
  LOVE_LANGUAGES: "love-languages",
  EGOGRAM: "egogram",
  TRITYPE: "tritype",
  LOVE_TYPE_16: "love-type-16",
  BLOOD_TYPE: "blood-type",
  ZODIAC_ASTROLOGY: "zodiac-astrology",
} as const;

export type DiagnosticPlatform =
  (typeof DIAGNOSTIC_PLATFORMS)[keyof typeof DIAGNOSTIC_PLATFORMS];

export const DIAGNOSTIC_PLATFORM_IDS = [
  DIAGNOSTIC_PLATFORMS.MBTI_16PERS,
  DIAGNOSTIC_PLATFORMS.STRENGTH_FINDER,
  DIAGNOSTIC_PLATFORMS.ENNEAGRAM,
  DIAGNOSTIC_PLATFORMS.BIG_FIVE,
  DIAGNOSTIC_PLATFORMS.DISC,
  DIAGNOSTIC_PLATFORMS.VIA_STRENGTHS,
  DIAGNOSTIC_PLATFORMS.PF16,
  DIAGNOSTIC_PLATFORMS.ANIMAL_PSYCHOLOGY,
  DIAGNOSTIC_PLATFORMS.RIASEC,
  DIAGNOSTIC_PLATFORMS.LOVE_LANGUAGES,
  DIAGNOSTIC_PLATFORMS.EGOGRAM,
  DIAGNOSTIC_PLATFORMS.TRITYPE,
  DIAGNOSTIC_PLATFORMS.LOVE_TYPE_16,
  DIAGNOSTIC_PLATFORMS.BLOOD_TYPE,
  DIAGNOSTIC_PLATFORMS.ZODIAC_ASTROLOGY,
] as const satisfies readonly DiagnosticPlatform[];

export interface StationTheme {
  /** Banner / gate accent (registry-owned hex only). */
  readonly gateColor: string;
  /** Must equal platform id — display strings live in resolveLineName. */
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
