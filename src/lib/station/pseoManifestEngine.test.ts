import { describe, expect, it, beforeEach } from "vitest";
import { BRAND_LANDING_SLUG } from "@/lib/landing/brandLandingSlug";
import { listLandingStaticParams } from "@/lib/landing/landingCatalog";
import {
  __resetPseoManifestRegistryForTests,
  generateAllPseoRoutes,
  getPseoManifestEntry,
} from "@/lib/station/pseoManifestEngine";

describe("pseoManifestEngine", () => {
  beforeEach(() => {
    __resetPseoManifestRegistryForTests();
  });

  it("resolves a known Discover cell to a first-party destination", () => {
    const entry = getPseoManifestEntry("ja", "sixteen-personalities");
    expect(entry.locale).toBe("ja");
    expect(entry.slug).toBe("sixteen-personalities");
    expect(entry.destinationPath.startsWith("/")).toBe(true);
    expect(entry.destinationPath.startsWith("//")).toBe(false);
    expect(entry.destinationPath.includes("16personalities.com")).toBe(false);
    expect(entry.surface.title.length).toBeGreaterThanOrEqual(5);
  });

  it("falls back to brand landing for invented sketch slugs", () => {
    const entry = getPseoManifestEntry("ja", "global-identity-core");
    expect(entry.slug).toBe(BRAND_LANDING_SLUG);
    expect(entry.destinationPath).toBe("/diagnosis");
  });

  it("falls back to en when locale is unknown but slug exists", () => {
    const entry = getPseoManifestEntry("xx", "big-five-ocean");
    expect(entry.locale).toBe("en");
    expect(entry.slug).toBe("big-five-ocean");
    expect(entry.destinationPath).toBe("/diagnosis/play/big-five");
  });

  it("generateAllPseoRoutes mirrors Discover static params", () => {
    const routes = generateAllPseoRoutes();
    expect(routes).toEqual(listLandingStaticParams());
    expect(routes.length).toBeGreaterThan(0);
  });

  it("never emits absolute outbound destinations for SSG cells", () => {
    for (const { locale, slug } of generateAllPseoRoutes()) {
      const { destinationPath } = getPseoManifestEntry(locale, slug);
      expect(destinationPath.startsWith("/")).toBe(true);
      expect(destinationPath).not.toMatch(/^https?:/i);
      expect(destinationPath).not.toContain("16personalities.com");
    }
  });
});
