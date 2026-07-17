import { z } from "zod";
import { extractJsonObject } from "@/lib/ai/extractJsonObject";
import {
  OCEAN_LETTER_KEYS,
  type ForgeAiFeedbackResult,
  type ForgeAiLocale,
  type OceanWeights,
} from "@/types/forgeAiPipeline";

const WEIGHT_MIN = 0;
const WEIGHT_MAX = 1;
const WEIGHT_PRECISION = 2;

/** Clamp + round to 2 decimals — keeps slider sync stable and schema-valid. */
function sanitizeWeight(value: number): number {
  if (!Number.isFinite(value)) {
    return WEIGHT_MIN;
  }
  const clamped = Math.min(WEIGHT_MAX, Math.max(WEIGHT_MIN, value));
  const factor = 10 ** WEIGHT_PRECISION;
  return Math.round(clamped * factor) / factor;
}

const oceanWeightField = z.number().transform(sanitizeWeight);

export const oceanWeightsSchema = z
  .object({
    O: oceanWeightField,
    C: oceanWeightField,
    E: oceanWeightField,
    A: oceanWeightField,
    N: oceanWeightField,
  })
  .strict();

export const generatedOptionSchema = z
  .object({
    optionText: z.string().trim().min(1).max(200),
    weights: oceanWeightsSchema,
  })
  .strict();

export const forgeAiFeedbackSchema = z.object({
  internalReasoning: z
    .object({
      psychometricAnalysisEnglish: z.string().trim().min(1).max(4000),
      weightJustificationEnglish: z.string().trim().min(1).max(4000),
    })
    .strict(),
  localizedOutput: z
    .object({
      questionText: z.string().trim().min(1).max(500),
      options: z.tuple([generatedOptionSchema, generatedOptionSchema]),
    })
    .strict(),
});

export type ParsedForgeAiFeedback = z.infer<typeof forgeAiFeedbackSchema>;

function sumWeights(weights: OceanWeights): number {
  let total = 0;
  for (const key of OCEAN_LETTER_KEYS) {
    total += weights[key];
  }
  return total;
}

/**
 * Soft balance check: polar options should not collapse to identical vectors.
 * Used for logging / future hardening — parse still succeeds (fail-open for editor UX).
 */
export function optionsArePolar(
  a: OceanWeights,
  b: OceanWeights,
  epsilon = 0.05,
): boolean {
  let distance = 0;
  for (const key of OCEAN_LETTER_KEYS) {
    distance += Math.abs(a[key] - b[key]);
  }
  return distance >= epsilon && sumWeights(a) > 0 && sumWeights(b) > 0;
}

export function parseForgeAiFeedback(raw: string): ForgeAiFeedbackResult | null {
  const payload = extractJsonObject(raw);
  if (payload === null) {
    return null;
  }

  const parsed = forgeAiFeedbackSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

type FallbackLabels = {
  readonly yes: string;
  readonly no: string;
};

function fallbackLabels(locale: ForgeAiLocale): FallbackLabels {
  switch (locale) {
    case "en":
      return { yes: "Yes", no: "No" };
    case "ko":
      return { yes: "네", no: "아니요" };
    case "zh":
      return { yes: "是", no: "否" };
    case "fr":
      return { yes: "Oui", no: "Non" };
    case "de":
      return { yes: "Ja", no: "Nein" };
    case "ja":
    default:
      return { yes: "はい", no: "いいえ" };
  }
}

/**
 * Deterministic safe state when keys/parse/upstream fail.
 * Editor must never crash — raw question text is preserved.
 */
export function buildFallbackForgeFeedback(
  rawQuestionText: string,
  locale: ForgeAiLocale = "ja",
): ForgeAiFeedbackResult {
  const questionText =
    rawQuestionText.trim().slice(0, 500) ||
    (locale === "ja"
      ? "最初の質問をここに入力してください"
      : "Enter your first question here");
  const labels = fallbackLabels(locale);

  return {
    internalReasoning: {
      psychometricAnalysisEnglish:
        "Fallback triggered — model unavailable or payload failed validation.",
      weightJustificationEnglish:
        "Baseline bipolar weights: Openness/Extraversion vs Conscientiousness/Agreeableness.",
    },
    localizedOutput: {
      questionText,
      options: [
        {
          optionText: labels.yes,
          weights: { O: 0.2, C: 0, E: 0.2, A: 0, N: 0 },
        },
        {
          optionText: labels.no,
          weights: { O: 0, C: 0.2, E: 0, A: 0.2, N: 0 },
        },
      ],
    },
  };
}

/** Schema JSON shape for prompts — keep in sync with forgeAiFeedbackSchema. */
export const FORGE_AI_FEEDBACK_RESPONSE_SHAPE = {
  internalReasoning: {
    psychometricAnalysisEnglish: "string",
    weightJustificationEnglish: "string",
  },
  localizedOutput: {
    questionText: "string",
    options: [
      {
        optionText: "string",
        weights: { O: 0.4, C: 0, E: 0.2, A: 0, N: 0 },
      },
      {
        optionText: "string",
        weights: { O: 0, C: 0.4, E: 0, A: 0.2, N: 0 },
      },
    ],
  },
} as const;
