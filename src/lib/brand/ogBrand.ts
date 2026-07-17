import { LC_DESIGN_TOKENS } from "@/lib/design/tokens";
import type { BrandId } from "@/lib/brand/registry";
import { getBrand } from "@/lib/brand/registry";

/** Server-side OG palette derived from BRAND_REGISTRY — single source of truth. */
export interface OgBrandPalette {
  readonly brandId: BrandId;
  readonly name: string;
  readonly nameJa: string;
  readonly accent: string;
  readonly cream: string;
  readonly ink: string;
  readonly muted: string;
  readonly background: string;
  readonly foreground: string;
  readonly eyebrow: string;
}

const ADULT_CUTE = {
  cream: LC_DESIGN_TOKENS.color.cream,
  ink: LC_DESIGN_TOKENS.color.ink,
  muted: LC_DESIGN_TOKENS.color.inkMuted,
} as const;

const IMMERSIVE = {
  background: "#0F172A",
  foreground: "#FFF8F2",
  muted: "rgba(255,248,242,0.72)",
} as const;

export function buildOgPalette(brandId: BrandId): OgBrandPalette {
  const brand = getBrand(brandId);
  const isImmersive = brand.theme === "immersive-dark";

  if (isImmersive) {
    return {
      brandId,
      name: brand.name,
      nameJa: brand.nameJa,
      accent: brand.accentColor,
      cream: ADULT_CUTE.cream,
      ink: ADULT_CUTE.ink,
      muted: ADULT_CUTE.muted,
      background: IMMERSIVE.background,
      foreground: IMMERSIVE.foreground,
      eyebrow: `${brand.nameJa} · 性格診断`,
    };
  }

  return {
    brandId,
    name: brand.name,
    nameJa: brand.nameJa,
    accent: brand.accentColor,
    cream: ADULT_CUTE.cream,
    ink: ADULT_CUTE.ink,
    muted: ADULT_CUTE.muted,
    background: `radial-gradient(circle at 85% 15%, ${brand.accentColor}33 0%, transparent 42%), radial-gradient(circle at 10% 90%, ${LC_DESIGN_TOKENS.color.sageSoft}22 0%, transparent 38%), ${ADULT_CUTE.cream}`,
    foreground: ADULT_CUTE.ink,
    eyebrow: `${brand.nameJa} · 心の色診断`,
  };
}

export function resolveOgBrandId(params: {
  slug?: string | null;
  quiz?: boolean;
  plug?: boolean;
}): BrandId {
  if (params.quiz) {
    return "liberty-runtime";
  }
  if (params.plug || params.slug) {
    return "liberty-plug";
  }
  return "liberty-canvas";
}
