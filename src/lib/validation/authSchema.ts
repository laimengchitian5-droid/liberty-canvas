import { z } from "zod";
import { AUTH_SESSION_MODES } from "@/lib/auth/constants";
import { fetchUserDataParamsSchema } from "@/lib/validation/userSchema";

const authSessionModeSchema = z.enum([
  AUTH_SESSION_MODES.login,
  AUTH_SESSION_MODES.signup,
]);

export const createSessionRequestSchema = z.object({
  userId: fetchUserDataParamsSchema.shape.userId,
  mode: authSessionModeSchema.default(AUTH_SESSION_MODES.login),
  displayName: z.string().trim().max(120).optional(),
});

export type CreateSessionRequest = z.infer<typeof createSessionRequestSchema>;

export const createSessionResponseSchema = z.object({
  userId: z.string().min(1).max(128),
  expiresAt: z.string().datetime(),
  mode: authSessionModeSchema,
});

export type CreateSessionResponse = z.infer<typeof createSessionResponseSchema>;
