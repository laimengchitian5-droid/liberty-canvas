import { z } from "zod";
import {
  USER_GAME_PROFILE_VERSION,
  type UserGameProfile,
} from "@/types/userGameProfile";

const completedGameRecordSchema = z
  .object({
    clearedAt: z.number().finite().nonnegative(),
    primaryTrait: z.string().trim().min(1).max(80),
  })
  .strict();

/**
 * Zod envelope for encrypted play-matrix cookies / local sync.
 * Alias: UserProfileSchema (sketch-compatible).
 */
export const userGameProfileSchema = z
  .object({
    completedGames: z
      .record(z.string().min(1).max(80), completedGameRecordSchema)
      .refine((record) => Object.keys(record).length <= 64, {
        message: "completedGames exceeds cookie-safe bound (64)",
      }),
    version: z.number().int().positive().default(USER_GAME_PROFILE_VERSION),
  })
  .strict();

/** Sketch-compatible export name. */
export const UserProfileSchema = userGameProfileSchema;

export type ParsedUserGameProfile = z.infer<typeof userGameProfileSchema>;
export type UserProfile = ParsedUserGameProfile;

export function parseUserGameProfile(raw: unknown): UserGameProfile | null {
  const parsed = userGameProfileSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function emptyUserGameProfile(): UserGameProfile {
  return { completedGames: {}, version: USER_GAME_PROFILE_VERSION };
}

/** Immutable upsert — O(1) copy of one key. */
export function recordGameCompletion(
  profile: UserGameProfile,
  gameId: string,
  primaryTrait: string,
  clearedAt: number = Date.now(),
): UserGameProfile {
  const id = gameId.trim().slice(0, 80);
  const trait = primaryTrait.trim().slice(0, 80) || "Explorer";
  if (!id) {
    return profile;
  }

  return {
    version: profile.version ?? USER_GAME_PROFILE_VERSION,
    completedGames: {
      ...profile.completedGames,
      [id]: { clearedAt, primaryTrait: trait },
    },
  };
}
