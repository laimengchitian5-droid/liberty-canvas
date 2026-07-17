import type { BuilderDiagnosisDefinition } from "@/types/builder";
import { OCEAN_TRAIT_KEYS } from "@/types/builder";
import type { PsychFrameworkId } from "@/lib/diagnosis/scoring/types";
import type { ResultLayoutKind } from "@/types/diagnosisCompiler";

export interface FrameworkTemplate {
  id: PsychFrameworkId;
  label: string;
  description: string;
  defaultLayout: ResultLayoutKind;
  defaultChoiceScores: Readonly<
    Partial<Record<(typeof OCEAN_TRAIT_KEYS)[number], number>>
  >;
  defaultTraitProfile: Readonly<Record<string, number>>;
}

export const FRAMEWORK_TEMPLATES: Readonly<Record<PsychFrameworkId, FrameworkTemplate>> =
  {
    ocean: {
      id: "ocean",
      label: "Big Five (OCEAN)",
      description: "5因子モデル — 学術的で汎用的な性格ベクトル",
      defaultLayout: "full_affirmation_chart",
      defaultChoiceScores: { openness: 0.35, extraversion: 0.2 },
      defaultTraitProfile: {
        trait_openness: 0.65,
        trait_conscientiousness: 0.5,
        trait_extraversion: 0.45,
        trait_agreeableness: 0.55,
        trait_empathy: 0.6,
        trait_neuroticism: 0.35,
      },
    },
    four_axis: {
      id: "four_axis",
      label: "Liberty 4軸",
      description: "共感・論理・創造・導き — LibertyCanvas 独自 taxonomy",
      defaultLayout: "character_archetype_card",
      defaultChoiceScores: { agreeableness: 0.4, openness: 0.25 },
      defaultTraitProfile: {
        trait_empathy: 0.75,
        trait_agreeableness: 0.65,
        trait_openness: 0.55,
        trait_conscientiousness: 0.45,
        trait_extraversion: 0.4,
        trait_neuroticism: 0.3,
      },
    },
    custom: {
      id: "custom",
      label: "カスタム",
      description: "自由にスコアと結果プロファイルを設計",
      defaultLayout: "compatibility_radar",
      defaultChoiceScores: { openness: 0.2, conscientiousness: 0.2 },
      defaultTraitProfile: {
        trait_openness: 0.5,
        trait_conscientiousness: 0.5,
        trait_extraversion: 0.5,
        trait_agreeableness: 0.5,
        trait_empathy: 0.5,
        trait_neuroticism: 0.5,
      },
    },
  };

export function applyFrameworkTemplate(
  definition: BuilderDiagnosisDefinition,
  frameworkId: PsychFrameworkId,
): BuilderDiagnosisDefinition {
  const template = FRAMEWORK_TEMPLATES[frameworkId];

  return {
    ...definition,
    frameworkId,
    resultConfig: {
      layout: template.defaultLayout,
      results: definition.resultConfig.results.map((result, index) =>
        index === 0
          ? {
              ...result,
              traitProfile: { ...template.defaultTraitProfile },
            }
          : result,
      ),
    },
    blocks: definition.blocks.map((block) => {
      if (block.type !== "CONVERSATIONAL_QUESTION") {
        return block;
      }

      return {
        ...block,
        choices: block.choices.map((choice, choiceIndex) =>
          choiceIndex === 0
            ? { ...choice, scores: { ...template.defaultChoiceScores } }
            : choice,
        ),
      };
    }),
  };
}
