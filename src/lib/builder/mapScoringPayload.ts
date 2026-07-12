import type { LegalTraitKey } from "@/lib/diagnosis/academicTraitVector";
import type { OceanTraitKey, ScoringPayload } from "@/types/builder";
import type { TraitWeightMap } from "@/types/diagnosisCompiler";

const OCEAN_TO_LEGAL: Readonly<Record<OceanTraitKey, LegalTraitKey>> = {
  openness: "trait_openness",
  conscientiousness: "trait_conscientiousness",
  extraversion: "trait_extraversion",
  agreeableness: "trait_agreeableness",
  neuroticism: "trait_neuroticism",
};

/**
 * Maps creator-facing OCEAN payload → internal academic trait weights.
 * Creators never see LegalTraitKey or normalization math.
 */
export function mapScoringPayloadToTraitWeights(
  payload: ScoringPayload,
): TraitWeightMap {
  const weights: Partial<Record<LegalTraitKey, number>> = {};

  for (const [oceanKey, value] of Object.entries(payload)) {
    const legalKey = OCEAN_TO_LEGAL[oceanKey as OceanTraitKey];

    if (legalKey !== undefined && typeof value === "number") {
      weights[legalKey] = value;
    }
  }

  return weights;
}

export function mergeScoringPayloads(
  left: ScoringPayload,
  right: ScoringPayload,
): ScoringPayload {
  const merged: Partial<Record<OceanTraitKey, number>> = { ...left };

  for (const [key, value] of Object.entries(right)) {
    const traitKey = key as OceanTraitKey;

    if (typeof value === "number") {
      merged[traitKey] = (merged[traitKey] ?? 0) + value;
    }
  }

  return merged;
}
