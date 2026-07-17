import type {
  ResultArchetype,
  ResultLayoutKind,
  ResultTemplateBlock,
  SeoTuningBlock,
  ViralShareBlock,
} from "@/types/diagnosisCompiler";
import type { PsychFrameworkId } from "@/lib/diagnosis/scoring/types";

/**
 * No-code builder block kinds — creators assemble these without touching code.
 * Typeform-style conversational flow with logic jumps and affirmation beats.
 */
export type BlockType =
  "CONVERSATIONAL_QUESTION" | "AI_INTERMEDIATE_FEEDBACK" | "CONDITIONAL_BRANCH";

/**
 * Creator-facing OCEAN trait axes — abstract vectors only, no scoring math exposed.
 * Maps internally to LibertyCanvas `LegalTraitKey` at compile time.
 */
export type OceanTraitKey =
  "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "neuroticism";

export const OCEAN_TRAIT_KEYS = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "neuroticism",
] as const satisfies readonly OceanTraitKey[];

/** Creator-safe scoring payload — partial OCEAN weights per choice. */
export type ScoringPayload = Readonly<Partial<Record<OceanTraitKey, number>>>;

export const BUILDER_CREATOR_TAGS = ["高校生向け", "推し活", "恋愛", "短時間"] as const;

export type BuilderCreatorTag = (typeof BUILDER_CREATOR_TAGS)[number] | string;

export interface ConversationalChoice {
  id: string;
  label: string;
  scores: ScoringPayload;
}

export interface ConversationalQuestionBlock {
  type: "CONVERSATIONAL_QUESTION";
  id: string;
  prompt: string;
  subPrompt?: string;
  choices: readonly ConversationalChoice[];
}

export interface AiIntermediateFeedbackBlock {
  type: "AI_INTERMEDIATE_FEEDBACK";
  id: string;
  /** Question block id that triggers this affirmation beat. */
  triggerAfterBlockId: string;
  /** Supports `{choice}` token replaced with the selected label. */
  affirmationTemplate: string;
  autoAdvanceMs?: number;
}

export interface ConditionalBranchRule {
  whenChoiceId: string;
  gotoBlockId: string;
}

export interface ConditionalBranchBlock {
  type: "CONDITIONAL_BRANCH";
  id: string;
  afterBlockId: string;
  rules: readonly ConditionalBranchRule[];
  defaultGotoBlockId: string;
}

export type BuilderBlock =
  ConversationalQuestionBlock | AiIntermediateFeedbackBlock | ConditionalBranchBlock;

export interface BuilderResultConfig {
  layout: ResultLayoutKind;
  results: readonly ResultArchetype[];
}

/**
 * Full no-code diagnosis definition — drag-and-drop assembled by creators.
 */
export interface BuilderDiagnosisDefinition {
  id: string;
  slug: string;
  /** Scoring framework — drives default weights and result layout. */
  frameworkId?: PsychFrameworkId;
  eyebrow: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  themeColor: string;
  creatorTags: readonly BuilderCreatorTag[];
  startBlockId: string;
  blocks: readonly BuilderBlock[];
  resultConfig: BuilderResultConfig;
  seoTuning?: SeoTuningBlock;
  viralShare?: ViralShareBlock;
}

/** Runtime step emitted by the conversational compiler — one screen per step. */
export type BuilderRuntimeStepKind = "question" | "feedback";

export interface BuilderRuntimeQuestionStep {
  kind: "question";
  block: ConversationalQuestionBlock;
  questionNumber: number;
  questionCount: number;
}

export interface BuilderRuntimeFeedbackStep {
  kind: "feedback";
  block: AiIntermediateFeedbackBlock;
  resolvedAffirmation: string;
  originQuestionId: string;
}

export type BuilderRuntimeStep = BuilderRuntimeQuestionStep | BuilderRuntimeFeedbackStep;

export type BuilderCompilerPhase = "intro" | "questions" | "feedback" | "result";

export interface BuilderCompilerAnswer {
  blockId: string;
  choiceId: string;
  choiceLabel: string;
  recordedAt: number;
}

export interface BuilderDiagnosisSeoContext {
  diagnosisId: string;
  slug: string;
  creatorTags: readonly BuilderCreatorTag[];
  viralKeywords: readonly string[];
  landingPath: string;
  title: string;
  description: string;
  ogImagePath: string;
}

export function isBuilderDiagnosisDefinition(
  value: unknown,
): value is BuilderDiagnosisDefinition {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BuilderDiagnosisDefinition>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.startBlockId === "string" &&
    Array.isArray(candidate.blocks) &&
    candidate.blocks.length > 0 &&
    typeof candidate.resultConfig === "object" &&
    candidate.resultConfig !== null
  );
}

export function isConversationalQuestionBlock(
  block: BuilderBlock,
): block is ConversationalQuestionBlock {
  return block.type === "CONVERSATIONAL_QUESTION";
}

export function isAiIntermediateFeedbackBlock(
  block: BuilderBlock,
): block is AiIntermediateFeedbackBlock {
  return block.type === "AI_INTERMEDIATE_FEEDBACK";
}

export function isConditionalBranchBlock(
  block: BuilderBlock,
): block is ConditionalBranchBlock {
  return block.type === "CONDITIONAL_BRANCH";
}

export function extractBuilderQuestionBlocks(
  definition: BuilderDiagnosisDefinition,
): ConversationalQuestionBlock[] {
  return definition.blocks.filter(isConversationalQuestionBlock);
}

export function toResultTemplateBlock(
  config: BuilderResultConfig,
  id = "builder-result-template",
): ResultTemplateBlock {
  return {
    kind: "RESULT_TEMPLATE_BLOCK",
    id,
    layout: config.layout,
    results: config.results,
  };
}
