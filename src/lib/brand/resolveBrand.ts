import type { BrandId } from "@/lib/brand/registry";

const BRAND_ROUTE_RULES: ReadonlyArray<{ prefix: string; brandId: BrandId }> = [
  { prefix: "/diagnosis/play/", brandId: "liberty-plug" },
  { prefix: "/discover/", brandId: "liberty-discover" },
  { prefix: "/discover", brandId: "liberty-discover" },
  { prefix: "/play/", brandId: "liberty-play" },
  { prefix: "/play", brandId: "liberty-play" },
  { prefix: "/create", brandId: "liberty-forge" },
  { prefix: "/quiz/", brandId: "liberty-runtime" },
  { prefix: "/quiz", brandId: "liberty-runtime" },
  { prefix: "/app/", brandId: "liberty-runtime" },
  { prefix: "/app", brandId: "liberty-runtime" },
  { prefix: "/diagnosis", brandId: "liberty-canvas" },
];

/**
 * Resolves the active sub-brand from a pathname.
 * O(n) over a fixed 8-rule table — negligible vs render cost.
 */
export function resolveBrandId(pathname: string | null | undefined): BrandId {
  if (!pathname) {
    return "liberty-canvas";
  }

  for (const rule of BRAND_ROUTE_RULES) {
    if (pathname === rule.prefix || pathname.startsWith(rule.prefix)) {
      return rule.brandId;
    }
  }

  return "liberty-canvas";
}

export function isImmersiveBrand(brandId: BrandId): boolean {
  return (
    brandId === "liberty-plug" ||
    brandId === "liberty-play" ||
    brandId === "liberty-discover"
  );
}

export function requiresBridgeModal(from: BrandId, to: BrandId): boolean {
  if (from === to) {
    return false;
  }
  return isImmersiveBrand(from) !== isImmersiveBrand(to);
}
