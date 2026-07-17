import { describe, expect, it } from "vitest";
import {
  DiagnosticStationMaster,
  buildAvailableRouteView,
  generateStationSEO,
  getAvailableRoutes,
} from "@/lib/station/diagnosticStationMaster";
import { isDiagnosticPlatform } from "@/lib/station/diagnosticStationRegistry";
import { getSiteUrl } from "@/lib/site/url";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";

describe("diagnosticStationMaster", () => {
  it("returns native routes for ja including big-five liberty path", () => {
    const routes = getAvailableRoutes("ja", "native");
    expect(routes.length).toBeGreaterThanOrEqual(3);
    expect(routes.every((r) => r.isNativeLocale)).toBe(true);

    const bigFive = routes.find((r) => r.id === "big-five");
    expect(bigFive?.libertyPath).toBe("/diagnosis/play/big-five");
    expect(bigFive?.lineName).toContain("Big Five");
  });

  it("buildAvailableRouteView is O(1) fail-closed and sanitizes libertyPath", () => {
    expect(buildAvailableRouteView("not-real", "ja")).toBeNull();

    const view = buildAvailableRouteView("big-five", "ja");
    expect(view?.lineName.length).toBeGreaterThan(0);
    expect(view?.libertyPath).toBe("/diagnosis/play/big-five");
    expect(view?.isNativeLocale).toBe(true);
  });

  it("with_english_fallback includes strengths-finder for ar when not native", () => {
    const native = getAvailableRoutes("ar", "native").map((r) => r.id);
    expect(native).not.toContain("strengths-finder");

    const fallback = getAvailableRoutes("ar", "with_english_fallback");
    const strengths = fallback.find((r) => r.id === "strengths-finder");
    expect(strengths).toBeDefined();
    expect(strengths?.isNativeLocale).toBe(false);
  });

  it("registers disc and love-type-16 hubs", () => {
    const disc = DiagnosticStationMaster.getRouteById("disc");
    expect(disc?.officialUrl).toMatch(/^https:\/\//);
    expect(disc?.libertyPath).toBeUndefined();
    expect(generateStationSEO("disc", "ja")?.path).toBe("/station/ja/disc");

    const love = DiagnosticStationMaster.getRouteById("love-type-16");
    expect(love?.officialUrl).toContain("lovecharacter64");
    expect(love?.libertyPath).toBeUndefined();
  });

  it("exposes fifteen O(1) registry entries", () => {
    expect(
      DiagnosticStationMaster.getAvailableRoutes("en", "with_english_fallback")
        .length,
    ).toBe(DIAGNOSTIC_PLATFORM_IDS.length);
    expect(DIAGNOSTIC_PLATFORM_IDS.length).toBe(15);
  });

  it("returns full AvailableRouteView fields (not sketch partials)", () => {
    const [first] = getAvailableRoutes("ja", "with_english_fallback");
    expect(first).toBeDefined();
    expect(first?.lineName.length).toBeGreaterThan(0);
    expect(typeof first?.isNativeLocale).toBe("boolean");
    expect(first?.officialUrl.startsWith("https://")).toBe(true);
    expect(
      first &&
        ("internalPlayPath" in first
          ? (first as { internalPlayPath?: unknown }).internalPlayPath
          : undefined),
    ).toBeUndefined();
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
