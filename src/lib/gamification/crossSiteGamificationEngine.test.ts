import { describe, expect, it } from "vitest";
import {
  CrossSiteGamificationEngine,
  GAMIFICATION_GAME_IDS,
  generateNextStep,
  sanitizeTraitLabel,
} from "@/lib/gamification/crossSiteGamificationEngine";
import {
  emptyUserGameProfile,
  recordGameCompletion,
} from "@/lib/gamification/userGameProfileSchema";

describe("crossSiteGamificationEngine", () => {
  it("onboards empty profiles to burnout with a clean /play path", () => {
    const hook = generateNextStep(
      "rubel-cat-dog-v1",
      emptyUserGameProfile(),
      "ja",
    );

    expect(hook.nextGameId).toBe(GAMIFICATION_GAME_IDS.burnout);
    expect(hook.targetCleanPath).toBe(`/play/${GAMIFICATION_GAME_IDS.burnout}`);
    expect(hook.reason).toBe("onboarding");
    expect(hook.localizedCatchphrase).toContain("燃え尽き");
  });

  it("chains cat → ura-seishiki with trait interpolation (alias-aware)", () => {
    let profile = emptyUserGameProfile();
    profile = recordGameCompletion(profile, "cat-test", "気まぐれキャット");

    const hook = generateNextStep("cat-test", profile, "ja");

    expect(hook.nextGameId).toBe(GAMIFICATION_GAME_IDS.uraSeishiki);
    expect(hook.targetCleanPath).toBe(`/play/${GAMIFICATION_GAME_IDS.uraSeishiki}`);
    expect(hook.reason).toBe("trait_chain");
    expect(hook.localizedCatchphrase).toContain("気まぐれキャット");
  });

  it("routes heavy users to insights hub without inventing /app paths", () => {
    let profile = emptyUserGameProfile();
    profile = recordGameCompletion(profile, GAMIFICATION_GAME_IDS.catDog, "Cat");
    profile = recordGameCompletion(
      profile,
      GAMIFICATION_GAME_IDS.uraSeishiki,
      "Shadow Soft",
    );
    profile = recordGameCompletion(profile, GAMIFICATION_GAME_IDS.burnout, "Ember");

    const hook = generateNextStep(GAMIFICATION_GAME_IDS.uraSeishiki, profile, "en");

    expect(hook.nextGameId).toBe(GAMIFICATION_GAME_IDS.insightsHub);
    expect(hook.targetCleanPath).toBe("/diagnosis/insights");
    expect(hook.reason).toBe("completion_hub");
  });

  it("sanitizes trait labels against markup injection", () => {
    expect(sanitizeTraitLabel('<img src=x onerror=alert(1)>', "safe")).toBe(
      "img src=x onerror=alert(1)",
    );
    expect(sanitizeTraitLabel("", "fallback")).toBe("fallback");
  });

  it("exposes sketch-compatible facade", () => {
    const hook = CrossSiteGamificationEngine.generateNextStep(
      "x",
      { completedGames: {} },
      "en",
    );
    expect(hook.nextGameId).toBe(GAMIFICATION_GAME_IDS.burnout);
  });
});
