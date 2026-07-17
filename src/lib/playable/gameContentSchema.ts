import { z } from "zod";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import type {
  PlayableGameRenderProps,
  PlayableServiceManifest,
} from "@/types/playableService";

/**
 * App-supported locales (ISO 639-1 subset actually wired in Liberty Canvas).
 * Do not invent es/pt packs here — unsupported tags fall back via resolveGameLocale.
 */
export const VALID_LOCALES = SUPPORTED_LOCALES;
export type ValidLocale = Locale;

/** SERP meta description soft limit (Google display ~150–160 chars). */
export const SEO_DESCRIPTION_MAX = 160;
export const SEO_TITLE_MAX = 70;

const gameOptionSchema = z
  .object({
    value: z.string().trim().min(1).max(64),
    label: z.string().trim().min(1).max(200),
  })
  .strict();

const gameQuestionSchema = z
  .object({
    id: z.string().trim().min(1).max(64),
    text: z.string().trim().min(1).max(500),
    options: z.array(gameOptionSchema).min(2).max(8),
  })
  .strict();

/**
 * E-E-A-T / pSEO-oriented playable content envelope.
 * Fail-closed at API and loader boundaries.
 */
export const gameContentSchema = z
  .object({
    title: z.string().trim().min(1).max(SEO_TITLE_MAX),
    description: z.string().trim().min(1).max(SEO_DESCRIPTION_MAX),
    questions: z.array(gameQuestionSchema).min(1).max(40),
  })
  .strict();

export type GameContent = z.infer<typeof gameContentSchema>;

/** Alias kept for sketch compatibility — same as gameContentSchema. */
export const GameContentSchema = gameContentSchema;

/**
 * Sketch-compatible ServiceManifest: serializable theme/id only.
 * Do not attach JSX renderers — use PlayServiceContainer children instead.
 */
export type ServiceManifest = PlayableServiceManifest<GameContent>;

export type GameServiceRenderProps = PlayableGameRenderProps<GameContent> & {
  readonly content: GameContent;
};

/** Build render-prop bag with `content` alias for GameContent data. */
export function toGameServiceRenderProps(
  props: PlayableGameRenderProps<GameContent>,
): GameServiceRenderProps {
  return { ...props, content: props.data };
}

/**
 * Map arbitrary ISO tags (incl. es/pt and regional variants) onto app Locale.
 * O(1) for supported; O(1) map hit for common unsupported fallbacks.
 */
const LOCALE_FALLBACKS: Readonly<Record<string, Locale>> = {
  es: "en",
  pt: "en",
  "pt-br": "en",
  "zh-cn": "zh",
  "zh-tw": "zh",
  "zh-hans": "zh",
  "zh-hant": "zh",
  "en-us": "en",
  "en-gb": "en",
  "ja-jp": "ja",
};

export function resolveGameLocale(
  candidate: string | null | undefined,
  fallback: Locale = DEFAULT_LOCALE,
): Locale {
  if (!candidate) {
    return fallback;
  }

  const normalized = candidate.trim().toLowerCase().replace(/_/g, "-");
  if (!normalized) {
    return fallback;
  }

  const primary = normalized.slice(0, 2);
  if (isLocale(primary)) {
    return primary;
  }

  return LOCALE_FALLBACKS[normalized] ?? LOCALE_FALLBACKS[primary] ?? fallback;
}

export function parseGameContent(raw: unknown): GameContent | null {
  const parsed = gameContentSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

/**
 * Deterministic SEO-safe stub when content fails validation.
 * Keeps play shells mountable (no blank SERP / crash).
 */
export function buildFallbackGameContent(locale: Locale): GameContent {
  const copy =
    locale === "ja"
      ? {
          title: "やさしい性格診断",
          description:
            "短い質問から、あなたらしさをやさしく見つける無料診断です。",
          optionA: "はい",
          optionB: "いいえ",
          question: "直感で近いほうを選んでください。",
        }
      : {
          title: "Gentle Personality Check",
          description:
            "A short, affirming quiz to explore your soft strengths — free on Liberty Canvas.",
          optionA: "Yes",
          optionB: "No",
          question: "Pick the option that feels closer to you.",
        };

  return {
    title: copy.title,
    description: copy.description.slice(0, SEO_DESCRIPTION_MAX),
    questions: [
      {
        id: "q1",
        text: copy.question,
        options: [
          { value: "a", label: copy.optionA },
          { value: "b", label: copy.optionB },
        ],
      },
    ],
  };
}

/** Expose supported list length for docs/tests — not a 197-locale claim. */
export const VALID_LOCALE_COUNT = VALID_LOCALES.length;
