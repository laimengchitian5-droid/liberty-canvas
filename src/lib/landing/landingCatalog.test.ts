import { describe, expect, it } from "vitest";
import {
  buildLandingPageDefinition,
  listAllLandingPages,
  listLandingStaticParams,
} from "@/lib/landing/landingCatalog";
import { buildLandingIntakeOutcome } from "@/lib/landing/landingIntakeBridge";
import { getSeedDiagnosisById } from "@/lib/rubel/repository";

describe("landingCatalog", () => {
  it("generates 120 static params (20 topics × 6 locales)", () => {
    expect(listLandingStaticParams()).toHaveLength(120);
  });

  it("lists all landing pages with absolute urls", () => {
    const pages = listAllLandingPages();
    expect(pages).toHaveLength(120);
    expect(pages[0]?.absoluteUrl).toContain("/discover/");
  });

  it("resolves sixteen-personalities with legal-safe copy", () => {
    const enPage = buildLandingPageDefinition("en", "sixteen-personalities");
    expect(enPage?.copy.headline).toContain("cosmic character");
    expect(enPage?.topic.plugPlayPath).toBe("/diagnosis/play/personality-spectrum");

    const jaPage = buildLandingPageDefinition("ja", "sixteen-personalities");
    expect(jaPage?.copy.headline).not.toMatch(/16Personalities|MBTI/i);
  });

  it("serves fr/de discover copy without trademark terms", () => {
    const frPage = buildLandingPageDefinition("fr", "mbti-personality-types");
    expect(frPage?.copy.headline).toContain("cosmique");
    expect(frPage?.copy.title).toMatch(/1 réponse/i);

    const dePage = buildLandingPageDefinition("de", "enneagram-nine-types");
    expect(dePage?.copy.headline).not.toMatch(/Enneagramm|MBTI/i);
  });

  it("resolves world-specialty-soul discover page", () => {
    const jaPage = buildLandingPageDefinition("ja", "world-specialty-soul");
    expect(jaPage?.topic.plugPlayPath).toBe("/diagnosis/play/world-specialty-soul");
    expect(jaPage?.copy.headline).toContain("テロワール");
  });

  it("routes upcoming specialty landings to world-entry play path", () => {
    const usPage = buildLandingPageDefinition("en", "us-corn-frontier");
    expect(usPage?.topic.plugPlayPath).toBe("/diagnosis/play/world-specialty-soul");

    const caPage = buildLandingPageDefinition("en", "ca-maple-resilience");
    expect(caPage?.topic.plugPlayPath).toBe("/diagnosis/play/world-specialty-soul");
  });

  it("keeps live JP specialty on deep-dive play path", () => {
    const jpPage = buildLandingPageDefinition("ja", "jp-sakamai-craft");
    expect(jpPage?.topic.plugPlayPath).toBe("/diagnosis/play/jp-sakamai-craft");
  });

  it("keeps live FR specialty on deep-dive play path", () => {
    const frPage = buildLandingPageDefinition("ja", "fr-terroir-poet");
    expect(frPage?.topic.plugPlayPath).toBe("/diagnosis/play/fr-terroir-poet");
  });
});

describe("buildLandingIntakeOutcome", () => {
  it("injects user text as verbalization anchor", () => {
    const diagnosis = getSeedDiagnosisById("rubel-introvert-level-v1");
    expect(diagnosis).toBeTruthy();

    const outcome = buildLandingIntakeOutcome(diagnosis!, {
      source: "satellite",
      locale: "en",
      slug: "sixteen-personalities",
      keyword: "Personality Spectrum",
      promptText: "How do you recharge?",
      userText: "I need solo time with books after parties.",
      playDiagnosisId: diagnosis!.id,
      createdAt: Date.now(),
    });

    expect(outcome.verbalizationAnchor?.chosenOptionText).toBe(
      "I need solo time with books after parties.",
    );
    expect(outcome.winningResult).toBeTruthy();
  });
});
