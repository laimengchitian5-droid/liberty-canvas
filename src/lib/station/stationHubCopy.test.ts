import { describe, expect, it } from "vitest";
import { resolveStationHubCopy } from "@/lib/station/stationHubCopy";

describe("resolveStationHubCopy", () => {
  it("returns ja pack without self-referential fallback", () => {
    const copy = resolveStationHubCopy("ja");
    expect(copy.hubTitle).toContain("ターミナル");
    expect(copy.linesBadge(3, 15)).toBe("3 / 15 Lines");
  });

  it("falls back to EN for non-ja locales", () => {
    expect(resolveStationHubCopy("ko").hubTitle).toBe(
      resolveStationHubCopy("en").hubTitle,
    );
  });
});
