import type { AnswerLogEntry, Question, ScoringResult } from "@/types/platform";

type MbtiLetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

const PAIRS: Array<[MbtiLetter, MbtiLetter]> = [
  ["E", "I"],
  ["S", "N"],
  ["T", "F"],
  ["J", "P"],
];

function buildLetterScores(
  questions: Question[],
  answerLog: AnswerLogEntry[],
): Record<MbtiLetter, number> {
  const scores: Record<MbtiLetter, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  const questionMap = new Map(questions.map((question) => [question.id, question]));

  for (const answer of answerLog) {
    const question = questionMap.get(answer.questionId);

    if (!question) {
      continue;
    }

    const letter = question.dimension.toUpperCase() as MbtiLetter;

    if (letter in scores) {
      scores[letter] += answer.value * question.weight;
    }
  }

  return scores;
}

function resolveMbtiArchetype(scores: Record<MbtiLetter, number>): string {
  return PAIRS.map(([left, right]) =>
    scores[left] >= scores[right] ? left : right,
  ).join("");
}

function evaluateReliability(
  questions: Question[],
  answerLog: AnswerLogEntry[],
): boolean {
  if (answerLog.length < questions.length) {
    return false;
  }

  const neutralCount = answerLog.filter((answer) => answer.value === 0).length;
  const neutralRatio = neutralCount / answerLog.length;
  const uniqueValues = new Set(answerLog.map((answer) => answer.value)).size;

  return neutralRatio <= 0.5 && uniqueValues >= 3;
}

function toRadarData(scores: Record<MbtiLetter, number>) {
  return PAIRS.map(([left, right]) => {
    const leftScore = Math.max(0, scores[left]);
    const rightScore = Math.max(0, scores[right]);
    const total = leftScore + rightScore || 1;
    const dominant = leftScore >= rightScore ? left : right;
    const dominance = (Math.max(leftScore, rightScore) / total) * 100;

    return {
      name: dominant,
      value: Number(dominance.toFixed(1)),
    };
  });
}

export function scoreMbtiQuestionnaire(params: {
  testId: string;
  questions: Question[];
  answerLog: AnswerLogEntry[];
}): ScoringResult {
  const letterScores = buildLetterScores(params.questions, params.answerLog);
  const archetype = resolveMbtiArchetype(letterScores);
  const isReliable = evaluateReliability(params.questions, params.answerLog);

  const pairScores = Object.fromEntries(
    PAIRS.flatMap(([left, right]) => [
      [`${left}/${right}`, Number((letterScores[left] - letterScores[right]).toFixed(1))],
      [left, Number(letterScores[left].toFixed(1))],
      [right, Number(letterScores[right].toFixed(1))],
    ]),
  );

  return {
    testId: params.testId,
    archetype,
    scores: pairScores,
    radarData: toRadarData(letterScores),
    isReliable,
  };
}
