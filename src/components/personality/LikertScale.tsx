"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getHorizontalStepDelta } from "@/lib/i18n/motion";
import { getLikertLabel } from "@/lib/i18n/messages";
import styles from "./QuestionCard.module.css";

type LikertSize = "xl" | "lg" | "md" | "sm";
type LikertTone =
  | "emerald-strong"
  | "emerald-medium"
  | "emerald-light"
  | "neutral"
  | "purple-light"
  | "purple-medium"
  | "purple-strong";

export interface LikertOption {
  value: number;
  label: string;
  shortLabel: string;
  polaritySymbol: string;
  size: LikertSize;
  tone: LikertTone;
}

const LIKERT_META: Array<{
  value: number;
  shortLabel: string;
  polaritySymbol: string;
  size: LikertSize;
  tone: LikertTone;
}> = [
  { value: -3, shortLabel: "3", polaritySymbol: "−", size: "xl", tone: "purple-strong" },
  { value: -2, shortLabel: "2", polaritySymbol: "−", size: "lg", tone: "purple-medium" },
  { value: -1, shortLabel: "1", polaritySymbol: "−", size: "md", tone: "purple-light" },
  { value: 0, shortLabel: "0", polaritySymbol: "○", size: "sm", tone: "neutral" },
  { value: 1, shortLabel: "1", polaritySymbol: "+", size: "md", tone: "emerald-light" },
  { value: 2, shortLabel: "2", polaritySymbol: "+", size: "lg", tone: "emerald-medium" },
  { value: 3, shortLabel: "3", polaritySymbol: "+", size: "xl", tone: "emerald-strong" },
];

const SIZE_CLASS: Record<LikertSize, string> = {
  xl: styles.sizeXl,
  lg: styles.sizeLg,
  md: styles.sizeMd,
  sm: styles.sizeSm,
};

const TONE_CLASS: Record<LikertTone, string> = {
  "emerald-strong": styles.toneEmeraldStrong,
  "emerald-medium": styles.toneEmeraldMedium,
  "emerald-light": styles.toneEmeraldLight,
  neutral: styles.toneNeutral,
  "purple-light": styles.tonePurpleLight,
  "purple-medium": styles.tonePurpleMedium,
  "purple-strong": styles.tonePurpleStrong,
};

const BUTTON_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.65,
};

interface LikertScaleProps {
  questionId: string;
  selectedValue: number | null;
  isExiting: boolean;
  labelledBy: string;
  onSelect: (option: LikertOption) => void;
}

export function LikertScale({
  questionId,
  selectedValue,
  isExiting,
  labelledBy,
  onSelect,
}: LikertScaleProps) {
  const { locale, messages, isRtl } = useI18n();
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(3);

  const likertOptions: LikertOption[] = LIKERT_META.map((entry) => ({
    ...entry,
    label: getLikertLabel(locale, entry.value),
  }));

  const defaultFocusIndex =
    selectedValue === null
      ? 3
      : Math.max(
          0,
          likertOptions.findIndex((option) => option.value === selectedValue),
        );

  useEffect(() => {
    const nextIndex = defaultFocusIndex >= 0 ? defaultFocusIndex : 3;
    setFocusedIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  }, [defaultFocusIndex, questionId]);

  const moveFocus = useCallback((nextIndex: number) => {
    const clampedIndex = Math.max(
      0,
      Math.min(likertOptions.length - 1, nextIndex),
    );
    setFocusedIndex(clampedIndex);
    optionRefs.current[clampedIndex]?.focus();
  }, [likertOptions.length]);

  const handleOptionKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          moveFocus(index + getHorizontalStepDelta("forward", isRtl));
          return;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          moveFocus(index + getHorizontalStepDelta("backward", isRtl));
          return;
        case "Home":
          event.preventDefault();
          moveFocus(0);
          return;
        case "End":
          event.preventDefault();
          moveFocus(likertOptions.length - 1);
          return;
        case " ":
        case "Enter":
          event.preventDefault();
          if (!isExiting) {
            onSelect(likertOptions[index]);
          }
          return;
        default:
          return;
      }
    },
    [isExiting, isRtl, likertOptions, moveFocus, onSelect],
  );

  const scaleInstructionsId = `${questionId}-likert-instructions`;

  return (
    <div className={styles.scaleSection}>
      <div className={styles.scaleLabels}>
        <span className={styles.scaleAnchorLow}>
          <span className={styles.polaritySymbol} aria-hidden="true">
            −
          </span>
          {messages.likert.anchorLow.replace(/^−\s*/, "")}
        </span>
        <span className={styles.scaleAnchorNeutral}>
          <span className={styles.polaritySymbol} aria-hidden="true">
            ○
          </span>
          {messages.likert.neutral}
        </span>
        <span className={styles.scaleAnchorHigh}>
          <span className={styles.polaritySymbol} aria-hidden="true">
            +
          </span>
          {messages.likert.anchorHigh.replace(/^\+\s*/, "")}
        </span>
      </div>

      <p id={scaleInstructionsId} className={styles.srOnly}>
        {messages.likert.instructions}
      </p>

      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-describedby={scaleInstructionsId}
        aria-required="true"
        className={styles.optionRow}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {likertOptions.map((option, index) => {
          const isSelected = selectedValue === option.value;
          const optionId = `${questionId}-likert-${option.value}`;

          return (
            <motion.button
              key={optionId}
              id={optionId}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option.label}, ${option.polaritySymbol}${option.shortLabel}`}
              aria-disabled={isExiting}
              tabIndex={focusedIndex === index ? 0 : -1}
              disabled={isExiting}
              data-selected={isSelected}
              data-polarity={
                option.value < 0 ? "low" : option.value > 0 ? "high" : "neutral"
              }
              className={`${styles.optionButton} ${SIZE_CLASS[option.size]} ${TONE_CLASS[option.tone]}`}
              onFocus={() => setFocusedIndex(index)}
              onClick={() => {
                if (!isExiting) {
                  onSelect(option);
                }
              }}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              whileHover={
                isExiting
                  ? undefined
                  : { scale: 1.08, transition: BUTTON_SPRING }
              }
              whileTap={
                isExiting
                  ? undefined
                  : { scale: 0.94, transition: BUTTON_SPRING }
              }
              animate={{
                scale: isSelected ? 1.06 : 1,
              }}
              transition={BUTTON_SPRING}
            >
              <span className={styles.optionContent} aria-hidden="true">
                <span className={styles.optionSymbol}>{option.polaritySymbol}</span>
                <span className={styles.optionScore}>{option.shortLabel}</span>
              </span>
              <span className={styles.srOnly}>{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
