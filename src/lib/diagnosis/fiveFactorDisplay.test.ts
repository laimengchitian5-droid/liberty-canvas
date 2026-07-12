import { describe, expect, it } from "vitest";
import {
  buildDetailedBehavioralAnalysis,
  buildFiveFactorRadar,
} from "@/lib/diagnosis/fiveFactorDisplay";
import { getPlugDiagnosisBySlug } from "@/config/diagnoses";
import { compileLegallySafeResult } from "@/lib/diagnosis/compileLegallySafeResult";
import { extractQuestionBlocks } from "@/lib/diagnosis/extractDiagnosisElements";

describe("fiveFactorDisplay", () => {
  it("builds 5-factor radar from academic vector", () => {
    const definition = getPlugDiagnosisBySlug("oshikatsu");
    expect(definition).not.toBeNull();

    const blocks = extractQuestionBlocks(definition!);
    expect(blocks.length).toBeGreaterThanOrEqual(20);

    const answers = blocks.slice(0, 5).map((block, index) => ({
      blockId: block.id,
      optionId: block.options?.[0]?.id ?? `${block.id}-a`,
      recordedAt: index,
    }));

    const outcome = compileLegallySafeResult(definition!, answers);
    const radar = buildFiveFactorRadar(outcome.academicVector);

    expect(radar).toHaveLength(5);
    expect(radar.map((point) => point.label)).toEqual([
      "外向性",
      "開放性",
      "共感・協調性",
      "誠実性",
      "感情安定性",
    ]);
  });

  it("builds Japanese behavioral analysis paragraphs", () => {
    const definition = getPlugDiagnosisBySlug("romance");
    expect(definition).not.toBeNull();

    const blocks = extractQuestionBlocks(definition!);
    const answers = blocks.slice(0, 8).map((block, index) => ({
      blockId: block.id,
      optionId: block.options?.[0]?.id ?? `${block.id}-a`,
      recordedAt: index,
    }));

    const outcome = compileLegallySafeResult(definition!, answers);
    const analysis = buildDetailedBehavioralAnalysis(
      outcome.winningArchetype.analysis,
      outcome.dominantTraits,
    );

    expect(analysis).not.toMatch(/MBTI|Celebration|Type [0-9]/i);
    expect(analysis.length).toBeGreaterThan(outcome.winningArchetype.analysis.length);
  });
});
