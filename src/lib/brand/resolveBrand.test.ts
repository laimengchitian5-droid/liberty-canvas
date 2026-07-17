import { describe, expect, it } from "vitest";
import {
  resolveBrandId,
  requiresBridgeModal,
  isImmersiveBrand,
} from "@/lib/brand/resolveBrand";
import { getBrand, BRAND_REGISTRY } from "@/lib/brand/registry";
import { resolveBrandPath, resolveBrandAbsolute } from "@/lib/brand/urlResolver";
import { buildBrandNavEntries } from "@/lib/brand/bridgeRoutes";

describe("brand registry", () => {
  it("resolves main diagnosis to liberty-canvas", () => {
    expect(resolveBrandId("/diagnosis")).toBe("liberty-canvas");
  });

  it("resolves plug play routes", () => {
    expect(resolveBrandId("/diagnosis/play/personality-spectrum")).toBe("liberty-plug");
  });

  it("resolves play catalogue hub", () => {
    expect(resolveBrandId("/play")).toBe("liberty-play");
    expect(resolveBrandId("/play/rubel-neko-ja-v1")).toBe("liberty-play");
  });

  it("requires bridge between immersive and main shell", () => {
    expect(requiresBridgeModal("liberty-play", "liberty-canvas")).toBe(true);
    expect(requiresBridgeModal("liberty-canvas", "liberty-forge")).toBe(false);
  });

  it("keeps structural homeHref as temporary / for all brands", () => {
    for (const brand of Object.values(BRAND_REGISTRY)) {
      expect(brand.homeHref).toBe("/");
      expect(brand.nameJa.length).toBeGreaterThan(0);
      expect(getBrand(brand.id).iconPath.startsWith("/")).toBe(true);
    }
  });

  it("resolves functional hubs via BrandUrlResolver (not registry schema)", () => {
    expect(resolveBrandPath("liberty-play", "hub")).toBe("/play");
    expect(resolveBrandPath("liberty-runtime", "engine")).toBe("/app");
    expect(resolveBrandPath("liberty-plug", "engine")).toBe(
      "/diagnosis/play/personality-spectrum",
    );
    expect(resolveBrandAbsolute("liberty-discover", "hub")).toMatch(/\/discover$/);
  });

  it("resolvePageAbsolute joins brand origin with arbitrary paths", async () => {
    const { resolvePageAbsolute } = await import("@/lib/brand/urlResolver");
    expect(resolvePageAbsolute("liberty-play", "/play/foo")).toMatch(/\/play\/foo$/);
  });

  it("builds nav entries from resolver paths", () => {
    const entries = buildBrandNavEntries();
    const play = entries.find((entry) => entry.brandId === "liberty-play");
    expect(play?.href).toBe("/play");
  });

  it("classifies immersive brands", () => {
    expect(isImmersiveBrand("liberty-discover")).toBe(true);
    expect(isImmersiveBrand("liberty-forge")).toBe(false);
  });
});
