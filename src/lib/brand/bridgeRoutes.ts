import type { BrandId } from "@/lib/brand/registry";
import { BRAND_REGISTRY, SUB_BRAND_IDS } from "@/lib/brand/registry";
import { resolveBrandPath } from "@/lib/brand/urlResolver";

export interface BrandNavEntry {
  readonly brandId: BrandId;
  readonly href: string;
  readonly labelJa: string;
  readonly iconPath: string;
  readonly accentColor: string;
}

/** Global mega-menu entries — hrefs resolved via BrandUrlResolver (not registry.homeHref). */
export function buildBrandNavEntries(): readonly BrandNavEntry[] {
  return SUB_BRAND_IDS.map((brandId) => {
    const brand = BRAND_REGISTRY[brandId];
    return {
      brandId,
      href: resolveBrandPath(brandId, "hub"),
      labelJa: brand.nameJa,
      iconPath: brand.iconPath,
      accentColor: brand.accentColor,
    };
  });
}

export const BRIDGE_DISMISS_KEY = "lc-brand-bridge-dismissed";
