import { describe, expect, it } from "vitest";
import { mapScoringPayloadToTraitWeights } from "@/lib/builder/mapScoringPayload";
import {
  buildBuilderOgKeywords,
  buildBuilderOgTitle,
} from "@/lib/builder/buildBuilderOgKeywords";
import {
  resolveNextQuestionBlockId,
  resolveAffirmationText,
} from "@/lib/builder/compileBuilderRuntime";
import {
  convertBuilderToPlugDefinition,
  validateBuilderDefinition,
} from "@/lib/builder/convertBuilderToPlugDefinition";
import { compileLegallySafeResult } from "@/lib/diagnosis/compileLegallySafeResult";
import type { BuilderDiagnosisDefinition } from "@/types/builder";

const SAMPLE_BUILDER: BuilderDiagnosisDefinition = {
  id: "builder-sample",
  slug: "sample-love",
  eyebrow: "No-Code Builder",
  title: "恋愛タイプ診断",
  subtitle: "5問であなたの恋愛スタイルがわかる",
  estimatedMinutes: 3,
  themeColor: "#c9a09a",
  creatorTags: ["恋愛", "短時間", "高校生向け"],
  startBlockId: "q-1",
  blocks: [
    {
      type: "CONVERSATIONAL_QUESTION",
      id: "q-1",
      prompt: "好きな人から連絡が来たとき、最初の反応は？",
      choices: [
        {
          id: "q-1-a",
          label: "すぐ返信して会話を楽しむ",
          scores: { extraversion: 0.6, agreeableness: 0.3 },
        },
        {
          id: "q-1-b",
          label: "内容を考えてから丁寧に返す",
          scores: { conscientiousness: 0.5, agreeableness: 0.4 },
        },
      ],
    },
    {
      type: "AI_INTERMEDIATE_FEEDBACK",
      id: "fb-1",
      triggerAfterBlockId: "q-1",
      affirmationTemplate: "「{choice}」— 素敵な選択ですね。あなたらしさが伝わってきます ✨",
    },
    {
      type: "CONDITIONAL_BRANCH",
      id: "branch-1",
      afterBlockId: "q-1",
      rules: [{ whenChoiceId: "q-1-a", gotoBlockId: "q-2a" }],
      defaultGotoBlockId: "q-2b",
    },
    {
      type: "CONVERSATIONAL_QUESTION",
      id: "q-2a",
      prompt: "デートの予定、どちらが好き？",
      choices: [
        {
          id: "q-2a-a",
          label: "その場のノリで決める",
          scores: { openness: 0.7, extraversion: 0.3 },
        },
      ],
    },
    {
      type: "CONVERSATIONAL_QUESTION",
      id: "q-2b",
      prompt: "理想の連絡頻度に近いのは？",
      choices: [
        {
          id: "q-2b-a",
          label: "毎日さりげなく",
          scores: { neuroticism: 0.3, agreeableness: 0.4 },
        },
      ],
    },
  ],
  resultConfig: {
    layout: "compatibility_radar",
    results: [
      {
        id: "lc-romantic-explorer",
        title: "ロマンティック・エクスプローラー",
        subtitle: "好奇心とやさしさで関係を育てるタイプ",
        analysis: "LibertyCanvas 独自分析：あなたは新しい体験を大切にしながら、相手への配慮も忘れません。",
        themeColor: "#c9a09a",
        traitProfile: {
          trait_openness: 0.8,
          trait_agreeableness: 0.6,
        },
        compatibilityHint: "誠実で落ち着いたタイプとの相性が良好です。",
      },
      {
        id: "lc-steady-partner",
        title: "ステディ・パートナー",
        subtitle: "安定感で信頼を築くタイプ",
        analysis: "LibertyCanvas 独自分析：丁寧なコミュニケーションが、あなたの恋愛の強みです。",
        themeColor: "#9caf88",
        traitProfile: {
          trait_conscientiousness: 0.8,
          trait_agreeableness: 0.5,
        },
        compatibilityHint: "社交的で明るいタイプとのバランスが取りやすいです。",
      },
    ],
  },
};

describe("mapScoringPayloadToTraitWeights", () => {
  it("maps OCEAN keys to legal trait keys", () => {
    const weights = mapScoringPayloadToTraitWeights({
      openness: 0.5,
      extraversion: 0.3,
    });

    expect(weights.trait_openness).toBe(0.5);
    expect(weights.trait_extraversion).toBe(0.3);
    expect(weights.trait_empathy).toBeUndefined();
  });
});

describe("compileBuilderRuntime", () => {
  it("resolves conditional branch by choice", () => {
    expect(
      resolveNextQuestionBlockId(SAMPLE_BUILDER, "q-1", "q-1-a"),
    ).toBe("q-2a");
    expect(
      resolveNextQuestionBlockId(SAMPLE_BUILDER, "q-1", "q-1-b"),
    ).toBe("q-2b");
  });

  it("interpolates affirmation template", () => {
    const feedback = SAMPLE_BUILDER.blocks.find(
      (block) => block.type === "AI_INTERMEDIATE_FEEDBACK",
    );

    expect(feedback?.type).toBe("AI_INTERMEDIATE_FEEDBACK");

    if (feedback?.type === "AI_INTERMEDIATE_FEEDBACK") {
      expect(resolveAffirmationText(feedback, "すぐ返信")).toContain("すぐ返信");
    }
  });
});

describe("convertBuilderToPlugDefinition", () => {
  it("produces a valid plug definition for legal scoring", () => {
    const errors = validateBuilderDefinition(SAMPLE_BUILDER);
    expect(errors).toEqual([]);

    const plug = convertBuilderToPlugDefinition(SAMPLE_BUILDER);
    const outcome = compileLegallySafeResult(plug, [
      { blockId: "q-1", optionId: "q-1-a", recordedAt: 1 },
      { blockId: "q-2a", optionId: "q-2a-a", recordedAt: 2 },
    ]);

    expect(outcome.winningArchetype.id.startsWith("lc-")).toBe(true);
    expect(outcome.resultLayout).toBe("compatibility_radar");
  });
});

describe("buildBuilderOgKeywords", () => {
  it("injects viral keywords from creator tags", () => {
    const keywords = buildBuilderOgKeywords(["恋愛", "短時間"]);

    expect(keywords).toContain("恋愛診断");
    expect(keywords).toContain("短時間");
    expect(keywords).toContain("サクッと診断");
  });

  it("builds localized title snippet", () => {
    const title = buildBuilderOgTitle("恋愛タイプ診断", ["恋愛", "高校生向け"]);

    expect(title).toContain("恋愛");
    expect(title).toContain("高校生向け");
  });
});
