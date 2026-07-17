import { describe, expect, it } from "vitest";
import {
  clampArtAxis,
  intensityFromVector,
  toCognitiveArtVector,
} from "@/lib/visual/cognitiveArt";

describe("cognitiveArt", () => {
  it("normalizes short vectors to 8 axes in 1–7", () => {
    const vector = toCognitiveArtVector([2, 8, 0], "seed");
    expect(vector).toHaveLength(8);
    expect(vector.every((v) => v >= 1 && v <= 7)).toBe(true);
    expect(clampArtAxis(99)).toBe(7);
  });

  it("maps intensity from average axis strength", () => {
    expect(intensityFromVector([7, 7, 7, 7, 7, 7, 7, 7])).toBe(100);
    expect(intensityFromVector([1, 1, 1, 1, 1, 1, 1, 1])).toBe(0);
  });
});
