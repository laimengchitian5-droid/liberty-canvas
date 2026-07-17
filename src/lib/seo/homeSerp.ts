import {
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  PRODUCT_NAME_JA,
  PRODUCT_NAME_SLUG,
  PRODUCT_TAGLINE_EN,
} from "@/lib/brand/constants";

/** SERP length budgets — soft caps used for invariant checks (not hard truncators). */
export const HOME_SERP_LIMITS = {
  titleMax: 60,
  descriptionMax: 160,
} as const;

/**
 * Trademark / jargon denylist for parent-home SERP surfaces.
 * Discover legal-safe landings own spectrum naming; home must not reintroduce these.
 */
const HOME_SERP_FORBIDDEN = /\b(MBTI|16Personalities|Likert|Kraepelin)\b/i;

export interface HomeSerpCopy {
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
}

/**
 * O(1) home SERP contract — single source for `/` title/description/keywords.
 * Brand stays leading (disambiguate from textile "Liberty"); generics follow for intent.
 */
export function buildHomeSerpCopy(): HomeSerpCopy {
  return {
    title: `${PRODUCT_NAME} | Free AI Personality Test & 1-Min Check`,
    description: PRODUCT_TAGLINE_EN,
    keywords: HOME_SERP_KEYWORDS,
  };
}

/** JA root layout default title (metadata.title.default). */
export function buildHomeSerpTitleJa(): string {
  return `${PRODUCT_NAME} | 無料AI性格診断・1分チェック`;
}

export function buildHomeSerpRootDescription(): string {
  return PRODUCT_DESCRIPTION;
}

/** Schema alternateName — software platform signal vs craft/textile entity. */
export function buildHomeSoftwareAlternateNames(): readonly string[] {
  return [
    PRODUCT_NAME_JA,
    PRODUCT_NAME_SLUG,
    "AI personality test",
    "無料AI性格診断",
  ] as const;
}

export const HOME_SERP_KEYWORDS = [
  "Free AI Personality Test",
  "AI personality test",
  "1-min personality check",
  "Empathetic Personality Test",
  "Free Personality Spectrum Test",
  "No-Login Personality Diagnosis",
  "All-Affirming AI Chat",
  "AI 性格診断",
  "無料性格診断",
  "性格診断 無料",
  "1問 性格診断",
  "全肯定 AI チャット",
  PRODUCT_NAME,
  PRODUCT_NAME_JA,
  "liberty-canvas.vercel.app",
] as const;

/** Defensive invariant — call from tests / build smoke; throws on contract breach. */
export function assertHomeSerpInvariants(copy: HomeSerpCopy = buildHomeSerpCopy()): void {
  const surfaces = [
    copy.title,
    copy.description,
    buildHomeSerpTitleJa(),
    buildHomeSerpRootDescription(),
    ...copy.keywords,
  ];

  for (const text of surfaces) {
    if (HOME_SERP_FORBIDDEN.test(text)) {
      throw new Error(`Home SERP forbidden token in: ${text}`);
    }
  }

  if (!copy.title.startsWith(PRODUCT_NAME)) {
    throw new Error("Home SERP title must lead with PRODUCT_NAME");
  }

  if (copy.title.length > HOME_SERP_LIMITS.titleMax) {
    throw new Error(
      `Home SERP title length ${copy.title.length} > ${HOME_SERP_LIMITS.titleMax}`,
    );
  }

  if (copy.description.length > HOME_SERP_LIMITS.descriptionMax) {
    throw new Error(
      `Home SERP description length ${copy.description.length} > ${HOME_SERP_LIMITS.descriptionMax}`,
    );
  }
}
