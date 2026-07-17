/**
 * Client-side play history for cross-site recommendation hooks.
 * Traits are display labels only — never clinical claims.
 */

export interface CompletedGameRecord {
  /** Unix ms when the user finished the game. */
  readonly clearedAt: number;
  /** Soft archetype / trait label from the result screen. */
  readonly primaryTrait: string;
}

export interface UserGameProfile {
  readonly completedGames: Readonly<Record<string, CompletedGameRecord>>;
  /** Schema epoch for forward-compatible migrations. */
  readonly version: number;
}

/** Sketch alias — same as UserGameProfile. */
export type UserProfile = UserGameProfile;

export type RecommendationReason =
  | "onboarding"
  | "trait_chain"
  | "completion_hub"
  | "fallback";

export interface RecommendationHook {
  readonly nextGameId: string;
  readonly localizedCatchphrase: string;
  /** Whitelisted runtime path for Link href. */
  readonly targetCleanPath: string;
  readonly reason: RecommendationReason;
}

export const USER_GAME_PROFILE_VERSION = 1 as const;
