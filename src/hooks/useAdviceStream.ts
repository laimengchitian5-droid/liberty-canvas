"use client";

import { useCallback, useRef, useState } from "react";
import {
  buildFallbackAdvice,
  parseAdviceResponse,
} from "@/lib/diagnosis/parseAdviceResponse";
import type {
  DiagnosisAdviceRequestBody,
  PersonalizedAdvicePayload,
} from "@/types/diagnosis";
import type { PlugDiagnosisAdviceRequestBody } from "@/types/diagnosisCompiler";

export type AdviceStreamPayload =
  | DiagnosisAdviceRequestBody
  | PlugDiagnosisAdviceRequestBody;

function resolveAdviceStreamTitle(payload: AdviceStreamPayload): string {
  if ("mode" in payload) {
    return payload.archetypeTitle;
  }

  return payload.result.title;
}

interface UseAdviceStreamState {
  rawText: string;
  advice: PersonalizedAdvicePayload | null;
  isStreaming: boolean;
  errorMessage: string | null;
}

export function useAdviceStream() {
  const abortRef = useRef<AbortController | null>(null);

  const [state, setState] = useState<UseAdviceStreamState>({
    rawText: "",
    advice: null,
    isStreaming: false,
    errorMessage: null,
  });

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;

    setState({
      rawText: "",
      advice: null,
      isStreaming: false,
      errorMessage: null,
    });
  }, []);

  const startStream = useCallback(async (payload: AdviceStreamPayload) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({
      rawText: "",
      advice: null,
      isStreaming: true,
      errorMessage: null,
    });

    try {
      const response = await fetch("/api/diagnosis/advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Advice request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Advice response did not include a stream body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        accumulated += decoder.decode(value, { stream: true });

        setState((previous) => ({
          ...previous,
          rawText: accumulated,
        }));
      }

      const parsed =
        parseAdviceResponse(accumulated) ??
        buildFallbackAdvice(resolveAdviceStreamTitle(payload));

      setState({
        rawText: accumulated,
        advice: parsed,
        isStreaming: false,
        errorMessage: null,
      });
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      const fallbackTitle = resolveAdviceStreamTitle(payload);

      const fallback = buildFallbackAdvice(fallbackTitle);

      setState({
        rawText: "",
        advice: fallback,
        isStreaming: false,
        errorMessage:
          error instanceof Error ? error.message : "Unexpected advice stream failure",
      });
    }
  }, []);

  return {
    rawText: state.rawText,
    advice: state.advice,
    isStreaming: state.isStreaming,
    errorMessage: state.errorMessage,
    startStream,
    reset,
  };
}
