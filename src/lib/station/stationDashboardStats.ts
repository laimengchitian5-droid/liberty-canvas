import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";
import type { UserGameProfile } from "@/types/userGameProfile";

/** Denominator for station stamp rally — registry length, never a magic 4. */
export const STATION_ROUTE_TOTAL = DIAGNOSTIC_PLATFORM_IDS.length;

/**
 * Completion % against the official station registry only.
 * Non-station game ids in the profile do not inflate the denominator.
 */
export function computeStationCompletionRate(
  profile: UserGameProfile,
): number {
  const cleared = DIAGNOSTIC_PLATFORM_IDS.reduce((count, id) => {
    return profile.completedGames[id] ? count + 1 : count;
  }, 0);

  if (STATION_ROUTE_TOTAL <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((cleared / STATION_ROUTE_TOTAL) * 100));
}

export function listCompletedGameIds(
  profile: UserGameProfile,
): readonly string[] {
  return Object.keys(profile.completedGames);
}
