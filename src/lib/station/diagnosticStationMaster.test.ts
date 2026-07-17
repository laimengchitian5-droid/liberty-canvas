import { describe, expect, it } from "vitest";
import {
  DiagnosticStationMaster,
  generateStationSEO,
  getAvailableRoutes,
} from "@/lib/station/diagnosticStationMaster";
import { isDiagnosticPlatform } from "@/lib/station/diagnosticStationRegistry";
import { getSiteUrl } from "@/lib/site/url";

describe("diagnosticStationMaster", () => {
  it("returns native routes for ja including big-five liberty path", () => {
    const routes = getAvailableRoutes("ja", "native");
    expect(routes.length).toBeGreaterThanOrEqual(3);
    expect(routes.every((r) => r.isNativeLocale)).toBe(true);

    const bigFive = routes.find((r) => r.id === "big-five");
    expect(bigFive?.libertyPath).toBe("/diagnosis/play/big-five");
    expect(bigFive?.lineName).toContain("Big Five");
  });

  it("with_english_fallback includes strengths-finder for ko when not native", () => {
    const native = getAvailableRoutes("ko", "native").map((r) => r.id);
    expect(native).not.toContain("strengths-finder");

    const fallback = getAvailableRoutes("ko", "with_english_fallback");
    const strengths = fallback.find((r) => r.id === "strengths-finder");
    expect(strengths).toBeDefined();
    expect(strengths?.isNativeLocale).toBe(false);
  });

  it("builds SEO without broken liberty-canvas.app{locale} canonicals", () => {
    const seo = generateStationSEO("big-five", "ja");
    expect(seo).not.toBeNull();
    expect(seo?.canonical).toBe(`${getSiteUrl()}/station/ja/big-five`);
    expect(seo?.canonical).not.toContain("{locale}");
    expect(seo?.canonical).not.toContain("vercel.app{");
    expect(seo?.title).toContain("Liberty Canvas");
    expect(seo?.description.length).toBeLessThanOrEqual(160);

    expect(generateStationSEO("not-a-platform", "en")).toBeNull();
  });

  it("validates platform ids and exposes facade", () => {
    expect(isDiagnosticPlatform("enneagram")).toBe(true);
    expect(isDiagnosticPlatform("cat-test")).toBe(false);
    expect(DiagnosticStationMaster.getRouteById("enneagram")?.officialUrl).toMatch(
      /^https:\/\//,
    );
  });
});
