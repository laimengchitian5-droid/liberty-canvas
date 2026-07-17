import { describe, expect, it } from "vitest";
import {
  buildDiagnosisOgImageUrl,
  buildDiagnosisResultPageUrl,
  buildDiagnosisShareText,
  isPersonalityCategory,
} from "@/lib/diagnosis/share";
import { buildDiagnosisQuizJsonLd } from "@/lib/diagnosis/structuredData";
import { DIAGNOSTIC_QUESTION_COUNT } from "@/types/diagnosis";
import { DIAGNOSIS_RESULT_CATALOG } from "@/lib/diagnosis/resultCatalog";

describe("diagnosis share", () => {
  it("validates personality categories", () => {
    expect(isPersonalityCategory("empathy")).toBe(true);
    expect(isPersonalityCategory("invalid")).toBe(false);
  });

  it("builds canonical result and OG urls", () => {
    expect(buildDiagnosisResultPageUrl("logic")).toContain("/diagnosis/result/logic");
    expect(buildDiagnosisOgImageUrl("creativity")).toContain("type=creativity");
    expect(buildDiagnosisOgImageUrl()).toContain("/api/og/diagnosis");
  });

  it("builds headline share text with hashtag", () => {
    const result = DIAGNOSIS_RESULT_CATALOG.empathy;
    const text = buildDiagnosisShareText(result, "headline");

    expect(text).toContain("#心の色診断");
    expect(text).toContain(result.title);
    expect(text).toContain("/diagnosis/result/empathy");
  });

  it("builds emotional share variant", () => {
    const text = buildDiagnosisShareText(
      DIAGNOSIS_RESULT_CATALOG.leadership,
      "emotional",
    );
    expect(text).toContain("わたしの心の色は");
    expect(text.length).toBeLessThanOrEqual(120);
  });

  it("keeps share text within social limits for all types", () => {
    for (const category of ["empathy", "logic", "creativity", "leadership"] as const) {
      const result = DIAGNOSIS_RESULT_CATALOG[category];
      expect(buildDiagnosisShareText(result, "headline").length).toBeLessThanOrEqual(120);
      expect(buildDiagnosisShareText(result, "emotional").length).toBeLessThanOrEqual(
        120,
      );
    }
  });
});

describe("diagnosis structured data", () => {
  it("emits Quiz schema with result answer", () => {
    const result = DIAGNOSIS_RESULT_CATALOG.creativity;
    const jsonLd = buildDiagnosisQuizJsonLd(result);

    expect(jsonLd["@type"]).toBe("Quiz");
    expect(jsonLd.numberOfQuestions).toBe(DIAGNOSTIC_QUESTION_COUNT);
    expect(jsonLd.about.name).toBe(result.title);
  });
});
