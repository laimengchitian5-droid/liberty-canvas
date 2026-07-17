import { describe, expect, it } from "vitest";
import { buildLocalEmbedding, cosineSimilarity } from "@/lib/catalog/localEmbedding";
import { isPostgresConfigured, resolveSearchBackend } from "@/lib/catalog/searchConfig";
import { tokenSearchAdapter } from "@/lib/catalog/tokenSearchAdapter";
import { scoringComputePort } from "@/lib/diagnosis/scoring/scoringPort";
import { fourAxisScoresToAcademicVector } from "@/lib/diagnosis/scoring/fourAxisAdapter";

describe("localEmbedding", () => {
  it("returns normalized vectors with positive similarity for related text", () => {
    const left = buildLocalEmbedding("love romance personality");
    const right = buildLocalEmbedding("love language test");
    expect(cosineSimilarity(left, right)).toBeGreaterThan(0);
  });
});

describe("searchConfig", () => {
  it("defaults to token backend without postgres env", () => {
    expect(isPostgresConfigured()).toBe(false);
    expect(resolveSearchBackend()).toBe("token");
  });
});

describe("tokenSearchAdapter", () => {
  it("searches catalog in memory", async () => {
    const result = await tokenSearchAdapter.search("romance", 5);
    expect(result.backend).toBe("token");
    expect(result.results.length).toBeGreaterThan(0);
  });
});

describe("scoringComputePort", () => {
  it("computes unified view via typescript backend", () => {
    const vector = fourAxisScoresToAcademicVector({
      empathy: 8,
      logic: 2,
      creativity: 4,
      leadership: 3,
    });
    const view = scoringComputePort.buildFromVector(vector, "four_axis");
    expect(view.frameworkId).toBe("four_axis");
    expect(view.fiveFactorRadar).toHaveLength(5);
    expect(scoringComputePort.backend).toBe("typescript");
  });
});
