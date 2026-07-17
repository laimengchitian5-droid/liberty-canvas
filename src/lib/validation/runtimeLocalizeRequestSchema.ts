import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";

export const runtimeLocalizeLocaleSchema = z.enum(SUPPORTED_LOCALES);

export const diagnosticMasterDataSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(800),
  })
  .strict();

export const runtimeLocalizeRequestSchema = z.object({
  master: diagnosticMasterDataSchema,
  lang: runtimeLocalizeLocaleSchema,
});

export type RuntimeLocalizeRequest = z.infer<typeof runtimeLocalizeRequestSchema>;
