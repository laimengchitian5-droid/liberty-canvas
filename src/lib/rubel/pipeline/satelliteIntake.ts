import type { Diagnosis, PlayOutcome } from "@/types/rubel";
import { calculateDiagnosisResult } from "@/lib/rubel/calculateDiagnosisResult";
import type { SatelliteIntakeRecord } from "@/lib/rubel/contracts/pipeline";

/**
 * Satellite funnel: free-text intake → type matrix → PlayOutcome.
 * Maps text length to binary option index, then overlays verbalization anchor.
 */
export function satelliteIntakeToOutcome(
  diagnosis: Diagnosis,
  intake: SatelliteIntakeRecord,
): PlayOutcome {
  const question = diagnosis.questions[0];
  const options = question?.options ?? [];
  const pickIndex = intake.userText.trim().length % Math.max(options.length, 1);
  const optionId = options[pickIndex]?.id ?? options[0]?.id;

  const answers =
    question && optionId
      ? [{ questionId: question.id, optionId }]
      : [];

  const outcome = calculateDiagnosisResult(diagnosis, answers);

  return {
    ...outcome,
    verbalizationAnchor: {
      questionText: intake.promptText,
      chosenOptionText: intake.userText.trim(),
    },
  };
}

export function buildPlayRoute(playDiagnosisId: string): string {
  return `/play/${playDiagnosisId}`;
}

export function buildDiscoverRoute(locale: string, slug: string): string {
  return `/discover/${locale}/${slug}`;
}
