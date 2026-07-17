import { describe, expect, it } from "vitest";
import {
  AdaptiveAIContextBuilder,
  buildAdaptiveStationContext,
} from "@/lib/station/adaptiveStationContext";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import {
  emptyUserGameProfile,
  recordGameCompletion,
} from "@/lib/gamification/userGameProfileSchema";

describe("buildAdaptiveStationContext", () => {
  it("maps station ids with EN line names and clamps traits", () => {
    let profile = emptyUserGameProfile();
    profile = recordGameCompletion(
      profile,
      "love-type-16",
      "ちゃっかりうさぎ",
    );
    profile = recordGameCompletion(profile, "rubel-cat-dog-v1", "Cat"); // ignored

    const payload = buildAdaptiveStationContext(profile, "ja");
    const json = JSON.parse(payload.compressedUserTraitsJson) as {
      totalRoutesCompleted: number;
      userTraitsMatrix: Record<string, { line: string; trait: string }>;
    };

    expect(json.totalRoutesCompleted).toBe(1);
    expect(json.userTraitsMatrix["love-type-16"]?.trait).toBe("ちゃっかりうさぎ");
    expect(json.userTraitsMatrix["love-type-16"]?.line).toMatch(/Love/i);
    expect(payload.systemPrompt).toContain(PRODUCT_NAME);
    expect(payload.systemPrompt).toContain('"ja"');
    expect(payload.systemPrompt).not.toContain("Universal AI Canvas");
  });

  it("exposes sketch facade AdaptiveAIContextBuilder", () => {
    const builder = new AdaptiveAIContextBuilder();
    const payload = builder.buildSecureContext(emptyUserGameProfile(), "en");
    expect(JSON.parse(payload.compressedUserTraitsJson).totalRoutesCompleted).toBe(
      0,
    );
  });
});
