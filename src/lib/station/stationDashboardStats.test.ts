import { describe, expect, it } from "vitest";
import {
  computeStationCompletionRate,
  STATION_ROUTE_TOTAL,
} from "@/lib/station/stationDashboardStats";
import { emptyUserGameProfile, recordGameCompletion } from "@/lib/gamification/userGameProfileSchema";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";

describe("stationDashboardStats", () => {
  it("uses registry size as denominator and ignores non-station ids", () => {
    expect(STATION_ROUTE_TOTAL).toBe(DIAGNOSTIC_PLATFORM_IDS.length);
    expect(STATION_ROUTE_TOTAL).toBe(15);

    let profile = emptyUserGameProfile();
    profile = recordGameCompletion(profile, "big-five", "Visited_Official");
    profile = recordGameCompletion(profile, "rubel-cat-dog-v1", "Cat");

    expect(computeStationCompletionRate(profile)).toBe(
      Math.round((1 / 15) * 100),
    );
  });

  it("caps at 100 when all station routes are cleared", () => {
    let profile = emptyUserGameProfile();
    for (const id of DIAGNOSTIC_PLATFORM_IDS) {
      profile = recordGameCompletion(profile, id, "Visited_Studio");
    }
    expect(computeStationCompletionRate(profile)).toBe(100);
  });
});
