import { z } from "zod";

const injectionTurnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const enginePayloadSchema = z.object({
  title: z.string().min(1),
  typeName: z.string().min(1),
  tone: z.string().min(1),
  empathyLevel: z.string().min(1),
  verbalizationAnchor: z
    .object({
      questionText: z.string(),
      chosenOptionText: z.string(),
    })
    .nullable(),
  compiledSystemPrompt: z.string().min(1),
  intakeSource: z.enum(["satellite", "quiz"]),
  keyword: z.string().optional(),
});

/**
 * POST /api/rubel/hf-chat — either raw prompt mode or engine+userMessage mode.
 * Structural gate only; content sanitization stays in hfChatGuard.
 */
export const hfChatRequestSchema = z
  .object({
    prompt: z.string().optional(),
    fallbackText: z.string().optional(),
    resultData: enginePayloadSchema.optional(),
    history: z.array(injectionTurnSchema).optional(),
    userMessage: z.string().optional(),
  })
  .refine(
    (body) =>
      Boolean(body.prompt?.trim()) ||
      (body.resultData !== undefined && Boolean(body.userMessage?.trim())),
    { message: "Provide prompt or valid resultData with userMessage." },
  );

export type HfChatRequestInput = z.infer<typeof hfChatRequestSchema>;
