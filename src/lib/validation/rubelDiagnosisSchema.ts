import { z } from "zod";

const personalityTraitSchema = z.enum(["openness", "empathy_need", "ego"]);
const aiToneSchema = z.enum(["gal", "mentor", "tsundere", "princess"]);
const therapyModeSchema = z.enum([
  "unconditional_praise",
  "strict_coaching",
  "emotional_mirror",
]);
const localeSchema = z.enum(["en", "ja", "es", "ko", "fr"]);

const traitVectorSchema = z.object({
  openness: z.number(),
  empathy_need: z.number(),
  ego: z.number(),
});

const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  scoreModifier: z.array(
    z.object({
      trait: personalityTraitSchema,
      value: z.number(),
    }),
  ),
});

const questionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  options: z.array(optionSchema).min(1),
});

const resultSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  baselineProfile: traitVectorSchema,
  aiConfig: z.object({
    tone: aiToneSchema,
    activeTherapyMode: therapyModeSchema,
  }),
});

/** POST /api/rubel/diagnoses — save diagnosis payload. */
export const rubelDiagnosisSaveSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  creatorName: z.string().min(1),
  language: localeSchema,
  searchKeywords: z.array(z.string()),
  totalSubmissions: z.number().int().nonnegative(),
  questions: z.array(questionSchema).min(1),
  results: z.array(resultSchema).min(1),
  personaPresetId: z.string().optional(),
});

/** PATCH /api/rubel/diagnoses — increment submissions. */
export const rubelDiagnosisIncrementSchema = z.object({
  action: z.literal("increment"),
  id: z.string().min(1),
});

export type RubelDiagnosisSaveInput = z.infer<typeof rubelDiagnosisSaveSchema>;

/** Structural bridge — Zod output matches Diagnosis contract. */
export function asRubelDiagnosis(
  value: RubelDiagnosisSaveInput,
): import("@/types/rubel").Diagnosis {
  return value;
}
