import { describe, expect, it } from "vitest";
import {
  evaluateSpecialtyReleaseReadiness,
  assertLiveCountriesReleaseReady,
} from "@/lib/specialty/specialtyReleaseChecklist";
import {
  isSpecialtyNativeDraftComplete,
  listUpcomingCountriesPendingNativeReview,
  UPCOMING_DRAFT_COUNTRY_IDS,
} from "@/lib/specialty/specialtyNativeDraftSlots";
import { getSpecialtyCountry } from "@/lib/specialty/globalSpecialtyTaxonomy";

describe("specialtyNativeDraftSlots", () => {
  it("marks six upcoming countries as pending native review", () => {
    expect(listUpcomingCountriesPendingNativeReview()).toEqual([
      ...UPCOMING_DRAFT_COUNTRY_IDS,
    ]);
  });

  it("completes native drafts only for live handcrafted countries", () => {
    expect(isSpecialtyNativeDraftComplete("jp")).toBe(true);
    expect(isSpecialtyNativeDraftComplete("fr")).toBe(true);
    expect(isSpecialtyNativeDraftComplete("uk")).toBe(true);
    expect(isSpecialtyNativeDraftComplete("us")).toBe(false);
  });
});

describe("specialtyReleaseChecklist", () => {
  it("passes release readiness for JP/FR/UK", () => {
    for (const id of ["jp", "fr", "uk"] as const) {
      const report = evaluateSpecialtyReleaseReadiness(id);
      expect(report.readyForLive, JSON.stringify(report.checks)).toBe(true);
    }
    expect(() => assertLiveCountriesReleaseReady(["jp", "fr", "uk"])).not.toThrow();
  });

  it("blocks upcoming countries from live promotion", () => {
    for (const id of UPCOMING_DRAFT_COUNTRY_IDS) {
      expect(getSpecialtyCountry(id).releasePhase).toBe("upcoming");
      const report = evaluateSpecialtyReleaseReadiness(id);
      expect(report.readyForLive).toBe(false);
      expect(
        report.checks.some((check) => check.id === "release_phase_live" && !check.ok),
      ).toBe(true);
    }
  });

  it("passes taboo scan for UK after alcohol-metaphor cleanup", () => {
    const report = evaluateSpecialtyReleaseReadiness("uk");
    const taboo = report.checks.find((check) => check.id === "taboo_copy_review");
    expect(taboo?.ok).toBe(true);
  });
});
