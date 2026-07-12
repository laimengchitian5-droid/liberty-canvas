import { describe, expect, it } from "vitest";
import { convertBuilderToPlugDefinition } from "@/lib/builder/convertBuilderToPlugDefinition";
import { buildCosmicCharacterSheet } from "@/lib/diagnosis/cosmicPlanetEngine";
import { compileLegallySafeResult } from "@/lib/diagnosis/compileLegallySafeResult";
import { buildFiveFactorRadar } from "@/lib/diagnosis/fiveFactorDisplay";
import { extractFactorPercentiles } from "@/lib/diagnosis/plugResultShare";
import type { BuilderDiagnosisDefinition } from "@/types/builder";

const SAMPLE_BUILDER: BuilderDiagnosisDefinition = {
  id: "pipeline-sample",
  slug: "pipeline-love",
  eyebrow: "Pipeline",
  title: "パイプライン検証診断",
  subtitle: "builder→plug→score→cosmic の契約テスト",
  estimatedMinutes: 3,
  themeColor: "#8B5CF6",
  creatorTags: ["恋愛"],
  startBlockId: "q-1",
  blocks: [
    {
      type: "CONVERSATIONAL_QUESTION",
      id: "q-1",
      prompt: "連絡が来たときの反応は？",
      choices: [
        {
          id: "q-1-a",
          label: "すぐ返信する",
          scores: { extraversion: 0.6, agreeableness: 0.3 },
        },
        {
          id: "q-1-b",
          label: "考えてから返す",
          scores: { conscientiousness: 0.5, agreeableness: 0.4 },
        },
      ],
    },
  ],
  resultConfig: {
    layout: "character_archetype_card",
    results: [
      {
        id: "lc-pipeline-alpha",
        title: "パイプラインAlpha",
        subtitle: "契約テスト用タイプ",
        analysis: "LibertyCanvas 独自分析：パイプライン検証用。",
        themeColor: "#8B5CF6",
        traitProfile: {
          trait_openness: 0.7,
          trait_extraversion: 0.6,
          trait_agreeableness: 0.5,
          trait_conscientiousness: 0.4,
          trait_empathy: 0.5,
          trait_neuroticism: 0.3,
        },
      },
    ],
  },
};

describe("builderPipeline fitness function", () => {
  it("runs builder → plug → legal score → cosmic sheet → share factors", () => {
    const plug = convertBuilderToPlugDefinition(SAMPLE_BUILDER);

    const outcome = compileLegallySafeResult(plug, [
      { blockId: "q-1", optionId: "q-1-a", recordedAt: 1 },
    ]);

    expect(outcome.isComplete).toBe(true);
    expect(outcome.winningArchetype.id.startsWith("lc-")).toBe(true);

    const radar = buildFiveFactorRadar(outcome.academicVector);
    expect(radar).toHaveLength(5);

    const cosmic = buildCosmicCharacterSheet(outcome.academicVector);
    expect(cosmic.planet.kind).toBeTruthy();
    expect(cosmic.energyLevels).toHaveLength(5);

    const factors = extractFactorPercentiles(outcome);
    expect(factors).toHaveLength(5);
    expect(factors.every((value) => value >= 0 && value <= 100)).toBe(true);
  });
});
