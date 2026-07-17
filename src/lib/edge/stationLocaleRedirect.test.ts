import { describe, expect, it } from "vitest";
import { resolveStationLocaleRedirect } from "@/lib/edge/stationLocaleRedirect";

describe("resolveStationLocaleRedirect", () => {
  it("injects locale into bare station hub and platform id paths", () => {
    expect(resolveStationLocaleRedirect("/station", "ja")).toBe("/station/ja");
    expect(resolveStationLocaleRedirect("/station/big-five", "en")).toBe(
      "/station/en/big-five",
    );
  });

  it("passes through already-canonical station locales (O(1) no-op)", () => {
    expect(resolveStationLocaleRedirect("/station/ja", "en")).toBeNull();
    expect(resolveStationLocaleRedirect("/station/ko/enneagram", "ja")).toBeNull();
  });

  it("never rewrites non-station routes (rejects sketch /{locale}/ prefix model)", () => {
    expect(resolveStationLocaleRedirect("/diagnosis", "ja")).toBeNull();
    expect(resolveStationLocaleRedirect("/discover/ja/big-five", "ja")).toBeNull();
    expect(resolveStationLocaleRedirect("/", "ja")).toBeNull();
  });
});
