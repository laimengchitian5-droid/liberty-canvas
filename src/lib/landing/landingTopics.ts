export const LANDING_TOPIC_SLUGS = [
  "big-five-ocean",
  "enneagram-nine-types",
  "sixteen-personalities",
  "mbti-personality-types",
  "introvert-personality",
  "love-language-test",
  "attachment-style",
  "burnout-personality",
  "inner-child-healing",
  "shadow-self-archetype",
] as const;

export type LandingTopicSlug = (typeof LANDING_TOPIC_SLUGS)[number];

export interface LandingTopicConfig {
  slug: LandingTopicSlug;
  playDiagnosisId: string;
  /** Primary Plug play route (Discover funnel). */
  plugPlayPath: string;
  /** Legacy psych SEO path — redirects to plug play. */
  psychDiagnosisPath?: string;
  schemaType: "Quiz" | "MedicalWebPage" | "WebApplication";
}

export const LANDING_TOPICS: LandingTopicConfig[] = [
  {
    slug: "big-five-ocean",
    playDiagnosisId: "rubel-introvert-level-v1",
    plugPlayPath: "/diagnosis/play/big-five",
    psychDiagnosisPath: "/diagnosis/play/big-five",
    schemaType: "Quiz",
  },
  {
    slug: "enneagram-nine-types",
    playDiagnosisId: "rubel-ura-seishiki-v1",
    plugPlayPath: "/diagnosis/play/motivation-spectrum",
    psychDiagnosisPath: "/diagnosis/play/motivation-spectrum",
    schemaType: "Quiz",
  },
  {
    slug: "sixteen-personalities",
    playDiagnosisId: "rubel-introvert-level-v1",
    plugPlayPath: "/diagnosis/play/personality-spectrum",
    schemaType: "Quiz",
  },
  {
    slug: "mbti-personality-types",
    playDiagnosisId: "rubel-introvert-level-v1",
    plugPlayPath: "/diagnosis/play/personality-spectrum",
    schemaType: "Quiz",
  },
  {
    slug: "introvert-personality",
    playDiagnosisId: "rubel-introvert-level-v1",
    plugPlayPath: "/diagnosis/play/big-five",
    schemaType: "Quiz",
  },
  {
    slug: "love-language-test",
    playDiagnosisId: "rubel-neko-ja-v1",
    plugPlayPath: "/diagnosis/play/romance",
    schemaType: "Quiz",
  },
  {
    slug: "attachment-style",
    playDiagnosisId: "rubel-ura-seishiki-v1",
    plugPlayPath: "/diagnosis/play/romance",
    schemaType: "MedicalWebPage",
  },
  {
    slug: "burnout-personality",
    playDiagnosisId: "rubel-burnout-v1",
    plugPlayPath: "/diagnosis/play/motivation-spectrum",
    schemaType: "MedicalWebPage",
  },
  {
    slug: "inner-child-healing",
    playDiagnosisId: "rubel-ura-seishiki-v1",
    plugPlayPath: "/diagnosis/play/personality-spectrum",
    schemaType: "MedicalWebPage",
  },
  {
    slug: "shadow-self-archetype",
    playDiagnosisId: "rubel-ura-seishiki-v1",
    plugPlayPath: "/diagnosis/play/genz",
    schemaType: "Quiz",
  },
];

export function getLandingTopic(slug: string): LandingTopicConfig | null {
  return LANDING_TOPICS.find((entry) => entry.slug === slug) ?? null;
}
