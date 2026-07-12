import type { LocaleCode } from "@/types/rubel-i18n";

export type { LocaleCode, LocalizedDiagnosisMeta, PlayLocalizationPhase, PlayLocalizationState, SearchResult } from "@/types/rubel-i18n";
export {
  DEFAULT_LOCALE,
  LOCALE_FLAGS,
  LOCALE_LABELS,
  RUBEL_LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  detectBrowserLocale,
  isLocaleCode,
  resolveLocale,
} from "@/types/rubel-i18n";

export type PersonalityTrait = "openness" | "empathy_need" | "ego";

export type AiTone = "gal" | "mentor" | "tsundere" | "princess";

export type ActiveTherapyMode =
  | "unconditional_praise"
  | "strict_coaching"
  | "emotional_mirror";

export interface TraitVector {
  openness: number;
  empathy_need: number;
  ego: number;
}

export interface ScoreModifier {
  trait: PersonalityTrait;
  value: number;
}

export interface AIConfig {
  tone: AiTone;
  activeTherapyMode: ActiveTherapyMode;
}

export interface Result {
  id: string;
  name: string;
  baselineProfile: TraitVector;
  aiConfig: AIConfig;
}

export interface Option {
  id: string;
  text: string;
  scoreModifier: ScoreModifier[];
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
}

export interface Diagnosis {
  id: string;
  title: string;
  creatorName: string;
  language: LocaleCode;
  searchKeywords: string[];
  totalSubmissions: number;
  questions: Question[];
  results: Result[];
  /** Optional preset id when compiled via Dify-style builder */
  personaPresetId?: string;
}

export interface Answer {
  questionId: string;
  optionId: string;
}

export interface VerbalizationAnchor {
  questionText: string;
  chosenOptionText: string;
}

export interface PlayOutcome {
  profile: TraitVector;
  winningResult: Result;
  distance: number;
  compiledPrompt: CompiledRubelPrompt;
  verbalizationAnchor: VerbalizationAnchor | null;
}

export interface CompiledRubelPrompt {
  systemPrompt: string;
  personaLabel: string;
  openingUserMessage: string;
}

export type RubelQuizPhase = "idle" | "active" | "transitioning" | "complete";

export interface RubelQuizSessionState {
  phase: RubelQuizPhase;
  questionIndex: number;
  answers: Answer[];
  outcome: PlayOutcome | null;
}

export interface HubDiagnosisCard {
  id: string;
  title: string;
  creatorName: string;
  creatorInitials: string;
  creatorAccent: string;
  language: LocaleCode;
  originFlag: string;
  globalReachLabel: string;
  searchKeywords: string[];
  totalSubmissions: number;
  questionCount: number;
  resultCount: number;
  trendingLabel: string;
  href: string;
}

export const PERSONALITY_TRAITS: readonly PersonalityTrait[] = [
  "openness",
  "empathy_need",
  "ego",
] as const;

export const TRAIT_LABELS: Record<PersonalityTrait, string> = {
  openness: "Openness",
  empathy_need: "Empathy Need",
  ego: "Ego",
};

export function createEmptyTraitVector(): TraitVector {
  return { openness: 0, empathy_need: 0, ego: 0 };
}
