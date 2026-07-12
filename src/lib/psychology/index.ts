export type {
  BigFiveLocaleCopy,
  EnneagramLocaleCopy,
  EnneagramTypeDefinition,
  OceanDimension,
  OceanScores,
  PsychPageCopy,
  PsychQuizResult,
  PsychTopicSlug,
} from "@/lib/psychology/types";

export { getBigFiveCopy, BIG_FIVE_COPY } from "@/lib/psychology/copy/bigFive";
export { getEnneagramCopy, ENNEAGRAM_COPY } from "@/lib/psychology/copy/enneagram";

export {
  scoreBigFive,
  buildBigFiveResult,
  formatBigFiveShareText,
  type BigFiveAnswer,
  type BigFiveAnswerRecord,
} from "@/lib/psychology/bigFiveEngine";

export {
  buildEnneagramResult,
  formatEnneagramShareText,
} from "@/lib/psychology/enneagramEngine";

export { buildPsychEnginePayload } from "@/lib/psychology/buildPsychPayload";

export {
  consumePsychIntakeSeed,
  mergePsychResultWithSeed,
  writePsychIntakeSeed,
} from "@/lib/psychology/psychIntakeStore";

export {
  buildPsychPageJsonLd,
  buildPsychPageMetadata,
  buildPsychPageDescription,
  buildPsychPageKeywords,
  buildPsychPageTitle,
  getPsychPlayDiagnosisId,
  getPsychTopicPath,
} from "@/lib/psychology/psychSeo";
