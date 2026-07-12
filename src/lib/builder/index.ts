export {
  mapScoringPayloadToTraitWeights,
  mergeScoringPayloads,
} from "@/lib/builder/mapScoringPayload";
export {
  buildBuilderOgDescription,
  buildBuilderOgImageUrl,
  buildBuilderOgKeywords,
  buildBuilderOgTitle,
} from "@/lib/builder/buildBuilderOgKeywords";
export {
  buildBuilderSeoContext,
  buildFeedbackRuntimeStep,
  buildInitialRuntimeStep,
  buildQuestionRuntimeStep,
  builderAnswersToCompilerPayload,
  findBranchAfterBlock,
  findFeedbackForQuestion,
  findQuestionBlock,
  resolveAffirmationText,
  resolveNextQuestionBlockId,
} from "@/lib/builder/compileBuilderRuntime";
export {
  convertBuilderToPlugDefinition,
  countReachableQuestions,
  validateBuilderDefinition,
} from "@/lib/builder/convertBuilderToPlugDefinition";
export {
  createDefaultBuilderDraft,
  deleteBuilderDraft,
  listBuilderDrafts,
  loadBuilderDraft,
  saveBuilderDraft,
} from "@/lib/builder/builderDraftStorage";
export {
  getMergedPlugDiagnosisBySlug,
  listMergedPlugDiagnosisSlugs,
} from "@/lib/builder/plugCatalog";
export {
  buildDiagnosisDiscoveryCatalog,
  type DiagnosisDiscoveryCard,
} from "@/lib/builder/discoveryCatalog";
export {
  buildUnifiedDiscoveryCatalog,
  groupUnifiedDiscoveryCatalog,
  type UnifiedDiscoveryEntry,
  type UnifiedDiscoveryKind,
} from "@/lib/catalog/unifiedDiscoveryCatalog";
export { PRODUCT_NAME, PRODUCT_SHORT_NAME } from "@/lib/brand/constants";
export {
  appendBuilderAuditEntry,
  isReservedBuilderSlug,
  listBuilderAuditEntries,
  RESERVED_BUILDER_SLUGS,
} from "@/lib/builder/auditLog";
export {
  getPublishedBuilderBySlug,
  listPublishedBuilderRecords,
  upsertBuilderRecord,
} from "@/lib/builder/repository";
export { parseSaveBuilderPayload } from "@/lib/builder/builderSchema";
