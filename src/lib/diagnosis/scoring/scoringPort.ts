import {
  buildUnifiedScoringView,
  buildUnifiedScoringViewFromVector,
} from "@/lib/diagnosis/scoring/buildUnifiedScoringView";
import type {
  PsychFrameworkId,
  ScoringAdapterInput,
  UnifiedScoringView,
} from "@/lib/diagnosis/scoring/types";
import type { AcademicTraitVector } from "@/lib/diagnosis/academicTraitVector";

export type ScoringComputeBackend = "typescript" | "wasm";

export interface ScoringComputePort {
  readonly backend: ScoringComputeBackend;
  buildFromInput(
    input: ScoringAdapterInput,
    frameworkId?: PsychFrameworkId,
  ): UnifiedScoringView;
  buildFromVector(
    vector: AcademicTraitVector,
    frameworkId?: PsychFrameworkId,
  ): UnifiedScoringView;
}

function resolveScoringBackend(): ScoringComputeBackend {
  return process.env.LC_SCORING_BACKEND === "wasm" ? "wasm" : "typescript";
}

const typescriptScoringPort: ScoringComputePort = {
  backend: "typescript",
  buildFromInput: (input, frameworkId = "ocean") =>
    buildUnifiedScoringView(input, frameworkId),
  buildFromVector: (vector, frameworkId = "ocean") =>
    buildUnifiedScoringViewFromVector(vector, frameworkId),
};

/**
 * Future Wasm module can replace this port without changing UI/domain callers.
 * Set LC_SCORING_BACKEND=wasm once a compiled scoring module is linked.
 */
export function resolveScoringComputePort(): ScoringComputePort {
  if (resolveScoringBackend() === "wasm") {
    console.warn(
      "[scoring] LC_SCORING_BACKEND=wasm requested — falling back to TypeScript port until Wasm module ships.",
    );
  }

  return typescriptScoringPort;
}

export const scoringComputePort = resolveScoringComputePort();
