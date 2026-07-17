import { describe, expect, it } from "vitest";
import { resolveStationPageCopy } from "@/lib/station/stationPageCopy";

describe("resolveStationPageCopy", () => {
  it("interpolates lineName for ja welcome", () => {
    const copy = resolveStationPageCopy("ja", "Big Five");
    expect(copy.welcome).toBe("Big Five へようこそ");
    expect(copy.internalNav).toContain("ターミナル");
  });

  it("falls back to EN for non-ja and guards empty lineName", () => {
    const copy = resolveStationPageCopy("fr", "   ");
    expect(copy.welcome).toBe("Welcome to this Station");
  });
});
