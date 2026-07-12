"use client";



import { AnimatePresence, motion } from "framer-motion";

import {

  Check,

  Copy,

  Download,

  RotateCcw,

  Share2,

} from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useShallow } from "zustand/react/shallow";

import { extractQuestionBlocks, extractSeoBlock } from "@/lib/diagnosis/extractDiagnosisElements";

import {

  LEGAL_TRAIT_KEYS,

  type LegalTraitKey,

} from "@/lib/diagnosis/academicTraitVector";

import { compileLegallySafeResult } from "@/lib/diagnosis/compileLegallySafeResult";
import { COMPILER_UI_MESSAGES } from "@/lib/diagnosis/compilerMessages";
import { getSiteUrl } from "@/lib/site/url";
import { DiagnosisResultPage } from "@/components/diagnosis/DiagnosisResultPage";
import { DiagnosisCompilerIntro } from "@/components/diagnosis/DiagnosisCompilerIntro";
import {
  DiagnosisCompilerTraitChart,
  formatTraitLabel,
} from "@/components/diagnosis/DiagnosisCompilerTraitChart";

import {

  selectCompilerProgress,

  useDiagnosisCompilerStore,

} from "@/store/diagnosisCompilerStore";

import { useUserStore } from "@/store/userStore";

import { cn } from "@/lib/utils/cn";

import type {

  BuilderDiagnosisDefinition,

  BuilderRuntimeFeedbackStep,

  BuilderRuntimeQuestionStep,

} from "@/types/builder";

import { isBuilderDiagnosisDefinition } from "@/types/builder";

import type {

  AcademicTraitVector,

  LegallySafeDiagnosisOutcome,

  PlugDiagnosisDefinition,

  QuestionBlock,

  ResultLayoutKind,

  ViralSharePreset,

} from "@/types/diagnosisCompiler";

import styles from "./diagnosisCompiler.module.css";



const CARD_SPRING = {

  type: "spring" as const,

  stiffness: 300,

  damping: 30,

};



type DiagnosisCompilerProps =

  | { definition: PlugDiagnosisDefinition; builderDefinition?: never }

  | { definition?: never; builderDefinition: BuilderDiagnosisDefinition }

  | { definition: PlugDiagnosisDefinition; builderDefinition?: BuilderDiagnosisDefinition };



export { compileLegallySafeResult };



function resolveProgramDefinition(

  props: DiagnosisCompilerProps,

): PlugDiagnosisDefinition | BuilderDiagnosisDefinition {

  if (props.builderDefinition) {

    return props.builderDefinition;

  }



  return props.definition;

}



function buildShareUrl(

  definition: PlugDiagnosisDefinition | BuilderDiagnosisDefinition,

): string {

  if (isBuilderDiagnosisDefinition(definition)) {

    const path =

      definition.seoTuning?.landingPath ?? `/diagnosis/play/${definition.slug}`;

    return `${getSiteUrl()}${path}`;

  }



  const seoBlock = extractSeoBlock(definition);

  const path = seoBlock?.landingPath ?? `/diagnosis/play/${definition.slug}`;

  return `${getSiteUrl()}${path}`;

}



function buildShareText(

  definition: PlugDiagnosisDefinition | BuilderDiagnosisDefinition,

  outcome: LegallySafeDiagnosisOutcome,

  preset: ViralSharePreset,

): string {

  return `${preset.cardTitle}：${outcome.winningArchetype.title}\n${preset.cardDescription}\n${preset.hashtag}\n${buildShareUrl(definition)}`;

}



async function copyText(text: string): Promise<boolean> {

  try {

    await navigator.clipboard.writeText(text);

    return true;

  } catch {

    return false;

  }

}



const ConversationalChoiceList = ({

  choices,

  isTransitioning,

  onSelect,

}: {

  choices: BuilderRuntimeQuestionStep["block"]["choices"];

  isTransitioning: boolean;

  onSelect: (choiceId: string, choiceLabel: string) => void;

}) => (

  <ul className={styles.optionList}>

    {choices.map((choice) => (

      <li key={choice.id}>

        <button

          type="button"

          className={styles.optionButton}

          disabled={isTransitioning}

          onClick={() => onSelect(choice.id, choice.label)}

        >

          {choice.label}

        </button>

      </li>

    ))}

  </ul>

);



const MultipleChoiceQuestion = ({

  block,

  isTransitioning,

  onSelect,

}: {

  block: QuestionBlock;

  isTransitioning: boolean;

  onSelect: (optionId: string) => void;

}) => (

  <ul className={styles.optionList}>

    {(block.options ?? []).map((option) => (

      <li key={option.id}>

        <button

          type="button"

          className={styles.optionButton}

          disabled={isTransitioning}

          onClick={() => onSelect(option.id)}

        >

          {option.label}

        </button>

      </li>

    ))}

  </ul>

);



const SliderQuestion = ({

  block,

  isTransitioning,

  onSubmit,

}: {

  block: QuestionBlock;

  isTransitioning: boolean;

  onSubmit: (value: number) => void;

}) => {

  const slider = block.slider!;

  const midpoint = Math.round((slider.min + slider.max) / 2);

  const [value, setValue] = useState(midpoint);



  return (

    <div className={styles.sliderGroup}>

      <div className={styles.sliderLabels}>

        <span>{slider.minLabel}</span>

        <span>{slider.maxLabel}</span>

      </div>

      <input

        type="range"

        className={styles.sliderInput}

        min={slider.min}

        max={slider.max}

        step={slider.step}

        value={value}

        disabled={isTransitioning}

        aria-valuemin={slider.min}

        aria-valuemax={slider.max}

        aria-valuenow={value}

        aria-label={block.prompt}

        onChange={(event) => setValue(Number(event.target.value))}

      />

      <span className={styles.sliderValue}>{value}</span>

      <button

        type="button"

        className={styles.sliderSubmit}

        disabled={isTransitioning}

        onClick={() => onSubmit(value)}

      >

        次へ

      </button>

    </div>

  );

};



const TextQuestion = ({

  block,

  isTransitioning,

  onSubmit,

}: {

  block: QuestionBlock;

  isTransitioning: boolean;

  onSubmit: (text: string) => void;

}) => {

  const config = block.textInput!;

  const [value, setValue] = useState("");



  return (

    <div className={styles.sliderGroup}>

      <input

        type="text"

        className={styles.textInput}

        value={value}

        maxLength={config.maxLength}

        placeholder={config.placeholder}

        disabled={isTransitioning}

        aria-label={block.prompt}

        onChange={(event) => setValue(event.target.value)}

      />

      <button

        type="button"

        className={styles.textSubmit}

        disabled={isTransitioning || value.trim().length === 0}

        onClick={() => onSubmit(value.trim())}

      >

        次へ

      </button>

    </div>

  );

};



const BuilderQuestionPanel = ({

  step,

  progress,

  isTransitioning,

  onAnswer,

}: {

  step: BuilderRuntimeQuestionStep;

  progress: number;

  isTransitioning: boolean;

  onAnswer: (choiceId: string, choiceLabel: string) => void;

}) => (

  <div className={styles.card} aria-live="polite">

    <div className={styles.metaRow}>

      <span className={styles.progressLabel}>

        {step.questionNumber} / {step.questionCount}

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

        key={step.block.id}

        initial={{ opacity: 0, x: 20 }}

        animate={{ opacity: 1, x: 0 }}

        exit={{ opacity: 0, x: -20 }}

        transition={CARD_SPRING}

        className={styles.questionStage}

      >

        <h2 className={styles.questionText}>{step.block.prompt}</h2>

        {step.block.subPrompt ? (

          <p className={styles.questionSubtext}>{step.block.subPrompt}</p>

        ) : null}



        <ConversationalChoiceList

          choices={step.block.choices}

          isTransitioning={isTransitioning}

          onSelect={onAnswer}

        />

      </motion.div>

    </AnimatePresence>

  </div>

);



const FeedbackPanel = ({

  step,

  isTransitioning,

  onContinue,

}: {

  step: BuilderRuntimeFeedbackStep;

  isTransitioning: boolean;

  onContinue: () => void;

}) => (

  <div className={styles.card} aria-live="polite">

    <AnimatePresence mode="wait" initial={false}>

      <motion.div

        key={step.block.id}

        initial={{ opacity: 0, scale: 0.96 }}

        animate={{ opacity: 1, scale: 1 }}

        exit={{ opacity: 0, scale: 0.96 }}

        transition={CARD_SPRING}

        className={styles.feedbackStage}

      >

        <p className={styles.feedbackBadge}>{COMPILER_UI_MESSAGES.feedbackBadge}</p>

        <p className={styles.feedbackText}>{step.resolvedAffirmation}</p>

        <button

          type="button"

          className={styles.primaryButton}

          disabled={isTransitioning}

          onClick={onContinue}

        >

          {COMPILER_UI_MESSAGES.nextQuestion}

        </button>

      </motion.div>

    </AnimatePresence>

  </div>

);



const CompilerQuestionPanel = ({

  block,

  questionNumber,

  questionCount,

  progress,

  isTransitioning,

  onAnswer,

}: {

  block: QuestionBlock;

  questionNumber: number;

  questionCount: number;

  progress: number;

  isTransitioning: boolean;

  onAnswer: (payload: {

    optionId?: string;

    sliderValue?: number;

    textValue?: string;

  }) => void;

}) => (

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

        key={block.id}

        initial={{ opacity: 0, x: 20 }}

        animate={{ opacity: 1, x: 0 }}

        exit={{ opacity: 0, x: -20 }}

        transition={CARD_SPRING}

        className={styles.questionStage}

      >

        <h2 className={styles.questionText}>{block.prompt}</h2>



        {block.inputType === "multiple_choice" ? (

          <MultipleChoiceQuestion

            block={block}

            isTransitioning={isTransitioning}

            onSelect={(optionId) => onAnswer({ optionId })}

          />

        ) : null}



        {block.inputType === "slider" ? (

          <SliderQuestion

            block={block}

            isTransitioning={isTransitioning}

            onSubmit={(sliderValue) => onAnswer({ sliderValue })}

          />

        ) : null}



        {block.inputType === "text" ? (

          <TextQuestion

            block={block}

            isTransitioning={isTransitioning}

            onSubmit={(textValue) => onAnswer({ textValue })}

          />

        ) : null}

      </motion.div>

    </AnimatePresence>

  </div>

);



const ResultLayoutRenderer = ({

  layout,

  outcome,

  themeColor,

}: {

  layout: ResultLayoutKind;

  outcome: LegallySafeDiagnosisOutcome;

  themeColor: string;

}) => {

  const archetype = outcome.winningArchetype;

  const vector = outcome.academicVector;



  if (layout === "full_affirmation_chart") {

    return (

      <div className={styles.resultVisualSlot} aria-hidden={false}>

        <DiagnosisCompilerTraitChart academicVector={vector} themeColor={themeColor} />

        {archetype.affirmationLine ? (

          <p className={styles.affirmationCard}>{archetype.affirmationLine}</p>

        ) : (

          <div className={styles.affirmationPlaceholder} aria-hidden="true" />

        )}

      </div>

    );

  }



  if (layout === "compatibility_radar") {

    const entries = LEGAL_TRAIT_KEYS.slice(0, 4).map((traitKey) => [

      traitKey,

      vector[traitKey],

    ] as const);



    return (

      <div className={styles.resultVisualSlot}>

        <div className={styles.radarGrid} role="group" aria-label="特性レーダー">

          {entries.map(([traitKey, score]) => (

            <div key={traitKey} className={styles.radarCell}>

              <p className={styles.radarCellLabel}>{formatTraitLabel(traitKey)}</p>

              <p className={styles.radarCellValue}>{Math.round(score * 100) / 100}</p>

            </div>

          ))}

        </div>

        {archetype.compatibilityHint ? (

          <p className={styles.compatibilityHint}>{archetype.compatibilityHint}</p>

        ) : (

          <div className={styles.compatibilityPlaceholder} aria-hidden="true" />

        )}

      </div>

    );

  }



  return (

    <div className={styles.resultVisualSlot}>

      {archetype.affirmationLine ? (

        <p className={styles.affirmationCard}>{archetype.affirmationLine}</p>

      ) : (

        <div className={styles.affirmationPlaceholder} aria-hidden="true" />

      )}

      <DiagnosisCompilerTraitChart academicVector={vector} themeColor={themeColor} />

    </div>

  );

};



const ViralSharePanel = ({

  definition,

  outcome,

  presets,

}: {

  definition: PlugDiagnosisDefinition | BuilderDiagnosisDefinition;

  outcome: LegallySafeDiagnosisOutcome;

  presets: readonly ViralSharePreset[];

}) => {

  const [copiedId, setCopiedId] = useState<string | null>(null);



  const handlePreset = useCallback(

    async (preset: ViralSharePreset) => {

      const shareText = buildShareText(definition, outcome, preset);

      const shareUrl = buildShareUrl(definition);



      if (preset.kind === "x_twitter_card") {

        const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

        window.open(intent, "_blank", "noopener,noreferrer");

        return;

      }



      if (preset.kind === "native_share" && navigator.share) {

        try {

          await navigator.share({

            title: preset.cardTitle,

            text: shareText,

            url: shareUrl,

          });

        } catch {

          // user cancelled

        }

        return;

      }



      if (preset.kind === "copy_link" || preset.kind === "native_share") {

        const ok = await copyText(shareUrl);

        if (ok) {

          setCopiedId(preset.id);

          window.setTimeout(() => setCopiedId(null), 2000);

        }

        return;

      }



      if (preset.kind === "image_download") {

        window.print();

      }

    },

    [definition, outcome],

  );



  if (presets.length === 0) {

    return null;

  }



  return (

    <div className={styles.sharePanel} aria-label="結果をシェア">

      <p className={styles.shareLead}>結果をシェア</p>

      <div className={styles.shareActions}>

        {presets.map((preset) => (

          <button

            key={preset.id}

            type="button"

            className={styles.shareButton}

            onClick={() => void handlePreset(preset)}

          >

            {copiedId === preset.id ? (

              <Check className={styles.shareIcon} aria-hidden="true" />

            ) : preset.kind === "x_twitter_card" ? (

              <Share2 className={styles.shareIcon} aria-hidden="true" />

            ) : preset.kind === "image_download" ? (

              <Download className={styles.shareIcon} aria-hidden="true" />

            ) : preset.kind === "copy_link" ? (

              <Copy className={styles.shareIcon} aria-hidden="true" />

            ) : (

              <Share2 className={styles.shareIcon} aria-hidden="true" />

            )}

            {copiedId === preset.id ? "コピー済" : preset.label}

          </button>

        ))}

      </div>

    </div>

  );

};



export const DiagnosisCompiler = (props: DiagnosisCompilerProps) => {

  const programDefinition = resolveProgramDefinition(props);

  const isBuilderMode = isBuilderDiagnosisDefinition(programDefinition);



  const hydrateBuilderSeoFromDefinition = useUserStore(

    (state) => state.hydrateBuilderSeoFromDefinition,

  );



  const {

    phase,

    questionIndex,

    runtimeStep,

    isTransitioning,

    outcome,

    programSource,

    initProgram,

    initBuilderProgram,

    startProgram,

    submitAnswer,

    advanceFeedback,

    restartProgram,

  } = useDiagnosisCompilerStore(

    useShallow((state) => ({

      phase: state.phase,

      questionIndex: state.questionIndex,

      runtimeStep: state.runtimeStep,

      isTransitioning: state.isTransitioning,

      outcome: state.outcome,

      programSource: state.programSource,

      initProgram: state.initProgram,

      initBuilderProgram: state.initBuilderProgram,

      startProgram: state.startProgram,

      submitAnswer: state.submitAnswer,

      advanceFeedback: state.advanceFeedback,

      restartProgram: state.restartProgram,

    })),

  );



  const { questionNumber, questionCount, progress } = useDiagnosisCompilerStore(

    useShallow(selectCompilerProgress),

  );



  const plugDefinition = isBuilderMode ? null : (programDefinition as PlugDiagnosisDefinition);



  const questionBlocks = useMemo(

    () => (plugDefinition ? extractQuestionBlocks(plugDefinition) : []),

    [plugDefinition],

  );



  const currentPlugBlock = questionBlocks[questionIndex] ?? null;



  useEffect(() => {

    if (isBuilderMode) {

      initBuilderProgram(programDefinition as BuilderDiagnosisDefinition);

    } else {

      initProgram(programDefinition as PlugDiagnosisDefinition);

    }

  }, [programDefinition, isBuilderMode, initProgram, initBuilderProgram]);



  useEffect(() => {

    hydrateBuilderSeoFromDefinition(programDefinition);

  }, [programDefinition, hydrateBuilderSeoFromDefinition]);



  useEffect(() => {

    if (

      programSource === "builder" &&

      phase === "feedback" &&

      runtimeStep?.kind === "feedback" &&

      runtimeStep.block.autoAdvanceMs &&

      !isTransitioning

    ) {

      const timer = window.setTimeout(() => {

        advanceFeedback();

      }, runtimeStep.block.autoAdvanceMs);



      return () => window.clearTimeout(timer);

    }



    return undefined;

  }, [programSource, phase, runtimeStep, isTransitioning, advanceFeedback]);



  const handlePlugAnswer = useCallback(

    (payload: { optionId?: string; sliderValue?: number; textValue?: string }) => {

      if (!currentPlugBlock) {

        return;

      }



      submitAnswer({

        blockId: currentPlugBlock.id,

        ...payload,

      });

    },

    [currentPlugBlock, submitAnswer],

  );



  const handleBuilderAnswer = useCallback(

    (choiceId: string, choiceLabel: string) => {

      if (!runtimeStep || runtimeStep.kind !== "question") {

        return;

      }



      submitAnswer({

        blockId: runtimeStep.block.id,

        optionId: choiceId,

        choiceLabel,

      });

    },

    [runtimeStep, submitAnswer],

  );



  return (

    <div className={styles.shell}>

      <div className={styles.container}>

        {phase === "intro" ? (

          <DiagnosisCompilerIntro definition={programDefinition} onStart={startProgram} />

        ) : null}



        {phase === "questions" && programSource === "builder" && runtimeStep?.kind === "question" ? (

          <BuilderQuestionPanel

            step={runtimeStep}

            progress={progress}

            isTransitioning={isTransitioning}

            onAnswer={handleBuilderAnswer}

          />

        ) : null}



        {phase === "questions" && programSource === "plug" && currentPlugBlock ? (

          <CompilerQuestionPanel

            block={currentPlugBlock}

            questionNumber={questionNumber}

            questionCount={questionCount}

            progress={progress}

            isTransitioning={isTransitioning}

            onAnswer={handlePlugAnswer}

          />

        ) : null}



        {phase === "feedback" && runtimeStep?.kind === "feedback" ? (

          <FeedbackPanel

            step={runtimeStep}

            isTransitioning={isTransitioning}

            onContinue={advanceFeedback}

          />

        ) : null}



        {phase === "result" && outcome ? (
          <DiagnosisResultPage
            definition={programDefinition}
            outcome={outcome}
            onRestart={restartProgram}
          />
        ) : null}

      </div>

    </div>

  );

};

