import { BRAND_LANDING_SLUG } from "@/lib/landing/brandLandingSlug";
import { buildSpecialtyLandingTopics } from "@/lib/landing/specialtyLandingCopy";

export const LANDING_TOPIC_SLUGS = [
  BRAND_LANDING_SLUG,
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
  "world-specialty-soul",
  "jp-sakamai-craft",
  "us-corn-frontier",
  "ca-maple-resilience",
  "br-terra-roxa-spirit",
  "fr-terroir-poet",
  "cl-andes-dualcraft",
  "md-cellar-guardian",
  "pk-fragrant-earth",
  "uk-maturation-highlander",
] as const;

export type LandingTopicSlug = (typeof LANDING_TOPIC_SLUGS)[number];

export type LandingSearchIntent =
  "informational" | "navigational" | "commercial" | "transactional";

export interface LandingTopicConfig {
  slug: LandingTopicSlug;
  playDiagnosisId: string;
  plugPlayPath: string;
  psychDiagnosisPath?: string;
  schemaType: "Quiz" | "MedicalWebPage" | "WebApplication";
  searchIntent: LandingSearchIntent;
  searchTags: readonly string[];
}

export const LANDING_TOPICS: LandingTopicConfig[] = [
  {
    slug: BRAND_LANDING_SLUG,
    playDiagnosisId: "rubel-introvert-level-v1",
    plugPlayPath: "/diagnosis",
    schemaType: "WebApplication",
    searchIntent: "navigational",
    searchTags: [
      "libertycanvas",
      "liberty canvas",
      "リバティキャンバス",
      "無料性格診断",
      "AI personality test",
    ],
  },
  {
    slug: "big-five-ocean",
    playDiagnosisId: "rubel-introvert-level-v1",
    plugPlayPath: "/diagnosis/play/big-five",
    psychDiagnosisPath: "/diagnosis/play/big-five",
    schemaType: "Quiz",
    searchIntent: "informational",
    searchTags: ["big five", "ocean", "ffm", "5因子", "personality science"],
  },
  {
    slug: "enneagram-nine-types",
    playDiagnosisId: "rubel-ura-seishiki-v1",
    plugPlayPath: "/diagnosis/play/motivation-spectrum",
    psychDiagnosisPath: "/diagnosis/play/motivation-spectrum",
    schemaType: "Quiz",
    searchIntent: "informational",
    searchTags: [
      "motivation spectrum",
      "9 patterns",
      "drive",
      "動機",
      "personality science",
    ],
  },
  {
    slug: "sixteen-personalities",
    playDiagnosisId: "rubel-introvert-level-v1",
    plugPlayPath: "/diagnosis/play/personality-spectrum",
    schemaType: "Quiz",
    searchIntent: "commercial",
    searchTags: ["personality spectrum", "four axis", "trait radar", "free test"],
  },
  {
    slug: "mbti-personality-types",
    playDiagnosisId: "rubel-introvert-level-v1",
    plugPlayPath: "/diagnosis/play/personality-spectrum",
    schemaType: "Quiz",
    searchIntent: "commercial",
    searchTags: ["personality spectrum", "trait axes", "type finder", "性格タイプ"],
  },
  {
    slug: "introvert-personality",
    playDiagnosisId: "rubel-introvert-level-v1",
    plugPlayPath: "/diagnosis/play/big-five",
    schemaType: "Quiz",
    searchIntent: "informational",
    searchTags: ["introvert", "内向", "quiet", "social battery"],
  },
  {
    slug: "love-language-test",
    playDiagnosisId: "rubel-neko-ja-v1",
    plugPlayPath: "/diagnosis/play/romance",
    schemaType: "Quiz",
    searchIntent: "transactional",
    searchTags: ["love language", "romance", "恋愛", "relationship"],
  },
  {
    slug: "attachment-style",
    playDiagnosisId: "rubel-ura-seishiki-v1",
    plugPlayPath: "/diagnosis/play/romance",
    schemaType: "MedicalWebPage",
    searchIntent: "transactional",
    searchTags: ["attachment", "恋愛", "relationship", "secure"],
  },
  {
    slug: "burnout-personality",
    playDiagnosisId: "rubel-burnout-v1",
    plugPlayPath: "/diagnosis/play/motivation-spectrum",
    schemaType: "MedicalWebPage",
    searchIntent: "informational",
    searchTags: ["burnout", "燃え尽き", "stress", "rest"],
  },
  {
    slug: "inner-child-healing",
    playDiagnosisId: "rubel-ura-seishiki-v1",
    plugPlayPath: "/diagnosis/play/personality-spectrum",
    schemaType: "MedicalWebPage",
    searchIntent: "informational",
    searchTags: ["inner child", "healing", "self care"],
  },
  {
    slug: "shadow-self-archetype",
    playDiagnosisId: "rubel-ura-seishiki-v1",
    plugPlayPath: "/diagnosis/play/genz",
    schemaType: "Quiz",
    searchIntent: "transactional",
    searchTags: ["shadow self", "archetype", "genz", "cosmic"],
  },
  ...buildSpecialtyLandingTopics(),
];

export function getLandingTopic(slug: string): LandingTopicConfig | null {
  return LANDING_TOPICS.find((entry) => entry.slug === slug) ?? null;
}
