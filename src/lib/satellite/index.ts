/**
 * Global SEO Satellite — public API.
 * Presentation data & routing only. Engine logic lives in @/lib/rubel/pipeline.
 */
export type { LandingLocale } from "@/lib/landing/landingLocales";
export {
  LANDING_LOCALES,
  LANDING_LOCALE_META,
  isLandingLocale,
  landingLocaleToAppLocale,
} from "@/lib/landing/landingLocales";

export type { LandingTopicSlug } from "@/lib/landing/landingTopics";
export { LANDING_TOPIC_SLUGS, LANDING_TOPICS, getLandingTopic } from "@/lib/landing/landingTopics";

export type { LandingPageCopy } from "@/lib/landing/landingCopy";
export { LANDING_COPY, getLandingCopy } from "@/lib/landing/landingCopy";

export type { LandingPageDefinition } from "@/lib/landing/landingCatalog";
export {
  buildLandingJsonLd,
  buildLandingMetadata,
  buildLandingPageDefinition,
  buildLandingPath,
  listAllLandingPages,
  listLandingStaticParams,
  resolveLandingPage,
} from "@/lib/landing/landingCatalog";

export {
  buildDiscoverRoute,
  buildPlayRoute,
  satelliteIntakeToOutcome,
} from "@/lib/rubel/pipeline/satelliteIntake";

export {
  consumeSatelliteIntake,
  peekSatelliteIntake,
  writeSatelliteIntake,
} from "@/lib/rubel/session/satelliteIntakeStore";

export type { SatelliteIntakeRecord, SatelliteIntakeWritePayload } from "@/lib/rubel/contracts/pipeline";
