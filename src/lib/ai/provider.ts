import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import { resolveInferenceApiKeyFallback } from "@/lib/env/serverSecrets";

export type AiProviderName = "anthropic" | "deepseek" | "openai" | "none";

export interface ResolvedLanguageModel {
  model: LanguageModel;
  provider: AiProviderName;
}

/**
 * Resolves the Rubel Canvas agent model.
 * Priority: Claude (Anthropic) → DeepSeek → OpenAI / AI_INFERENCE_API_KEY.
 * Keys are server-only — never NEXT_PUBLIC_*.
 * Groq / xAI Grok are intentionally excluded for youth-safe ChatCompletion APIs.
 */
export function resolveLanguageModel(): ResolvedLanguageModel | null {
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();

  if (anthropicKey) {
    const anthropic = createAnthropic({ apiKey: anthropicKey });
    return {
      provider: "anthropic",
      model: anthropic(process.env.ANTHROPIC_CHAT_MODEL ?? "claude-sonnet-4-20250514"),
    };
  }

  const deepseekKey = process.env.DEEPSEEK_API_KEY?.trim();

  if (deepseekKey) {
    const deepseek = createOpenAI({
      apiKey: deepseekKey,
      baseURL: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com",
    });
    return {
      provider: "deepseek",
      model: deepseek(process.env.DEEPSEEK_CHAT_MODEL ?? "deepseek-chat"),
    };
  }

  const openAiKey = resolveInferenceApiKeyFallback();

  if (openAiKey) {
    const openai = createOpenAI({ apiKey: openAiKey });
    return {
      provider: "openai",
      model: openai(process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini"),
    };
  }

  return null;
}
