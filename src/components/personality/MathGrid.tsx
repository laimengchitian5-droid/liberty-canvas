"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import {
  buildKraepelinPerformanceMatrix,
  KRAEPELIN_TEST_DURATION_MS,
} from "@/lib/kraepelin/scoreKraepelinMatrix";
import {
  createKraepelinTimerWorker,
  type KraepelinTimerWorkerEvent,
  type KraepelinTimerWorkerMessage,
} from "@/lib/kraepelin/timerWorker";
import { usePlatform } from "@/store/PlatformContext";
import type { KraepelinAttemptMetric } from "@/types/platform";
import styles from "./MathGrid.module.css";

const TEST_ID = "kraepelin-math-grid";
const INITIAL_DIGIT_COUNT = 16;
const DIGIT_EXTENSION_THRESHOLD = 4;

type TestPhase = "idle" | "running" | "complete";

function randomDigit(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % 10;
}

function generateDigits(count: number): number[] {
  return Array.from({ length: count }, () => randomDigit());
}

function expectedOnesDigitSum(left: number, right: number): number {
  return (left + right) % 10;
}

function formatSeconds(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function isSingleDigit(value: string): value is `${number}` {
  return /^[0-9]$/.test(value);
}

export function MathGrid() {
  const { submitKraepelinPerformance, kraepelinPerformance } = usePlatform();

  const [phase, setPhase] = useState<TestPhase>("idle");
  const [digits, setDigits] = useState<number[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [attempts, setAttempts] = useState<KraepelinAttemptMetric[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(KRAEPELIN_TEST_DURATION_MS);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [inputStates, setInputStates] = useState<
    Record<number, "correct" | "incorrect" | "idle">
  >({});

  const workerRef = useRef<Worker | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const testStartedAtRef = useRef(0);
  const pairActivatedAtRef = useRef(0);
  const attemptsRef = useRef<KraepelinAttemptMetric[]>([]);
  const phaseRef = useRef<TestPhase>("idle");
  const finalizeRef = useRef<() => void>(() => undefined);

  const pairCount = Math.max(0, digits.length - 1);

  const liveStats = useMemo(() => {
    const attempted = attempts.length;
    const correct = attempts.filter((attempt) => attempt.isCorrect).length;
    const accuracy = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);

    return {
      attempted,
      correct,
      accuracy,
    };
  }, [attempts]);

  const visibleStartIndex = useMemo(() => {
    if (pairCount <= 8) {
      return 0;
    }

    return Math.max(0, Math.min(currentPairIndex - 2, pairCount - 8));
  }, [currentPairIndex, pairCount]);

  const visiblePairIndices = useMemo(() => {
    const windowSize = Math.min(8, pairCount);

    return Array.from(
      { length: windowSize },
      (_, offset) => visibleStartIndex + offset,
    ).filter((index) => index < pairCount);
  }, [pairCount, visibleStartIndex]);

  const finalizeTest = useCallback(() => {
    if (phaseRef.current === "complete") {
      return;
    }

    phaseRef.current = "complete";
    setPhase("complete");

    workerRef.current?.postMessage({
      type: "STOP",
    } satisfies KraepelinTimerWorkerMessage);
    workerRef.current?.terminate();
    workerRef.current = null;

    const completedAt = Date.now();
    const matrix = buildKraepelinPerformanceMatrix({
      testId: TEST_ID,
      startedAt: testStartedAtRef.current,
      completedAt,
      attempts: attemptsRef.current,
    });

    submitKraepelinPerformance(matrix);
  }, [submitKraepelinPerformance]);

  useEffect(() => {
    finalizeRef.current = finalizeTest;
  }, [finalizeTest]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    attemptsRef.current = attempts;
  }, [attempts]);

  useEffect(() => {
    if (phase !== "running") {
      return;
    }

    const worker = createKraepelinTimerWorker();
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<KraepelinTimerWorkerEvent>) => {
      const payload = event.data;

      if (payload.type === "TICK") {
        setElapsedMs(payload.elapsedMs);
        setRemainingMs(payload.remainingMs);
        return;
      }

      if (payload.type === "COMPLETE") {
        setElapsedMs(payload.elapsedMs);
        setRemainingMs(0);
        finalizeRef.current();
      }
    };

    worker.postMessage({
      type: "START",
      durationMs: KRAEPELIN_TEST_DURATION_MS,
    } satisfies KraepelinTimerWorkerMessage);

    return () => {
      worker.postMessage({ type: "STOP" } satisfies KraepelinTimerWorkerMessage);
      worker.terminate();
      workerRef.current = null;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "running") {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      inputRefs.current[currentPairIndex]?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [currentPairIndex, phase]);

  const startTest = useCallback(() => {
    const nextDigits = generateDigits(INITIAL_DIGIT_COUNT);
    const startedAt = Date.now();

    testStartedAtRef.current = startedAt;
    pairActivatedAtRef.current = startedAt;
    attemptsRef.current = [];
    phaseRef.current = "running";

    setDigits(nextDigits);
    setCurrentPairIndex(0);
    setAttempts([]);
    setInputValues({});
    setInputStates({});
    setElapsedMs(0);
    setRemainingMs(KRAEPELIN_TEST_DURATION_MS);
    setPhase("running");
  }, []);

  const appendDigitsIfNeeded = useCallback(
    (nextPairIndex: number, currentDigits: number[]) => {
      if (nextPairIndex + DIGIT_EXTENSION_THRESHOLD >= currentDigits.length) {
        return [...currentDigits, randomDigit(), randomDigit()];
      }

      return currentDigits;
    },
    [],
  );

  const commitPairAnswer = useCallback(
    (pairIndex: number, rawValue: string) => {
      if (phaseRef.current !== "running" || !isSingleDigit(rawValue)) {
        return;
      }

      const leftDigit = digits[pairIndex];
      const rightDigit = digits[pairIndex + 1];

      if (leftDigit === undefined || rightDigit === undefined) {
        return;
      }

      const expectedSum = expectedOnesDigitSum(leftDigit, rightDigit);
      const userSum = Number(rawValue);
      const timestamp = Date.now();
      const attempt: KraepelinAttemptMetric = {
        index: attemptsRef.current.length,
        leftDigit,
        rightDigit,
        expectedSum,
        userSum,
        isCorrect: userSum === expectedSum,
        reactionMs: Math.max(1, timestamp - pairActivatedAtRef.current),
        elapsedMs: Math.max(0, timestamp - testStartedAtRef.current),
      };

      attemptsRef.current = [...attemptsRef.current, attempt];
      setAttempts(attemptsRef.current);
      setInputValues((current) => ({ ...current, [pairIndex]: rawValue }));
      setInputStates((current) => ({
        ...current,
        [pairIndex]: userSum === expectedSum ? "correct" : "incorrect",
      }));

      const nextPairIndex = pairIndex + 1;
      pairActivatedAtRef.current = timestamp;

      setDigits((currentDigits) => appendDigitsIfNeeded(nextPairIndex, currentDigits));
      setCurrentPairIndex(nextPairIndex);
    },
    [appendDigitsIfNeeded, digits],
  );

  const handleInputChange = useCallback(
    (pairIndex: number, event: ChangeEvent<HTMLInputElement>) => {
      if (phaseRef.current !== "running" || pairIndex !== currentPairIndex) {
        event.target.value = inputValues[pairIndex] ?? "";
        return;
      }

      const nextCharacter = event.target.value.slice(-1);

      if (!nextCharacter) {
        event.target.value = "";
        return;
      }

      if (!isSingleDigit(nextCharacter)) {
        event.target.value = inputValues[pairIndex] ?? "";
        return;
      }

      event.target.value = nextCharacter;
      commitPairAnswer(pairIndex, nextCharacter);
    },
    [commitPairAnswer, currentPairIndex, inputValues],
  );

  const handleInputKeyDown = useCallback(
    (pairIndex: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (phaseRef.current !== "running" || pairIndex !== currentPairIndex) {
        return;
      }

      if (event.key.length === 1 && /^[0-9]$/.test(event.key)) {
        event.preventDefault();
        commitPairAnswer(pairIndex, event.key);
        return;
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
      }
    },
    [commitPairAnswer, currentPairIndex],
  );

  return (
    <section
      className={styles.shell}
      aria-label="Kraepelin psychomotor math grid"
      aria-describedby="math-grid-instructions"
    >
      <header className={styles.header}>
        <h2 id="math-grid-title" className={styles.title}>
          Uchida-Kraepelin Performance Matrix
        </h2>
        <time
          className={`${styles.timer} ${phase === "complete" ? styles.timerComplete : ""}`}
          aria-live="polite"
          aria-atomic="true"
          dateTime={phase === "idle" ? undefined : `PT${Math.ceil(remainingMs / 1000)}S`}
        >
          {phase === "idle" ? "Ready" : formatSeconds(remainingMs)}
        </time>
      </header>

      <p id="math-grid-instructions" className={styles.instructions}>
        上の2桁の一の位の和（0-9）を下の入力欄へ1桁だけ入力してください。入力後、自動的に次の欄へ移動します。
      </p>

      {phase === "idle" ? (
        <button
          type="button"
          className={styles.startButton}
          aria-label="Start 60 second Kraepelin math grid test"
          onClick={startTest}
        >
          60秒テストを開始
        </button>
      ) : null}

      {phase !== "idle" ? (
        <>
          <div className={styles.matrixViewport} aria-live="off">
            <div
              className={styles.matrixRow}
              role="group"
              aria-labelledby="math-grid-title"
              aria-describedby="math-grid-instructions"
            >
              {visiblePairIndices.map((pairIndex) => {
                const leftDigit = digits[pairIndex];
                const rightDigit = digits[pairIndex + 1];
                const isActive = phase === "running" && pairIndex === currentPairIndex;
                const inputState = inputStates[pairIndex] ?? "idle";

                return (
                  <motion.div
                    key={`pair-${pairIndex}-${leftDigit}-${rightDigit}`}
                    className={styles.digitCell}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  >
                    <div className={styles.digitPairRow}>
                      <span
                        className={`${styles.digitValue} ${
                          isActive ? styles.digitValueActive : ""
                        }`}
                        aria-hidden="true"
                      >
                        {leftDigit}
                      </span>
                      <span
                        className={`${styles.digitValue} ${
                          isActive ? styles.digitValueActive : ""
                        }`}
                        aria-hidden="true"
                      >
                        {rightDigit}
                      </span>
                    </div>

                    <label
                      htmlFor={`math-grid-input-${pairIndex}`}
                      className={styles.srOnly}
                    >
                      Sum of {leftDigit} and {rightDigit}, ones digit only
                    </label>
                    <input
                      id={`math-grid-input-${pairIndex}`}
                      ref={(element) => {
                        inputRefs.current[pairIndex] = element;
                      }}
                      className={`${styles.sumInput} ${
                        isActive ? styles.sumInputActive : ""
                      } ${
                        inputState === "correct"
                          ? styles.sumInputCorrect
                          : inputState === "incorrect"
                            ? styles.sumInputIncorrect
                            : ""
                      }`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      pattern="[0-9]"
                      maxLength={1}
                      value={inputValues[pairIndex] ?? ""}
                      disabled={phase !== "running" || pairIndex !== currentPairIndex}
                      aria-label={`Answer slot ${pairIndex + 1}: ones digit of ${leftDigit} plus ${rightDigit}`}
                      aria-describedby="math-grid-instructions"
                      aria-invalid={inputState === "incorrect"}
                      aria-disabled={
                        phase !== "running" || pairIndex !== currentPairIndex
                      }
                      onChange={(event) => handleInputChange(pairIndex, event)}
                      onKeyDown={(event) => handleInputKeyDown(pairIndex, event)}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div
            className={styles.statsRow}
            role="group"
            aria-label="Live performance statistics"
          >
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Attempts</span>
              <strong className={styles.statValue}>{liveStats.attempted}</strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Accuracy</span>
              <strong className={styles.statValue}>{liveStats.accuracy}%</strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Elapsed</span>
              <strong className={styles.statValue}>{formatSeconds(elapsedMs)}</strong>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.matrixPlaceholder} aria-hidden="true" />
      )}

      {phase === "complete" && kraepelinPerformance ? (
        <div className={styles.completeBanner} role="status" aria-live="polite">
          テスト完了。Focus pattern:{" "}
          <strong>{kraepelinPerformance.focusPattern.replace(/_/g, " ")}</strong> /
          Accuracy {kraepelinPerformance.overallAccuracy.toFixed(1)}% / Fatigue index{" "}
          {kraepelinPerformance.fatigueIndex.toFixed(1)}. AI
          チャットへパフォーマンス曲線を同期しました。
        </div>
      ) : (
        <div className={styles.completeBannerPlaceholder} aria-hidden="true" />
      )}
    </section>
  );
}
