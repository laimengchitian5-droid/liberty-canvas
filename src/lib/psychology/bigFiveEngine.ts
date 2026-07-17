import type { LandingLocale } from "@/lib/landing/landingLocales";
import type {
  BigFiveLocaleCopy,
  OceanDimension,
  OceanScores,
  PsychQuizResult,
} from "@/lib/psychology/types";

export type BigFiveAnswer = "low" | "high";

export interface BigFiveAnswerRecord {
  dimension: OceanDimension;
  choice: BigFiveAnswer;
  questionText: string;
  chosenText: string;
}

export function scoreBigFive(answers: BigFiveAnswerRecord[]): OceanScores {
  const scores: OceanScores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };

  for (const answer of answers) {
    scores[answer.dimension] += answer.choice === "high" ? 1 : 0;
  }

  return scores;
}

export function resolveDominantTrait(scores: OceanScores): OceanDimension {
  const entries = Object.entries(scores) as Array<[OceanDimension, number]>;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? "openness";
}

export function buildBigFiveResult(
  copy: BigFiveLocaleCopy,
  answers: BigFiveAnswerRecord[],
): PsychQuizResult {
  const scores = scoreBigFive(answers);
  const dominant = resolveDominantTrait(scores);
  const lastAnswer = answers[answers.length - 1];
  const traitLabel = copy.traitLabels[dominant];
  const scoreValue = scores[dominant];

  const detailLines = (Object.entries(scores) as Array<[OceanDimension, number]>).map(
    ([dimension, value]) => `${copy.traitLabels[dimension]}: ${value}/1`,
  );

  return {
    typeName: `${traitLabel} ${scoreValue >= 1 ? "High" : "Balanced"} Type`,
    summary: `${copy.resultPrefix}: ${traitLabel} (${scoreValue}/1)`,
    anchorQuestion: lastAnswer?.questionText ?? copy.questions[0].prompt,
    anchorAnswer: lastAnswer?.chosenText ?? copy.questions[0].optionHigh,
    detailLines,
    oceanScores: scores,
  };
}

export function formatBigFiveShareText(
  copy: BigFiveLocaleCopy,
  result: PsychQuizResult,
  locale: LandingLocale,
): string {
  const url =
    locale === "ja"
      ? "https://liberty-canvas.vercel.app/diagnosis/big-five"
      : `https://liberty-canvas.vercel.app/diagnosis/big-five?lang=${locale}`;

  return `${result.typeName} — ${copy.keyword}\n${result.summary}\n${url}\n#LibertyCanvas #BigFive #OCEAN`;
}
