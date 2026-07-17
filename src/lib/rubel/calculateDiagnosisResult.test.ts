import { describe, expect, it } from "vitest";
import { calculateDiagnosisResult } from "@/lib/rubel/calculateDiagnosisResult";
import { SAMPLE_CAT_DOG_DIAGNOSIS } from "@/lib/rubel/seedDiagnoses";

describe("calculateDiagnosisResult", () => {
  it("returns first result when no answers are provided", () => {
    const outcome = calculateDiagnosisResult(SAMPLE_CAT_DOG_DIAGNOSIS, []);

    expect(outcome.profile).toEqual({
      openness: 0,
      empathy_need: 0,
      ego: 0,
    });
    expect(outcome.winningResult.id).toBe("result-cat");
  });

  it("selects cat result when cat-weighted answers dominate", () => {
    const outcome = calculateDiagnosisResult(SAMPLE_CAT_DOG_DIAGNOSIS, [
      { questionId: "q-weekend", optionId: "q-weekend-a" },
      { questionId: "q-morning", optionId: "q-morning-a" },
      { questionId: "q-social", optionId: "q-social-a" },
    ]);

    expect(outcome.winningResult.id).toBe("result-cat");
    expect(outcome.profile.openness).toBeLessThan(0);
  });

  it("selects dog result when dog-weighted answers dominate", () => {
    const outcome = calculateDiagnosisResult(SAMPLE_CAT_DOG_DIAGNOSIS, [
      { questionId: "q-weekend", optionId: "q-weekend-b" },
      { questionId: "q-morning", optionId: "q-morning-b" },
      { questionId: "q-gift", optionId: "q-gift-b" },
    ]);

    expect(outcome.winningResult.id).toBe("result-dog");
    expect(outcome.profile.empathy_need).toBeGreaterThan(0);
  });

  it("ignores unknown option ids", () => {
    const outcome = calculateDiagnosisResult(SAMPLE_CAT_DOG_DIAGNOSIS, [
      { questionId: "q-weekend", optionId: "unknown-option" },
    ]);

    expect(outcome.profile).toEqual({
      openness: 0,
      empathy_need: 0,
      ego: 0,
    });
  });

  it("includes compiled prompt and verbalization anchor in outcome", () => {
    const outcome = calculateDiagnosisResult(SAMPLE_CAT_DOG_DIAGNOSIS, [
      { questionId: "q-weekend", optionId: "q-weekend-a" },
    ]);

    expect(outcome.compiledPrompt.systemPrompt).toContain(outcome.winningResult.name);
    expect(outcome.verbalizationAnchor?.chosenOptionText).toBeTruthy();
    expect(outcome.compiledPrompt.openingUserMessage).toContain("[DIAGNOSIS_COMPLETE]");
  });

  it("instant binary maps option A to first result on single-question diagnosis", () => {
    const singleQuestion = {
      ...SAMPLE_CAT_DOG_DIAGNOSIS,
      questions: [SAMPLE_CAT_DOG_DIAGNOSIS.questions[0]],
    };

    const outcome = calculateDiagnosisResult(singleQuestion, [
      { questionId: "q-weekend", optionId: "q-weekend-a" },
    ]);

    expect(outcome.winningResult.id).toBe("result-cat");
    expect(outcome.distance).toBe(0);
  });
});
