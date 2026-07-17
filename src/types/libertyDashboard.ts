/**
 * Liberty dashboard AI envelope: English reasoning (hidden) + locale UI copy.
 * Entertainment / Adult-Cute only — never clinical diagnosis claims.
 */

import type { Locale } from "@/lib/i18n/config";

export interface LibertyInternalReasoning {
  /** English persona notes for the model chain — never shown to end users in prod UI. */
  readonly personaProfileEnglish: string;
  /** English reading of the 8-axis art vector. */
  readonly vectorInterpretation: string;
  /** How to adapt tone/culture for the target locale. */
  readonly culturalAdaptationNotes: string;
}

export interface LibertyLocalizedOutput {
  /** Cosmic character display name (locale-native). */
  readonly characterName: string;
  /** Unconditional-positive advice (locale-native). */
  readonly aiAdvice: string;
  /** Soft catchphrase for color-energy (locale-native). */
  readonly energyLabel: string;
}

export interface AIAnalysisEngineResult {
  readonly internalReasoning: LibertyInternalReasoning;
  readonly localizedOutput: LibertyLocalizedOutput;
}

/** Same set as app `Locale` — no separate i18n router required. */
export type LibertyDashboardLocale = Locale;
