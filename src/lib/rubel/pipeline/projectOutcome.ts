import type { RubelEnginePayload } from "@/lib/rubel/contracts/pipeline";
import {
  resolveEmpathyInjectionLabel,
  resolveToneInjectionLabel,
} from "@/lib/rubel/pipeline/labelHelpers";
import type { Diagnosis, PlayOutcome } from "@/types/rubel";

/**
 * Projects type-matrix PlayOutcome → normalized HF engine payload.
 * Single projection path for satellite AND quiz funnels.
 */
export function projectOutcomeToEnginePayload(
  diagnosis: Diagnosis,
  outcome: PlayOutcome,
  options?: { intakeSource?: "satellite" | "quiz"; keyword?: string },
): RubelEnginePayload {
  const { tone, activeTherapyMode } = outcome.winningResult.aiConfig;

  return {
    title: diagnosis.title,
    typeName: outcome.winningResult.name,
    tone: resolveToneInjectionLabel(tone),
    empathyLevel: resolveEmpathyInjectionLabel(activeTherapyMode),
    verbalizationAnchor: outcome.verbalizationAnchor,
    compiledSystemPrompt: outcome.compiledPrompt.systemPrompt,
    intakeSource: options?.intakeSource ?? "quiz",
    keyword: options?.keyword,
  };
}

/** @deprecated Use projectOutcomeToEnginePayload */
export const extractResultData = projectOutcomeToEnginePayload;

export type { RubelEnginePayload as RubelResultData };
