/**
 * Canonical query-parameter contract for LibertyCanvas routes.
 * Used by analytics, OG, deep links, and SEO alternates.
 */
export const QUERY_PARAM_REGISTRY = {
  q: {
    purpose: "Hub/catalog full-text search (client + /api/search)",
    example: "/?q=cat",
    analytics: false,
  },
  lang: {
    purpose: "UI + metadata locale override (ja/en/ko/zh)",
    example: "/?lang=en",
    analytics: false,
  },
  ref: {
    purpose: "Attribution source for plug play and share funnels",
    example: "/diagnosis/play/big-five?ref=rubel-bridge",
    analytics: true,
  },
  planet: {
    purpose: "Cosmic planet kind for result deep-link + OG",
    example: "/diagnosis/play/romance/result?planet=nebula",
    analytics: true,
  },
  archetype: {
    purpose: "Winning result archetype id on share URLs",
    example: "/diagnosis/play/romance/result?archetype=romantic-dreamer",
    analytics: false,
  },
  f: {
    purpose: "Five-factor percentile blob for OG radar (0–100 comma-separated)",
    example: "/diagnosis/play/big-five/result?f=72,65,58,80,45",
    analytics: false,
  },
  variant: {
    purpose: "Share card A/B variant id",
    example: "?variant=cosmic-a",
    analytics: true,
  },
  ogVariant: {
    purpose: "OG image layout variant (classic | radar)",
    example: "/api/og/diagnosis?slug=big-five&ogVariant=classic",
    analytics: false,
  },
} as const;

export type QueryParamKey = keyof typeof QUERY_PARAM_REGISTRY;
