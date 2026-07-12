export type DiagnosisElementKind =
  | "QUESTION_BLOCK"
  | "SEO_TUNING_BLOCK"
  | "RESULT_TEMPLATE_BLOCK"
  | "VIRAL_SHARE_BLOCK";

export type QuestionInputType = "multiple_choice" | "slider" | "text";

export type ResultLayoutKind =
  | "full_affirmation_chart"
  | "character_archetype_card"
  | "compatibility_radar";

export type ViralSharePresetKind =
  | "x_twitter_card"
  | "image_download"
  | "native_share"
  | "copy_link";

import type {
  AcademicTraitVector,
  LegalTraitKey,
} from "@/lib/diagnosis/academicTraitVector";

export type { AcademicTraitVector, LegalTraitKey };

/** Academic trait weights only — no proprietary test category keys. */
export type TraitWeightMap = Readonly<Partial<Record<LegalTraitKey, number>>>;

export interface MultipleChoiceOption {
  id: string;
  label: string;
  traitWeights: TraitWeightMap;
}

export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  traitCurve: TraitWeightMap;
}

export interface TextInputConfig {
  placeholder: string;
  maxLength: number;
  traitBonus: TraitWeightMap;
}

export interface QuestionBlock {
  kind: "QUESTION_BLOCK";
  id: string;
  prompt: string;
  inputType: QuestionInputType;
  options?: readonly MultipleChoiceOption[];
  slider?: SliderConfig;
  textInput?: TextInputConfig;
}

export interface SeoTuningBlock {
  kind: "SEO_TUNING_BLOCK";
  id: string;
  targetDemographics: readonly string[];
  desireTags: readonly string[];
  landingPath: string;
  titleTemplate: string;
  descriptionTemplate: string;
}

export interface ResultArchetype {
  id: string;
  title: string;
  subtitle: string;
  analysis: string;
  themeColor: string;
  traitProfile: TraitWeightMap;
  affirmationLine?: string;
  compatibilityHint?: string;
}

export interface ResultTemplateBlock {
  kind: "RESULT_TEMPLATE_BLOCK";
  id: string;
  layout: ResultLayoutKind;
  results: readonly ResultArchetype[];
}

export interface ViralSharePreset {
  id: string;
  kind: ViralSharePresetKind;
  label: string;
  hashtag: string;
  cardTitle: string;
  cardDescription: string;
}

export interface ViralShareBlock {
  kind: "VIRAL_SHARE_BLOCK";
  id: string;
  presets: readonly ViralSharePreset[];
}

export type DiagnosisElement =
  | QuestionBlock
  | SeoTuningBlock
  | ResultTemplateBlock
  | ViralShareBlock;

export interface PlugDiagnosisDefinition {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  themeColor: string;
  /** Canonical academic vector keys — same set for every plug diagnosis. */
  traitIds: readonly LegalTraitKey[];
  elements: readonly DiagnosisElement[];
}

export type CompilerPhase = "intro" | "questions" | "result";

export interface CompilerAnswer {
  blockId: string;
  optionId?: string;
  sliderValue?: number;
  textValue?: string;
  recordedAt: number;
}

export interface CompiledDiagnosisOutcome {
  diagnosisId: string;
  traitScores: AcademicTraitVector;
  winningArchetype: ResultArchetype;
  resultLayout: ResultLayoutKind;
  viralPresets: readonly ViralSharePreset[];
  seoTags: readonly string[];
  isComplete: boolean;
  answeredCount: number;
  totalQuestions: number;
}

/** Legally insulated outcome: academic vector + LibertyCanvas proprietary synthesis. */
export interface LegallySafeDiagnosisOutcome extends CompiledDiagnosisOutcome {
  academicVector: AcademicTraitVector;
  dominantTraits: readonly LegalTraitKey[];
}

export interface PlugDiagnosisAdviceRequestBody {
  mode: "plug";
  slug: string;
  diagnosisTitle: string;
  archetypeTitle: string;
  archetypeAnalysis: string;
  planetNickname: string;
  planetCoreStatus: string;
  cosmicStrengths: string;
  factorSummary: Readonly<Record<string, number>>;
}
