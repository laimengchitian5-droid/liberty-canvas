import { describe, expect, it } from "vitest";
import { buildCompleteStationProfile } from "@/lib/station/buildCompleteStationProfile";
import { STATION_ROUTE_TOTAL } from "@/lib/station/stationDashboardStats";
import { computeStationCompletionRate } from "@/lib/station/stationDashboardStats";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";

describe("buildCompleteStationProfile", () => {
  it("clears every registry route for 100% completion", () => {
    const profile = buildCompleteStationProfile(1_700_000_000_000);
    expect(Object.keys(profile.completedGames)).toHaveLength(
      DIAGNOSTIC_PLATFORM_IDS.length,
    );
    expect(computeStationCompletionRate(profile)).toBe(100);
    expect(STATION_ROUTE_TOTAL).toBe(15);
  });
});
