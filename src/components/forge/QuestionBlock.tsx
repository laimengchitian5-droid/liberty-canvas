"use client";

import { useEffect, useRef, useState } from "react";
import { forgeAiFeedbackSchema } from "@/lib/forge/forgeDashboardSchema";
import type {
  ForgeAiFeedbackResult,
  GeneratedOption,
  OceanWeights,
} from "@/types/forgeAiPipeline";
import { OCEAN_LETTER_KEYS } from "@/types/forgeAiPipeline";
import styles from "./QuestionBlock.module.css";

const DEFAULT_QUESTION = "最初の質問をここに入力してください";

const DEFAULT_OPTIONS: readonly [GeneratedOption, GeneratedOption] = [
  {
    optionText: "はい",
    weights: { O: 0.2, C: 0, E: 0.2, A: 0, N: 0 },
  },
  {
    optionText: "いいえ",
    weights: { O: 0, C: 0.2, E: 0, A: 0.2, N: 0 },
  },
];

export interface QuestionBlockProps {
  readonly initialQuestionText?: string;
  readonly onFeedbackApplied?: (result: ForgeAiFeedbackResult) => void;
}

function formatWeight(value: number): string {
  return value.toFixed(2);
}

export const QuestionBlock = ({
  initialQuestionText = DEFAULT_QUESTION,
  onFeedbackApplied,
}: QuestionBlockProps) => {
  const [questionText, setQuestionText] = useState(initialQuestionText);
  const [options, setOptions] =
    useState<readonly [GeneratedOption, GeneratedOption]>(DEFAULT_OPTIONS);
  const [aiLog, setAiLog] = useState<ForgeAiFeedbackResult["internalReasoning"] | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const applyFeedback = (data: ForgeAiFeedbackResult) => {
    setIsTransitioning(true);
    setQuestionText(data.localizedOutput.questionText);
    setOptions(data.localizedOutput.options);
    setAiLog(data.internalReasoning);
    onFeedbackApplied?.(data);
    setIsTransitioning(false);
  };

  const handleAiFeedbackClick = async () => {
    if (isLoading || isTransitioning) {
      return;
    }

    const trimmed = questionText.trim();
    if (!trimmed) {
      setErrorMessage("質問文を入力してから AI フィードバックを実行してください。");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/forge/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText: trimmed, lang: "ja" }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const payload: unknown = await res.json();
      const parsed = forgeAiFeedbackSchema.safeParse(payload);

      if (!parsed.success) {
        throw new Error("AI 応答の形式が不正です。");
      }

      applyFeedback(parsed.data);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("[QuestionBlock] forge feedback failed:", error);
      setErrorMessage(
        "AIフィードバックに失敗しました。しばらくしてからもう一度お試しください。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateOptionText = (index: 0 | 1, text: string) => {
    setOptions((prev) => {
      const next: [GeneratedOption, GeneratedOption] = [
        { ...prev[0] },
        { ...prev[1] },
      ];
      next[index] = { ...next[index], optionText: text };
      return next;
    });
  };

  const updateWeight = (index: 0 | 1, key: keyof OceanWeights, value: number) => {
    setOptions((prev) => {
      const next: [GeneratedOption, GeneratedOption] = [
        { ...prev[0] },
        { ...prev[1] },
      ];
      next[index] = {
        ...next[index],
        weights: { ...next[index].weights, [key]: value },
      };
      return next;
    });
  };

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className={styles.root} role="group" aria-label="質問エディタ">
      <label className={styles.label} htmlFor="forge-question-text">
        質問文
      </label>
      <input
        id="forge-question-text"
        value={questionText}
        onChange={(event) => setQuestionText(event.target.value)}
        className={styles.questionInput}
        maxLength={500}
        disabled={isLoading}
        aria-busy={isLoading}
      />

      <div className={styles.options} role="group" aria-label="選択肢と OCEAN 重み">
        {options.map((option, index) => {
          const optionIndex = index as 0 | 1;
          return (
            <div key={`option-${optionIndex}`} className={styles.optionCard}>
              <label
                className={styles.label}
                htmlFor={`forge-option-${optionIndex}`}
              >
                選択肢 {optionIndex === 0 ? "A" : "B"}
              </label>
              <input
                id={`forge-option-${optionIndex}`}
                value={option.optionText}
                onChange={(event) =>
                  updateOptionText(optionIndex, event.target.value)
                }
                className={styles.optionInput}
                maxLength={200}
                disabled={isLoading}
              />
              <ul className={styles.weightList} aria-label={`選択肢${optionIndex === 0 ? "A" : "B"}の重み`}>
                {OCEAN_LETTER_KEYS.map((key) => (
                  <li key={key} className={styles.weightRow}>
                    <label htmlFor={`forge-weight-${optionIndex}-${key}`}>
                      {key}
                    </label>
                    <input
                      id={`forge-weight-${optionIndex}-${key}`}
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={option.weights[key]}
                      onChange={(event) =>
                        updateWeight(
                          optionIndex,
                          key,
                          Number.parseFloat(event.target.value),
                        )
                      }
                      disabled={isLoading}
                      aria-valuemin={0}
                      aria-valuemax={1}
                      aria-valuenow={option.weights[key]}
                      aria-valuetext={formatWeight(option.weights[key])}
                    />
                    <span className={styles.weightValue} aria-hidden="true">
                      {formatWeight(option.weights[key])}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          void handleAiFeedbackClick();
        }}
        disabled={isLoading || isTransitioning}
        className={styles.feedbackButton}
        aria-busy={isLoading}
      >
        {isLoading ? "AIが思考・翻訳中..." : "AIフィードバック"}
      </button>

      {errorMessage ? (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}

      {isDev && aiLog ? (
        <details className={styles.cot}>
          <summary>View Psychometric CoT (English Only)</summary>
          <div className={styles.cotBody}>
            <p>
              <span className={styles.cotLabel}>[Analysis]</span>{" "}
              {aiLog.psychometricAnalysisEnglish}
            </p>
            <p>
              <span className={styles.cotLabel}>[Justification]</span>{" "}
              {aiLog.weightJustificationEnglish}
            </p>
          </div>
        </details>
      ) : null}
    </div>
  );
};
