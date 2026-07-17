import { generateText } from "ai";
import { resolveLanguageModel, type AiProviderName } from "@/lib/ai/provider";
import { getLocaleLabel } from "@/lib/i18n/config";
import {
  buildFallbackForgeFeedback,
  FORGE_AI_FEEDBACK_RESPONSE_SHAPE,
  optionsArePolar,
  parseForgeAiFeedback,
} from "@/lib/forge/forgeDashboardSchema";
import type {
  ForgeAiFeedbackResult,
  ForgeAiLocale,
} from "@/types/forgeAiPipeline";

const TEMPERATURE = 0.2;
const MAX_OUTPUT_TOKENS = 1200;

export interface GenerateForgeFeedbackResult {
  readonly data: ForgeAiFeedbackResult;
  readonly provider: Exclude<AiProviderName, "none"> | "fallback";
  readonly usedFallback: boolean;
}

function buildSystemPrompt(lang: ForgeAiLocale): string {
  const label = getLocaleLabel(lang);

  return [
    "You are an elite psychometrics expert and AI diagnostic architect.",
    "Never claim clinical diagnosis, therapy, or medical authority.",
    "Think step-by-step in English inside internalReasoning only.",
    "Write questionText and optionText only in localizedOutput.",
    `Target language ISO: ${lang} (${label}).`,
    "localizedOutput MUST feel natural to a native speaker — Adult-Cute, refined, engaging.",
    "Allocate Big Five (OCEAN) weights in [0.00, 1.00] with two polar-opposite options.",
    "Respond with JSON only matching:",
    JSON.stringify(FORGE_AI_FEEDBACK_RESPONSE_SHAPE),
  ].join("\n");
}

function buildUserPrompt(rawQuestionText: string, lang: ForgeAiLocale): string {
  return [
    "Analyze this raw personality-test question:",
    JSON.stringify(rawQuestionText),
    "",
    "[STEP 1 — REASONING, English only]",
    "- Deconstruct the psychological trait underlying this question.",
    "- Design a polar-opposite pair (Option A vs Option B).",
    "- Allocate precise OCEAN weights (O,C,E,A,N) from 0.00 to 1.00 per option.",
    "- Keep the absolute weight gap between options scientifically balanced.",
    "",
    "[STEP 2 — LOCALIZATION]",
    `- Fill questionText and optionText strictly in ISO language "${lang}".`,
    "- Polish the stem into a clean, engaging question (no clinical jargon).",
  ].join("\n");
}

function asFallback(
  rawQuestionText: string,
  lang: ForgeAiLocale,
): GenerateForgeFeedbackResult {
  return {
    data: buildFallbackForgeFeedback(rawQuestionText, lang),
    provider: "fallback",
    usedFallback: true,
  };
}

/**
 * EN CoT → locale editor payload for Forge question blocks.
 * Always returns typed data; never throws to the editor shell.
 */
export async function generateForgeFeedback(
  rawQuestionText: string,
  lang: ForgeAiLocale = "ja",
): Promise<GenerateForgeFeedbackResult> {
  const trimmed = rawQuestionText.trim();
  if (!trimmed) {
    return asFallback(rawQuestionText, lang);
  }

  const resolved = resolveLanguageModel();
  if (!resolved) {
    return asFallback(trimmed, lang);
  }

  try {
    const result = await generateText({
      model: resolved.model,
      temperature: TEMPERATURE,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      system: buildSystemPrompt(lang),
      prompt: buildUserPrompt(trimmed, lang),
    });

    const parsed = parseForgeAiFeedback(result.text);
    if (!parsed) {
      return asFallback(trimmed, lang);
    }

    const [optA, optB] = parsed.localizedOutput.options;
    if (!optionsArePolar(optA.weights, optB.weights)) {
      console.warn(
        "[forge-feedback] options are not polar; accepting payload with soft warning",
      );
    }

    return {
      data: parsed,
      provider: resolved.provider as Exclude<AiProviderName, "none">,
      usedFallback: false,
    };
  } catch (error) {
    console.error("[forge-feedback] generateText failed:", error);
    return asFallback(trimmed, lang);
  }
}
