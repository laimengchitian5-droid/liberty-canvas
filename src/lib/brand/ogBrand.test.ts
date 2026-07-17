import { describe, expect, it } from "vitest";
import { buildOgPalette, resolveOgBrandId } from "@/lib/brand/ogBrand";

describe("ogBrand", () => {
  it("builds adult-cute palette for liberty-canvas", () => {
    const palette = buildOgPalette("liberty-canvas");
    expect(palette.nameJa).toBe("リバティ・キャンバス");
    expect(palette.background).toContain("radial-gradient");
  });

  it("builds immersive palette for liberty-plug", () => {
    const palette = buildOgPalette("liberty-plug");
    expect(palette.background).toBe("#0F172A");
    expect(palette.eyebrow).toContain("リバティ・プラグ");
  });

  it("resolves brand id from og context", () => {
    expect(resolveOgBrandId({ quiz: true })).toBe("liberty-runtime");
    expect(resolveOgBrandId({ slug: "big-five" })).toBe("liberty-plug");
    expect(resolveOgBrandId({})).toBe("liberty-canvas");
  });
});
