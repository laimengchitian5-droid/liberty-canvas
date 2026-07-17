import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";
import type { UserGameProfile } from "@/types/userGameProfile";

/** Denominator for station stamp rally — registry length, never a magic 4. */
export const STATION_ROUTE_TOTAL = DIAGNOSTIC_PLATFORM_IDS.length;

/** O(1) Record lookup — registry id only; never scan Object.keys. */
export function isStationRouteCleared(
  profile: UserGameProfile,
  platformId: string,
): boolean {
  return Boolean(profile.completedGames[platformId]);
}

/** Cleared station stamps only — ignores non-station game ids. O(registry). */
export function countClearedStationRoutes(profile: UserGameProfile): number {
  let cleared = 0;
  for (const id of DIAGNOSTIC_PLATFORM_IDS) {
    if (profile.completedGames[id]) {
      cleared += 1;
    }
  }
  return cleared;
}

/**
 * Completion % against the official station registry only.
 * Non-station game ids in the profile do not inflate the denominator.
 */
export function computeStationCompletionRate(
  profile: UserGameProfile,
): number {
  if (STATION_ROUTE_TOTAL <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((countClearedStationRoutes(profile) / STATION_ROUTE_TOTAL) * 100),
  );
}

export function listCompletedGameIds(
  profile: UserGameProfile,
): readonly string[] {
  return Object.keys(profile.completedGames);
}
