"use client";

import { useCallback, useReducer } from "react";
import { calculateDiagnosisResult } from "@/lib/rubel/calculateDiagnosisResult";
import type {
  Answer,
  Diagnosis,
  PlayOutcome,
  RubelQuizPhase,
  RubelQuizSessionState,
} from "@/types/rubel";

const TRANSITION_MS = 320;

type RubelQuizAction =
  | { type: "START" }
  | { type: "SELECT_OPTION"; answer: Answer }
  | { type: "ADVANCE" }
  | { type: "COMPLETE"; outcome: PlayOutcome }
  | { type: "RESET" };

function createInitialState(): RubelQuizSessionState {
  return {
    phase: "idle",
    questionIndex: 0,
    answers: [],
    outcome: null,
  };
}

function rubelQuizReducer(
  state: RubelQuizSessionState,
  action: RubelQuizAction,
): RubelQuizSessionState {
  switch (action.type) {
    case "START":
      return {
        phase: "active",
        questionIndex: 0,
        answers: [],
        outcome: null,
      };
    case "SELECT_OPTION":
      if (state.phase !== "active") {
        return state;
      }

      return {
        ...state,
        phase: "transitioning",
        answers: [
          ...state.answers.filter(
            (entry) => entry.questionId !== action.answer.questionId,
          ),
          action.answer,
        ],
      };
    case "ADVANCE": {
      if (state.phase !== "transitioning") {
        return state;
      }

      return {
        ...state,
        phase: "active",
        questionIndex: state.questionIndex + 1,
      };
    }
    case "COMPLETE":
      return {
        ...state,
        phase: "complete",
        outcome: action.outcome,
      };
    case "RESET":
      return createInitialState();
    default:
      return state;
  }
}

export function useRubelQuizSession(
  diagnosis: Diagnosis,
  onComplete?: (outcome: PlayOutcome) => void,
) {
  const [state, dispatch] = useReducer(rubelQuizReducer, undefined, createInitialState);

  const questionCount = diagnosis.questions.length;
  const currentQuestion = diagnosis.questions[state.questionIndex] ?? null;
  const progress =
    questionCount === 0 ? 0 : Math.round((state.answers.length / questionCount) * 100);

  const startQuiz = useCallback(() => {
    dispatch({ type: "START" });
  }, []);

  const resetQuiz = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const selectOption = useCallback(
    (optionId: string) => {
      if (!currentQuestion || state.phase !== "active") {
        return;
      }

      const answer: Answer = {
        questionId: currentQuestion.id,
        optionId,
      };

      const nextAnswers = [
        ...state.answers.filter((entry) => entry.questionId !== currentQuestion.id),
        answer,
      ];
      const answeredIndex = state.questionIndex;
      const isLastQuestion = answeredIndex + 1 >= questionCount;

      dispatch({ type: "SELECT_OPTION", answer });

      window.setTimeout(() => {
        if (isLastQuestion) {
          const outcome = calculateDiagnosisResult(diagnosis, nextAnswers);
          dispatch({ type: "COMPLETE", outcome });
          onComplete?.(outcome);
          return;
        }

        dispatch({ type: "ADVANCE" });
      }, TRANSITION_MS);
    },
    [
      currentQuestion,
      diagnosis,
      onComplete,
      questionCount,
      state.answers,
      state.phase,
      state.questionIndex,
    ],
  );

  const isChatUnlocked = state.phase === "complete";

  return {
    state,
    currentQuestion,
    questionNumber: state.questionIndex + 1,
    questionCount,
    progress,
    isChatUnlocked,
    startQuiz,
    resetQuiz,
    selectOption,
  };
}

export type { RubelQuizPhase, RubelQuizSessionState };
