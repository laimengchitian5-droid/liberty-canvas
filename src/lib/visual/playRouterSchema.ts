import { z } from "zod";
import { extractJsonObject } from "@/lib/ai/extractJsonObject";
import { CLEAN_PLAY_PATH_PATTERN, sanitizePlayPath } from "@/lib/visual/sanitizePlayPath";
import type {
  CleanPlayCardRoute,
  PlayRouterBulkResult,
  PlayRouterLocale,
  RawPlayCardParam,
} from "@/types/playRuntimeRouter";

export const cleanPlayCardRouteSchema = z
  .object({
    id: z.string().trim().min(1).max(64),
    localizedTitle: z.string().trim().min(1).max(160),
    localizedLocations: z.string().trim().min(1).max(120),
    localizedTrendingTag: z.string().trim().min(1).max(40),
    targetCleanPath: z
      .string()
      .trim()
      .regex(CLEAN_PLAY_PATH_PATTERN, "path must be an internal clean runtime route"),
  })
  .strict();

export const playRouterBulkSchema = z.object({
  internalReasoning: z
    .object({
      slugContextDeconstructionEnglish: z.string().trim().min(1).max(4000),
      routingSanitizationJustificationEnglish: z.string().trim().min(1).max(4000),
    })
    .strict(),
  localizedOutput: z
    .object({
      sanitizedRoutes: z.array(cleanPlayCardRouteSchema).max(40),
    })
    .strict(),
});

export type ParsedPlayRouterBulk = z.infer<typeof playRouterBulkSchema>;

const LOCATIONS_BY_LOCALE: Readonly<Record<PlayRouterLocale, string>> = {
  ja: "東京 / ニューヨーク / ロンドン",
  en: "Tokyo / New York / London",
  ko: "도쿄 / 뉴욕 / 런던",
  zh: "东京 / 纽约 / 伦敦",
  fr: "Tokyo / New York / Londres",
  de: "Tokio / New York / London",
  ar: "طوكيو / نيويورك / لندن",
  he: "טוקיו / ניו יורק / לונדון",
};

const TRENDING_BY_LOCALE: Readonly<Record<PlayRouterLocale, string>> = {
  ja: "急上昇",
  en: "Trending",
  ko: "급상승",
  zh: "热门",
  fr: "En vogue",
  de: "Im Trend",
  ar: "رائج",
  he: "טרנדי",
};

export function defaultLocations(locale: PlayRouterLocale): string {
  return LOCATIONS_BY_LOCALE[locale];
}

export function defaultTrendingTag(locale: PlayRouterLocale): string {
  return TRENDING_BY_LOCALE[locale];
}

export function parsePlayRouterBulk(raw: string): PlayRouterBulkResult | null {
  const payload = extractJsonObject(raw);
  if (payload === null) {
    return null;
  }

  const parsed = playRouterBulkSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

/**
 * Force deterministic paths + preserve card identity order.
 * AI may invent titles/tags; it must never invent navigation targets.
 */
export function mergeRoutesWithDeterministicPaths(
  aiRoutes: readonly CleanPlayCardRoute[],
  rawCards: readonly RawPlayCardParam[],
  locale: PlayRouterLocale,
): CleanPlayCardRoute[] {
  const aiById = new Map(aiRoutes.map((route) => [route.id, route]));
  const result: CleanPlayCardRoute[] = [];

  for (const card of rawCards) {
    const cleanPath = sanitizePlayPath(card.rawPath);
    if (!cleanPath) {
      continue;
    }

    const ai = aiById.get(card.id);
    result.push({
      id: card.id,
      localizedTitle: ai?.localizedTitle?.trim() || card.rawTitle,
      localizedLocations: ai?.localizedLocations?.trim() || defaultLocations(locale),
      localizedTrendingTag: ai?.localizedTrendingTag?.trim() || defaultTrendingTag(locale),
      targetCleanPath: cleanPath,
    });
  }

  return result;
}

export function buildFallbackPlayRouterBulk(
  rawCards: readonly RawPlayCardParam[],
  locale: PlayRouterLocale = "ja",
): PlayRouterBulkResult {
  const sanitizedRoutes = mergeRoutesWithDeterministicPaths([], rawCards, locale).map(
    (route) => ({
      ...route,
      localizedTitle: route.localizedTitle || "Liberty Canvas",
    }),
  );

  return {
    internalReasoning: {
      slugContextDeconstructionEnglish:
        "Fallback active — model unavailable or payload failed validation.",
      routingSanitizationJustificationEnglish:
        "Applied deterministic sanitizePlayPath whitelist (/play|/app|/diagnosis/play); AI paths ignored.",
    },
    localizedOutput: { sanitizedRoutes },
  };
}

export const PLAY_ROUTER_BULK_RESPONSE_SHAPE = {
  internalReasoning: {
    slugContextDeconstructionEnglish: "string",
    routingSanitizationJustificationEnglish: "string",
  },
  localizedOutput: {
    sanitizedRoutes: [
      {
        id: "string",
        localizedTitle: "string",
        localizedLocations: "string",
        localizedTrendingTag: "string",
        targetCleanPath: "/play/example-slug",
      },
    ],
  },
} as const;
