"use client";

import { useEffect } from "react";
import { AdviceSkeleton } from "@/components/diagnosis/AdviceSkeleton";
import { DiagnosisShareActions } from "@/components/diagnosis/DiagnosisShareActions";
import { useAdviceStream } from "@/hooks/useAdviceStream";
import type { DiagnosisEvaluation, DiagnosticAnswer } from "@/types/diagnosis";
import styles from "./diagnosis.module.css";

interface DiagnosisAdvicePanelProps {
  evaluation: DiagnosisEvaluation;
  answers: DiagnosticAnswer[];
  onRestart: () => void;
}

export function DiagnosisAdvicePanel({
  evaluation,
  answers,
  onRestart,
}: DiagnosisAdvicePanelProps) {
  const { rawText, advice, isStreaming, errorMessage, startStream, reset } =
    useAdviceStream();

  useEffect(() => {
    void startStream({
      result: evaluation.result,
      scores: evaluation.scores,
      answers,
    });

    return () => {
      reset();
    };
  }, [answers, evaluation.result, evaluation.scores, reset, startStream]);
  return (
    <div id="diagnosis-result-print" className={styles.card}>
      <p className={styles.resultBadge}>AI パーソナルアドバイス</p>
      <h2 className={styles.resultTitle}>{evaluation.result.title}</h2>

      <div className={styles.adviceSection} aria-live="polite">
        {isStreaming && !advice ? (
          <>
            <AdviceSkeleton />
            {rawText ? <p className={styles.adviceBody}>{rawText}</p> : null}
          </>
        ) : null}

        {advice ? (
          <>
            <p className={styles.adviceBody}>{advice.personalizedAdvice}</p>
            <div className={styles.tipCard}>
              <strong>今日のヒント</strong>
              <p className={styles.adviceBody}>{advice.dailyTip}</p>
            </div>
            <div className={styles.affirmationCard}>
              <strong>あなたへ</strong>
              <p className={styles.adviceBody}>{advice.affirmation}</p>
            </div>
          </>
        ) : null}

        {errorMessage ? (
          <p className={styles.adviceBody} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>

      {advice ? <DiagnosisShareActions result={evaluation.result} /> : null}

      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={onRestart}>
          もう一度診断する
        </button>
      </div>
    </div>
  );
}
