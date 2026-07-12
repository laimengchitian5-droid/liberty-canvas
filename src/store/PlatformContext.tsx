"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { kraepelinMatrixToScoringResult } from "@/lib/kraepelin/scoreKraepelinMatrix";
import {
  FULL_INCLUSIVE_AI_GUARDRAILS,
} from "@/lib/i18n/culturalGuardrails";
import {
  DEFAULT_SCORING_PRESENTATION,
  INCLUSIVE_OUTPUT_POLICY,
  PERCENTILE_SCORE_RANGE,
} from "@/types/platform";
import {
  INITIAL_AI_CONTEXT,
  TestType,
  type ActiveQuestionnaire,
  type AIContextState,
  type AnswerLogEntry,
  type PlatformTelemetry,
  type Question,
  type KraepelinPerformanceMatrix,
  type ScoringResult,
} from "@/types/platform";

const MBTI_ARCHETYPE_PATTERN = /^[IE][NS][FT][JP]$/;

const MBTI_PERSONA_PROMPTS: Record<string, string> = {
  INTJ:
    "Respond with strategic clarity. Lead with conclusions, support with concise reasoning, and prioritize long-range implications over small talk.",
  INTP:
    "Respond with analytical curiosity. Explore underlying models, acknowledge uncertainty, and invite deeper reasoning without rushing to closure.",
  ENTJ:
    "Respond with executive decisiveness. State the goal first, outline actionable steps, and keep language direct and outcome-oriented.",
  ENTP:
    "Respond with inventive energy. Present multiple angles, challenge assumptions constructively, and keep the dialogue exploratory.",
  INFJ:
    "Respond with thoughtful depth. Connect patterns to meaning, validate emotional context, and offer insight that respects nuance.",
  INFP:
    "Respond with high empathy and reflective warmth. Honor values, use gentle language, and prioritize emotional authenticity over blunt efficiency.",
  ENFJ:
    "Respond with encouraging leadership. Focus on people impact, motivate with clarity, and balance empathy with practical guidance.",
  ENFP:
    "Respond with optimistic creativity. Highlight possibilities, celebrate strengths, and keep tone energizing without losing substance.",
  ISTJ:
    "Respond with dependable structure. Use ordered steps, cite concrete facts, and avoid ambiguity in recommendations.",
  ISFJ:
    "Respond with steady support. Acknowledge practical needs, provide careful detail, and maintain a reassuring, respectful tone.",
  ESTJ:
    "Respond with structured efficiency. Use bullet points, lead with conclusions, and prioritize actionable decisions over open-ended exploration.",
  ESFJ:
    "Respond with cooperative practicality. Emphasize shared goals, offer clear next steps, and maintain a warm, community-minded tone.",
  ISTP:
    "Respond with pragmatic brevity. Focus on what works, minimize fluff, and explain mechanics only when they change outcomes.",
  ISFP:
    "Respond with calm sensitivity. Respect personal boundaries, use soft language, and ground advice in present-moment realism.",
  ESTP:
    "Respond with bold directness. Cut to the chase, emphasize immediate options, and keep momentum high.",
  ESFP:
    "Respond with lively engagement. Keep tone upbeat, use vivid examples, and connect advice to lived experience.",
};

export interface PlatformState {
  questionnaire: ActiveQuestionnaire | null;
  answerLog: AnswerLogEntry[];
  scoringResult: ScoringResult | null;
  kraepelinPerformance: KraepelinPerformanceMatrix | null;
  aiContext: AIContextState;
  operationalFatigue: number | null;
  telemetry: PlatformTelemetry;
  localePreference: string | null;
}

type PlatformAction =
  | {
      type: "START_QUESTIONNAIRE";
      payload: { testId: string; testType: TestType; questions: Question[] };
    }
  | { type: "RECORD_ANSWER"; payload: { questionId: string; value: number } }
  | { type: "ADVANCE_QUESTION" }
  | { type: "RETREAT_QUESTION" }
  | { type: "SET_SCORING_RESULT"; payload: ScoringResult }
  | {
      type: "SET_KRAEPELIN_PERFORMANCE";
      payload: {
        matrix: KraepelinPerformanceMatrix;
        scoringResult: ScoringResult;
      };
    }
  | { type: "SYNC_AI_CONTEXT"; payload: Partial<AIContextState> }
  | { type: "SET_LOCALE_PREFERENCE"; payload: string | null }
  | { type: "RESET_PLATFORM" };

interface PlatformContextValue {
  questionnaire: ActiveQuestionnaire | null;
  answerLog: AnswerLogEntry[];
  scoringResult: ScoringResult | null;
  kraepelinPerformance: KraepelinPerformanceMatrix | null;
  aiContext: AIContextState;
  operationalFatigue: number | null;
  telemetry: PlatformTelemetry;
  localePreference: string | null;
  currentQuestion: Question | null;
  progress: number;
  isQuestionnaireComplete: boolean;
  startQuestionnaire: (
    testId: string,
    testType: TestType,
    questions: Question[],
  ) => void;
  recordAnswer: (questionId: string, value: number) => void;
  advanceQuestion: () => void;
  retreatQuestion: () => void;
  setScoringResult: (result: ScoringResult) => void;
  submitKraepelinPerformance: (matrix: KraepelinPerformanceMatrix) => void;
  syncAIContext: (patch?: Partial<AIContextState>) => void;
  setLocalePreference: (locale: string | null) => void;
  resetPlatform: () => void;
  getSystemPrompt: () => string;
}

function createInitialTelemetry(): PlatformTelemetry {
  const now = Date.now();
  return {
    sessionStartedAt: now,
    lastInteractionAt: now,
  };
}

const initialState: PlatformState = {
  questionnaire: null,
  answerLog: [],
  scoringResult: null,
  kraepelinPerformance: null,
  aiContext: INITIAL_AI_CONTEXT,
  operationalFatigue: null,
  telemetry: createInitialTelemetry(),
  localePreference: null,
};

function formatScoresAsPercentiles(scores: Record<string, number>): string {
  return Object.entries(scores)
    .map(([dimension, value]) => {
      const clamped = Math.max(
        PERCENTILE_SCORE_RANGE.min,
        Math.min(PERCENTILE_SCORE_RANGE.max, value),
      );
      return `${dimension}=${clamped.toFixed(1)}%`;
    })
    .join(", ");
}

function withInclusivePrompt(base: string): string {
  return [
    base,
    FULL_INCLUSIVE_AI_GUARDRAILS,
    INCLUSIVE_OUTPUT_POLICY.zeroTaboo,
    INCLUSIVE_OUTPUT_POLICY.numericalNeutrality,
    `Present quantitative dimensions as ${DEFAULT_SCORING_PRESENTATION.presentation} values between ${DEFAULT_SCORING_PRESENTATION.min} and ${DEFAULT_SCORING_PRESENTATION.max}.`,
  ].join(" ");
}

function generateAISystemPrompt(result: ScoringResult): string {
  if (!result.isReliable) {
    return withInclusivePrompt(
      [
        "You are a truth-seeking coaching agent.",
        "The user's assessment reliability is low, so avoid overconfident personality labeling.",
        "Gently clarify inconsistencies, ask one focused follow-up when useful, and recommend retaking or supplementing the assessment.",
        "Keep tone supportive, precise, and non-judgmental.",
        `Observed archetype hint: ${result.archetype}.`,
        `Dimension scores: ${formatScores(result.scores)}.`,
      ].join(" "),
    );
  }

  const normalizedArchetype = result.archetype.trim().toUpperCase();

  if (MBTI_ARCHETYPE_PATTERN.test(normalizedArchetype)) {
    const mbtiPrompt = MBTI_PERSONA_PROMPTS[normalizedArchetype];
    if (mbtiPrompt) {
      return withInclusivePrompt(
        [
          mbtiPrompt,
          `User MBTI profile: ${normalizedArchetype}.`,
          `Supporting scores: ${formatScores(result.scores)}.`,
        ].join(" "),
      );
    }
  }

  if (result.testId.toUpperCase().includes(TestType.BIG5)) {
    return withInclusivePrompt(buildBigFivePrompt(result));
  }

  if (result.testId.toUpperCase().includes(TestType.ENNEAGRAM)) {
    return withInclusivePrompt(buildEnneagramPrompt(result));
  }

  if (result.testId.toUpperCase().includes(TestType.DISC)) {
    return withInclusivePrompt(buildDiscPrompt(result));
  }

  if (result.testId.toUpperCase().includes(TestType.KRAEPELIN)) {
    return withInclusivePrompt(buildKraepelinPrompt(result));
  }

  return withInclusivePrompt(
    [
      "Adapt your communication style to the user's dominant personality dimensions.",
      `Primary archetype: ${result.archetype}.`,
      `Dimension emphasis: ${formatTopDimensions(result.scores)}.`,
      `Radar profile: ${formatRadar(result.radarData)}.`,
    ].join(" "),
  );
}

function formatScores(scores: Record<string, number>): string {
  return formatScoresAsPercentiles(scores);
}

function formatTopDimensions(scores: Record<string, number>, limit = 3): string {
  const ranked = Object.entries(scores).sort(([, a], [, b]) => b - a);
  if (ranked.length === 0) {
    return "none";
  }

  return ranked
    .slice(0, limit)
    .map(([dimension, value]) => `${dimension} (${value.toFixed(1)})`)
    .join(", ");
}

function formatRadar(
  radarData: Array<{ name: string; value: number }>,
): string {
  if (radarData.length === 0) {
    return "unavailable";
  }

  return radarData
    .map((entry) => `${entry.name}:${entry.value.toFixed(1)}`)
    .join(", ");
}

function buildBigFivePrompt(result: ScoringResult): string {
  const openness = result.scores.Openness ?? result.scores.openness ?? 0;
  const conscientiousness =
    result.scores.Conscientiousness ?? result.scores.conscientiousness ?? 0;
  const extraversion =
    result.scores.Extraversion ?? result.scores.extraversion ?? 0;
  const agreeableness =
    result.scores.Agreeableness ?? result.scores.agreeableness ?? 0;
  const neuroticism = result.scores.Neuroticism ?? result.scores.neuroticism ?? 0;

  const toneDirectives: string[] = [
    "Use evidence-based language aligned with Big Five trait levels.",
  ];

  if (openness >= 70) {
    toneDirectives.push("Encourage conceptual exploration and novel framing.");
  }

  if (conscientiousness >= 70) {
    toneDirectives.push("Provide structured plans, checkpoints, and clear priorities.");
  }

  if (extraversion >= 70) {
    toneDirectives.push("Keep responses energetic and interaction-oriented.");
  } else if (extraversion <= 30) {
    toneDirectives.push("Keep responses concise and respect reflective pacing.");
  }

  if (agreeableness >= 70) {
    toneDirectives.push("Maintain collaborative and validating language.");
  }

  if (neuroticism >= 70) {
    toneDirectives.push("Reduce alarmist framing and emphasize stabilizing actions.");
  }

  return [
    toneDirectives.join(" "),
    `Big Five archetype: ${result.archetype}.`,
    `Trait scores: ${formatScores(result.scores)}.`,
  ].join(" ");
}

function buildEnneagramPrompt(result: ScoringResult): string {
  return [
    "Respond through an Enneagram-aware lens focused on core motivations and growth paths.",
    "Connect advice to underlying fears and desires without stereotyping.",
    `Enneagram type: ${result.archetype}.`,
    `Type intensities: ${formatTopDimensions(result.scores)}.`,
  ].join(" ");
}

function buildDiscPrompt(result: ScoringResult): string {
  const dominant = result.archetype.toUpperCase();

  if (dominant.includes("D")) {
    return [
      "Use decisive, results-first communication with clear ownership and timelines.",
      `DISC profile: ${result.archetype}.`,
      `Behavioral scores: ${formatScores(result.scores)}.`,
    ].join(" ");
  }

  if (dominant.includes("I")) {
    return [
      "Use enthusiastic, persuasive communication that highlights social impact and momentum.",
      `DISC profile: ${result.archetype}.`,
      `Behavioral scores: ${formatScores(result.scores)}.`,
    ].join(" ");
  }

  if (dominant.includes("S")) {
    return [
      "Use calm, steady communication that emphasizes reliability and incremental change.",
      `DISC profile: ${result.archetype}.`,
      `Behavioral scores: ${formatScores(result.scores)}.`,
    ].join(" ");
  }

  if (dominant.includes("C")) {
    return [
      "Use precise, quality-focused communication with explicit assumptions and data points.",
      `DISC profile: ${result.archetype}.`,
      `Behavioral scores: ${formatScores(result.scores)}.`,
    ].join(" ");
  }

  return [
    "Adapt tone to the user's dominant DISC behavioral pattern.",
    `DISC profile: ${result.archetype}.`,
    `Behavioral scores: ${formatScores(result.scores)}.`,
  ].join(" ");
}

function buildKraepelinPrompt(result: ScoringResult): string {
  const fatigue = result.scores.fatigue ?? result.scores.Fatigue ?? 0;
  const consistency =
    result.scores.consistency ?? result.scores.Consistency ?? 0;

  const directives = [
    "Interpret responses through cognitive endurance and sustained attention patterns.",
    "Avoid moral judgment; focus on pacing, workload design, and recovery strategy.",
  ];

  if (fatigue >= 60) {
    directives.push("Recommend shorter cognitive bursts and explicit rest intervals.");
  }

  if (consistency <= 40) {
    directives.push("Highlight attention variability and suggest focus scaffolding.");
  }

  return [
    directives.join(" "),
    `Kraepelin profile: ${result.archetype}.`,
    `Performance metrics: ${formatScores(result.scores)}.`,
  ].join(" ");
}

function derivePersonaLabel(result: ScoringResult): string {
  if (!result.isReliable) {
    return "truth-seeking-coach";
  }

  const normalizedArchetype = result.archetype.trim().toUpperCase();

  if (MBTI_ARCHETYPE_PATTERN.test(normalizedArchetype)) {
    return `mbti-${normalizedArchetype.toLowerCase()}`;
  }

  const testPrefix = result.testId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${testPrefix || "personality"}-${normalizedArchetype.toLowerCase()}`;
}

function touchTelemetry(state: PlatformState): PlatformTelemetry {
  return {
    ...state.telemetry,
    lastInteractionAt: Date.now(),
  };
}

function platformReducer(
  state: PlatformState,
  action: PlatformAction,
): PlatformState {
  switch (action.type) {
    case "START_QUESTIONNAIRE": {
      const { testId, testType, questions } = action.payload;

      if (questions.length === 0) {
        return state;
      }

      return {
        ...state,
        questionnaire: {
          testId,
          testType,
          questions,
          currentIndex: 0,
          startedAt: Date.now(),
        },
        answerLog: [],
        scoringResult: null,
        operationalFatigue: null,
        aiContext: INITIAL_AI_CONTEXT,
        telemetry: touchTelemetry(state),
      };
    }

    case "RECORD_ANSWER": {
      const { questionId, value } = action.payload;
      const existingIndex = state.answerLog.findIndex(
        (entry) => entry.questionId === questionId,
      );
      const nextEntry: AnswerLogEntry = {
        questionId,
        value,
        recordedAt: Date.now(),
      };

      if (existingIndex === -1) {
        return {
          ...state,
          answerLog: [...state.answerLog, nextEntry],
          telemetry: touchTelemetry(state),
        };
      }

      const nextAnswerLog = [...state.answerLog];
      nextAnswerLog[existingIndex] = nextEntry;

      return {
        ...state,
        answerLog: nextAnswerLog,
        telemetry: touchTelemetry(state),
      };
    }

    case "ADVANCE_QUESTION": {
      if (!state.questionnaire) {
        return state;
      }

      const lastIndex = state.questionnaire.questions.length - 1;
      if (state.questionnaire.currentIndex >= lastIndex) {
        return state;
      }

      return {
        ...state,
        questionnaire: {
          ...state.questionnaire,
          currentIndex: state.questionnaire.currentIndex + 1,
        },
      };
    }

    case "RETREAT_QUESTION": {
      if (!state.questionnaire) {
        return state;
      }

      if (state.questionnaire.currentIndex <= 0) {
        return state;
      }

      return {
        ...state,
        questionnaire: {
          ...state.questionnaire,
          currentIndex: state.questionnaire.currentIndex - 1,
        },
      };
    }

    case "SET_SCORING_RESULT": {
      const scoringResult = action.payload;
      const generatedPrompt = generateAISystemPrompt(scoringResult);

      return {
        ...state,
        scoringResult,
        aiContext: {
          syncTimestamp: Date.now(),
          activePersona: derivePersonaLabel(scoringResult),
          systemPromptOverride: generatedPrompt,
        },
      };
    }

    case "SET_KRAEPELIN_PERFORMANCE": {
      const { matrix, scoringResult } = action.payload;
      const generatedPrompt = generateAISystemPrompt(scoringResult);

      return {
        ...state,
        kraepelinPerformance: matrix,
        scoringResult,
        operationalFatigue: matrix.fatigueIndex,
        aiContext: {
          syncTimestamp: Date.now(),
          activePersona: derivePersonaLabel(scoringResult),
          systemPromptOverride: generatedPrompt,
        },
        telemetry: touchTelemetry(state),
      };
    }

    case "SET_LOCALE_PREFERENCE":
      return {
        ...state,
        localePreference: action.payload,
        telemetry: touchTelemetry(state),
      };

    case "SYNC_AI_CONTEXT": {
      if (!state.scoringResult) {
        return {
          ...state,
          aiContext: {
            ...state.aiContext,
            ...action.payload,
            syncTimestamp: Date.now(),
          },
        };
      }

      const mergedOverride =
        action.payload.systemPromptOverride ?? state.aiContext.systemPromptOverride;

      return {
        ...state,
        aiContext: {
          ...state.aiContext,
          ...action.payload,
          systemPromptOverride: mergedOverride,
          syncTimestamp: Date.now(),
        },
      };
    }

    case "RESET_PLATFORM":
      return {
        ...initialState,
        telemetry: createInitialTelemetry(),
      };

    default:
      return state;
  }
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(platformReducer, initialState);

  const currentQuestion = useMemo(() => {
    if (!state.questionnaire) {
      return null;
    }

    return state.questionnaire.questions[state.questionnaire.currentIndex] ?? null;
  }, [state.questionnaire]);

  const progress = useMemo(() => {
    if (!state.questionnaire || state.questionnaire.questions.length === 0) {
      return 0;
    }

    const answeredCount = state.answerLog.length;
    const totalCount = state.questionnaire.questions.length;
    return Math.min(100, Math.round((answeredCount / totalCount) * 100));
  }, [state.answerLog.length, state.questionnaire]);

  const isQuestionnaireComplete = useMemo(() => {
    if (!state.questionnaire) {
      return false;
    }

    return state.answerLog.length >= state.questionnaire.questions.length;
  }, [state.answerLog.length, state.questionnaire]);

  const startQuestionnaire = useCallback(
    (testId: string, testType: TestType, questions: Question[]) => {
      dispatch({ type: "START_QUESTIONNAIRE", payload: { testId, testType, questions } });
    },
    [],
  );

  const recordAnswer = useCallback((questionId: string, value: number) => {
    dispatch({ type: "RECORD_ANSWER", payload: { questionId, value } });
  }, []);

  const advanceQuestion = useCallback(() => {
    dispatch({ type: "ADVANCE_QUESTION" });
  }, []);

  const retreatQuestion = useCallback(() => {
    dispatch({ type: "RETREAT_QUESTION" });
  }, []);

  const setScoringResult = useCallback((result: ScoringResult) => {
    dispatch({ type: "SET_SCORING_RESULT", payload: result });
  }, []);

  const submitKraepelinPerformance = useCallback(
    (matrix: KraepelinPerformanceMatrix) => {
      dispatch({
        type: "SET_KRAEPELIN_PERFORMANCE",
        payload: {
          matrix,
          scoringResult: kraepelinMatrixToScoringResult(matrix),
        },
      });
    },
    [],
  );

  const syncAIContext = useCallback((patch?: Partial<AIContextState>) => {
    dispatch({ type: "SYNC_AI_CONTEXT", payload: patch ?? {} });
  }, []);

  const setLocalePreference = useCallback((locale: string | null) => {
    dispatch({ type: "SET_LOCALE_PREFERENCE", payload: locale });
  }, []);

  const resetPlatform = useCallback(() => {
    dispatch({ type: "RESET_PLATFORM" });
  }, []);

  const getSystemPrompt = useCallback((): string => {
    if (state.aiContext.systemPromptOverride.trim().length > 0) {
      return state.aiContext.systemPromptOverride;
    }

    if (!state.scoringResult) {
      return "You are LibertyCanvas, a helpful universal AI workspace assistant.";
    }

    return generateAISystemPrompt(state.scoringResult);
  }, [state.aiContext.systemPromptOverride, state.scoringResult]);

  const value = useMemo<PlatformContextValue>(
    () => ({
      questionnaire: state.questionnaire,
      answerLog: state.answerLog,
      scoringResult: state.scoringResult,
      kraepelinPerformance: state.kraepelinPerformance,
      aiContext: state.aiContext,
      operationalFatigue: state.operationalFatigue,
      telemetry: state.telemetry,
      localePreference: state.localePreference,
      currentQuestion,
      progress,
      isQuestionnaireComplete,
      startQuestionnaire,
      recordAnswer,
      advanceQuestion,
      retreatQuestion,
      setScoringResult,
      submitKraepelinPerformance,
      syncAIContext,
      setLocalePreference,
      resetPlatform,
      getSystemPrompt,
    }),
    [
      state.questionnaire,
      state.answerLog,
      state.scoringResult,
      state.kraepelinPerformance,
      state.aiContext,
      state.operationalFatigue,
      state.telemetry,
      state.localePreference,
      currentQuestion,
      progress,
      isQuestionnaireComplete,
      startQuestionnaire,
      recordAnswer,
      advanceQuestion,
      retreatQuestion,
      setScoringResult,
      submitKraepelinPerformance,
      syncAIContext,
      setLocalePreference,
      resetPlatform,
      getSystemPrompt,
    ],
  );

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform(): PlatformContextValue {
  const context = useContext(PlatformContext);

  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }

  return context;
}
