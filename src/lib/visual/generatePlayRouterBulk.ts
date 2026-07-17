import { generateText } from "ai";
import { resolveLanguageModel, type AiProviderName } from "@/lib/ai/provider";
import { getDirection, getLocaleLabel } from "@/lib/i18n/config";
import {
  buildFallbackPlayRouterBulk,
  mergeRoutesWithDeterministicPaths,
  parsePlayRouterBulk,
  PLAY_ROUTER_BULK_RESPONSE_SHAPE,
} from "@/lib/visual/playRouterSchema";
import type {
  PlayRouterBulkResult,
  PlayRouterLocale,
  RawPlayCardParam,
} from "@/types/playRuntimeRouter";

const TEMPERATURE = 0.2;
const MAX_OUTPUT_TOKENS = 1600;
const CACHE_MAX_ENTRIES = 48;
const CACHE_TTL_MS = 15 * 60 * 1000;

export type PlayRouterProvider = Exclude<AiProviderName, "none"> | "fallback";

export interface GeneratePlayRouterBulkResult {
  readonly data: PlayRouterBulkResult;
  readonly provider: PlayRouterProvider;
  readonly usedFallback: boolean;
  readonly cacheHit: boolean;
}

type CacheEntry = {
  readonly result: GeneratePlayRouterBulkResult;
  readonly expiresAt: number;
};

const routerCache = new Map<string, CacheEntry>();

function cacheKey(cards: readonly RawPlayCardParam[], lang: PlayRouterLocale): string {
  const fingerprint = cards
    .map((card) => `${card.id}:${card.rawPath}:${card.rawTitle}`)
    .join("|");
  return `${lang}\0${fingerprint}`;
}

function readCache(key: string): GeneratePlayRouterBulkResult | null {
  const entry = routerCache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    routerCache.delete(key);
    return null;
  }
  return { ...entry.result, cacheHit: true };
}

function writeCache(key: string, result: GeneratePlayRouterBulkResult): void {
  if (routerCache.size >= CACHE_MAX_ENTRIES) {
    const oldest = routerCache.keys().next().value;
    if (oldest !== undefined) {
      routerCache.delete(oldest);
    }
  }
  routerCache.set(key, {
    result: { ...result, cacheHit: false },
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/** Test helper. */
export function clearPlayRouterCache(): void {
  routerCache.clear();
}

function buildSystemPrompt(lang: PlayRouterLocale): string {
  const label = getLocaleLabel(lang);
  const dir = getDirection(lang);

  return [
    "You are an elite system architect and global localization engine for Liberty Canvas.",
    "Never claim clinical diagnosis, therapy, or medical authority.",
    "Think in English inside internalReasoning only.",
    "Write localizedTitle, localizedLocations, and localizedTrendingTag in localizedOutput only.",
    `Target language ISO: ${lang} (${label}), text direction: ${dir}.`,
    "targetCleanPath MUST be an internal path matching /^\\/(play|app|diagnosis\\/play)\\/[a-zA-Z0-9][a-zA-Z0-9_-]*$/",
    "Do not invent external URLs, query strings, or protocol-relative paths.",
    "Prefer preserving /play/[id] for Rubel quizzes; /app/[id] for Forge apps; /diagnosis/play/[slug] for Plug.",
    "Respond with JSON only matching:",
    JSON.stringify(PLAY_ROUTER_BULK_RESPONSE_SHAPE),
  ].join("\n");
}

function buildUserPrompt(
  rawCards: readonly RawPlayCardParam[],
  lang: PlayRouterLocale,
): string {
  // Compact JSON — avoid pretty-print cost/tokens (O(n) stringify once).
  return [
    "[RAW CARDS]",
    JSON.stringify(rawCards),
    "",
    "[STEP 1 — REASONING, English only]",
    "- Deconstruct each slug/creator hint.",
    "- Explain how paths should map to /play|/app|/diagnosis/play.",
    "",
    "[STEP 2 — LOCALIZATION]",
    `- Fill copy fields in ISO language "${lang}".`,
    "- Standardize locations (Tokyo / New York / London) and a short trending tag.",
    "- Keep every card id from the input; do not drop or invent ids.",
  ].join("\n");
}

function asFallback(
  rawCards: readonly RawPlayCardParam[],
  lang: PlayRouterLocale,
): GeneratePlayRouterBulkResult {
  return {
    data: buildFallbackPlayRouterBulk(rawCards, lang),
    provider: "fallback",
    usedFallback: true,
    cacheHit: false,
  };
}

/**
 * Localize catalog cards + attach deterministically sanitized runtime paths.
 * Paths are always re-derived from raw cards — model output is never authoritative.
 */
export async function generatePlayRouterBulk(
  rawCards: readonly RawPlayCardParam[],
  lang: PlayRouterLocale = "ja",
): Promise<GeneratePlayRouterBulkResult> {
  if (rawCards.length === 0) {
    return asFallback(rawCards, lang);
  }

  const key = cacheKey(rawCards, lang);
  const cached = readCache(key);
  if (cached) {
    return cached;
  }

  const resolved = resolveLanguageModel();
  if (!resolved) {
    const fallback = asFallback(rawCards, lang);
    writeCache(key, fallback);
    return fallback;
  }

  try {
    const result = await generateText({
      model: resolved.model,
      temperature: TEMPERATURE,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      system: buildSystemPrompt(lang),
      prompt: buildUserPrompt(rawCards, lang),
    });

    const parsed = parsePlayRouterBulk(result.text);
    if (!parsed) {
      const fallback = asFallback(rawCards, lang);
      writeCache(key, fallback);
      return fallback;
    }

    const sanitizedRoutes = mergeRoutesWithDeterministicPaths(
      parsed.localizedOutput.sanitizedRoutes,
      rawCards,
      lang,
    );

    if (sanitizedRoutes.length === 0) {
      const fallback = asFallback(rawCards, lang);
      writeCache(key, fallback);
      return fallback;
    }

    const success: GeneratePlayRouterBulkResult = {
      data: {
        internalReasoning: parsed.internalReasoning,
        localizedOutput: { sanitizedRoutes },
      },
      provider: resolved.provider as Exclude<AiProviderName, "none">,
      usedFallback: false,
      cacheHit: false,
    };
    writeCache(key, success);
    return success;
  } catch (error) {
    console.error("[play-router-bulk] generateText failed:", error);
    const fallback = asFallback(rawCards, lang);
    writeCache(key, fallback);
    return fallback;
  }
}
