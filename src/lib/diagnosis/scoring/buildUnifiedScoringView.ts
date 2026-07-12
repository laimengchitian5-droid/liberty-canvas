import {
  resolveDominantTraits,
  type AcademicTraitVector,
} from "@/lib/diagnosis/academicTraitVector";
import { buildFiveFactorRadar } from "@/lib/diagnosis/fiveFactorDisplay";
import { fourAxisScoresToAcademicVector } from "@/lib/diagnosis/scoring/fourAxisAdapter";
import { oceanScoresToAcademicVector } from "@/lib/diagnosis/scoring/oceanAdapter";
import type {
  PsychFrameworkId,
  ScoringAdapterInput,
  UnifiedScoringView,
} from "@/lib/diagnosis/scoring/types";

function resolveAcademicVector(input: ScoringAdapterInput): AcademicTraitVector {
  switch (input.kind) {
    case "ocean":
      return oceanScoresToAcademicVector(input.scores);
    case "four_axis":
      return fourAxisScoresToAcademicVector(input.scores);
    case "academic":
      return input.vector;
    default: {
      const exhaustive: never = input;
      return exhaustive;
    }
  }
}

export function buildUnifiedScoringView(
  input: ScoringAdapterInput,
  frameworkId: PsychFrameworkId = "ocean",
): UnifiedScoringView {
  const academicVector = resolveAcademicVector(input);
  const fiveFactorRadar = buildFiveFactorRadar(academicVector);

  return {
    frameworkId,
    academicVector,
    fiveFactorRadar,
    dominantLegalTraits: resolveDominantTraits(academicVector, 2),
  };
}

export function buildUnifiedScoringViewFromVector(
  vector: AcademicTraitVector,
  frameworkId: PsychFrameworkId = "ocean",
): UnifiedScoringView {
  return buildUnifiedScoringView({ kind: "academic", vector }, frameworkId);
}
