import {
  createEmptyAcademicVector,
  freezeAcademicVector,
  type AcademicTraitVector,
} from "@/lib/diagnosis/academicTraitVector";
import type { TraitVector } from "@/types/rubel";

function normalizeRubelTrait(value: number): number {
  return Math.max(0, Math.min(1, (value + 5) / 10));
}

export function mapRubelProfileToAcademicVector(
  profile: TraitVector,
): AcademicTraitVector {
  const raw = createEmptyAcademicVector();
  const empathy = normalizeRubelTrait(profile.empathy_need);

  raw.trait_openness = normalizeRubelTrait(profile.openness);
  raw.trait_empathy = empathy;
  raw.trait_agreeableness = empathy * 0.85;
  raw.trait_extraversion = normalizeRubelTrait(profile.ego);
  raw.trait_conscientiousness = 0.45 + empathy * 0.2;
  raw.trait_neuroticism = Math.max(0.15, 0.55 - normalizeRubelTrait(profile.openness) * 0.25);

  return freezeAcademicVector(raw);
}
