import type { UIMessage } from "ai";
import type {
  AdaptiveChatRequestBody,
  ChatRequestMessage,
} from "@/lib/ai/parseStreamingChatResponse";

interface RawChatRequest {
  messages?: unknown;
  systemPrompt?: string;
  appliedPersona?: string;
  isReliable?: boolean;
  archetype?: string;
  mode?: string;
  scores?: Record<string, number>;
  kraepelinFatigue?: number;
  kraepelinConsistency?: number;
  kraepelinFocusPattern?: string;
  locale?: string;
  id?: string;
  trigger?: string;
  messageId?: string;
}

function getTextFromUiMessage(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function normalizeLegacyMessage(value: unknown): ChatRequestMessage | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const entry = value as { role?: unknown; content?: unknown };

  if (entry.role !== "user" && entry.role !== "assistant") {
    return null;
  }

  if (typeof entry.content !== "string") {
    return null;
  }

  return {
    role: entry.role,
    content: entry.content,
  };
}

function normalizeUiMessage(value: unknown): ChatRequestMessage | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const message = value as UIMessage;

  if (message.role !== "user" && message.role !== "assistant") {
    return null;
  }

  if (!Array.isArray(message.parts)) {
    return null;
  }

  const content = getTextFromUiMessage(message);

  if (!content.trim()) {
    return null;
  }

  return {
    role: message.role,
    content,
  };
}

export function normalizeChatMessages(raw: unknown): ChatRequestMessage[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry) => {
      if (entry && typeof entry === "object" && "parts" in entry) {
        return normalizeUiMessage(entry);
      }

      return normalizeLegacyMessage(entry);
    })
    .filter((message): message is ChatRequestMessage => message !== null);
}

export function parseAdaptiveChatRequest(
  payload: unknown,
): AdaptiveChatRequestBody & { uiMessages?: UIMessage[] } {
  const body = (payload ?? {}) as RawChatRequest;
  const messages = normalizeChatMessages(body.messages);

  return {
    messages,
    uiMessages: Array.isArray(body.messages)
      ? (body.messages as UIMessage[])
      : undefined,
    systemPrompt: body.systemPrompt ?? "",
    appliedPersona: body.appliedPersona ?? "standard-assistant",
    isReliable: body.isReliable ?? true,
    archetype: body.archetype ?? "unknown",
    mode: body.mode === "rubel" ? "rubel" : "adaptive",
    scores: body.scores,
    kraepelinFatigue: body.kraepelinFatigue,
    kraepelinConsistency: body.kraepelinConsistency,
    kraepelinFocusPattern: body.kraepelinFocusPattern,
    locale: body.locale,
  };
}

export function getLatestUserMessage(messages: ChatRequestMessage[]): string {
  return (
    [...messages].reverse().find((message) => message.role === "user")?.content ??
    ""
  );
}

export { getTextFromUiMessage };
