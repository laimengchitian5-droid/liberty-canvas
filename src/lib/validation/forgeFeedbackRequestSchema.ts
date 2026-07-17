import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";

/** Forge feedback accepts a subset of app locales (psychometrics editor). */
export const forgeAiLocaleSchema = z.enum([
  "ja",
  "en",
  "ko",
  "zh",
  "fr",
  "de",
] as const);

export const forgeFeedbackRequestSchema = z.object({
  questionText: z.string().trim().min(1).max(500),
  lang: forgeAiLocaleSchema.optional().default("ja"),
});

export type ForgeFeedbackRequest = z.infer<typeof forgeFeedbackRequestSchema>;

/** Guard: request lang must remain within SUPPORTED_LOCALES for future expansion. */
export function isSupportedForgeLocale(value: string): boolean {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
