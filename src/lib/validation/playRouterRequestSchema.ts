import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";

export const playRouterLocaleSchema = z.enum(SUPPORTED_LOCALES);

export const rawPlayCardParamSchema = z
  .object({
    id: z.string().trim().min(1).max(64),
    rawTitle: z.string().trim().min(1).max(160),
    rawPath: z.string().trim().min(1).max(200),
  })
  .strict();

export const playRouterRequestSchema = z.object({
  cards: z.array(rawPlayCardParamSchema).min(1).max(40),
  lang: playRouterLocaleSchema.optional().default("ja"),
});

export type PlayRouterRequest = z.infer<typeof playRouterRequestSchema>;
