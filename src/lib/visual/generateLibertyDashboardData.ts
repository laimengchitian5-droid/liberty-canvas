import { generateText } from "ai";
import { resolveLanguageModel, type AiProviderName } from "@/lib/ai/provider";
import { getDirection, getLocaleLabel } from "@/lib/i18n/config";
import { toCognitiveArtVector } from "@/lib/visual/cognitiveArt";
import {
  buildFallbackLibertyDashboard,
  parseAIAnalysisEngineResult,
} from "@/lib/visual/libertyDashboardSchema";
import type {
  AIAnalysisEngineResult,
  LibertyDashboardLocale,
} from "@/types/libertyDashboard";

export interface GenerateLibertyDashboardResult {
  readonly data: AIAnalysisEngineResult;
  readonly provider: Exclude<AiProviderName, "none"> | "fallback";
  readonly usedFallback: boolean;
}

function buildSystemPrompt(locale: LibertyDashboardLocale): string {
  const dir = getDirection(locale);
  const label = getLocaleLabel(locale);

  return [
    "You are Liberty Canvas's entertainment persona writer.",
    "Never claim clinical diagnosis, therapy, MBTI codes, or medical authority.",
    "Think step-by-step in English inside internalReasoning.",
    "Write user-facing copy only in localizedOutput.",
    `Target language ISO: ${locale} (${label}), text direction: ${dir}.`,
    "localizedOutput MUST be natural in the target language, Adult-Cute, cosmic, affirming.",
    "Respond with JSON only matching:",
    JSON.stringify({
      internalReasoning: {
        personaProfileEnglish: "string",
        vectorInterpretation: "string",
        culturalAdaptationNotes: "string",
      },
      localizedOutput: {
        characterName: "string",
        aiAdvice: "string",
        energyLabel: "string",
      },
    }),
  ].join("\n");
}

function buildUserPrompt(
  axes: readonly number[],
  locale: LibertyDashboardLocale,
  seed?: string,
): string {
  return [
    `8-dimensional color-energy vector (1–7): [${axes.join(", ")}]`,
    seed ? `Optional seed name hint: ${seed}` : null,
    "",
    "[STEP 1 — REASONING, English only]",
    "- Interpret the vector as soft Adult-Cute color energy (not clinical traits).",
    "- Invent a cosmic character persona (no MBTI letters).",
    "- Plan unconditional-positive validation.",
    "",
    "[STEP 2 — LOCALIZATION]",
    `- Fill localizedOutput strictly in target language ISO "${locale}".`,
    "- Adapt grammar and empathy nuances of that language (not literal English calque).",
    "- characterName: memorable cosmic nickname.",
    "- aiAdvice: 2–4 warm sentences, fully affirming.",
    "- energyLabel: short catchphrase for color energy (not focus/Kraepelin).",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * EN reasoning → locale UI copy for LibertyResultDashboard.
 * Always returns typed data; falls back when keys/parse fail.
 * Locale rides query/API (`locale=`), not a global `/[lang]` rewrite.
 */
export async function generateLibertyDashboardData(input: {
  readonly vector: readonly number[];
  readonly locale?: LibertyDashboardLocale;
  readonly seed?: string;
}): Promise<GenerateLibertyDashboardResult> {
  const locale = input.locale ?? "ja";
  const axes = toCognitiveArtVector(input.vector, input.seed ?? "liberty");
  const resolved = resolveLanguageModel();

  if (!resolved) {
    return {
      data: buildFallbackLibertyDashboard(axes, locale),
      provider: "fallback",
      usedFallback: true,
    };
  }

  try {
    const result = await generateText({
      model: resolved.model,
      temperature: 0.78,
      maxOutputTokens: 900,
      system: buildSystemPrompt(locale),
      prompt: buildUserPrompt(axes, locale, input.seed),
    });

    const parsed = parseAIAnalysisEngineResult(result.text);
    if (!parsed) {
      return {
        data: buildFallbackLibertyDashboard(axes, locale),
        provider: "fallback",
        usedFallback: true,
      };
    }

    return {
      data: parsed,
      provider: resolved.provider as Exclude<AiProviderName, "none">,
      usedFallback: false,
    };
  } catch (error) {
    console.error("[liberty-dashboard] generateText failed:", error);
    return {
      data: buildFallbackLibertyDashboard(axes, locale),
      provider: "fallback",
      usedFallback: true,
    };
  }
}
