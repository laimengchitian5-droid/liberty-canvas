"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { DiagnosticQuestion } from "@/types/diagnosis";
import styles from "./diagnosis.module.css";

const CARD_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

interface DiagnosisQuestionCardProps {
  question: DiagnosticQuestion;
  questionNumber: number;
  questionCount: number;
  progress: number;
  isTransitioning: boolean;
  onSelect: (optionId: string) => void;
}

export function DiagnosisQuestionCard({
  question,
  questionNumber,
  questionCount,
  progress,
  isTransitioning,
  onSelect,
}: DiagnosisQuestionCardProps) {
  return (
    <div className={styles.card} aria-live="polite">
      <div className={styles.metaRow}>
        <span className={styles.progressLabel}>
          {questionNumber} / {questionCount}
        </span>
        <span className={styles.progressLabel}>{progress}%</span>
      </div>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="診断の進捗"
      >
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={CARD_SPRING}
        >
          <h2 className={styles.questionText}>{question.text}</h2>

          <ul className={styles.optionList}>
            {question.options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className={styles.optionButton}
                  disabled={isTransitioning}
                  onClick={() => onSelect(option.id)}
                >
                  {option.text}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
