import { z } from "zod";

/** Outer envelope for /api/chat — normalized further by parseAdaptiveChatRequest. */
export const adaptiveChatRequestEnvelopeSchema = z
  .object({
    messages: z.array(z.unknown()).min(1),
    systemPrompt: z.string().optional(),
    appliedPersona: z.string().optional(),
    isReliable: z.boolean().optional(),
    archetype: z.string().optional(),
    mode: z.enum(["rubel", "adaptive"]).optional(),
    scores: z.record(z.string(), z.number()).optional(),
    kraepelinFatigue: z.number().optional(),
    kraepelinConsistency: z.number().optional(),
    kraepelinFocusPattern: z.string().optional(),
    locale: z.string().optional(),
    id: z.string().optional(),
    trigger: z.string().optional(),
    messageId: z.string().optional(),
  })
  .passthrough();
