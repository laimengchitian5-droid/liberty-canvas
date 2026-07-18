import { generateText } from "ai";
import { resolveLanguageModel } from "@/lib/ai/provider";
import type { Locale } from "@/lib/i18n/config";
import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import {
  buildConductorSystemPrompt,
  routeExpressLineFromAnswer,
} from "@/lib/station/conductorEngine";
import {
  assembleConductorResponse,
  buildConductorFallbackResponse,
} from "@/lib/station/identityConductor/conductorFallback";
import { extractJsonObject } from "@/lib/station/identityConductor/extractJsonObject";
import {
  ConductorAiResponseSchema,
  type ConductorAiResponse,
  type ConductorRequest,
  type ConductorResponse,
  type ConductorExpressSlug,
} from "@/types/conductor";

export { buildConductorFallbackResponse } from "@/lib/station/identityConductor/conductorFallback";

const MODEL_TIMEOUT_MS = 8_000;

async function generateAiProse(
  locale: Locale,
  userAnswer: string,
  slug: ConductorExpressSlug,
): Promise<ConductorAiResponse | null> {
  const resolved = resolveLanguageModel();
  if (!resolved) {
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, MODEL_TIMEOUT_MS);

  try {
    const result = await generateText({
      model: resolved.model,
      system: buildConductorSystemPrompt(locale, slug),
      prompt: `User pre-screen answer:\n"""${userAnswer}"""`,
      maxOutputTokens: 320,
      temperature: 0.7,
      abortSignal: controller.signal,
    });

    const parsed = ConductorAiResponseSchema.safeParse(
      extractJsonObject(result.text),
    );
    return parsed.success ? parsed.data : null;
  } catch (error) {
    console.warn("[identity-conductor] model path failed:", error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Full conductor pipeline:
 * 1) locale normalize
 * 2) deterministic express slug
 * 3) AI prose (optional) → Zod
 * 4) fallback prose if model fails
 */
export async function runIdentityConductor(
  input: ConductorRequest,
): Promise<ConductorResponse> {
  const locale = resolveGameLocale(input.locale);
  const userAnswer = input.userAnswer.trim();
  const expressLineSlug = routeExpressLineFromAnswer(userAnswer);

  const aiProse = await generateAiProse(locale, userAnswer, expressLineSlug);
  if (aiProse) {
    return assembleConductorResponse(
      locale,
      expressLineSlug,
      aiProse,
      "model",
    );
  }

  return buildConductorFallbackResponse({ locale, userAnswer });
}
