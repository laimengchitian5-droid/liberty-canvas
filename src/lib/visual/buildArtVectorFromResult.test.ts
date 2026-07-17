import { describe, expect, it } from "vitest";
import {
  buildPlayArtVector,
  buildPsychArtVector,
} from "@/lib/visual/buildArtVectorFromResult";
import type { PsychQuizResult } from "@/lib/psychology/types";

describe("buildArtVectorFromResult", () => {
  it("maps OCEAN highs/lows into 8 axes", () => {
    const result = {
      typeName: "Explorer",
      summary: "s",
      anchorAnswer: "a",
      oceanScores: {
        openness: 1,
        conscientiousness: 0,
        extraversion: 1,
        agreeableness: 0,
        neuroticism: 0,
      },
    } as PsychQuizResult;

    const vector = buildPsychArtVector(result);
    expect(vector).toHaveLength(8);
    expect(vector[0]).toBe(6);
    expect(vector[1]).toBe(3);
  });

  it("maps play traits into clamped axes", () => {
    const vector = buildPlayArtVector(
      { openness: 0.8, empathy_need: 0.4, ego: 0.2 },
      "Luna",
    );
    expect(vector).toHaveLength(8);
    expect(vector.every((v) => v >= 1 && v <= 7)).toBe(true);
  });
});
