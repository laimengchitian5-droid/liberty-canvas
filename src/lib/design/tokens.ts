/**
 * Adult-Cute design tokens — LibertyCanvas diagnosis shell.
 * Single source for Tailwind extends + CSS custom properties.
 */
export const LC_DESIGN_TOKENS = {
  color: {
    cream: "#FAF9F6",
    creamSoft: "#FFFCF7",
    dustyRose: "#C9A09A",
    sageSoft: "#9CAF88",
    goldAccent: "#C4A962",
    ink: "#4A4038",
    inkMuted: "#6F6258",
    focusRing: "#10b981",
    cosmicIndigo: "#6366F1",
  },
  typography: {
    hero: "clamp(1.65rem, 4.5vw, 2.35rem)",
    title: "clamp(1.25rem, 3.2vw, 1.65rem)",
    body: "clamp(0.92rem, 2.2vw, 1rem)",
    caption: "0.78rem",
    lineHeightBody: 1.65,
    lineHeightHero: 1.25,
  },
  touch: {
    minTarget: "44px",
  },
  radius: {
    card: "1.25rem",
    pill: "9999px",
  },
  motion: {
    springStiffness: 380,
    springDamping: 28,
  },
} as const;

export type LcDesignTokens = typeof LC_DESIGN_TOKENS;

/** CSS custom property map for `:root` injection. */
export const LC_CSS_VAR_ENTRIES: ReadonlyArray<[string, string]> = [
  ["--lc-color-cream", LC_DESIGN_TOKENS.color.cream],
  ["--lc-color-cream-soft", LC_DESIGN_TOKENS.color.creamSoft],
  ["--lc-color-dusty-rose", LC_DESIGN_TOKENS.color.dustyRose],
  ["--lc-color-sage", LC_DESIGN_TOKENS.color.sageSoft],
  ["--lc-color-gold", LC_DESIGN_TOKENS.color.goldAccent],
  ["--lc-color-ink", LC_DESIGN_TOKENS.color.ink],
  ["--lc-color-ink-muted", LC_DESIGN_TOKENS.color.inkMuted],
  ["--lc-font-hero", LC_DESIGN_TOKENS.typography.hero],
  ["--lc-font-title", LC_DESIGN_TOKENS.typography.title],
  ["--lc-font-body", LC_DESIGN_TOKENS.typography.body],
  ["--lc-touch-min", LC_DESIGN_TOKENS.touch.minTarget],
  ["--lc-radius-card", LC_DESIGN_TOKENS.radius.card],
];
