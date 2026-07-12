export {
  buildUnifiedScoringView,
  buildUnifiedScoringViewFromVector,
} from "@/lib/diagnosis/scoring/buildUnifiedScoringView";
export { scoringComputePort, resolveScoringComputePort } from "@/lib/diagnosis/scoring/scoringPort";
export type { ScoringComputePort, ScoringComputeBackend } from "@/lib/diagnosis/scoring/scoringPort";
export {
  academicVectorToOceanScores,
  oceanScoresToAcademicVector,
} from "@/lib/diagnosis/scoring/oceanAdapter";
export {
  fourAxisScoresToAcademicVector,
  resolveFourAxisDominant,
} from "@/lib/diagnosis/scoring/fourAxisAdapter";
export {
  isPsychFrameworkId,
  PSYCH_FRAMEWORK_IDS,
  type PsychFrameworkId,
  type ScoringAdapterInput,
  type UnifiedScoringView,
} from "@/lib/diagnosis/scoring/types";
