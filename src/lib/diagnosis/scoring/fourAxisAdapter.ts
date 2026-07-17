import {
  createEmptyAcademicVector,
  normalizeAcademicVector,
  type AcademicTraitVector,
} from "@/lib/diagnosis/academicTraitVector";
import type { CategoryScoreMap, PersonalityCategory } from "@/types/diagnosis";

function clampUnit(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(1, value));
}

/**
 * Projects LibertyCanvas 4-axis scores (empathy/logic/creativity/leadership)
 * into the internal academic vector — no MBTI nomenclature exposed.
 */
export function fourAxisScoresToAcademicVector(
  scores: CategoryScoreMap,
): AcademicTraitVector {
  const max = Math.max(
    1,
    scores.empathy,
    scores.logic,
    scores.creativity,
    scores.leadership,
  );

  const normalized = {
    empathy: scores.empathy / max,
    logic: scores.logic / max,
    creativity: scores.creativity / max,
    leadership: scores.leadership / max,
  };

  const raw = createEmptyAcademicVector();
  raw.trait_empathy = clampUnit(normalized.empathy);
  raw.trait_agreeableness = clampUnit(normalized.empathy * 0.85);
  raw.trait_openness = clampUnit(normalized.creativity);
  raw.trait_conscientiousness = clampUnit(normalized.logic);
  raw.trait_extraversion = clampUnit(normalized.leadership);
  raw.trait_neuroticism = clampUnit(1 - normalized.logic * 0.6);

  return normalizeAcademicVector(raw);
}

export function resolveFourAxisDominant(scores: CategoryScoreMap): PersonalityCategory {
  const entries = Object.entries(scores) as Array<[PersonalityCategory, number]>;
  entries.sort((left, right) => right[1] - left[1]);
  return entries[0]?.[0] ?? "empathy";
}
