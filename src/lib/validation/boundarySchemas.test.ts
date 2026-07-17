import { describe, expect, it } from "vitest";
import { diagnosisAdviceRequestSchema } from "@/lib/validation/adviceSchema";
import {
  builderPatchActionSchema,
  quizIndexRequestSchema,
} from "@/lib/validation/builderAndIndexSchema";
import { adaptiveChatRequestEnvelopeSchema } from "@/lib/validation/chatRequestSchema";
import { hfChatRequestSchema } from "@/lib/validation/hfChatSchema";
import { libertyDashboardRequestSchema } from "@/lib/validation/libertyDashboardRequestSchema";
import {
  rubelDiagnosisIncrementSchema,
  rubelDiagnosisSaveSchema,
} from "@/lib/validation/rubelDiagnosisSchema";

describe("Wave 1 boundary schemas", () => {
  it("accepts rubel diagnosis save + increment", () => {
    const save = rubelDiagnosisSaveSchema.safeParse({
      id: "d1",
      title: "T",
      creatorName: "C",
      language: "ja",
      searchKeywords: [],
      totalSubmissions: 0,
      questions: [
        {
          id: "q1",
          text: "Q?",
          options: [
            {
              id: "o1",
              text: "A",
              scoreModifier: [{ trait: "openness", value: 1 }],
            },
          ],
        },
      ],
      results: [
        {
          id: "r1",
          name: "R",
          baselineProfile: { openness: 0.5, empathy_need: 0.5, ego: 0.5 },
          aiConfig: {
            tone: "mentor",
            activeTherapyMode: "unconditional_praise",
          },
        },
      ],
    });
    expect(save.success).toBe(true);

    expect(
      rubelDiagnosisIncrementSchema.safeParse({ action: "increment", id: "d1" }).success,
    ).toBe(true);
    expect(
      rubelDiagnosisIncrementSchema.safeParse({ action: "delete", id: "d1" }).success,
    ).toBe(false);
  });

  it("gates hf-chat to prompt or engine+message", () => {
    expect(hfChatRequestSchema.safeParse({ prompt: "hi" }).success).toBe(true);
    expect(
      hfChatRequestSchema.safeParse({
        resultData: {
          title: "t",
          typeName: "n",
          tone: "mentor",
          empathyLevel: "high",
          verbalizationAnchor: null,
          compiledSystemPrompt: "sys",
          intakeSource: "quiz",
        },
        userMessage: "hello",
      }).success,
    ).toBe(true);
    expect(hfChatRequestSchema.safeParse({}).success).toBe(false);
  });

  it("accepts builder unpublish and quiz index modes", () => {
    expect(builderPatchActionSchema.safeParse({ action: "unpublish" }).success).toBe(
      true,
    );
    expect(builderPatchActionSchema.safeParse({ action: "publish" }).success).toBe(false);
    expect(quizIndexRequestSchema.safeParse({ retryFailed: true }).success).toBe(true);
    expect(quizIndexRequestSchema.safeParse({ quizId: "q1" }).success).toBe(true);
    expect(quizIndexRequestSchema.safeParse({}).success).toBe(false);
  });

  it("discriminates plug vs legacy advice", () => {
    const plug = diagnosisAdviceRequestSchema.safeParse({
      mode: "plug",
      slug: "big-five",
      diagnosisTitle: "D",
      archetypeTitle: "A",
      archetypeAnalysis: "x",
      planetNickname: "p",
      planetCoreStatus: "s",
      cosmicStrengths: "c",
      factorSummary: { openness: 0.8 },
    });
    expect(plug.success).toBe(true);

    const legacy = diagnosisAdviceRequestSchema.safeParse({
      result: {
        id: "r",
        title: "T",
        subtitle: "S",
        baseAnalysis: "B",
        themeColor: "#fff",
        dominantCategory: "empathy",
      },
      scores: { empathy: 1, logic: 0, creativity: 0, leadership: 0 },
      answers: [{ questionId: "q1", optionId: "o1", selectedAt: 1 }],
    });
    expect(legacy.success).toBe(true);
    expect(diagnosisAdviceRequestSchema.safeParse({ mode: "plug" }).success).toBe(false);
  });

  it("requires non-empty chat messages envelope", () => {
    expect(
      adaptiveChatRequestEnvelopeSchema.safeParse({
        messages: [{ role: "user", content: "hi" }],
      }).success,
    ).toBe(true);
    expect(adaptiveChatRequestEnvelopeSchema.safeParse({ messages: [] }).success).toBe(
      false,
    );
  });

  it("accepts liberty dashboard vector requests", () => {
    expect(
      libertyDashboardRequestSchema.safeParse({
        vector: [4, 5, 6, 3, 5, 4, 6, 5],
        locale: "ja",
      }).success,
    ).toBe(true);
    expect(libertyDashboardRequestSchema.safeParse({ vector: [] }).success).toBe(false);
  });
});
