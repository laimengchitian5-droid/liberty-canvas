import { describe, expect, it } from "vitest";
import {
  buildFallbackForgeFeedback,
  forgeAiFeedbackSchema,
  optionsArePolar,
  parseForgeAiFeedback,
} from "@/lib/forge/forgeDashboardSchema";
import { forgeFeedbackRequestSchema } from "@/lib/validation/forgeFeedbackRequestSchema";

describe("forge AI feedback envelope", () => {
  it("parses strict JSON matching the forge interface", () => {
    const raw = JSON.stringify({
      internalReasoning: {
        psychometricAnalysisEnglish: "Targets openness vs structure.",
        weightJustificationEnglish: "A elevates O/E; B elevates C/A.",
      },
      localizedOutput: {
        questionText: "新しい体験と、決まったルーティン、どちらが心地よいですか？",
        options: [
          {
            optionText: "新しい体験を選びたい",
            weights: { O: 0.4, C: 0, E: 0.2, A: 0, N: 0 },
          },
          {
            optionText: "いつもの流れを大切にしたい",
            weights: { O: 0, C: 0.4, E: 0, A: 0.2, N: 0 },
          },
        ],
      },
    });

    const parsed = parseForgeAiFeedback(raw);
    expect(parsed?.localizedOutput.options).toHaveLength(2);
    expect(parsed?.localizedOutput.questionText).toContain("心地よい");
  });

  it("parses fenced JSON and clamps out-of-range weights", () => {
    const raw = `\`\`\`json
{"internalReasoning":{"psychometricAnalysisEnglish":"A","weightJustificationEnglish":"B"},"localizedOutput":{"questionText":"Q","options":[{"optionText":"Yes","weights":{"O":1.5,"C":-1,"E":0.2,"A":0,"N":0}},{"optionText":"No","weights":{"O":0,"C":0.4,"E":0,"A":0.2,"N":0}}]}}
\`\`\``;

    const parsed = parseForgeAiFeedback(raw);
    expect(parsed?.localizedOutput.options[0].weights.O).toBe(1);
    expect(parsed?.localizedOutput.options[0].weights.C).toBe(0);
  });

  it("rejects incomplete payloads", () => {
    expect(parseForgeAiFeedback('{"localizedOutput":{}}')).toBeNull();
    expect(
      forgeAiFeedbackSchema.safeParse({
        internalReasoning: {
          psychometricAnalysisEnglish: "x",
          weightJustificationEnglish: "y",
        },
        localizedOutput: {
          questionText: "q",
          options: [{ optionText: "only-one", weights: { O: 0, C: 0, E: 0, A: 0, N: 0 } }],
        },
      }).success,
    ).toBe(false);
  });

  it("builds locale-aware fallbacks without duplicate weight keys", () => {
    const ja = buildFallbackForgeFeedback("テスト質問", "ja");
    expect(ja.localizedOutput.questionText).toBe("テスト質問");
    expect(ja.localizedOutput.options[0].optionText).toBe("はい");
    expect(ja.localizedOutput.options[0].weights).toEqual({
      O: 0.2,
      C: 0,
      E: 0.2,
      A: 0,
      N: 0,
    });
    expect(ja.localizedOutput.options[1].weights).toEqual({
      O: 0,
      C: 0.2,
      E: 0,
      A: 0.2,
      N: 0,
    });

    const en = buildFallbackForgeFeedback("Hello?", "en");
    expect(en.localizedOutput.options[0].optionText).toBe("Yes");
  });

  it("detects polar vs collapsed weight pairs", () => {
    expect(
      optionsArePolar(
        { O: 0.4, C: 0, E: 0.2, A: 0, N: 0 },
        { O: 0, C: 0.4, E: 0, A: 0.2, N: 0 },
      ),
    ).toBe(true);

    expect(
      optionsArePolar(
        { O: 0, C: 0, E: 0, A: 0, N: 0 },
        { O: 0, C: 0, E: 0, A: 0, N: 0 },
      ),
    ).toBe(false);
  });

  it("validates request bounds", () => {
    expect(
      forgeFeedbackRequestSchema.safeParse({
        questionText: "新しい体験は好き？",
        lang: "ja",
      }).success,
    ).toBe(true);

    expect(
      forgeFeedbackRequestSchema.safeParse({
        questionText: "   ",
      }).success,
    ).toBe(false);

    expect(
      forgeFeedbackRequestSchema.safeParse({
        questionText: "ok",
        lang: "xx",
      }).success,
    ).toBe(false);
  });
});
