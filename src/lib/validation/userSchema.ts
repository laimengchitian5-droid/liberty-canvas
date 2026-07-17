import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { USER_ID_PATTERN, USER_DATA_REQUEST } from "@/lib/user/constants";
import { USER_DATA_SCHEMA_VERSION } from "@/types/user";

const localeSchema = z.enum(SUPPORTED_LOCALES);

export const fetchUserDataParamsSchema = z.object({
  userId: z
    .string()
    .trim()
    .min(1, "userId is required")
    .max(128, "userId must be at most 128 characters")
    .regex(USER_ID_PATTERN, "userId contains invalid characters"),
  forceRefresh: z.boolean().optional(),
});

export type FetchUserDataParams = z.infer<typeof fetchUserDataParamsSchema>;

export const userProfileSummarySchema = z.object({
  userId: z.string().min(1).max(128),
  displayName: z.string().min(1).max(120),
  avatarInitials: z
    .string()
    .min(1)
    .max(4)
    .regex(/^[\p{L}\p{N}]{1,4}$/u),
  locale: localeSchema,
  memberSince: z.string().datetime(),
});

export const userActivitySnapshotSchema = z.object({
  appsAuthored: z.number().int().min(0),
  recentAppIds: z.array(z.string().min(1).max(128)).max(USER_DATA_REQUEST.maxRecentApps),
  lastActiveAt: z.string().datetime().nullable(),
});

export const userPreferencesSnapshotSchema = z.object({
  activePersona: z.string().min(1).max(128),
  localePreference: localeSchema.nullable(),
});

export const userDataSchema = z.object({
  profile: userProfileSummarySchema,
  activity: userActivitySnapshotSchema,
  preferences: userPreferencesSnapshotSchema,
  fetchedAt: z.string().datetime(),
  schemaVersion: z.literal(USER_DATA_SCHEMA_VERSION),
});

export type ValidatedUserData = z.infer<typeof userDataSchema>;

export const userDataApiResponseSchema = z.object({
  data: userDataSchema,
});

export type UserDataApiResponse = z.infer<typeof userDataApiResponseSchema>;

export const userDataRouteParamsSchema = z.object({
  userId: fetchUserDataParamsSchema.shape.userId,
});
