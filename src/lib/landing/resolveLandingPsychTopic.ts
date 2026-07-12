import { LANDING_TOPIC_SLUGS, type LandingTopicSlug } from "@/lib/landing/landingTopics";
import type { PsychTopicSlug } from "@/lib/psychology/types";

const LANDING_PSYCH_TOPIC: Partial<Record<LandingTopicSlug, PsychTopicSlug>> = {
  "big-five-ocean": "big-five",
  "enneagram-nine-types": "enneagram",
};

function isLandingTopicSlug(value: string): value is LandingTopicSlug {
  return (LANDING_TOPIC_SLUGS as readonly string[]).includes(value);
}

/** Maps Discover slug → psych intake topic (explicit table, no string heuristics). */
export function resolveLandingPsychTopic(slug: string): PsychTopicSlug {
  if (isLandingTopicSlug(slug)) {
    return LANDING_PSYCH_TOPIC[slug] ?? "big-five";
  }

  return "big-five";
}
