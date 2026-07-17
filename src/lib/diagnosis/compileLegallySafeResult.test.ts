import { describe, expect, it } from "vitest";
import { getPlugDiagnosisBySlug } from "@/config/diagnoses";
import { compileLegallySafeResult } from "@/lib/diagnosis/compileLegallySafeResult";
import { extractQuestionBlocks } from "@/lib/diagnosis/extractDiagnosisElements";
import { LEGAL_TRAIT_KEYS } from "@/lib/diagnosis/academicTraitVector";
import type { CompilerAnswer } from "@/types/diagnosisCompiler";

function buildFullAnswers(
  definition: NonNullable<ReturnType<typeof getPlugDiagnosisBySlug>>,
): CompilerAnswer[] {
  return extractQuestionBlocks(definition).map((block, index) => {
    if (block.inputType === "slider" && block.slider) {
      return {
        blockId: block.id,
        sliderValue: Math.round((block.slider.min + block.slider.max) / 2),
        recordedAt: index,
      };
    }

    if (block.inputType === "text") {
      return {
        blockId: block.id,
        textValue: "自然体でいられる存在",
        recordedAt: index,
      };
    }

    return {
      blockId: block.id,
      optionId: block.options?.[0]?.id ?? `${block.id}-a`,
      recordedAt: index,
    };
  });
}

describe("compileLegallySafeResult", () => {
  it("maps answers to academic trait vectors only", () => {
    const definition = getPlugDiagnosisBySlug("oshikatsu");
    expect(definition).not.toBeNull();

    const answers = buildFullAnswers(definition!);
    expect(answers.length).toBeGreaterThanOrEqual(20);

    const outcome = compileLegallySafeResult(definition!, answers);

    for (const key of LEGAL_TRAIT_KEYS) {
      expect(outcome.academicVector[key]).toBeTypeOf("number");
      expect(Object.keys(outcome.traitScores)).toContain(key);
    }

    expect(outcome.winningArchetype.title.length).toBeGreaterThan(0);
    expect(outcome.winningArchetype.analysis).toContain(
      outcome.winningArchetype.analysis.slice(0, 10),
    );
    expect(outcome.dominantTraits.length).toBe(2);
    expect(outcome.isComplete).toBe(true);
    expect(outcome.totalQuestions).toBe(answers.length);
  });

  it("never exposes proprietary test nomenclature in archetype ids", () => {
    const definition = getPlugDiagnosisBySlug("romance");
    expect(definition).not.toBeNull();

    const resultBlock = definition!.elements.find(
      (element) => element.kind === "RESULT_TEMPLATE_BLOCK",
    );

    expect(resultBlock?.kind).toBe("RESULT_TEMPLATE_BLOCK");

    if (resultBlock?.kind === "RESULT_TEMPLATE_BLOCK") {
      for (const archetype of resultBlock.results) {
        expect(archetype.id.startsWith("lc-")).toBe(true);
        expect(archetype.title).not.toMatch(/MBTI|INFP|Enneagram|Type [0-9]/i);
      }
    }
  });
});
