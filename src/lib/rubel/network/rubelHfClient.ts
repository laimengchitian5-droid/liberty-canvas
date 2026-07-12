import type {
  HfChatRequestContract,
  HfChatResponseContract,
  InjectionChatTurn,
  RubelEnginePayload,
} from "@/lib/rubel/contracts/pipeline";
import {
  buildInjectionPrompt,
  buildPersonalizedFallback,
  OPENING_INJECTION_MESSAGE,
} from "@/lib/rubel/prompt/buildInjectionPrompt";
import {
  clampInjectionHistory,
  HF_MAX_USER_MESSAGE_CHARS,
  sanitizeHfText,
  validateRawPromptRequest,
} from "@/lib/rubel/network/hfChatGuard";

export { OPENING_INJECTION_MESSAGE };

export interface RequestRubelHfReplyParams {
  payload: RubelEnginePayload;
  history: InjectionChatTurn[];
  userMessage: string;
  customPersona?: string;
}

/**
 * Network orchestration layer — UI components MUST call this, not fetch() directly.
 */
export async function requestRubelHfReply(
  params: RequestRubelHfReplyParams,
): Promise<string> {
  const userMessage = sanitizeHfText(params.userMessage, HF_MAX_USER_MESSAGE_CHARS);

  if (!userMessage) {
    throw new Error("メッセージが空です。");
  }

  const history = clampInjectionHistory(params.history);

  let prompt = buildInjectionPrompt(params.payload, history, userMessage);

  if (params.customPersona?.trim()) {
    const persona = sanitizeHfText(params.customPersona, 500);
    prompt = prompt.replace(
      "[VERBALIZATION_ANCHOR",
      `[CUSTOM_PERSONA] ${persona}\n[VERBALIZATION_ANCHOR`,
    );
  }

  const validated = validateRawPromptRequest({
    prompt,
    fallbackText: buildPersonalizedFallback(params.payload, userMessage),
  });

  if (!validated.ok) {
    throw new Error(validated.error);
  }

  const body: HfChatRequestContract = {
    prompt: validated.prompt,
    fallbackText: validated.fallbackText,
  };

  const response = await fetch("/api/rubel/hf-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = (await response.json()) as HfChatResponseContract;

  if (!response.ok) {
    throw new Error(result.error ?? `AI応答エラー (${response.status})`);
  }

  if (!result.text?.trim()) {
    throw new Error("AIから空の応答が返りました。");
  }

  return result.text.trim();
}
