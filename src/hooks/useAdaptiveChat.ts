"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, type UIMessage } from "ai";
import { useMemo } from "react";
import {
  parsePartialAdaptiveChatResponse,
  type AdaptiveChatResponse,
} from "@/lib/ai/parseStreamingChatResponse";
import { getTextFromUiMessage } from "@/lib/ai/parseChatRequestBody";
import type { ScoringResult } from "@/types/platform";

export interface AdaptiveChatContext {
  systemPrompt: string;
  appliedPersona: string;
  isReliable: boolean;
  archetype: string;
  scores?: Record<string, number>;
  kraepelinFatigue?: number;
  kraepelinConsistency?: number;
  kraepelinFocusPattern?: string;
  locale: string;
}

export type AdaptiveUiMessage = UIMessage;

export function parseStructuredFromMessage(
  message: AdaptiveUiMessage,
): Partial<AdaptiveChatResponse> {
  return parsePartialAdaptiveChatResponse(getTextFromUiMessage(message));
}

export function useAdaptiveChat(context: AdaptiveChatContext) {
  const transport = useMemo(
    () =>
      new TextStreamChatTransport<AdaptiveUiMessage>({
        api: "/api/chat",
        body: context,
      }),
    [context],
  );

  return useChat<AdaptiveUiMessage>({
    transport,
  });
}

export function buildAdaptiveChatContext(input: {
  systemPrompt: string;
  appliedPersona: string;
  scoringResult: ScoringResult | null;
  isForgeMode: boolean;
  kraepelinFatigue?: number;
  kraepelinConsistency?: number;
  kraepelinFocusPattern?: string;
  locale: string;
}): AdaptiveChatContext {
  return {
    systemPrompt: input.systemPrompt,
    appliedPersona: input.appliedPersona,
    isReliable: input.isForgeMode ? true : (input.scoringResult?.isReliable ?? true),
    archetype: input.scoringResult?.archetype ?? "unknown",
    scores: input.scoringResult?.scores,
    kraepelinFatigue: input.kraepelinFatigue,
    kraepelinConsistency: input.kraepelinConsistency,
    kraepelinFocusPattern: input.kraepelinFocusPattern,
    locale: input.locale,
  };
}
