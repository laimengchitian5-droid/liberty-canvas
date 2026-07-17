"use client";

import { useCallback, useEffect, useState } from "react";
import { LibertyResultDashboard } from "@/components/visual/LibertyResultDashboard";
import type {
  AIAnalysisEngineResult,
  LibertyDashboardLocale,
} from "@/types/libertyDashboard";
import { buildFallbackLibertyDashboard } from "@/lib/visual/libertyDashboardSchema";
import styles from "./LibertyResultContainer.module.css";

export interface LibertyResultContainerProps {
  readonly vector: readonly number[];
  readonly locale?: LibertyDashboardLocale;
  readonly seed?: string;
  readonly sharePath?: string;
  /** When true, skip auto-fetch (tests / story wrappers). */
  readonly deferFetch?: boolean;
}

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: AIAnalysisEngineResult }
  | { status: "error"; message: string };

/**
 * Fetches EN-reasoning → locale UI envelope, then renders LibertyResultDashboard.
 * Chain-of-thought is visible only in development.
 */
export const LibertyResultContainer = ({
  vector,
  locale = "ja",
  seed,
  sharePath = "/result",
  deferFetch = false,
}: LibertyResultContainerProps) => {
  const [state, setState] = useState<LoadState>({ status: "idle" });
  const vectorKey = vector.join(",");

  const load = useCallback(async () => {
    setState({ status: "loading" });
    const axes = vectorKey.split(",").map((part) => Number(part));

    try {
      const response = await fetch("/api/visual/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vector: axes,
          locale,
          seed,
        }),
      });

      if (!response.ok) {
        throw new Error(`Dashboard request failed (${response.status})`);
      }

      const payload = (await response.json()) as AIAnalysisEngineResult & {
        error?: string;
      };

      if (!payload.localizedOutput?.characterName) {
        throw new Error(payload.error ?? "Invalid dashboard payload");
      }

      setState({
        status: "ready",
        data: {
          internalReasoning: payload.internalReasoning,
          localizedOutput: payload.localizedOutput,
        },
      });
    } catch (error) {
      // Fail soft: deterministic Adult-Cute copy so reveal never dead-ends.
      setState({
        status: "ready",
        data: buildFallbackLibertyDashboard(axes, locale),
      });
      console.error("[LibertyResultContainer]", error);
    }
  }, [locale, seed, vectorKey]);

  useEffect(() => {
    if (deferFetch) {
      return;
    }
    void load();
  }, [deferFetch, load]);

  if (state.status === "idle" || state.status === "loading") {
    return (
      <div className={styles.status} role="status" aria-live="polite">
        心の色を読みとっています…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className={styles.status} role="alert">
        <p>{state.message}</p>
        <button type="button" className={styles.retry} onClick={() => void load()}>
          もう一度試す
        </button>
      </div>
    );
  }

  const { localizedOutput, internalReasoning } = state.data;

  return (
    <div className={styles.wrap}>
      <LibertyResultDashboard
        characterName={localizedOutput.characterName}
        vector={vector}
        aiAdvice={localizedOutput.aiAdvice}
        energyLabel={localizedOutput.energyLabel}
        sharePath={sharePath}
      />

      {process.env.NODE_ENV === "development" ? (
        <details className={styles.devCot}>
          <summary>View AI Chain of Thought (English)</summary>
          <pre>{JSON.stringify(internalReasoning, null, 2)}</pre>
        </details>
      ) : null}
    </div>
  );
};
