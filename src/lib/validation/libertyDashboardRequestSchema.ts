import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";

export const libertyDashboardLocaleSchema = z.enum(SUPPORTED_LOCALES);

export const libertyDashboardRequestSchema = z.object({
  vector: z
    .array(z.number().finite())
    .min(1)
    .max(32)
    .refine((values) => values.every((v) => v >= 0 && v <= 10), {
      message: "vector values must be within 0–10",
    }),
  locale: libertyDashboardLocaleSchema.optional().default("ja"),
  seed: z.string().max(80).optional(),
});

export type LibertyDashboardRequest = z.infer<typeof libertyDashboardRequestSchema>;
