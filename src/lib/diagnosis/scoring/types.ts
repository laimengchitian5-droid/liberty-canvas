import type {
  AcademicTraitVector,
  LegalTraitKey,
} from "@/lib/diagnosis/academicTraitVector";
import type { FiveFactorRadarPoint } from "@/lib/diagnosis/fiveFactorDisplay";
import type { CategoryScoreMap, PersonalityCategory } from "@/types/diagnosis";
import type { OceanScores } from "@/lib/psychology/types";

export const PSYCH_FRAMEWORK_IDS = ["ocean", "four_axis", "custom"] as const;

export type PsychFrameworkId = (typeof PSYCH_FRAMEWORK_IDS)[number];

export function isPsychFrameworkId(value: string): value is PsychFrameworkId {
  return (PSYCH_FRAMEWORK_IDS as readonly string[]).includes(value);
}

export interface UnifiedScoringView {
  frameworkId: PsychFrameworkId;
  academicVector: AcademicTraitVector;
  fiveFactorRadar: readonly FiveFactorRadarPoint[];
  dominantLegalTraits: readonly LegalTraitKey[];
}

export type ScoringAdapterInput =
  | { kind: "academic"; vector: AcademicTraitVector }
  | { kind: "ocean"; scores: OceanScores }
  | { kind: "four_axis"; scores: CategoryScoreMap; dominant?: PersonalityCategory };
