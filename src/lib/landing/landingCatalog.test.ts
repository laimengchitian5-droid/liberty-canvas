import { describe, expect, it } from "vitest";
import {
  buildLandingPageDefinition,
  listAllLandingPages,
  listLandingStaticParams,
} from "@/lib/landing/landingCatalog";
import { buildLandingIntakeOutcome } from "@/lib/landing/landingIntakeBridge";
import { getSeedDiagnosisById } from "@/lib/rubel/repository";

describe("landingCatalog", () => {
  it("generates 40 static params (10 topics × 4 locales)", () => {
    expect(listLandingStaticParams()).toHaveLength(40);
  });

  it("lists all landing pages with absolute urls", () => {
    const pages = listAllLandingPages();
    expect(pages).toHaveLength(40);
    expect(pages[0]?.absoluteUrl).toContain("/discover/");
  });

  it("resolves sixteen-personalities ja page", () => {
    const page = buildLandingPageDefinition("ja", "sixteen-personalities");
    expect(page?.copy.headline).toContain("16Personalities");
    expect(page?.topic.plugPlayPath).toBe("/diagnosis/play/personality-spectrum");
  });
});

describe("buildLandingIntakeOutcome", () => {
  it("injects user text as verbalization anchor", () => {
    const diagnosis = getSeedDiagnosisById("rubel-introvert-level-v1");
    expect(diagnosis).toBeTruthy();

    const outcome = buildLandingIntakeOutcome(diagnosis!, {
      locale: "en",
      slug: "sixteen-personalities",
      keyword: "16Personalities",
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
