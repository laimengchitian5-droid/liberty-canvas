export enum TestType {
  MBTI = "MBTI",
  BIG5 = "BIG5",
  ENNEAGRAM = "ENNEAGRAM",
  DISC = "DISC",
  KRAEPELIN = "KRAEPELIN",
}

export type AppType = "assessment" | "ai_agent" | "interactive_media" | "custom_tool";

export interface Question {
  id: string;
  text: string;
  type: TestType;
  dimension: string;
  weight: number;
}

export interface ScoringResult {
  testId: string;
  archetype: string;
  scores: Record<string, number>;
  radarData: Array<{ name: string; value: number }>;
  isReliable: boolean;
}

export interface AIContextState {
  syncTimestamp: number;
  activePersona: string;
  systemPromptOverride: string;
}

export interface AppResultMapping {
  archetype: string;
  minScore: number;
  maxScore: number;
  description: string;
}

export interface AIAgentConfig {
  systemPromptOverride: string;
  responseGuidelines: string;
}

export interface UniversalAppDefinition {
  id: string;
  title: string;
  description: string;
  authorId: string;
  appType: AppType;
  questions: Question[];
  resultsMapping: AppResultMapping[];
  aiAgent?: AIAgentConfig;
}

export interface CreateUniversalAppInput {
  title: string;
  description: string;
  authorId: string;
  appType: AppType;
  questions?: Question[];
  resultsMapping?: AppResultMapping[];
  systemPromptOverride?: string;
  responseGuidelines?: string;
}

export interface StoredUniversalApp extends UniversalAppDefinition {
  createdAt: string;
  updatedAt: string;
}

export interface IndexingAuditEntry {
  id: string;
  quizId: string;
  url: string;
  status: "pending" | "failed" | "success";
  attemptCount: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnswerLogEntry {
  questionId: string;
  value: number;
  recordedAt: number;
}

export interface ActiveQuestionnaire {
  testId: string;
  testType: TestType;
  questions: Question[];
  currentIndex: number;
  startedAt: number;
}

export interface PlatformTelemetry {
  sessionStartedAt: number;
  lastInteractionAt: number;
}

export const INITIAL_AI_CONTEXT: AIContextState = {
  syncTimestamp: 0,
  activePersona: "neutral-assistant",
  systemPromptOverride: "",
};

export const DEFAULT_APP_TYPE: AppType = "assessment";

export type KraepelinFocusPattern =
  "highly_consistent" | "fluctuating" | "easily_fatigued";

export interface KraepelinAttemptMetric {
  index: number;
  leftDigit: number;
  rightDigit: number;
  expectedSum: number;
  userSum: number;
  isCorrect: boolean;
  reactionMs: number;
  elapsedMs: number;
}

export interface KraepelinTimeSliceMetric {
  sliceIndex: number;
  startMs: number;
  endMs: number;
  attempted: number;
  correct: number;
  accuracy: number;
  medianReactionMs: number;
}

export interface KraepelinPerformanceMatrix {
  testId: string;
  durationMs: number;
  startedAt: number;
  completedAt: number;
  totalAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  overallMedianReactionMs: number;
  fatigueIndex: number;
  consistencyIndex: number;
  focusPattern: KraepelinFocusPattern;
  attempts: KraepelinAttemptMetric[];
  timeSlices: KraepelinTimeSliceMetric[];
}

export const INCLUSIVE_OUTPUT_POLICY = {
  zeroTaboo:
    "You are an inclusive, universally unbiased AI. When formatting lucky_items, compatibility_descriptions, and personality outputs, absolutely prohibit any reference to localized alcohol/bar culture, specific religious dietaries (pork, non-halal definitions), or region-sensitive geopolitical and historical terminology.",
  numericalNeutrality:
    "To eliminate numeric cultural friction, do not structure outputs around localized unlucky numbers (e.g., 4, 9, 13, 17, 39) as prominent solitary grading statistics. Deliver results using direct percentile structures (0-100%).",
  universalReferences:
    "Use universal, accessible references only (notebooks, nature, ambient light, quiet spaces, learning tools).",
  identityNeutral:
    "Use abstract, identity-neutral metaphors. Do not assume gender, ethnicity, nationality, or religious affiliation.",
} as const;

export const PERCENTILE_SCORE_RANGE = {
  min: 0,
  max: 100,
} as const;

export interface InclusiveScoringPresentation {
  presentation: "percentile";
  min: number;
  max: number;
}

export const DEFAULT_SCORING_PRESENTATION: InclusiveScoringPresentation = {
  presentation: "percentile",
  min: PERCENTILE_SCORE_RANGE.min,
  max: PERCENTILE_SCORE_RANGE.max,
};

/** @deprecated Use UniversalAppDefinition */
export type CustomQuiz = UniversalAppDefinition;

/** @deprecated Use AppResultMapping */
export type QuizResultMapping = AppResultMapping;

/** @deprecated Use CreateUniversalAppInput */
export type CreateCustomQuizInput = CreateUniversalAppInput;

/** @deprecated Use StoredUniversalApp */
export type StoredCustomQuiz = StoredUniversalApp;
