import { PRODUCT_NAME, PRODUCT_NAME_JA } from "@/lib/brand/constants";
import { getBrand } from "@/lib/brand/registry";

const discover = getBrand("liberty-discover");

/** Discover satellite landings — sourced from BRAND_REGISTRY. */
export const LANDING_DISCOVER_NAME = discover.name;
export const LANDING_DISCOVER_NAME_JA = discover.nameJa;
export const LANDING_DISCOVER_TAGLINE_JA = discover.taglineJa;

/** Verified identity signature for Discover SEO surfaces. */
export const LANDING_DISCOVER_IDENTITY_JA =
  `${LANDING_DISCOVER_NAME_JA} / ${LANDING_DISCOVER_TAGLINE_JA}` as const;

/** Parent platform narrative (Lu + Bel FAQ, etc.). */
export const LANDING_PARENT_NAME = PRODUCT_NAME;
export const LANDING_PARENT_NAME_JA = PRODUCT_NAME_JA;

export const LANDING_BRAND_NARRATIVE_EN = `${LANDING_PARENT_NAME} — Lu + Bel = liberate beautiful souls.`;
export const LANDING_BRAND_NARRATIVE_JA = `${LANDING_PARENT_NAME} — Lu + Bel = 美しい魂を解放。`;
