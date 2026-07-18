/** Navigational GSC slug — must stay literal for query `libertycanvas`. */
export const BRAND_LANDING_SLUG = "libertycanvas" as const;

export type BrandLandingSlug = typeof BRAND_LANDING_SLUG;

export function isBrandLandingSlug(slug: string): slug is BrandLandingSlug {
  return slug === BRAND_LANDING_SLUG;
}
