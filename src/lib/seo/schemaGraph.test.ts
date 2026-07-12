import { describe, expect, it } from "vitest";
import { getPlugDiagnosisBySlug } from "@/config/diagnoses";
import {
  buildOrganizationEntity,
  buildPlayDiagnosisSchemaGraph,
  buildQuizEntity,
  mergeSchemaGraphs,
} from "@/lib/seo/schemaGraph";

describe("schemaGraph", () => {
  it("builds Organization with stable @id", () => {
    const org = buildOrganizationEntity("https://liberty-canvas.vercel.app");
    expect(org["@id"]).toBe("https://liberty-canvas.vercel.app#organization");
    expect(org.name).toBe("LibertyCanvas");
  });

  it("builds Quiz entity for official plug diagnosis", () => {
    const definition = getPlugDiagnosisBySlug("big-five");
    expect(definition).not.toBeNull();

    const graph = buildPlayDiagnosisSchemaGraph(definition!);
    expect(graph["@graph"].length).toBeGreaterThanOrEqual(4);

    const quiz = graph["@graph"].find((node) => node["@type"] === "Quiz");
    expect(quiz).toBeTruthy();
    expect(quiz?.numberOfQuestions).toBeGreaterThan(0);
  });

  it("merges graphs deduping by @id", () => {
    const siteUrl = "https://liberty-canvas.vercel.app";
    const merged = mergeSchemaGraphs(
      {
        "@context": "https://schema.org",
        "@graph": [buildOrganizationEntity(siteUrl)],
      },
      {
        "@context": "https://schema.org",
        "@graph": [
          buildOrganizationEntity(siteUrl),
          buildQuizEntity(getPlugDiagnosisBySlug("romance")!, null, siteUrl),
        ],
      },
    );

    const orgNodes = merged["@graph"].filter((node) => node["@type"] === "Organization");
    expect(orgNodes).toHaveLength(1);
  });
});
