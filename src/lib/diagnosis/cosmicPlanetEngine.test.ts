import { describe, expect, it } from "vitest";
import { getPlugDiagnosisBySlug } from "@/config/diagnoses";
import { compileLegallySafeResult } from "@/lib/diagnosis/compileLegallySafeResult";
import { extractQuestionBlocks } from "@/lib/diagnosis/extractDiagnosisElements";
import {
  buildCosmicCharacterSheet,
  buildCosmicRadarPolygonPoints,
  resolveCosmicPlanetKind,
} from "@/lib/diagnosis/cosmicPlanetEngine";

describe("cosmicPlanetEngine", () => {
  it("resolves a planet kind and Japanese nickname", () => {
    const definition = getPlugDiagnosisBySlug("romance");
    expect(definition).not.toBeNull();

    const answers = extractQuestionBlocks(definition!).map((block, index) => ({
      blockId: block.id,
      optionId: block.options?.[0]?.id ?? `${block.id}-a`,
      recordedAt: index,
    }));

    const outcome = compileLegallySafeResult(definition!, answers);
    const sheet = buildCosmicCharacterSheet(outcome.academicVector);

    expect(sheet.planet.nickname.length).toBeGreaterThan(4);
    expect(sheet.planet.nickname).not.toMatch(/Celebration|Type [0-9]/i);
    expect(sheet.energyLevels).toHaveLength(5);
    expect(sheet.narrative.strengths.length).toBeGreaterThan(20);
    expect(sheet.narrative.universalCompatibility).toContain("相性");
  });

  it("builds SVG radar polygon points", () => {
    const definition = getPlugDiagnosisBySlug("oshikatsu");
    expect(definition).not.toBeNull();

    const answers = extractQuestionBlocks(definition!)
      .slice(0, 10)
      .map((block, index) => ({
        blockId: block.id,
        optionId: block.options?.[0]?.id ?? `${block.id}-a`,
        recordedAt: index,
      }));

    const outcome = compileLegallySafeResult(definition!, answers);
    const kind = resolveCosmicPlanetKind(outcome.academicVector);
    expect(kind).toBeTruthy();

    const sheet = buildCosmicCharacterSheet(outcome.academicVector);
    const points = buildCosmicRadarPolygonPoints(sheet.energyLevels, 100, 100, 72);

    expect(points.split(" ").length).toBe(5);
  });
});
