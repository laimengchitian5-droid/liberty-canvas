/**
 * Public-domain academic trait dimensions (Big Five + supplementary empathy).
 * No proprietary test nomenclature — numeric vectors only.
 */
export const LEGAL_TRAIT_KEYS = [
  "trait_openness",
  "trait_conscientiousness",
  "trait_extraversion",
  "trait_agreeableness",
  "trait_neuroticism",
  "trait_empathy",
] as const;

export type LegalTraitKey = (typeof LEGAL_TRAIT_KEYS)[number];

export type AcademicTraitVector = Readonly<Record<LegalTraitKey, number>>;

/** User-facing labels — standard academic Japanese, not trademarked test names. */
export const ACADEMIC_TRAIT_LABELS: Readonly<Record<LegalTraitKey, string>> = {
  trait_openness: "開放性",
  trait_conscientiousness: "誠実性",
  trait_extraversion: "外向性",
  trait_agreeableness: "協調性",
  trait_neuroticism: "感情変動性",
  trait_empathy: "共感力",
};

export function createEmptyAcademicVector(): Record<LegalTraitKey, number> {
  return {
    trait_openness: 0,
    trait_conscientiousness: 0,
    trait_extraversion: 0,
    trait_agreeableness: 0,
    trait_neuroticism: 0,
    trait_empathy: 0,
  };
}

export function freezeAcademicVector(
  scores: Record<LegalTraitKey, number>,
): AcademicTraitVector {
  return { ...scores };
}

export function normalizeAcademicVector(
  scores: Record<LegalTraitKey, number>,
): AcademicTraitVector {
  const values = LEGAL_TRAIT_KEYS.map((key) => scores[key]);
  const max = Math.max(1, ...values);

  const normalized = createEmptyAcademicVector();

  for (const key of LEGAL_TRAIT_KEYS) {
    normalized[key] = Math.round((scores[key] / max) * 100) / 100;
  }

  return freezeAcademicVector(normalized);
}

export function resolveDominantTraits(
  vector: AcademicTraitVector,
  count = 2,
): LegalTraitKey[] {
  return [...LEGAL_TRAIT_KEYS]
    .sort((left, right) => vector[right] - vector[left])
    .slice(0, count);
}

export function formatAcademicTraitLabel(traitKey: LegalTraitKey): string {
  return ACADEMIC_TRAIT_LABELS[traitKey];
}
