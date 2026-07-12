import type { Diagnosis, PlayOutcome } from "@/types/rubel";
import type { RubelEnginePayload } from "@/lib/rubel/contracts/pipeline";
import {
  projectOutcomeToEnginePayload,
  type RubelResultData,
} from "@/lib/rubel/pipeline/projectOutcome";

export type { RubelEnginePayload, RubelResultData };

export function extractResultData(
  diagnosis: Diagnosis,
  outcome: PlayOutcome,
  options?: { intakeSource?: "satellite" | "quiz"; keyword?: string },
): RubelEnginePayload {
  return projectOutcomeToEnginePayload(diagnosis, outcome, {
    intakeSource: options?.intakeSource ?? "quiz",
    keyword: options?.keyword,
  });
}

export {
  resolveToneInjectionLabel,
  resolveEmpathyInjectionLabel,
} from "@/lib/rubel/pipeline/labelHelpers";
