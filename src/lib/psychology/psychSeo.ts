import type { Metadata } from "next";
import type { LandingLocale } from "@/lib/landing/landingLocales";
import { LANDING_LOCALE_META } from "@/lib/landing/landingLocales";
import { PRODUCT_NAME, PRODUCT_NAME_JA } from "@/lib/brand/constants";
import { buildHreflangAlternates } from "@/lib/seo/hreflang";
import { buildPlugOgImageUrl } from "@/lib/seo/ogUrls";
import { getSiteUrl } from "@/lib/site/url";
import { BRAND_NARRATIVE } from "@/lib/rubel/rubelSeo";
import type { PsychTopicSlug } from "@/lib/psychology/types";
import { getBigFiveCopy } from "@/lib/psychology/copy/bigFive";
import { getEnneagramCopy } from "@/lib/psychology/copy/enneagram";

const TOPIC_PATH: Record<PsychTopicSlug, string> = {
  "big-five": "/diagnosis/play/big-five",
  enneagram: "/diagnosis/play/motivation-spectrum",
};
const TOPIC_PLAY_ID: Record<PsychTopicSlug, string> = {
  "big-five": "rubel-introvert-level-v1",
  enneagram: "rubel-ura-seishiki-v1",
};

export function getPsychTopicPath(topic: PsychTopicSlug): string {
  return TOPIC_PATH[topic];
}

export function getPsychPlayDiagnosisId(topic: PsychTopicSlug): string {
  return TOPIC_PLAY_ID[topic];
}

function resolveCopy(topic: PsychTopicSlug, locale: LandingLocale) {
  return topic === "big-five" ? getBigFiveCopy(locale) : getEnneagramCopy(locale);
}

export function buildPsychPageTitle(
  topic: PsychTopicSlug,
  locale: LandingLocale = "ja",
): string {
  const copy = resolveCopy(topic, locale);
  return `${copy.headline} — ${copy.keyword} | ${PRODUCT_NAME}`;
}
export function buildPsychPageDescription(
  topic: PsychTopicSlug,
  locale: LandingLocale = "ja",
): string {
  const copy = resolveCopy(topic, locale);
  return `${copy.subhead} ${BRAND_NARRATIVE}`;
}

export function buildPsychPageKeywords(topic: PsychTopicSlug): string[] {
  const base = [
    "All-Affirming AI Chat",
    "Empathetic Personality Test",
    "Free Personality Spectrum Test",
    "No-Login Personality Diagnosis",
    "AI 性格診断",
    "全肯定 AI チャット",
    PRODUCT_NAME,
    "liberty-canvas.vercel.app",
  ];

  if (topic === "big-five") {
    return [...base, "Big Five", "OCEAN", "ビッグファイブ", "大五人格", "빅파이브"];
  }

  return [...base, "Motivation Spectrum", "動機スペクトル", "动机光谱", "동기 스펙트럼"];
}

export function buildPsychPageMetadata(topic: PsychTopicSlug): Metadata {
  const siteUrl = getSiteUrl();
  const path = TOPIC_PATH[topic];
  const title = buildPsychPageTitle(topic, "ja");
  const description = buildPsychPageDescription(topic, "ja");
  const keywords = buildPsychPageKeywords(topic);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: buildHreflangAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName: PRODUCT_NAME,
      locale: "ja_JP",
      type: "website",
      images: [
        {
          url: buildPlugOgImageUrl(
            topic === "big-five" ? "big-five" : "motivation-spectrum",
          ),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export function buildPsychPageJsonLd(
  topic: PsychTopicSlug,
  locale: LandingLocale = "ja",
) {
  const siteUrl = getSiteUrl();
  const path = TOPIC_PATH[topic];
  const copy = resolveCopy(topic, locale);
  const meta = LANDING_LOCALE_META[locale];
  const pageUrl = `${siteUrl}${path}${locale === "ja" ? "" : `?lang=${locale}`}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Quiz",
        "@id": `${pageUrl}#quiz`,
        name: copy.headline,
        description: copy.subhead,
        url: pageUrl,
        inLanguage: meta.htmlLang,
        educationalLevel: "general audience",
        isAccessibleForFree: true,
        author: {
          "@type": "Organization",
          name: PRODUCT_NAME,
          url: siteUrl,
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: PRODUCT_NAME,
        alternateName: [PRODUCT_NAME_JA, "LibertyCanvas"],
        url: siteUrl,
        description: BRAND_NARRATIVE,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: copy.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
