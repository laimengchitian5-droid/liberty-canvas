import type {
  AiIntermediateFeedbackBlock,
  BuilderCompilerAnswer,
  BuilderDiagnosisDefinition,
  BuilderDiagnosisSeoContext,
  BuilderRuntimeFeedbackStep,
  BuilderRuntimeQuestionStep,
  BuilderRuntimeStep,
  ConditionalBranchBlock,
  ConversationalQuestionBlock,
} from "@/types/builder";
import {
  extractBuilderQuestionBlocks,
  isAiIntermediateFeedbackBlock,
  isConditionalBranchBlock,
  isConversationalQuestionBlock,
} from "@/types/builder";
import { buildAffirmationFromTemplate } from "@/lib/diagnosis/compilerMessages";
import {
  buildBuilderOgDescription,
  buildBuilderOgImageUrl,
  buildBuilderOgKeywords,
  buildBuilderOgTitle,
} from "@/lib/builder/buildBuilderOgKeywords";

export function findQuestionBlock(
  definition: BuilderDiagnosisDefinition,
  blockId: string,
): ConversationalQuestionBlock | null {
  for (const entry of definition.blocks) {
    if (entry.id === blockId && isConversationalQuestionBlock(entry)) {
      return entry;
    }
  }

  return null;
}

export function findFeedbackForQuestion(
  definition: BuilderDiagnosisDefinition,
  questionBlockId: string,
): AiIntermediateFeedbackBlock | null {
  for (const entry of definition.blocks) {
    if (
      isAiIntermediateFeedbackBlock(entry) &&
      entry.triggerAfterBlockId === questionBlockId
    ) {
      return entry;
    }
  }

  return null;
}

export function findBranchAfterBlock(
  definition: BuilderDiagnosisDefinition,
  afterBlockId: string,
): ConditionalBranchBlock | null {
  for (const entry of definition.blocks) {
    if (isConditionalBranchBlock(entry) && entry.afterBlockId === afterBlockId) {
      return entry;
    }
  }

  return null;
}

export function resolveAffirmationText(
  block: AiIntermediateFeedbackBlock,
  choiceLabel: string,
): string {
  return buildAffirmationFromTemplate(block.affirmationTemplate, choiceLabel);
}

export function resolveNextQuestionBlockId(
  definition: BuilderDiagnosisDefinition,
  completedBlockId: string,
  choiceId: string,
): string | null {
  const branch = findBranchAfterBlock(definition, completedBlockId);

  if (branch) {
    for (const rule of branch.rules) {
      if (rule.whenChoiceId === choiceId) {
        return rule.gotoBlockId;
      }
    }

    return branch.defaultGotoBlockId;
  }

  const questions = extractBuilderQuestionBlocks(definition);
  const currentIndex = questions.findIndex(
    (question) => question.id === completedBlockId,
  );

  if (currentIndex >= 0 && currentIndex < questions.length - 1) {
    return questions[currentIndex + 1]!.id;
  }

  return null;
}

export function buildQuestionRuntimeStep(
  definition: BuilderDiagnosisDefinition,
  blockId: string,
): BuilderRuntimeQuestionStep | null {
  const block = findQuestionBlock(definition, blockId);

  if (!block) {
    return null;
  }

  const questions = extractBuilderQuestionBlocks(definition);
  const questionNumber = questions.findIndex((entry) => entry.id === blockId) + 1;

  return {
    kind: "question",
    block,
    questionNumber: Math.max(1, questionNumber),
    questionCount: questions.length,
  };
}

export function buildFeedbackRuntimeStep(
  definition: BuilderDiagnosisDefinition,
  feedbackBlockId: string,
  choiceLabel: string,
  originQuestionId: string,
): BuilderRuntimeFeedbackStep | null {
  const block = definition.blocks.find(
    (entry) =>
      isAiIntermediateFeedbackBlock(entry) && entry.id === feedbackBlockId,
  );

  if (!block || !isAiIntermediateFeedbackBlock(block)) {
    return null;
  }

  return {
    kind: "feedback",
    block,
    resolvedAffirmation: resolveAffirmationText(block, choiceLabel),
    originQuestionId,
  };
}

export function buildInitialRuntimeStep(
  definition: BuilderDiagnosisDefinition,
): BuilderRuntimeStep | null {
  return buildQuestionRuntimeStep(definition, definition.startBlockId);
}

export function builderAnswersToCompilerPayload(
  answers: readonly BuilderCompilerAnswer[],
): { blockId: string; optionId: string; recordedAt: number }[] {
  return answers.map((entry) => ({
    blockId: entry.blockId,
    optionId: entry.choiceId,
    recordedAt: entry.recordedAt,
  }));
}

export function buildBuilderSeoContext(
  definition: BuilderDiagnosisDefinition,
): BuilderDiagnosisSeoContext {
  const landingPath =
    definition.seoTuning?.landingPath ?? `/diagnosis/play/${definition.slug}`;
  const baseKeywords = definition.seoTuning
    ? [
        ...definition.seoTuning.desireTags,
        ...definition.seoTuning.targetDemographics,
      ]
    : [];
  const viralKeywords = buildBuilderOgKeywords(
    definition.creatorTags,
    baseKeywords,
  );
  const title = buildBuilderOgTitle(
    definition.seoTuning?.titleTemplate ?? definition.title,
    definition.creatorTags,
  );
  const description = buildBuilderOgDescription(
    definition.seoTuning?.descriptionTemplate ?? definition.subtitle,
    definition.creatorTags,
    definition.estimatedMinutes,
  );

  return {
    diagnosisId: definition.id,
    slug: definition.slug,
    creatorTags: definition.creatorTags,
    viralKeywords,
    landingPath,
    title,
    description,
    ogImagePath: buildBuilderOgImageUrl(definition.slug),
  };
}
