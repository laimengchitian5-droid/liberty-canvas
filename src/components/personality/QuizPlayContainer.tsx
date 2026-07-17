"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { findResultDescription, scoreCustomQuiz } from "@/lib/assessment/scoreCustomQuiz";
import { LikertScale, type LikertOption } from "@/components/personality/LikertScale";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getSlideOffset } from "@/lib/i18n/motion";
import { buildQuizResultShareUrl } from "@/lib/seo/ogUrls";
import { usePlatform } from "@/store/PlatformContext";
import {
  TestType,
  type StoredUniversalApp,
  type UniversalAppDefinition,
} from "@/types/platform";
import styles from "./QuizPlayContainer.module.css";

type PlayPhase = "playing" | "result";

const QUESTION_SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 32,
  mass: 0.85,
};

interface QuizPlayContainerProps {
  quiz: StoredUniversalApp | UniversalAppDefinition;
  onExit: () => void;
}

function getStoredAnswerValue(
  answerLog: Array<{ questionId: string; value: number }>,
  questionId: string,
): number | null {
  const entry = answerLog.find((answer) => answer.questionId === questionId);
  return entry?.value ?? null;
}

export function QuizPlayContainer({ quiz, onExit }: QuizPlayContainerProps) {
  const { isRtl, messages } = useI18n();
  const {
    questionnaire,
    answerLog,
    scoringResult,
    currentQuestion,
    progress,
    isQuestionnaireComplete,
    startQuestionnaire,
    recordAnswer,
    advanceQuestion,
    setScoringResult,
    resetPlatform,
  } = usePlatform();

  const [phase, setPhase] = useState<PlayPhase>("playing");
  const [slideDirection, setSlideDirection] = useState(1);
  const [isExiting, setIsExiting] = useState(false);
  const [hasScored, setHasScored] = useState(false);

  const primaryTestType = quiz.questions[0]?.type ?? TestType.MBTI;

  const slideVariants = useMemo(
    () => ({
      enter: (direction: number) => ({
        x: getSlideOffset(direction, isRtl),
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
      },
      exit: (direction: number) => ({
        x: getSlideOffset(-direction, isRtl),
        opacity: 0,
      }),
    }),
    [isRtl],
  );

  useEffect(() => {
    resetPlatform();
    startQuestionnaire(quiz.id, primaryTestType, quiz.questions);
  }, [primaryTestType, quiz.id, quiz.questions, resetPlatform, startQuestionnaire]);

  useEffect(() => {
    if (phase !== "playing" || !isQuestionnaireComplete || hasScored) {
      return;
    }

    const result = scoreCustomQuiz({
      testId: quiz.id,
      questions: quiz.questions,
      answerLog,
      resultsMapping: quiz.resultsMapping,
    });

    setScoringResult(result);
    setHasScored(true);
    setPhase("result");
  }, [answerLog, hasScored, isQuestionnaireComplete, phase, quiz, setScoringResult]);

  const questionIndex = questionnaire?.currentIndex ?? 0;
  const questionCount = questionnaire?.questions.length ?? 0;
  const questionNumber = questionCount > 0 ? questionIndex + 1 : 0;

  const selectedValue = useMemo(() => {
    if (!currentQuestion) {
      return null;
    }

    return getStoredAnswerValue(answerLog, currentQuestion.id);
  }, [answerLog, currentQuestion]);

  useEffect(() => {
    setIsExiting(false);
  }, [currentQuestion?.id]);

  const handleSelect = useCallback(
    (option: LikertOption) => {
      if (!currentQuestion || isExiting || phase !== "playing") {
        return;
      }

      recordAnswer(currentQuestion.id, option.value);
      setSlideDirection(1);
      setIsExiting(true);
    },
    [currentQuestion, isExiting, phase, recordAnswer],
  );

  const handleQuestionExitComplete = useCallback(() => {
    if (!isExiting) {
      return;
    }

    advanceQuestion();
    setIsExiting(false);
  }, [advanceQuestion, isExiting]);

  const resultDescription = useMemo(() => {
    if (!scoringResult) {
      return "";
    }

    return findResultDescription(scoringResult.archetype, quiz.resultsMapping);
  }, [quiz.resultsMapping, scoringResult]);

  const handleShareResult = useCallback(async () => {
    if (!scoringResult) {
      return;
    }

    const scoreLabel = `${scoringResult.archetype} · ${scoringResult.scores.total}`;
    const url = buildQuizResultShareUrl(
      quiz.id,
      scoringResult.archetype,
      scoringResult.scores.total,
    );
    const text = `${quiz.title}\n結果: ${scoreLabel}\n${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: quiz.title, text, url });
        return;
      } catch {
        /* fall through */
      }
    }

    await navigator.clipboard.writeText(text);
  }, [quiz.id, quiz.title, scoringResult]);

  if (!quiz.questions.length) {
    return (
      <div className={styles.resultCard} aria-live="polite">
        <p className={styles.resultMeta}>このクイズには質問がありません。</p>
        <div className={styles.actions}>
          <button type="button" className={styles.buttonSecondary} onClick={onExit}>
            戻る
          </button>
        </div>
      </div>
    );
  }

  if (phase === "result" && scoringResult) {
    return (
      <section className={styles.resultCard} aria-live="polite" aria-label="Quiz result">
        <p className={styles.badge}>診断結果</p>
        <h2 className={styles.resultType}>{scoringResult.archetype}</h2>
        {resultDescription ? (
          <p className={styles.resultDescription}>{resultDescription}</p>
        ) : null}
        <p className={styles.resultMeta}>
          信頼性: {scoringResult.isReliable ? "高" : "低（再受験を推奨）"}
        </p>
        <p className={styles.resultMeta}>
          回答数: {answerLog.length} / {quiz.questions.length}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={() => {
              void handleShareResult();
            }}
          >
            結果をシェア
          </button>
          <Link
            className={styles.buttonSecondary}
            href="/diagnosis/play/personality-spectrum"
          >
            AI チャットで深掘り
          </Link>
          <button type="button" className={styles.buttonSecondary} onClick={onExit}>
            クイズ概要に戻る
          </button>
        </div>
      </section>
    );
  }

  if (!currentQuestion) {
    return (
      <div className={styles.playCard} aria-live="polite">
        <div className={styles.questionPanel} aria-hidden="true" />
        <p className={styles.helperText}>クイズを読み込んでいます…</p>
      </div>
    );
  }

  return (
    <div
      className={styles.container}
      role="group"
      aria-label={`${quiz.title} quiz player`}
    >
      <article className={styles.playCard}>
        <header className={styles.header}>
          <div className={styles.metaRow}>
            <span className={styles.badge}>{currentQuestion.type}</span>
            <span className={styles.progressLabel} aria-live="polite">
              {questionNumber} / {questionCount} ({progress}%)
            </span>
          </div>

          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Quiz progress"
          >
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </header>

        <motion.div
          key={currentQuestion.id}
          className={styles.questionPanel}
          custom={slideDirection}
          variants={slideVariants}
          initial="enter"
          animate={isExiting ? "exit" : "center"}
          transition={QUESTION_SPRING}
          onAnimationComplete={() => {
            if (isExiting) {
              handleQuestionExitComplete();
            }
          }}
        >
          <h2 id="quiz-play-question-title" className={styles.questionText}>
            {currentQuestion.text}
          </h2>
          <p className={styles.helperText}>{messages.likert.instructions}</p>
        </motion.div>

        <LikertScale
          questionId={currentQuestion.id}
          selectedValue={selectedValue}
          isExiting={isExiting}
          labelledBy="quiz-play-question-title"
          onSelect={handleSelect}
        />
      </article>
    </div>
  );
}
