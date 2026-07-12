import { describe, expect, it } from "vitest";
import { extractResultData } from "@/lib/rubel/resultData";
import type { Diagnosis, PlayOutcome } from "@/types/rubel";

describe("extractResultData", () => {
  it("maps quiz outcome to injection payload", () => {
    const diagnosis: Diagnosis = {
      id: "rubel-ura-seishiki-v1",
      title: "あなたの裏性格診断",
      creatorName: "@rubel",
      language: "ja",
      searchKeywords: [],
      totalSubmissions: 0,
      questions: [],
      results: [],
    };

    const outcome: PlayOutcome = {
      profile: { openness: 5, empathy_need: 4, ego: -2 },
      winningResult: {
        id: "result-glass-artist",
        name: "ガラスのハートの芸術家タイプ",
        baselineProfile: { openness: 5, empathy_need: 4, ego: -2 },
        aiConfig: { tone: "gal", activeTherapyMode: "unconditional_praise" },
      },
      distance: 0,
      compiledPrompt: {
        systemPrompt: "Persona kernel",
        personaLabel: "ガラスのハートの芸術家タイプ",
        openingUserMessage: "",
      },
      verbalizationAnchor: {
        questionText: "休日は？",
        chosenOptionText: "ひとりで過ごす",
      },
    };

    expect(extractResultData(diagnosis, outcome)).toEqual({
      title: "あなたの裏性格診断",
      typeName: "ガラスのハートの芸術家タイプ",
      tone: "ギャル（Gal-tone）",
      empathyLevel: "100%全肯定（Hyper-Supportive）",
      verbalizationAnchor: {
        questionText: "休日は？",
        chosenOptionText: "ひとりで過ごす",
      },
      compiledSystemPrompt: "Persona kernel",
      intakeSource: "quiz",
    });
  });
});
