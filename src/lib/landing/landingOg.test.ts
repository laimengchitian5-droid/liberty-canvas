import { describe, expect, it } from "vitest";
import { resolveLandingOgImageUrl } from "@/lib/landing/landingOg";

describe("resolveLandingOgImageUrl", () => {
  it("maps plug play paths to slug OG", () => {
    const url = resolveLandingOgImageUrl(
      "/diagnosis/play/big-five",
      "headline",
      "description",
    );
    expect(url).toContain("/api/og/diagnosis");
    expect(url).toContain("slug=big-five");
  });

  it("falls back to headline card for brand hub path", () => {
    const url = resolveLandingOgImageUrl("/diagnosis", "LibertyCanvas hub", "meta");
    expect(url).toContain("/api/og/diagnosis");
    expect(url).toContain("headline=");
    expect(url).not.toContain("slug=");
  });
});
