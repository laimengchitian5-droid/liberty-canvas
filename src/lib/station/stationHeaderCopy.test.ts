import { describe, expect, it } from "vitest";
import { resolveStationHeaderCopy } from "@/lib/station/stationHeaderCopy";

describe("resolveStationHeaderCopy", () => {
  it("returns ja pack without self-referential fallback", () => {
    expect(resolveStationHeaderCopy("ja").stationHub).toBe(
      "診断ターミナル",
    );
    expect(resolveStationHeaderCopy("ja").backToTerminal).toContain("ターミナル");
  });

  it("falls back to EN for non-ja locales", () => {
    expect(resolveStationHeaderCopy("ko").dashboard).toBe(
      resolveStationHeaderCopy("en").dashboard,
    );
    expect(resolveStationHeaderCopy("fr").backToTerminal).toBe(
      "Back to Terminal",
    );
  });
});
