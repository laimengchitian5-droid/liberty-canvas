import { describe, expect, it } from "vitest";
import { appendStationAdaptiveContext } from "@/lib/ai/stationChatContext";
import { emptyUserGameProfile, recordGameCompletion } from "@/lib/gamification/userGameProfileSchema";
import { PRODUCT_NAME } from "@/lib/brand/constants";

describe("appendStationAdaptiveContext", () => {
  it("merges EN-reasoning station prompt and stable id keys", () => {
    let profile = emptyUserGameProfile();
    profile = recordGameCompletion(profile, "big-five", "OpenExplorer");

    const merged = appendStationAdaptiveContext(
      "Base coaching prompt.",
      profile,
      "ja",
    );

    expect(merged).toContain("Base coaching prompt.");
    expect(merged).toContain(PRODUCT_NAME);
    expect(merged).toContain("compressedUserTraitsJson:");
    expect(merged).toContain('"big-five"');
    expect(merged).toContain("OpenExplorer");
    expect(merged).not.toContain("internalPlayPath");
  });

  it("stays safe with empty matrix", () => {
    const merged = appendStationAdaptiveContext(
      "Base.",
      emptyUserGameProfile(),
      "en",
    );
    expect(merged).toContain("0/");
    expect(merged).toContain('"userTraitsMatrix":{}');
  });
});
