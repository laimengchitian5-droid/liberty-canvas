import { describe, expect, it } from "vitest";
import { compileLegallySafeResult } from "@/lib/diagnosis/compileLegallySafeResult";
import { extractQuestionBlocks } from "@/lib/diagnosis/extractDiagnosisElements";
import {
  buildUnifiedScoringView,
  buildUnifiedScoringViewFromVector,
  fourAxisScoresToAcademicVector,
  oceanScoresToAcademicVector,
} from "@/lib/diagnosis/scoring";
import { getPlugDiagnosisBySlug } from "@/config/diagnoses";

describe("scoring adapters", () => {
  it("maps OCEAN scores into academic vector", () => {
    const vector = oceanScoresToAcademicVector({
      openness: 4,
      conscientiousness: 3,
      extraversion: 2,
      agreeableness: 5,
      neuroticism: 1,
    });

    expect(vector.trait_openness).toBeGreaterThan(0);
    expect(vector.trait_empathy).toBeGreaterThan(0);
    expect(vector.trait_neuroticism).toBeLessThanOrEqual(1);
  });

  it("maps 4-axis scores into academic vector", () => {
    const vector = fourAxisScoresToAcademicVector({
      empathy: 8,
      logic: 2,
      creativity: 5,
      leadership: 3,
    });

    expect(vector.trait_empathy).toBeGreaterThan(vector.trait_conscientiousness);
  });

  it("builds unified 5-factor view from plug compile outcome", () => {
    const definition = getPlugDiagnosisBySlug("big-five");
    expect(definition).not.toBeNull();

    const blocks = extractQuestionBlocks(definition!);
    const answers = blocks.slice(0, 6).map((block, index) => ({
      blockId: block.id,
      optionId: block.options?.[0]?.id ?? `${block.id}-a`,
      recordedAt: index,
    }));

    const outcome = compileLegallySafeResult(definition!, answers);
    const view = buildUnifiedScoringViewFromVector(outcome.academicVector, "ocean");

    expect(view.frameworkId).toBe("ocean");
    expect(view.fiveFactorRadar).toHaveLength(5);
    expect(view.dominantLegalTraits.length).toBe(2);
  });

  it("accepts four_axis adapter input", () => {
    const view = buildUnifiedScoringView(
      {
        kind: "four_axis",
        scores: { empathy: 10, logic: 1, creativity: 4, leadership: 2 },
      },
      "four_axis",
    );

    expect(view.frameworkId).toBe("four_axis");
    expect(view.fiveFactorRadar[0]?.percentile).toBeGreaterThanOrEqual(0);
  });
});
