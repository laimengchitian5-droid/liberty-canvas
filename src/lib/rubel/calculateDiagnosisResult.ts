import type {
  Answer,
  Diagnosis,
  Option,
  PlayOutcome,
  Result,
  TraitVector,
  VerbalizationAnchor,
} from "@/types/rubel";
import { createEmptyTraitVector, PERSONALITY_TRAITS } from "@/types/rubel";
import { compileSystemPrompt } from "@/lib/rubel/compileSystemPrompt";

function buildOptionLookup(diagnosis: Diagnosis): Map<string, Option> {
  const lookup = new Map<string, Option>();

  for (const question of diagnosis.questions) {
    for (const option of question.options) {
      lookup.set(option.id, option);
    }
  }

  return lookup;
}

export function buildVerbalizationAnchor(
  diagnosis: Diagnosis,
  userAnswers: Answer[],
): VerbalizationAnchor | null {
  if (userAnswers.length === 0) {
    return null;
  }

  const lastAnswer = userAnswers[userAnswers.length - 1];
  const question = diagnosis.questions.find(
    (entry) => entry.id === lastAnswer.questionId,
  );

  if (!question) {
    return null;
  }

  const option = question.options.find((entry) => entry.id === lastAnswer.optionId);

  if (!option) {
    return null;
  }

  return {
    questionText: question.text,
    chosenOptionText: option.text,
  };
}

/** Instant binary split: option index maps directly to result type (16P-style snap). */
function tryInstantBinaryResult(
  diagnosis: Diagnosis,
  userAnswers: Answer[],
): Result | null {
  if (diagnosis.questions.length !== 1 || userAnswers.length !== 1) {
    return null;
  }

  const question = diagnosis.questions[0];
  const answer = userAnswers[0];

  if (answer.questionId !== question.id) {
    return null;
  }

  const optionIndex = question.options.findIndex(
    (option) => option.id === answer.optionId,
  );

  if (optionIndex < 0) {
    return null;
  }

  if (diagnosis.results.length >= 2 && question.options.length >= 2) {
    return diagnosis.results[Math.min(optionIndex, diagnosis.results.length - 1)];
  }

  return null;
}

export function accumulateTraitProfile(
  diagnosis: Diagnosis,
  userAnswers: Answer[],
): TraitVector {
  const profile = createEmptyTraitVector();
  const optionLookup = buildOptionLookup(diagnosis);

  for (const answer of userAnswers) {
    const option = optionLookup.get(answer.optionId);

    if (!option) {
      continue;
    }

    for (const modifier of option.scoreModifier) {
      profile[modifier.trait] += modifier.value;
    }
  }

  return profile;
}

function traitDistance(a: TraitVector, b: TraitVector): number {
  return PERSONALITY_TRAITS.reduce((sum, trait) => {
    const delta = a[trait] - b[trait];
    return sum + delta * delta;
  }, 0);
}

function resolveWinningResult(
  diagnosis: Diagnosis,
  profile: TraitVector,
): { winningResult: Result; distance: number } {
  if (diagnosis.results.length === 0) {
    throw new Error("Diagnosis must define at least one Result");
  }

  let winningResult = diagnosis.results[0];
  let distance = traitDistance(profile, winningResult.baselineProfile);

  for (const result of diagnosis.results.slice(1)) {
    const nextDistance = traitDistance(profile, result.baselineProfile);

    if (nextDistance < distance) {
      winningResult = result;
      distance = nextDistance;
    }
  }

  return { winningResult, distance };
}

export function calculateDiagnosisResult(
  diagnosis: Diagnosis,
  userAnswers: Answer[],
): PlayOutcome {
  const verbalizationAnchor = buildVerbalizationAnchor(diagnosis, userAnswers);
  const instantResult = tryInstantBinaryResult(diagnosis, userAnswers);
  const profile = accumulateTraitProfile(diagnosis, userAnswers);

  const { winningResult, distance } = instantResult
    ? { winningResult: instantResult, distance: 0 }
    : resolveWinningResult(diagnosis, profile);

  const compiledPrompt = compileSystemPrompt(winningResult, profile);

  return {
    profile,
    winningResult,
    distance,
    compiledPrompt,
    verbalizationAnchor,
  };
}

export const calculateDiagnosisResultLegacy = calculateDiagnosisResult;
