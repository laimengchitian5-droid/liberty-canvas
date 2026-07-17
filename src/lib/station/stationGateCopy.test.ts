import { describe, expect, it } from "vitest";
import {
  buildStationDisclaimer,
  toSafeExternalHref,
} from "@/lib/station/stationGateCopy";

describe("stationGateCopy", () => {
  it("only allows https external hrefs", () => {
    expect(toSafeExternalHref("https://www.16personalities.com")).toMatch(
      /^https:\/\//,
    );
    expect(toSafeExternalHref("http://insecure.example")).toBeNull();
    expect(toSafeExternalHref("javascript:alert(1)")).toBeNull();
    expect(toSafeExternalHref("//evil.example")).toBeNull();
  });

  it("builds locale-aware disclaimers with non-affiliation notice", () => {
    expect(buildStationDisclaimer("MBTI 特急", "ja")).toMatch(/運営・提携|乗り換え案内/);
    expect(buildStationDisclaimer("MBTI Express", "en")).toMatch(
      /not affiliated|Independent/i,
    );
  });
});

