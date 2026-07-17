import { z } from "zod";

export const builderPatchActionSchema = z.object({
  action: z.literal("unpublish"),
});

export const quizIndexRequestSchema = z
  .object({
    quizId: z.string().optional(),
    retryFailed: z.boolean().optional(),
  })
  .refine((body) => body.retryFailed === true || Boolean(body.quizId?.trim()), {
    message: "quizId is required unless retryFailed is true",
  });
