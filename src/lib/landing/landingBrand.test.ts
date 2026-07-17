import { describe, expect, it } from "vitest";
import {
  LANDING_DISCOVER_IDENTITY_JA,
  LANDING_DISCOVER_NAME,
  LANDING_PARENT_NAME,
} from "@/lib/landing/landingBrand";
import { getLandingCopy } from "@/lib/landing/landingCopy";

describe("landingBrand E3", () => {
  it("exports discover name from registry", () => {
    expect(LANDING_DISCOVER_NAME).toBe("Liberty Discover");
    expect(LANDING_PARENT_NAME).toBe("Liberty Canvas");
    expect(LANDING_DISCOVER_IDENTITY_JA).toBe(
      "リバティ・ディスカバー / SEO診断ハブ・多言語ランディング",
    );
  });

  it("landing copy keywords reference discover brand constant", () => {
    const enCopy = getLandingCopy("big-five-ocean", "en");
    expect(enCopy.keywords).toContain(LANDING_DISCOVER_NAME);
  });
});
