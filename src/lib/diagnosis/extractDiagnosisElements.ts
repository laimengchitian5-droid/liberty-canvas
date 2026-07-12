import type {
  PlugDiagnosisDefinition,
  QuestionBlock,
  ResultTemplateBlock,
  SeoTuningBlock,
  ViralSharePreset,
} from "@/types/diagnosisCompiler";

export function extractQuestionBlocks(
  definition: PlugDiagnosisDefinition,
): QuestionBlock[] {
  return definition.elements.filter(
    (element): element is QuestionBlock => element.kind === "QUESTION_BLOCK",
  );
}

export function extractSeoBlock(
  definition: PlugDiagnosisDefinition,
): SeoTuningBlock | null {
  return (
    definition.elements.find(
      (element): element is SeoTuningBlock => element.kind === "SEO_TUNING_BLOCK",
    ) ?? null
  );
}

export function extractResultBlock(
  definition: PlugDiagnosisDefinition,
): ResultTemplateBlock | null {
  return (
    definition.elements.find(
      (element): element is ResultTemplateBlock =>
        element.kind === "RESULT_TEMPLATE_BLOCK",
    ) ?? null
  );
}

export function extractViralPresets(
  definition: PlugDiagnosisDefinition,
): readonly ViralSharePreset[] {
  const block = definition.elements.find(
    (element) => element.kind === "VIRAL_SHARE_BLOCK",
  );

  if (!block || block.kind !== "VIRAL_SHARE_BLOCK") {
    return [];
  }

  return block.presets;
}
