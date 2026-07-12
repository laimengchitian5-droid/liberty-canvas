import { describe, expect, it } from "vitest";
import { scoreDiagnosis } from "@/lib/diagnosis/scoreDiagnosis";
import { SAMPLE_DIAGNOSTIC_QUESTIONS } from "@/lib/diagnosis/sampleQuestions";
import { DIAGNOSIS_RESULT_CATALOG } from "@/lib/diagnosis/resultCatalog";
import type { DiagnosticAnswer } from "@/types/diagnosis";

function answer(questionId: string, optionId: string): DiagnosticAnswer {
  return {
    questionId,
    optionId,
    selectedAt: Date.now(),
  };
}

describe("scoreDiagnosis", () => {
  it("returns zero scores and empathy dominant when no answers are provided", () => {
    const evaluation = scoreDiagnosis(SAMPLE_DIAGNOSTIC_QUESTIONS, []);

    expect(evaluation.scores).toEqual({
      empathy: 0,
      logic: 0,
      creativity: 0,
      leadership: 0,
    });
    expect(evaluation.dominantCategory).toBe("empathy");
    expect(evaluation.result).toEqual(DIAGNOSIS_RESULT_CATALOG.empathy);
    expect(evaluation.isComplete).toBe(false);
    expect(evaluation.answeredCount).toBe(0);
    expect(evaluation.totalQuestions).toBe(SAMPLE_DIAGNOSTIC_QUESTIONS.length);
  });

  it("selects empathy when empathy-weighted answers dominate", () => {
    const answers = SAMPLE_DIAGNOSTIC_QUESTIONS.map((question) =>
      answer(question.id, `${question.id}-a`),
    );

    const evaluation = scoreDiagnosis(SAMPLE_DIAGNOSTIC_QUESTIONS, answers);

    expect(evaluation.dominantCategory).toBe("empathy");
    expect(evaluation.result.id).toBe("empathy-harmonizer");
    expect(evaluation.scores.empathy).toBeGreaterThan(evaluation.scores.logic);
    expect(evaluation.isComplete).toBe(true);
  });

  it("selects logic when logic-weighted answers dominate", () => {
    const answers = SAMPLE_DIAGNOSTIC_QUESTIONS.map((question) =>
      answer(question.id, `${question.id}-b`),
    );

    const evaluation = scoreDiagnosis(SAMPLE_DIAGNOSTIC_QUESTIONS, answers);

    expect(evaluation.dominantCategory).toBe("logic");
    expect(evaluation.result.id).toBe("logic-clarity");
    expect(evaluation.scores.logic).toBeGreaterThan(evaluation.scores.empathy);
  });

  it("ignores answers for unknown questions or options", () => {
    const evaluation = scoreDiagnosis(SAMPLE_DIAGNOSTIC_QUESTIONS, [
      answer("missing-question", "missing-option"),
      answer("q1", "missing-option"),
    ]);

    expect(evaluation.scores).toEqual({
      empathy: 0,
      logic: 0,
      creativity: 0,
      leadership: 0,
    });
    expect(evaluation.answeredCount).toBe(2);
    expect(evaluation.isComplete).toBe(false);
  });

  it("breaks ties using category order (empathy first)", () => {
    const evaluation = scoreDiagnosis(
      [
        {
          id: "tie-q",
          index: 0,
          text: "tie breaker",
          category: "logic",
          options: [
            {
              id: "tie-a",
              text: "balanced",
              scores: {
                empathy: 2,
                logic: 2,
                creativity: 2,
                leadership: 2,
              },
            },
          ],
        },
      ],
      [answer("tie-q", "tie-a")],
    );

    expect(evaluation.dominantCategory).toBe("empathy");
  });
});
