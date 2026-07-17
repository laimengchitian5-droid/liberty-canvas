"use client";

import { useCallback, useMemo, useState } from "react";
import { SAMPLE_DIAGNOSTIC_QUESTIONS } from "@/lib/diagnosis/sampleQuestions";
import { scoreDiagnosis } from "@/lib/diagnosis/scoreDiagnosis";
import type {
  DiagnosisEvaluation,
  DiagnosisPhase,
  DiagnosticAnswer,
  DiagnosticQuestion,
} from "@/types/diagnosis";

interface UseDiagnosisEngineOptions {
  questions?: DiagnosticQuestion[];
}

interface DiagnosisEngineState {
  phase: DiagnosisPhase;
  questionIndex: number;
  answers: DiagnosticAnswer[];
  isTransitioning: boolean;
}

const TRANSITION_MS = 280;

export function useDiagnosisEngine(options: UseDiagnosisEngineOptions = {}) {
  const questions = options.questions ?? SAMPLE_DIAGNOSTIC_QUESTIONS;

  const [state, setState] = useState<DiagnosisEngineState>({
    phase: "intro",
    questionIndex: 0,
    answers: [],
    isTransitioning: false,
  });

  const currentQuestion = questions[state.questionIndex] ?? null;

  const evaluation: DiagnosisEvaluation = useMemo(
    () => scoreDiagnosis(questions, state.answers),
    [questions, state.answers],
  );

  const progress = useMemo(() => {
    if (questions.length === 0) {
      return 0;
    }

    return Math.round((state.answers.length / questions.length) * 100);
  }, [questions.length, state.answers.length]);

  const startDiagnosis = useCallback(() => {
    setState({
      phase: "questions",
      questionIndex: 0,
      answers: [],
      isTransitioning: false,
    });
  }, []);

  const selectOption = useCallback(
    (optionId: string) => {
      setState((previous) => {
        if (
          previous.isTransitioning ||
          previous.phase !== "questions" ||
          !questions[previous.questionIndex]
        ) {
          return previous;
        }

        const question = questions[previous.questionIndex];
        const nextAnswers: DiagnosticAnswer[] = [
          ...previous.answers.filter((entry) => entry.questionId !== question.id),
          {
            questionId: question.id,
            optionId,
            selectedAt: Date.now(),
          },
        ];

        return {
          ...previous,
          answers: nextAnswers,
          isTransitioning: true,
        };
      });

      window.setTimeout(() => {
        setState((previous) => {
          if (previous.phase !== "questions") {
            return previous;
          }

          const nextIndex = previous.questionIndex + 1;
          const isLastQuestion = nextIndex >= questions.length;

          return {
            ...previous,
            questionIndex: isLastQuestion ? previous.questionIndex : nextIndex,
            phase: isLastQuestion ? "result" : "questions",
            isTransitioning: false,
          };
        });
      }, TRANSITION_MS);
    },
    [questions],
  );

  const openAdvice = useCallback(() => {
    setState((previous) => ({
      ...previous,
      phase: "advice",
    }));
  }, []);

  const restart = useCallback(() => {
    setState({
      phase: "intro",
      questionIndex: 0,
      answers: [],
      isTransitioning: false,
    });
  }, []);

  return {
    questions,
    currentQuestion,
    phase: state.phase,
    questionNumber: state.questionIndex + 1,
    questionCount: questions.length,
    progress,
    evaluation,
    answers: state.answers,
    isTransitioning: state.isTransitioning,
    startDiagnosis,
    selectOption,
    openAdvice,
    restart,
  };
}
