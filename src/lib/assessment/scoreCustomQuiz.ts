import { scoreMbtiQuestionnaire } from "@/lib/assessment/scoreQuestionnaire";
import {
  TestType,
  type AnswerLogEntry,
  type Question,
  type QuizResultMapping,
  type ScoringResult,
} from "@/types/platform";

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

function resolveMappedArchetype(
  totalScore: number,
  resultsMapping: QuizResultMapping[],
): QuizResultMapping {
  const matched = resultsMapping.find(
    (result) => totalScore >= result.minScore && totalScore <= result.maxScore,
  );

  if (matched) {
    return matched;
  }

  const sorted = [...resultsMapping].sort(
    (left, right) =>
      Math.abs(totalScore - (left.minScore + left.maxScore) / 2) -
      Math.abs(totalScore - (right.minScore + right.maxScore) / 2),
  );

  return sorted[0] ?? resultsMapping[0];
}

function scoreWeightedTotal(
  questions: Question[],
  answerLog: AnswerLogEntry[],
): number {
  const questionMap = new Map(
    questions.map((question) => [question.id, question]),
  );

  let totalScore = 0;

  for (const answer of answerLog) {
    const question = questionMap.get(answer.questionId);

    if (!question) {
      continue;
    }

    totalScore += (answer.value + 3) * question.weight;
  }

  return Number(totalScore.toFixed(1));
}

export function scoreCustomQuiz(params: {
  testId: string;
  questions: Question[];
  answerLog: AnswerLogEntry[];
  resultsMapping: QuizResultMapping[];
}): ScoringResult {
  const { testId, questions, answerLog, resultsMapping } = params;

  if (questions.length === 0 || resultsMapping.length === 0) {
    return {
      testId,
      archetype: "Unknown",
      scores: {},
      radarData: [],
      isReliable: false,
    };
  }

  const isAllMbti = questions.every(
    (question) => question.type === TestType.MBTI,
  );

  if (isAllMbti) {
    return scoreMbtiQuestionnaire({ testId, questions, answerLog });
  }

  const totalScore = scoreWeightedTotal(questions, answerLog);
  const mapping = resolveMappedArchetype(totalScore, resultsMapping);
  const isReliable = evaluateReliability(questions, answerLog);

  return {
    testId,
    archetype: mapping.archetype,
    scores: {
      total: totalScore,
      minRange: mapping.minScore,
      maxRange: mapping.maxScore,
    },
    radarData: resultsMapping.map((result) => ({
      name: result.archetype,
      value:
        totalScore >= result.minScore && totalScore <= result.maxScore
          ? 100
          : Math.max(
              0,
              100 -
                Math.abs(
                  totalScore - (result.minScore + result.maxScore) / 2,
                ),
            ),
    })),
    isReliable,
  };
}

export function findResultDescription(
  archetype: string,
  resultsMapping: QuizResultMapping[],
): string {
  const match = resultsMapping.find((result) => result.archetype === archetype);
  return match?.description ?? "";
}
