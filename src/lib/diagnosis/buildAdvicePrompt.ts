import type {
  AIPromptBlueprint,
  DiagnosisAdviceRequestBody,
} from "@/types/diagnosis";

export const DIAGNOSIS_ADVICE_BLUEPRINT: AIPromptBlueprint = {
  systemContext: [
    "You are a warm, sophisticated personality coach for Japanese adult women.",
    "Write in polite, gentle Japanese (です・ます調).",
    "Tone: adult-cute, elegant, never preachy or clinical.",
    "Avoid gender stereotypes, lucky numbers, alcohol, and religious references.",
    "Return JSON only with keys: personalizedAdvice, dailyTip, affirmation.",
  ].join(" "),
  temperature: 0.65,
  maxTokens: 900,
  responseSchema: JSON.stringify(
    {
      type: "object",
      properties: {
        personalizedAdvice: {
          type: "string",
          description: "2-3 paragraphs of hyper-personalized analysis",
        },
        dailyTip: {
          type: "string",
          description: "One gentle actionable tip for today",
        },
        affirmation: {
          type: "string",
          description: "One short affirming sentence",
        },
      },
      required: ["personalizedAdvice", "dailyTip", "affirmation"],
      additionalProperties: false,
    },
    null,
    2,
  ),
};

export function buildAdviceUserPrompt(body: DiagnosisAdviceRequestBody): string {
  return [
    `Diagnosis title: ${body.result.title}`,
    `Subtitle: ${body.result.subtitle}`,
    `Base analysis: ${body.result.baseAnalysis}`,
    `Dominant category: ${body.result.dominantCategory}`,
    `Score map: ${JSON.stringify(body.scores)}`,
    `Answer count: ${body.answers.length}`,
    "Generate deeply personalized advice based on this profile.",
  ].join("\n");
}
