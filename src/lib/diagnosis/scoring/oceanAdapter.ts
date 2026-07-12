import {
  createEmptyAcademicVector,
  freezeAcademicVector,
  normalizeAcademicVector,
  type AcademicTraitVector,
} from "@/lib/diagnosis/academicTraitVector";
import type { OceanScores } from "@/lib/psychology/types";

function clampUnit(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function oceanScoresToAcademicVector(scores: OceanScores): AcademicTraitVector {
  const values = Object.values(scores);
  const max = Math.max(1, ...values);

  const raw = createEmptyAcademicVector();

  raw.trait_openness = clampUnit(scores.openness / max);
  raw.trait_conscientiousness = clampUnit(scores.conscientiousness / max);
  raw.trait_extraversion = clampUnit(scores.extraversion / max);
  raw.trait_agreeableness = clampUnit(scores.agreeableness / max);
  raw.trait_neuroticism = clampUnit(scores.neuroticism / max);
  raw.trait_empathy = clampUnit(
    (scores.agreeableness / max + (1 - scores.neuroticism / max)) / 2,
  );

  return normalizeAcademicVector(raw);
}

export function academicVectorToOceanScores(
  vector: AcademicTraitVector,
): OceanScores {
  return {
    openness: clampUnit(vector.trait_openness),
    conscientiousness: clampUnit(vector.trait_conscientiousness),
    extraversion: clampUnit(vector.trait_extraversion),
    agreeableness: clampUnit(
      (vector.trait_agreeableness + vector.trait_empathy) / 2,
    ),
    neuroticism: clampUnit(vector.trait_neuroticism),
  };
}

export function freezeOceanAdapterResult(
  vector: AcademicTraitVector,
): AcademicTraitVector {
  return freezeAcademicVector({ ...vector });
}
