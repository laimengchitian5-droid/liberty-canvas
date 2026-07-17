/**
 * Forge AI psychometrics envelope:
 * English CoT (dev-only) + locale-native question/options for the editor.
 */

/** Big Five letter keys — psychometrics short form (not builder long-form OceanTraitKey). */
export const OCEAN_LETTER_KEYS = ["O", "C", "E", "A", "N"] as const;

export type OceanLetterKey = (typeof OCEAN_LETTER_KEYS)[number];

export type OceanWeights = Readonly<Record<OceanLetterKey, number>>;

export interface GeneratedOption {
  readonly optionText: string;
  readonly weights: OceanWeights;
}

export interface ForgeInternalReasoning {
  /** English psychometric deconstruction — never shown in production UI. */
  readonly psychometricAnalysisEnglish: string;
  /** English justification for OCEAN weight allocation. */
  readonly weightJustificationEnglish: string;
}

export interface ForgeLocalizedOutput {
  /** Cleaned, locale-native question stem. */
  readonly questionText: string;
  /** Polar-opposite pair — exactly two options. */
  readonly options: readonly [GeneratedOption, GeneratedOption];
}

export interface ForgeAiFeedbackResult {
  readonly internalReasoning: ForgeInternalReasoning;
  readonly localizedOutput: ForgeLocalizedOutput;
}

export type ForgeAiLocale = "ja" | "en" | "ko" | "zh" | "fr" | "de";
