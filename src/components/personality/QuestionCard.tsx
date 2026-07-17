"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getSlideOffset } from "@/lib/i18n/motion";
import { usePlatform } from "@/store/PlatformContext";
import { LikertScale, type LikertOption } from "@/components/personality/LikertScale";
import styles from "./QuestionCard.module.css";

const QUESTION_SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 32,
  mass: 0.85,
};

function getStoredAnswerValue(
  answerLog: Array<{ questionId: string; value: number }>,
  questionId: string,
): number | null {
  const entry = answerLog.find((answer) => answer.questionId === questionId);
  return entry?.value ?? null;
}

export function QuestionCard() {
  const { isRtl } = useI18n();
  const {
    questionnaire,
    currentQuestion,
    answerLog,
    progress,
    recordAnswer,
    advanceQuestion,
  } = usePlatform();

  const [slideDirection, setSlideDirection] = useState(1);
  const [isExiting, setIsExiting] = useState(false);

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
      if (!currentQuestion || isExiting) {
        return;
      }

      recordAnswer(currentQuestion.id, option.value);
      setSlideDirection(1);
      setIsExiting(true);
    },
    [currentQuestion, isExiting, recordAnswer],
  );

  const handleQuestionExitComplete = useCallback(() => {
    if (!isExiting) {
      return;
    }

    advanceQuestion();
    setIsExiting(false);
  }, [advanceQuestion, isExiting]);

  if (!questionnaire || !currentQuestion) {
    return (
      <div
        className={styles.emptyState}
        role="group"
        aria-live="polite"
        aria-label="Assessment question panel waiting state"
      >
        <div className={styles.skeletonBlock} aria-hidden="true" />
        <p>診断を開始すると、ここに質問が表示されます。</p>
      </div>
    );
  }

  return (
    <section
      className={styles.card}
      aria-labelledby="question-card-title"
      aria-describedby="question-card-help"
    >
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
          aria-label="Assessment progress"
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
        <h2 id="question-card-title" className={styles.questionText}>
          {currentQuestion.text}
        </h2>
        <p id="question-card-help" className={styles.helperText}>
          7段階で回答してください。数字と +/− 記号を参照し、色だけに頼らないでください。
        </p>
      </motion.div>

      <LikertScale
        questionId={currentQuestion.id}
        selectedValue={selectedValue}
        isExiting={isExiting}
        labelledBy="question-card-title"
        onSelect={handleSelect}
      />
    </section>
  );
}
