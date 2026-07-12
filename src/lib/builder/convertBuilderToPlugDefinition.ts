import { LEGAL_TRAIT_KEYS } from "@/lib/diagnosis/academicTraitVector";
import { mapScoringPayloadToTraitWeights } from "@/lib/builder/mapScoringPayload";
import type { BuilderDiagnosisDefinition } from "@/types/builder";
import {
  extractBuilderQuestionBlocks,
  isConversationalQuestionBlock,
  toResultTemplateBlock,
} from "@/types/builder";
import type {
  DiagnosisElement,
  PlugDiagnosisDefinition,
  QuestionBlock,
} from "@/types/diagnosisCompiler";

/**
 * Converts a no-code builder definition into the plug compiler format
 * so scoring + legal insulation reuse `compileLegallySafeResult`.
 */
export function convertBuilderToPlugDefinition(
  definition: BuilderDiagnosisDefinition,
): PlugDiagnosisDefinition {
  const questionBlocks: QuestionBlock[] = extractBuilderQuestionBlocks(
    definition,
  ).map((block) => ({
    kind: "QUESTION_BLOCK" as const,
    id: block.id,
    prompt: block.subPrompt
      ? `${block.prompt}\n${block.subPrompt}`
      : block.prompt,
    inputType: "multiple_choice" as const,
    options: block.choices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      traitWeights: mapScoringPayloadToTraitWeights(choice.scores),
    })),
  }));

  const elements: DiagnosisElement[] = [...questionBlocks];

  if (definition.seoTuning) {
    elements.push(definition.seoTuning);
  }

  elements.push(toResultTemplateBlock(definition.resultConfig));

  if (definition.viralShare) {
    elements.push(definition.viralShare);
  }

  return {
    id: definition.id,
    slug: definition.slug,
    eyebrow: definition.eyebrow,
    title: definition.title,
    subtitle: definition.subtitle,
    estimatedMinutes: definition.estimatedMinutes,
    themeColor: definition.themeColor,
    traitIds: LEGAL_TRAIT_KEYS,
    elements,
  };
}

export function countReachableQuestions(
  definition: BuilderDiagnosisDefinition,
): number {
  return extractBuilderQuestionBlocks(definition).length;
}

export function validateBuilderDefinition(
  definition: BuilderDiagnosisDefinition,
): readonly string[] {
  const errors: string[] = [];
  const questionIds = new Set(
    definition.blocks
      .filter(isConversationalQuestionBlock)
      .map((block) => block.id),
  );

  if (!questionIds.has(definition.startBlockId)) {
    errors.push(`startBlockId "${definition.startBlockId}" is not a question block`);
  }

  if (definition.resultConfig.results.length === 0) {
    errors.push("resultConfig must include at least one archetype");
  }

  for (const block of definition.blocks) {
    if (block.type === "AI_INTERMEDIATE_FEEDBACK") {
      if (!questionIds.has(block.triggerAfterBlockId)) {
        errors.push(
          `feedback block "${block.id}" references unknown question "${block.triggerAfterBlockId}"`,
        );
      }
    }

    if (block.type === "CONDITIONAL_BRANCH") {
      if (!questionIds.has(block.afterBlockId)) {
        errors.push(
          `branch block "${block.id}" references unknown question "${block.afterBlockId}"`,
        );
      }

      if (!questionIds.has(block.defaultGotoBlockId)) {
        errors.push(
          `branch block "${block.id}" defaultGotoBlockId is invalid`,
        );
      }

      for (const rule of block.rules) {
        if (!questionIds.has(rule.gotoBlockId)) {
          errors.push(
            `branch rule in "${block.id}" references unknown block "${rule.gotoBlockId}"`,
          );
        }
      }
    }
  }

  return errors;
}
