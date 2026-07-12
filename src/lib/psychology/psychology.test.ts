import { describe, expect, it } from "vitest";
import { buildBigFiveResult, scoreBigFive } from "@/lib/psychology/bigFiveEngine";
import { getBigFiveCopy } from "@/lib/psychology/copy/bigFive";
import { buildEnneagramResult } from "@/lib/psychology/enneagramEngine";
import { getEnneagramCopy } from "@/lib/psychology/copy/enneagram";
import { buildPsychEnginePayload } from "@/lib/psychology/buildPsychPayload";

describe("bigFiveEngine", () => {
  it("scores OCEAN answers and resolves dominant trait", () => {
    const copy = getBigFiveCopy("en");
    const answers = copy.questions.map((question, index) => ({
      dimension: question.dimension,
      choice: index % 2 === 0 ? ("high" as const) : ("low" as const),
      questionText: question.prompt,
      chosenText: index % 2 === 0 ? question.optionHigh : question.optionLow,
    }));

    const scores = scoreBigFive(answers);
    expect(scores.openness).toBe(1);
    expect(scores.conscientiousness).toBe(0);

    const result = buildBigFiveResult(copy, answers);
    expect(result.typeName).toContain("Openness");
    expect(result.detailLines).toHaveLength(5);
  });
});

describe("enneagramEngine", () => {
  it("builds enneagram result from selected type", () => {
    const copy = getEnneagramCopy("ja");
    const selected = copy.types[3];

    const result = buildEnneagramResult(copy, selected);
    expect(result.typeName).toBe(selected.name);
    expect(result.anchorAnswer).toBe(selected.name);
  });
});

describe("buildPsychEnginePayload", () => {
  it("creates RubelEnginePayload with verbalization anchor", () => {
    const copy = getEnneagramCopy("en");
    const selected = copy.types[0];
    const result = buildEnneagramResult(copy, selected);

    const payload = buildPsychEnginePayload({
      topic: "enneagram",
      locale: "en",
      keyword: copy.keyword,
      pageTitle: copy.headline,
      result,
    });

    expect(payload.intakeSource).toBe("quiz");
    expect(payload.typeName).toBe(selected.name);
    expect(payload.verbalizationAnchor?.chosenOptionText).toBe(selected.name);
    expect(payload.compiledSystemPrompt).toContain("PSYCHOMETRIC DETAIL");
  });
});
