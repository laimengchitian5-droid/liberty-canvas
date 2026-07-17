import { describe, expect, it } from "vitest";
import { getPlugDiagnosisBySlug } from "@/config/diagnoses";
import { compileLegallySafeResult } from "@/lib/diagnosis/compileLegallySafeResult";
import { extractQuestionBlocks } from "@/lib/diagnosis/extractDiagnosisElements";
import { isCosmicPlanetKind } from "@/lib/diagnosis/cosmicPlanetEngine";
import {
  buildCosmicOgImageUrl,
  buildPlugResultShareUrl,
  buildRadarLevelsFromFactorPercentiles,
  decodePlugResultShareQuery,
  encodePlugResultShareQuery,
  extractFactorPercentiles,
  parseFactorPercentiles,
  rebuildOutcomeFromShareQuery,
} from "@/lib/diagnosis/plugResultShare";

describe("plugResultShare", () => {
  it("round-trips share query params", () => {
    const definition = getPlugDiagnosisBySlug("oshikatsu");
    expect(definition).not.toBeNull();

    const answers = extractQuestionBlocks(definition!)
      .slice(0, 12)
      .map((block, index) => ({
        blockId: block.id,
        optionId: block.options?.[0]?.id ?? `${block.id}-a`,
        recordedAt: index,
      }));

    const outcome = compileLegallySafeResult(definition!, answers);
    const factors = extractFactorPercentiles(outcome);
    const query = {
      planet: "sun_affirmation" as const,
      archetypeId: outcome.winningArchetype.id,
      factors,
    };

    const encoded = encodePlugResultShareQuery(query);
    const decoded = decodePlugResultShareQuery(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded?.planet).toBe("sun_affirmation");
    expect(decoded?.archetypeId).toBe(outcome.winningArchetype.id);
    expect(decoded?.factors).toEqual(factors);
  });

  it("builds deep link and cosmic OG urls", () => {
    const definition = getPlugDiagnosisBySlug("romance");
    expect(definition).not.toBeNull();

    const answers = extractQuestionBlocks(definition!)
      .slice(0, 8)
      .map((block, index) => ({
        blockId: block.id,
        optionId: block.options?.[0]?.id ?? `${block.id}-a`,
        recordedAt: index,
      }));

    const outcome = compileLegallySafeResult(definition!, answers);
    const shareUrl = buildPlugResultShareUrl(definition!.slug, outcome, "nebula_dream");

    expect(shareUrl).toContain("/diagnosis/play/romance/result");
    expect(shareUrl).toContain("planet=nebula_dream");
    expect(shareUrl).toContain("archetype=");

    const ogUrl = buildCosmicOgImageUrl({
      slug: "romance",
      planet: "nebula_dream",
      archetypeId: outcome.winningArchetype.id,
      factors: extractFactorPercentiles(outcome),
    });

    expect(ogUrl).toContain("/api/og/diagnosis");
    expect(ogUrl).toContain("slug=romance");
    expect(ogUrl).toContain("f=");
    expect(isCosmicPlanetKind("nebula_dream")).toBe(true);
  });

  it("parses factor percentiles for OG radar", () => {
    const parsed = parseFactorPercentiles("72-65-80-55-70");
    expect(parsed).toEqual([72, 65, 80, 55, 70]);

    const radar = buildRadarLevelsFromFactorPercentiles(parsed!);
    expect(radar).toHaveLength(5);
    expect(radar[0]?.key).toBe("extraversion");
  });

  it("rebuilds outcome from cold share query", () => {
    const definition = getPlugDiagnosisBySlug("genz");
    expect(definition).not.toBeNull();

    const resultBlock = definition!.elements.find(
      (element) => element.kind === "RESULT_TEMPLATE_BLOCK",
    );

    expect(resultBlock?.kind).toBe("RESULT_TEMPLATE_BLOCK");

    if (resultBlock?.kind !== "RESULT_TEMPLATE_BLOCK") {
      return;
    }

    const archetype = resultBlock.results[0]!;
    const query = {
      planet: "aurora_social" as const,
      archetypeId: archetype.id,
      factors: [70, 55, 62, 48, 80] as const,
    };

    const rebuilt = rebuildOutcomeFromShareQuery(definition!, query);

    expect(rebuilt).not.toBeNull();
    expect(rebuilt?.winningArchetype.id).toBe(archetype.id);
    expect(rebuilt?.isComplete).toBe(true);
  });
});
