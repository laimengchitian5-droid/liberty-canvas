import type { LandingLocale } from "@/lib/landing/landingLocales";

export type PsychTopicSlug = "big-five" | "enneagram";

export type OceanDimension =
  "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "neuroticism";

export interface OceanScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface BigFiveQuestion {
  dimension: OceanDimension;
  prompt: string;
  optionLow: string;
  optionHigh: string;
}

export interface EnneagramTypeDefinition {
  typeNumber: number;
  name: string;
  tagline: string;
  description: string;
}

export interface PsychPageCopy {
  locale: LandingLocale;
  keyword: string;
  headline: string;
  subhead: string;
  submitLabel: string;
  trustLine: string;
  revealTitle: string;
  chatPlaceholder: string;
  shareLabel: string;
  retakeLabel: string;
  typingLabel: string;
  faq: Array<{ question: string; answer: string }>;
}

export interface BigFiveLocaleCopy extends PsychPageCopy {
  questions: BigFiveQuestion[];
  traitLabels: Record<OceanDimension, string>;
  resultPrefix: string;
}

export interface EnneagramLocaleCopy extends PsychPageCopy {
  promptLabel: string;
  types: EnneagramTypeDefinition[];
}

export interface PsychQuizResult {
  typeName: string;
  summary: string;
  anchorQuestion: string;
  anchorAnswer: string;
  detailLines: string[];
  oceanScores?: OceanScores;
  enneagramTypeNumber?: number;
}
