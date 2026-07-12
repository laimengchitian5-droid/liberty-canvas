"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  builderAnswersToCompilerPayload,
  buildFeedbackRuntimeStep,
  buildInitialRuntimeStep,
  buildQuestionRuntimeStep,
  findFeedbackForQuestion,
  resolveNextQuestionBlockId,
} from "@/lib/builder/compileBuilderRuntime";
import { convertBuilderToPlugDefinition } from "@/lib/builder/convertBuilderToPlugDefinition";
import { compileLegallySafeResult } from "@/lib/diagnosis/compileLegallySafeResult";
import {
  buildCosmicCharacterSheet,
  type CosmicCharacterSheet,
  type CosmicPlanetKind,
} from "@/lib/diagnosis/cosmicPlanetEngine";
import { extractQuestionBlocks } from "@/lib/diagnosis/extractDiagnosisElements";
import type {
  BuilderCompilerAnswer,
  BuilderCompilerPhase,
  BuilderDiagnosisDefinition,
  BuilderRuntimeStep,
} from "@/types/builder";
import type {
  CompilerAnswer,
  LegallySafeDiagnosisOutcome,
  PlugDiagnosisDefinition,
} from "@/types/diagnosisCompiler";

const TRANSITION_MS = 220;

export type CompilerProgramSource = "plug" | "builder";

export interface DiagnosisCompilerStoreState {
  programSource: CompilerProgramSource | null;
  definition: PlugDiagnosisDefinition | null;
  builderDefinition: BuilderDiagnosisDefinition | null;
  phase: BuilderCompilerPhase;
  questionIndex: number;
  activeBlockId: string | null;
  runtimeStep: BuilderRuntimeStep | null;
  answers: CompilerAnswer[];
  builderAnswers: BuilderCompilerAnswer[];
  outcome: LegallySafeDiagnosisOutcome | null;
  isTransitioning: boolean;
  cosmicSheet: CosmicCharacterSheet | null;
  activePlanetKind: CosmicPlanetKind | null;
  planetRenderReady: boolean;
}

interface SubmitAnswerPayload {
  blockId: string;
  optionId?: string;
  choiceLabel?: string;
  sliderValue?: number;
  textValue?: string;
}

interface DiagnosisCompilerStoreActions {
  initProgram: (definition: PlugDiagnosisDefinition) => void;
  initBuilderProgram: (definition: BuilderDiagnosisDefinition) => void;
  startProgram: () => void;
  submitAnswer: (payload: SubmitAnswerPayload) => void;
  advanceFeedback: () => void;
  restartProgram: () => void;
}

export type DiagnosisCompilerStore = DiagnosisCompilerStoreState &
  DiagnosisCompilerStoreActions;

const INITIAL_STATE: DiagnosisCompilerStoreState = {
  programSource: null,
  definition: null,
  builderDefinition: null,
  phase: "intro",
  questionIndex: 0,
  activeBlockId: null,
  runtimeStep: null,
  answers: [],
  builderAnswers: [],
  outcome: null,
  isTransitioning: false,
  cosmicSheet: null,
  activePlanetKind: null,
  planetRenderReady: false,
};

function buildPlugOutcome(
  definition: PlugDiagnosisDefinition,
  answers: readonly CompilerAnswer[],
): LegallySafeDiagnosisOutcome {
  return compileLegallySafeResult(definition, answers);
}

function buildBuilderOutcome(
  definition: BuilderDiagnosisDefinition,
  answers: readonly BuilderCompilerAnswer[],
): LegallySafeDiagnosisOutcome {
  const plugDefinition = convertBuilderToPlugDefinition(definition);
  const compilerAnswers = builderAnswersToCompilerPayload(answers);

  return compileLegallySafeResult(plugDefinition, compilerAnswers);
}

function applyCosmicPlanetFromOutcome(
  outcome: LegallySafeDiagnosisOutcome,
): Pick<
  DiagnosisCompilerStoreState,
  "cosmicSheet" | "activePlanetKind" | "planetRenderReady"
> {
  const cosmicSheet = buildCosmicCharacterSheet(outcome.academicVector);

  return {
    cosmicSheet,
    activePlanetKind: cosmicSheet.planet.kind,
    planetRenderReady: true,
  };
}

function finalizeBuilderRun(
  definition: BuilderDiagnosisDefinition,
  builderAnswers: readonly BuilderCompilerAnswer[],
): Partial<DiagnosisCompilerStoreState> {
  const outcome = buildBuilderOutcome(definition, builderAnswers);

  return {
    phase: "result",
    runtimeStep: null,
    activeBlockId: null,
    outcome,
    isTransitioning: false,
    ...applyCosmicPlanetFromOutcome(outcome),
  };
}

function advanceBuilderAfterQuestion(
  definition: BuilderDiagnosisDefinition,
  completedBlockId: string,
  choiceId: string,
  choiceLabel: string,
  builderAnswers: readonly BuilderCompilerAnswer[],
): Partial<DiagnosisCompilerStoreState> {
  const feedback = findFeedbackForQuestion(definition, completedBlockId);

  if (feedback) {
    const feedbackStep = buildFeedbackRuntimeStep(
      definition,
      feedback.id,
      choiceLabel,
      completedBlockId,
    );

    return {
      phase: "feedback",
      runtimeStep: feedbackStep,
      activeBlockId: feedback.id,
      isTransitioning: false,
    };
  }

  const nextBlockId = resolveNextQuestionBlockId(
    definition,
    completedBlockId,
    choiceId,
  );

  if (!nextBlockId) {
    return finalizeBuilderRun(definition, builderAnswers);
  }

  const nextStep = buildQuestionRuntimeStep(definition, nextBlockId);

  return {
    phase: "questions",
    runtimeStep: nextStep,
    activeBlockId: nextBlockId,
    questionIndex: nextStep?.questionNumber
      ? nextStep.questionNumber - 1
      : 0,
    isTransitioning: false,
  };
}

export const useDiagnosisCompilerStore = create<DiagnosisCompilerStore>()(
  subscribeWithSelector((set, get) => ({
    ...INITIAL_STATE,

    initProgram: (definition) => {
      set({
        programSource: "plug",
        definition,
        builderDefinition: null,
        phase: "intro",
        questionIndex: 0,
        activeBlockId: null,
        runtimeStep: null,
        answers: [],
        builderAnswers: [],
        outcome: null,
        isTransitioning: false,
        cosmicSheet: null,
        activePlanetKind: null,
        planetRenderReady: false,
      });
    },

    initBuilderProgram: (definition) => {
      const initialStep = buildInitialRuntimeStep(definition);

      set({
        programSource: "builder",
        definition: convertBuilderToPlugDefinition(definition),
        builderDefinition: definition,
        phase: "intro",
        questionIndex: 0,
        activeBlockId: definition.startBlockId,
        runtimeStep: initialStep,
        answers: [],
        builderAnswers: [],
        outcome: null,
        isTransitioning: false,
        cosmicSheet: null,
        activePlanetKind: null,
        planetRenderReady: false,
      });
    },

    startProgram: () => {
      const { programSource, builderDefinition, isTransitioning } = get();

      if (isTransitioning) {
        return;
      }

      if (programSource === "builder" && builderDefinition) {
        const initialStep = buildInitialRuntimeStep(builderDefinition);

        set({
          phase: "questions",
          activeBlockId: builderDefinition.startBlockId,
          runtimeStep: initialStep,
          questionIndex: 0,
          isTransitioning: false,
        });
        return;
      }

      if (get().definition) {
        set({ phase: "questions", questionIndex: 0, isTransitioning: false });
      }
    },

    submitAnswer: (payload) => {
      const state = get();

      if (state.isTransitioning) {
        return;
      }

      if (state.programSource === "builder" && state.builderDefinition) {
        const { builderDefinition } = state;
        const currentStep = state.runtimeStep;

        if (
          !currentStep ||
          currentStep.kind !== "question" ||
          currentStep.block.id !== payload.blockId ||
          !payload.optionId ||
          !payload.choiceLabel
        ) {
          return;
        }

        const nextBuilderAnswer: BuilderCompilerAnswer = {
          blockId: payload.blockId,
          choiceId: payload.optionId,
          choiceLabel: payload.choiceLabel,
          recordedAt: Date.now(),
        };

        const nextBuilderAnswers = [
          ...state.builderAnswers.filter(
            (entry) => entry.blockId !== payload.blockId,
          ),
          nextBuilderAnswer,
        ];

        set({ isTransitioning: true, builderAnswers: nextBuilderAnswers });

        window.setTimeout(() => {
          const latest = get();

          if (!latest.builderDefinition) {
            set({ isTransitioning: false });
            return;
          }

          set(
            advanceBuilderAfterQuestion(
              latest.builderDefinition,
              payload.blockId,
              payload.optionId!,
              payload.choiceLabel!,
              nextBuilderAnswers,
            ),
          );
        }, TRANSITION_MS);

        return;
      }

      const { definition, questionIndex, answers } = state;

      if (!definition) {
        return;
      }

      const questionBlocks = extractQuestionBlocks(definition);
      const currentBlock = questionBlocks[questionIndex];

      if (!currentBlock || currentBlock.id !== payload.blockId) {
        return;
      }

      const nextAnswer: CompilerAnswer = {
        blockId: payload.blockId,
        optionId: payload.optionId,
        sliderValue: payload.sliderValue,
        textValue: payload.textValue,
        recordedAt: Date.now(),
      };

      const nextAnswers = [
        ...answers.filter((entry) => entry.blockId !== payload.blockId),
        nextAnswer,
      ];

      set({ isTransitioning: true, answers: nextAnswers });

      window.setTimeout(() => {
        const latest = get();

        if (!latest.definition) {
          set({ isTransitioning: false });
          return;
        }

        const blocks = extractQuestionBlocks(latest.definition);
        const nextIndex = latest.questionIndex + 1;

        if (nextIndex >= blocks.length) {
          const outcome = buildPlugOutcome(latest.definition, nextAnswers);
          set({
            phase: "result",
            questionIndex: nextIndex,
            outcome,
            isTransitioning: false,
            ...applyCosmicPlanetFromOutcome(outcome),
          });
          return;
        }

        set({
          questionIndex: nextIndex,
          isTransitioning: false,
        });
      }, TRANSITION_MS);
    },

    advanceFeedback: () => {
      const state = get();

      if (
        state.isTransitioning ||
        state.programSource !== "builder" ||
        !state.builderDefinition ||
        state.phase !== "feedback" ||
        !state.runtimeStep ||
        state.runtimeStep.kind !== "feedback"
      ) {
        return;
      }

      const originQuestionId = state.runtimeStep.originQuestionId;
      const lastAnswer = state.builderAnswers.find(
        (entry) => entry.blockId === originQuestionId,
      );

      if (!lastAnswer) {
        set({ isTransitioning: false });
        return;
      }

      set({ isTransitioning: true });

      window.setTimeout(() => {
        const latest = get();

        if (!latest.builderDefinition) {
          set({ isTransitioning: false });
          return;
        }

        const nextBlockId = resolveNextQuestionBlockId(
          latest.builderDefinition,
          originQuestionId,
          lastAnswer.choiceId,
        );

        if (!nextBlockId) {
          set(finalizeBuilderRun(latest.builderDefinition, latest.builderAnswers));
          return;
        }

        const nextStep = buildQuestionRuntimeStep(
          latest.builderDefinition,
          nextBlockId,
        );

        set({
          phase: "questions",
          runtimeStep: nextStep,
          activeBlockId: nextBlockId,
          questionIndex: nextStep?.questionNumber
            ? nextStep.questionNumber - 1
            : latest.questionIndex,
          isTransitioning: false,
        });
      }, TRANSITION_MS);
    },

    restartProgram: () => {
      const { programSource, definition, builderDefinition } = get();

      if (programSource === "builder" && builderDefinition) {
        const initialStep = buildInitialRuntimeStep(builderDefinition);

        set({
          programSource: "builder",
          definition: convertBuilderToPlugDefinition(builderDefinition),
          builderDefinition,
          phase: "intro",
          questionIndex: 0,
          activeBlockId: builderDefinition.startBlockId,
          runtimeStep: initialStep,
          answers: [],
          builderAnswers: [],
          outcome: null,
          isTransitioning: false,
          cosmicSheet: null,
          activePlanetKind: null,
          planetRenderReady: false,
        });
        return;
      }

      if (definition) {
        set({
          programSource: "plug",
          definition,
          builderDefinition: null,
          phase: "intro",
          questionIndex: 0,
          activeBlockId: null,
          runtimeStep: null,
          answers: [],
          builderAnswers: [],
          outcome: null,
          isTransitioning: false,
          cosmicSheet: null,
          activePlanetKind: null,
          planetRenderReady: false,
        });
        return;
      }

      set({ ...INITIAL_STATE });
    },
  })),
);

export function selectCompilerProgress(state: DiagnosisCompilerStore): {
  questionNumber: number;
  questionCount: number;
  progress: number;
} {
  if (state.programSource === "builder" && state.runtimeStep?.kind === "question") {
    const { questionNumber, questionCount } = state.runtimeStep;

    const progress =
      questionCount === 0
        ? 0
        : Math.round(
            ((state.phase === "result" ? questionCount : questionNumber - 1) /
              questionCount) *
              100,
          );

    return { questionNumber, questionCount, progress };
  }

  const questionCount = state.definition
    ? extractQuestionBlocks(state.definition).length
    : 0;

  const answeredInPhase =
    state.phase === "result" ? questionCount : state.questionIndex;

  const questionNumber = Math.min(
    questionCount,
    Math.max(1, answeredInPhase + (state.phase === "questions" ? 1 : 0)),
  );

  const progress =
    questionCount === 0
      ? 0
      : Math.round(
          ((state.phase === "result" ? questionCount : state.questionIndex) /
            questionCount) *
            100,
        );

  return { questionNumber, questionCount, progress };
}
