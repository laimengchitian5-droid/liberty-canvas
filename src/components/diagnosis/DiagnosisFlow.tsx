"use client";

import { Sparkles, Heart } from "lucide-react";
import { useEffect } from "react";
import { DiagnosisAdvicePanel } from "@/components/diagnosis/DiagnosisAdvicePanel";
import { DiagnosisQuestionCard } from "@/components/diagnosis/DiagnosisQuestionCard";
import { DiagnosisShareActions } from "@/components/diagnosis/DiagnosisShareActions";
import {
  trackDiagnosisCompletion,
  trackDiagnosisEvent,
} from "@/lib/diagnosis/analytics";
import { useDiagnosisEngine } from "@/hooks/useDiagnosisEngine";
import { cn } from "@/lib/utils/cn";
import { DIAGNOSTIC_QUESTION_COUNT } from "@/types/diagnosis";
import styles from "./diagnosis.module.css";

export function DiagnosisFlow() {
  const {
    currentQuestion,
    phase,
    questionNumber,
    questionCount,
    progress,
    evaluation,
    answers,
    isTransitioning,
    startDiagnosis,
    selectOption,
    openAdvice,
    restart,
  } = useDiagnosisEngine();

  useEffect(() => {
    if (phase !== "result") {
      return;
    }

    trackDiagnosisCompletion(evaluation.result);
  }, [evaluation.result, phase]);

  const handleStart = () => {
    trackDiagnosisEvent("diagnosis_started", {});
    startDiagnosis();
  };

  const handleOpenAdvice = () => {
    trackDiagnosisEvent("diagnosis_advice_opened", {
      category: evaluation.result.dominantCategory,
    });
    openAdvice();
  };

  return (
    <div className={styles.shell}>
      <div className={styles.container}>
        {phase === "intro" ? (
          <header className={styles.hero}>
            <p className={styles.eyebrow}>
              <Sparkles className="inline-block h-3.5 w-3.5 align-[-2px] mr-1" aria-hidden="true" />
              Personality Diagnosis
            </p>
            <h1 className={cn(styles.title, "font-serif")}>あなたの心の色診断</h1>
            <p className={styles.lead}>
              {DIAGNOSTIC_QUESTION_COUNT}つのやさしい質問から、あなたらしさを見つけます。
              診断後には、AI があなただけのアドバイスをお届けします。
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={cn(styles.primaryButton, "gap-2")}
                onClick={handleStart}
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
                診断をはじめる
              </button>
            </div>
          </header>
        ) : null}

        {phase === "questions" && currentQuestion ? (
          <DiagnosisQuestionCard
            question={currentQuestion}
            questionNumber={questionNumber}
            questionCount={questionCount}
            progress={progress}
            isTransitioning={isTransitioning}
            onSelect={selectOption}
          />
        ) : null}

        {phase === "result" ? (
          <div
            id="diagnosis-result-print"
            className={styles.card}
            style={{ borderColor: `${evaluation.result.themeColor}33` }}
          >
            <p className={styles.resultBadge}>診断結果</p>
            <h2 className={styles.resultTitle}>{evaluation.result.title}</h2>
            <p className={styles.resultSubtitle}>{evaluation.result.subtitle}</p>
            <p className={styles.resultAnalysis}>{evaluation.result.baseAnalysis}</p>
            <DiagnosisShareActions result={evaluation.result} />
            <div className={styles.actions}>
              <button type="button" className={cn(styles.primaryButton, "gap-2")} onClick={handleOpenAdvice}>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                AI アドバイスを見る
              </button>
              <button type="button" className={styles.secondaryButton} onClick={restart}>
                もう一度
              </button>
            </div>
          </div>
        ) : null}

        {phase === "advice" ? (
          <DiagnosisAdvicePanel
            evaluation={evaluation}
            answers={answers}
            onRestart={restart}
          />
        ) : null}
      </div>
    </div>
  );
}
