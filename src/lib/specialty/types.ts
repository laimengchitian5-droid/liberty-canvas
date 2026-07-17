import type { LegalTraitKey } from "@/lib/diagnosis/academicTraitVector";
import type { ResultArchetype, TraitWeightMap } from "@/types/diagnosisCompiler";

/** ISO-like stable identifiers — never derive from display copy. */
export const SPECIALTY_COUNTRY_IDS = [
  "jp",
  "us",
  "ca",
  "br",
  "fr",
  "cl",
  "md",
  "pk",
  "uk",
] as const;

export type SpecialtyCountryId = (typeof SPECIALTY_COUNTRY_IDS)[number];

/**
 * live — handcrafted, culturally reviewed, catalog-eligible.
 * upcoming — template content; blocked from catalog until native review.
 * stub — reserved / empty scaffold (no deep-dive offer).
 */
export type SpecialtyReleasePhase = "live" | "upcoming" | "stub";

export function isSpecialtyDeepDiveLive(phase: SpecialtyReleasePhase): boolean {
  return phase === "live";
}

export interface SpecialtyTraitProfileInput {
  readonly trait_openness: number;
  readonly trait_conscientiousness: number;
  readonly trait_extraversion: number;
  readonly trait_agreeableness: number;
  readonly trait_neuroticism: number;
  readonly trait_empathy: number;
}

export interface SpecialtyBArchetypeSeed {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly analysis: string;
  readonly themeColor: string;
  readonly affirmationLine: string;
  readonly traitProfile: SpecialtyTraitProfileInput;
}

export interface SpecialtyCArchetypeSeed {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly analysis: string;
  readonly themeColor: string;
  readonly affirmationLine: string;
  readonly traitProfile: SpecialtyTraitProfileInput;
}

export interface SpecialtyCountryRecord {
  readonly id: SpecialtyCountryId;
  readonly flagEmoji: string;
  readonly countryNameJa: string;
  readonly countryNameEn: string;
  /** Taboo-safe specialty label for diagnosis copy (no alcohol promotion). */
  readonly specialtyLabelJa: string;
  readonly specialtyLabelEn: string;
  readonly history: readonly string[];
  readonly context: readonly string[];
  readonly significance: readonly string[];
  readonly cSlug: string;
  readonly cTitleJa: string;
  readonly cEyebrowJa: string;
  readonly releasePhase: SpecialtyReleasePhase;
  readonly bArchetype: SpecialtyBArchetypeSeed;
  readonly cArchetypes: readonly SpecialtyCArchetypeSeed[];
}

export interface ResolvedSpecialtyArchetype extends ResultArchetype {
  readonly countryId: SpecialtyCountryId;
  readonly deepDivePath: string;
  readonly deepDiveLive: boolean;
}

export type ValidatedTraitProfile = Readonly<Record<LegalTraitKey, number>>;

export type TraitProfileFactory = (input: SpecialtyTraitProfileInput) => TraitWeightMap;
