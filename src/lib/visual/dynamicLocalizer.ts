import { generateText } from "ai";
import { resolveLanguageModel, type AiProviderName } from "@/lib/ai/provider";
import { getDirection, getLocaleLabel } from "@/lib/i18n/config";
import {
  buildFallbackRuntimeLocalization,
  parseRuntimeLocalization,
  RUNTIME_LOCALIZATION_RESPONSE_SHAPE,
} from "@/lib/visual/runtimeLocalizerSchema";
import type {
  DiagnosticMasterData,
  RuntimeLocalizationResult,
  RuntimeLocalizerLocale,
} from "@/types/runtimeLocalizer";

const TEMPERATURE = 0.3;
const MAX_OUTPUT_TOKENS = 900;
const CACHE_MAX_ENTRIES = 64;

export type LocalizerProvider =
  | Exclude<AiProviderName, "none">
  | "fallback"
  | "identity";

export interface LocalizeDiagnosticContentResult {
  readonly data: RuntimeLocalizationResult;
  readonly provider: LocalizerProvider;
  readonly usedFallback: boolean;
  readonly cacheHit: boolean;
}

type CacheEntry = {
  readonly result: LocalizeDiagnosticContentResult;
  readonly expiresAt: number;
};

/** Bounded in-memory cache — O(1) hit for repeated master+locale pairs. */
const localizationCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function cacheKey(master: DiagnosticMasterData, lang: RuntimeLocalizerLocale): string {
  return `${lang}\0${master.title}\0${master.description}`;
}

function readCache(key: string): LocalizeDiagnosticContentResult | null {
  const entry = localizationCache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    localizationCache.delete(key);
    return null;
  }
  return { ...entry.result, cacheHit: true };
}

function writeCache(key: string, result: LocalizeDiagnosticContentResult): void {
  if (localizationCache.size >= CACHE_MAX_ENTRIES) {
    const oldest = localizationCache.keys().next().value;
    if (oldest !== undefined) {
      localizationCache.delete(oldest);
    }
  }
  localizationCache.set(key, {
    result: { ...result, cacheHit: false },
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/** Test/dev helper — clears memoization between cases. */
export function clearRuntimeLocalizerCache(): void {
  localizationCache.clear();
}

function buildSystemPrompt(lang: RuntimeLocalizerLocale): string {
  const label = getLocaleLabel(lang);
  const dir = getDirection(lang);

  return [
    "You are an elite localization architect and psychometrics copywriter.",
    "Never claim clinical diagnosis, therapy, or medical authority.",
    "Think step-by-step in English inside internalReasoning only.",
    "Write title, description, and startButtonText only in localizedOutput.",
    `Target language ISO: ${lang} (${label}), text direction: ${dir}.`,
    "localizedOutput MUST feel native — Adult-Cute, cosmic, affirming — never machine-translated.",
    "Respect cultural guardrails: no alcohol/bar culture, no religious dietary framing, no unlucky-number grading.",
    "Respond with JSON only matching:",
    JSON.stringify(RUNTIME_LOCALIZATION_RESPONSE_SHAPE),
  ].join("\n");
}

function buildUserPrompt(
  master: DiagnosticMasterData,
  lang: RuntimeLocalizerLocale,
): string {
  return [
    "[MASTER DATA]",
    `- Original Title: ${JSON.stringify(master.title)}`,
    `- Original Description: ${JSON.stringify(master.description)}`,
    "",
    "[STEP 1 — REASONING, English only]",
    `- Analyze target ISO "${lang}" cultural nuance.`,
    "- Plan how Adult-Cute + cosmic empathy should land in this culture.",
    "- Choose a psychologically warm CTA for the start button.",
    "",
    "[STEP 2 — LOCALIZATION]",
    `- Fill localizedOutput strictly in ISO language "${lang}".`,
    "- Adapt meaning and warmth; do not literal-calque Japanese or English.",
  ].join("\n");
}

function asFallback(
  master: DiagnosticMasterData,
  lang: RuntimeLocalizerLocale,
): LocalizeDiagnosticContentResult {
  return {
    data: buildFallbackRuntimeLocalization(master, lang),
    provider: "fallback",
    usedFallback: true,
    cacheHit: false,
  };
}

/**
 * EN cultural CoT → locale UI meta for diagnostic start surfaces.
 * Always returns typed data; never throws to the plug shell.
 * Japanese short-circuits without an AI call (master is already JA).
 */
export async function localizeDiagnosticContent(
  master: DiagnosticMasterData,
  lang: RuntimeLocalizerLocale,
): Promise<LocalizeDiagnosticContentResult> {
  const normalized: DiagnosticMasterData = {
    title: master.title.trim(),
    description: master.description.trim(),
  };

  if (!normalized.title || !normalized.description) {
    return asFallback(master, lang);
  }

  // Master authoring language is Japanese — skip model round-trip (O(1)).
  if (lang === "ja") {
    const data = buildFallbackRuntimeLocalization(normalized, "ja");
    return {
      data: {
        ...data,
        internalReasoning: {
          culturalAdaptationAnalysisEnglish:
            "Japanese master copy used as-is; no cross-locale adaptation required.",
          toneConsistencyCheckEnglish:
            "Adult-Cute Japanese です・ます tone retained from master.",
        },
        localizedOutput: {
          title: normalized.title,
          description: normalized.description,
          startButtonText: data.localizedOutput.startButtonText,
        },
      },
      provider: "identity",
      usedFallback: false,
      cacheHit: false,
    };
  }

  const key = cacheKey(normalized, lang);
  const cached = readCache(key);
  if (cached) {
    return cached;
  }

  const resolved = resolveLanguageModel();
  if (!resolved) {
    const fallback = asFallback(normalized, lang);
    writeCache(key, fallback);
    return fallback;
  }

  try {
    const result = await generateText({
      model: resolved.model,
      temperature: TEMPERATURE,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      system: buildSystemPrompt(lang),
      prompt: buildUserPrompt(normalized, lang),
    });

    const parsed = parseRuntimeLocalization(result.text);
    if (!parsed) {
      const fallback = asFallback(normalized, lang);
      writeCache(key, fallback);
      return fallback;
    }

    const success: LocalizeDiagnosticContentResult = {
      data: parsed,
      provider: resolved.provider as Exclude<AiProviderName, "none">,
      usedFallback: false,
      cacheHit: false,
    };
    writeCache(key, success);
    return success;
  } catch (error) {
    console.error("[dynamic-localizer] generateText failed:", error);
    const fallback = asFallback(normalized, lang);
    writeCache(key, fallback);
    return fallback;
  }
}
