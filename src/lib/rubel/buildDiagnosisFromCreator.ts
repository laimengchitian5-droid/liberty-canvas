import type {
  ActiveTherapyMode,
  AiTone,
  Diagnosis,
  PersonalityTrait,
  TraitVector,
} from "@/types/rubel";
import { createEmptyTraitVector, PERSONALITY_TRAITS } from "@/types/rubel";
import { inferCrossLingualKeywords } from "@/lib/rubel/i18n/constants";
import type { LocaleCode } from "@/types/rubel-i18n";

interface CreatorResultDraft {
  id: string;
  name: string;
  baselineProfile: TraitVector;
  tone: AiTone;
  activeTherapyMode: ActiveTherapyMode;
}

interface CreatorOptionDraft {
  id: string;
  text: string;
  traits: TraitVector;
}

interface CreatorQuestionDraft {
  id: string;
  text: string;
  options: CreatorOptionDraft[];
}

function traitsToModifiers(traits: TraitVector) {
  return PERSONALITY_TRAITS.map((trait) => ({
    trait,
    value: traits[trait],
  }));
}

export function buildDiagnosisFromCreator(input: {
  title: string;
  creatorName?: string;
  language: LocaleCode;
  results: CreatorResultDraft[];
  questions: CreatorQuestionDraft[];
}): Diagnosis {
  const diagnosisId = `rubel-${crypto.randomUUID().slice(0, 8)}`;
  const trimmedTitle = input.title.trim();

  return {
    id: diagnosisId,
    title: trimmedTitle,
    creatorName: input.creatorName?.trim() || "Anonymous Creator",
    language: input.language,
    searchKeywords: inferCrossLingualKeywords(trimmedTitle, input.language),
    totalSubmissions: 0,
    results: input.results.map((result) => ({
      id: result.id,
      name: result.name.trim(),
      baselineProfile: { ...result.baselineProfile },
      aiConfig: {
        tone: result.tone,
        activeTherapyMode: result.activeTherapyMode,
      },
    })),
    questions: input.questions
      .map((question) => ({
        id: question.id,
        text: question.text.trim(),
        options: question.options
          .map((option) => ({
            id: option.id,
            text: option.text.trim(),
            scoreModifier: traitsToModifiers(option.traits),
          }))
          .filter((option) => option.text.length > 0),
      }))
      .filter((question) => question.text.length > 0 && question.options.length >= 2),
  };
}

export function createDefaultResultDraft(index: number) {
  const profiles: TraitVector[] = [
    { openness: -2, empathy_need: 1, ego: 0 },
    { openness: 2, empathy_need: -1, ego: 1 },
  ];

  return {
    id: `result-${index + 1}`,
    name: index === 0 ? "Type Alpha" : "Type Beta",
    baselineProfile: profiles[index] ?? createEmptyTraitVector(),
    tone: "mentor" as AiTone,
    activeTherapyMode: "emotional_mirror" as ActiveTherapyMode,
  };
}

export function createDefaultOptionDraft(
  questionId: string,
  index: number,
): CreatorOptionDraft {
  return {
    id: `${questionId}-opt-${index + 1}`,
    text: "",
    traits: createEmptyTraitVector(),
  };
}

export function createDefaultQuestionDraft(): CreatorQuestionDraft {
  const id = `question-${crypto.randomUUID().slice(0, 8)}`;

  return {
    id,
    text: "",
    options: [createDefaultOptionDraft(id, 0), createDefaultOptionDraft(id, 1)],
  };
}

export type {
  CreatorOptionDraft,
  CreatorQuestionDraft,
  CreatorResultDraft,
  PersonalityTrait,
};
