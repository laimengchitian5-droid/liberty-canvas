/**
 * Rubel Canvas — shared pipeline contracts.
 * NO imports from satellite/, components/, or React.
 */
import type {
  ActiveTherapyMode,
  AiTone,
  CompiledRubelPrompt,
  Diagnosis,
  PlayOutcome,
  Result,
  TraitVector,
  VerbalizationAnchor,
} from "@/types/rubel";

export type { VerbalizationAnchor, PlayOutcome, Diagnosis, Result, TraitVector };

/** Where user input originated in the global funnel. */
export type IntakeSource = "satellite" | "quiz";

/**
 * Satellite SEO page → core engine handoff record.
 * Serialized to sessionStorage between /discover and /play routes.
 */
export interface SatelliteIntakeRecord {
  source: "satellite";
  locale: string;
  slug: string;
  keyword: string;
  promptText: string;
  userText: string;
  playDiagnosisId: string;
  createdAt: number;
}

/** Client write shape — `source` is injected by session store. */
export type SatelliteIntakeWritePayload = Omit<SatelliteIntakeRecord, "source">;

/** Quiz binary selection handoff (native play funnel). */
export interface QuizIntakeRecord {
  source: "quiz";
  questionText: string;
  chosenOptionText: string;
}

export type RubelIntakeRecord = SatelliteIntakeRecord | QuizIntakeRecord;

/**
 * Normalized payload consumed by Hugging Face prompt builder.
 * Single contract for satellite AND quiz funnels.
 */
export interface RubelEnginePayload {
  title: string;
  typeName: string;
  tone: string;
  empathyLevel: string;
  verbalizationAnchor: VerbalizationAnchor | null;
  compiledSystemPrompt: string;
  intakeSource: IntakeSource;
  keyword?: string;
}

export interface InjectionChatTurn {
  role: "user" | "assistant";
  content: string;
}

/** Client → /api/rubel/hf-chat */
export interface HfChatRequestContract {
  prompt: string;
  fallbackText: string;
}

/** /api/rubel/hf-chat → client */
export interface HfChatResponseContract {
  text: string;
  provider?:
    | "huggingface"
    | "fallback"
    | "anthropic"
    | "deepseek"
    | "openai";
  model?: string;
  error?: string;
}

/** Structured result after type-matrix processing. */
export interface TypeMatrixResult {
  outcome: PlayOutcome;
  profile: TraitVector;
  winningResult: Result;
  compiledPrompt: CompiledRubelPrompt;
}

export interface RubelAiPersonaLabels {
  tone: AiTone;
  activeTherapyMode: ActiveTherapyMode;
}

export const SATELLITE_INTAKE_STORAGE_KEY = "rubel-satellite-intake-v1";

/** @deprecated Use SATELLITE_INTAKE_STORAGE_KEY */
export const LANDING_INTAKE_STORAGE_KEY = SATELLITE_INTAKE_STORAGE_KEY;
