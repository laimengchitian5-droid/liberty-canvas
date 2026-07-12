"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef } from "react";
import { getTextFromUiMessage } from "@/lib/ai/parseChatRequestBody";

export interface RubelChatContext {
  systemPrompt: string;
  personaLabel: string;
  openingUserMessage: string;
  locale: string;
}

export type RubelUiMessage = UIMessage;

export function useRubelChat(
  context: RubelChatContext,
  enabled: boolean,
  sessionKey: number,
) {
  const hasTriggeredOpeningRef = useRef(false);

  const transport = useMemo(
    () =>
      new TextStreamChatTransport<RubelUiMessage>({
        api: "/api/chat",
        body: {
          mode: "rubel",
          systemPrompt: context.systemPrompt,
          appliedPersona: context.personaLabel,
          isReliable: true,
          archetype: context.personaLabel,
          locale: context.locale,
        },
      }),
    [context.locale, context.personaLabel, context.systemPrompt],
  );

  const chat = useChat<RubelUiMessage>({
    id: `rubel-${context.personaLabel}-${sessionKey}`,
    transport,
  });

  const { messages, sendMessage, status, error, stop } = chat;

  useEffect(() => {
    if (!enabled) {
      hasTriggeredOpeningRef.current = false;
      return;
    }

    if (hasTriggeredOpeningRef.current || messages.length > 0) {
      return;
    }

    hasTriggeredOpeningRef.current = true;
    void sendMessage({ text: context.openingUserMessage });
  }, [context.openingUserMessage, enabled, messages.length, sendMessage]);

  const displayMessages = messages.map((message) => ({
    id: message.id,
    role: message.role,
    text: getTextFromUiMessage(message),
  }));

  return {
    messages: displayMessages,
    sendMessage,
    status,
    error,
    stop,
    isStreaming: status === "streaming" || status === "submitted",
  };
}
