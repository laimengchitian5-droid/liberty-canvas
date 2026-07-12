import { generateText } from "ai";
import type { InjectionChatTurn } from "@/lib/rubel/buildInjectionPrompt";
import { buildPersonalizedFallback } from "@/lib/rubel/buildInjectionPrompt";
import type { RubelEnginePayload } from "@/lib/rubel/resultData";
import { resolveLanguageModel, type AiProviderName } from "@/lib/ai/provider";

export interface RubelChatAdapterResponse {
  text: string;
  provider: Exclude<AiProviderName, "none"> | "fallback";
  model?: string;
}

export async function generateRubelChatReply(input: {
  resultData: RubelEnginePayload;
  history: InjectionChatTurn[];
  userMessage: string;
}): Promise<RubelChatAdapterResponse | null> {
  const resolved = resolveLanguageModel();

  if (!resolved) {
    return null;
  }

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> =
    [
      {
        role: "system",
        content: input.resultData.compiledSystemPrompt,
      },
      ...input.history.map((turn) => ({
        role: turn.role,
        content: turn.content,
      })),
      { role: "user", content: input.userMessage },
    ];

  try {
    const result = await generateText({
      model: resolved.model,
      messages,
      maxOutputTokens: 220,
      temperature: 0.82,
    });

    const text = result.text.trim();

    if (!text) {
      return {
        text: buildPersonalizedFallback(input.resultData, input.userMessage),
        provider: "fallback",
      };
    }

    return {
      text,
      provider: resolved.provider as Exclude<AiProviderName, "none">,
    };
  } catch {
    return null;
  }
}
