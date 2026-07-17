import { z } from "zod";
import type { DiagnosisAdviceRequestBody } from "@/types/diagnosis";

const personalityCategorySchema = z.enum([
  "empathy",
  "logic",
  "creativity",
  "leadership",
]);

const categoryScoreMapSchema = z.object({
  empathy: z.number(),
  logic: z.number(),
  creativity: z.number(),
  leadership: z.number(),
});

const diagnosticAnswerSchema = z.object({
  questionId: z.string().min(1),
  optionId: z.string().min(1),
  selectedAt: z.number().finite(),
});

const diagnosisResultSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string(),
  baseAnalysis: z.string(),
  themeColor: z.string().min(1),
  dominantCategory: personalityCategorySchema,
});

export const legacyAdviceSchema = z.object({
  result: diagnosisResultSchema,
  scores: categoryScoreMapSchema,
  answers: z.array(diagnosticAnswerSchema),
});

export const plugAdviceSchema = z.object({
  mode: z.literal("plug"),
  slug: z.string().min(1),
  diagnosisTitle: z.string().min(1),
  archetypeTitle: z.string().min(1),
  archetypeAnalysis: z.string(),
  planetNickname: z.string(),
  planetCoreStatus: z.string(),
  cosmicStrengths: z.string(),
  factorSummary: z.record(z.string(), z.number()),
});

export const diagnosisAdviceRequestSchema = z.union([
  plugAdviceSchema,
  legacyAdviceSchema,
]);

export type DiagnosisAdviceRequestInput = z.infer<typeof diagnosisAdviceRequestSchema>;

export function isPlugAdviceInput(
  value: DiagnosisAdviceRequestInput,
): value is z.infer<typeof plugAdviceSchema> {
  return "mode" in value && value.mode === "plug";
}

export function asLegacyAdviceBody(
  value: Exclude<DiagnosisAdviceRequestInput, z.infer<typeof plugAdviceSchema>>,
): DiagnosisAdviceRequestBody {
  return value;
}
