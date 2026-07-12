import { inferCrossLingualKeywords } from "@/lib/rubel/i18n/constants";
import { getPersonaPresetOrDefault } from "@/lib/rubel/personaPresets";
import type { Diagnosis } from "@/types/rubel";
import type { LocaleCode } from "@/types/rubel-i18n";

export interface QuickCompilerInput {
  title: string;
  creatorName: string;
  language: LocaleCode;
  questionText: string;
  optionAText: string;
  optionBText: string;
  personaPresetId: string;
}

function traitModifiers(openness: number, empathyNeed: number, ego: number) {
  return [
    { trait: "openness" as const, value: openness },
    { trait: "empathy_need" as const, value: empathyNeed },
    { trait: "ego" as const, value: ego },
  ];
}

/**
 * Dify-style compiler: maps visual persona label → structured aiConfig JSON.
 * Produces a single-question, 2-choice diagnosis ready for the play pipeline.
 */
export function buildQuickCompilerDiagnosis(input: QuickCompilerInput): Diagnosis {
  const preset = getPersonaPresetOrDefault(input.personaPresetId);
  const diagnosisId = `rubel-${crypto.randomUUID().slice(0, 8)}`;
  const questionId = `q-${crypto.randomUUID().slice(0, 8)}`;
  const trimmedTitle = input.title.trim();
  const creatorName = input.creatorName.trim() || "Anonymous Creator";

  return {
    id: diagnosisId,
    title: trimmedTitle,
    creatorName,
    language: input.language,
    searchKeywords: inferCrossLingualKeywords(trimmedTitle, input.language),
    totalSubmissions: 0,
    personaPresetId: preset.id,
    results: [
      {
        id: "result-persona",
        name: preset.label,
        baselineProfile: { ...preset.baselineProfile },
        aiConfig: { ...preset.aiConfig },
      },
    ],
    questions: [
      {
        id: questionId,
        text: input.questionText.trim(),
        options: [
          {
            id: `${questionId}-a`,
            text: input.optionAText.trim(),
            scoreModifier: traitModifiers(-2, 1, 0),
          },
          {
            id: `${questionId}-b`,
            text: input.optionBText.trim(),
            scoreModifier: traitModifiers(2, -1, 1),
          },
        ],
      },
    ],
  };
}
