import { describe, expect, it } from "vitest";
import { libertyDashboardRequestSchema } from "@/lib/validation/libertyDashboardRequestSchema";
import {
  buildFallbackLibertyDashboard,
  parseAIAnalysisEngineResult,
} from "@/lib/visual/libertyDashboardSchema";

describe("liberty dashboard AI envelope", () => {
  it("parses strict JSON matching the engine interface", () => {
    const raw = JSON.stringify({
      internalReasoning: {
        personaProfileEnglish: "Soft rose-forward cosmic caretaker.",
        vectorInterpretation: "Elevated warmth axes; calm structure mid.",
        culturalAdaptationNotes: "Japanese です・ます, affirming.",
      },
      localizedOutput: {
        characterName: "ステラ・ノーヴァ",
        aiAdvice: "あなたの色は、ちゃんと世界を照らしています。",
        energyLabel: "やわらかい輝き",
      },
    });

    const parsed = parseAIAnalysisEngineResult(raw);
    expect(parsed?.localizedOutput.characterName).toBe("ステラ・ノーヴァ");
  });

  it("parses fenced JSON", () => {
    const raw = `\`\`\`json
{"internalReasoning":{"personaProfileEnglish":"A","vectorInterpretation":"B","culturalAdaptationNotes":"C"},"localizedOutput":{"characterName":"ルナ","aiAdvice":"やさしい。","energyLabel":"光"}}
\`\`\``;
    expect(parseAIAnalysisEngineResult(raw)?.localizedOutput.characterName).toBe(
      "ルナ",
    );
  });

  it("rejects clinical-shaped incomplete payloads", () => {
    expect(parseAIAnalysisEngineResult('{"localizedOutput":{}}')).toBeNull();
  });

  it("builds locale-aware fallbacks", () => {
    const ja = buildFallbackLibertyDashboard([5, 5, 5, 5, 5, 5, 5, 5], "ja");
    expect(ja.localizedOutput.characterName.length).toBeGreaterThan(0);
    expect(ja.localizedOutput.aiAdvice).toMatch(/ペース|やさし|柔らか/);

    const en = buildFallbackLibertyDashboard([5, 5, 5, 5, 5, 5, 5, 5], "en");
    expect(en.localizedOutput.characterName).toBe("Stella Nova");

    const ko = buildFallbackLibertyDashboard([5, 5, 5, 5, 5, 5, 5, 5], "ko");
    expect(ko.localizedOutput.energyLabel).toContain("빛");

    const fr = buildFallbackLibertyDashboard([5, 5, 5, 5, 5, 5, 5, 5], "fr");
    expect(fr.localizedOutput.energyLabel).toMatch(/Lueur/i);
  });

  it("validates request vector bounds and locales", () => {
    expect(
      libertyDashboardRequestSchema.safeParse({
        vector: [1, 2, 3, 4, 5, 6, 7, 4],
        locale: "ja",
      }).success,
    ).toBe(true);

    expect(
      libertyDashboardRequestSchema.safeParse({
        vector: [1, 2, 3, 4, 5, 6, 7, 4],
        locale: "de",
      }).success,
    ).toBe(true);

    expect(
      libertyDashboardRequestSchema.safeParse({
        vector: [99],
      }).success,
    ).toBe(false);

    expect(
      libertyDashboardRequestSchema.safeParse({
        vector: [1, 2, 3],
        locale: "xx",
      }).success,
    ).toBe(false);
  });
});
