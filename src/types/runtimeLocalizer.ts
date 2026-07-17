/**
 * Runtime localization envelope:
 * English cultural CoT (dev-only) + locale-native diagnostic meta for UI mount.
 */

import type { Locale } from "@/lib/i18n/config";

export interface LocalizedDiagnosticMeta {
  /** Culturally adapted diagnosis title. */
  readonly title: string;
  /** Culturally adapted short description. */
  readonly description: string;
  /** Locale-native CTA for starting the diagnosis. */
  readonly startButtonText: string;
}

export interface RuntimeInternalReasoning {
  /** English analysis of cultural nuance for the target locale. */
  readonly culturalAdaptationAnalysisEnglish: string;
  /** English check that Adult-Cute / affirming tone is preserved. */
  readonly toneConsistencyCheckEnglish: string;
}

export interface RuntimeLocalizationResult {
  readonly internalReasoning: RuntimeInternalReasoning;
  readonly localizedOutput: LocalizedDiagnosticMeta;
}

/** Master (source) copy — typically Japanese authoring language. */
export interface DiagnosticMasterData {
  readonly title: string;
  readonly description: string;
}

/** Same app locale set as i18n — no separate router required. */
export type RuntimeLocalizerLocale = Locale;
