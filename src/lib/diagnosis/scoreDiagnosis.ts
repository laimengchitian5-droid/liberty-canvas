import { DIAGNOSIS_RESULT_CATALOG } from "@/lib/diagnosis/resultCatalog";
import type {
  CategoryScoreMap,
  DiagnosticAnswer,
  DiagnosticQuestion,
  DiagnosisEvaluation,
  PersonalityCategory,
} from "@/types/diagnosis";
import { PERSONALITY_CATEGORIES } from "@/types/diagnosis";

function createEmptyScores(): CategoryScoreMap {
  return {
    empathy: 0,
    logic: 0,
    creativity: 0,
    leadership: 0,
  };
}

function resolveDominantCategory(scores: CategoryScoreMap): PersonalityCategory {
  let dominant: PersonalityCategory = "empathy";
  let highest = -Infinity;

  for (const category of PERSONALITY_CATEGORIES) {
    const value = scores[category];

    if (value > highest) {
      highest = value;
      dominant = category;
    }
  }

  return dominant;
}

export function scoreDiagnosis(
  questions: DiagnosticQuestion[],
  answers: DiagnosticAnswer[],
): DiagnosisEvaluation {
  const scores = createEmptyScores();
  const questionMap = new Map(questions.map((question) => [question.id, question]));

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);

    if (!question) {
      continue;
    }

    const option = question.options.find((entry) => entry.id === answer.optionId);

    if (!option) {
      continue;
    }

    for (const category of PERSONALITY_CATEGORIES) {
      scores[category] += option.scores[category];
    }
  }

  const dominantCategory = resolveDominantCategory(scores);
  const result = DIAGNOSIS_RESULT_CATALOG[dominantCategory];

  return {
    scores,
    dominantCategory,
    result,
    isComplete: answers.length >= questions.length,
    answeredCount: answers.length,
    totalQuestions: questions.length,
  };
}
