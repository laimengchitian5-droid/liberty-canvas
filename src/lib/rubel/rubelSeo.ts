import type { Metadata } from "next";

import type { Diagnosis } from "@/types/rubel";

import { PRODUCT_NAME } from "@/lib/brand/constants";
import { getBrand } from "@/lib/brand/registry";
import {
  buildHomeSerpCopy,
  buildHomeSoftwareAlternateNames,
  HOME_SERP_KEYWORDS,
} from "@/lib/seo/homeSerp";
import { getSiteUrl } from "@/lib/site/url";

const BRAND_NARRATIVE = `${PRODUCT_NAME} — AI × personality diagnosis × freedom. Lu (Liberate) + Bel (Beautiful): paint inner souls into cosmic characters — log-in free, affirming AI, instant archetype.`;

const HIGH_VALUE_KEYWORDS = HOME_SERP_KEYWORDS;

export function buildPlayPageTitle(diagnosis: Diagnosis): string {
  return `${diagnosis.title} — ${PRODUCT_NAME}`;
}

export function buildPlayPageDescription(diagnosis: Diagnosis): string {
  return `${diagnosis.title} — 1-question AI quiz with affirming persona chat. Free · ${diagnosis.results.length} types · No login.`;
}

export function buildHomeTitle(): string {
  return buildHomeSerpCopy().title;
}

export function buildHomeDescription(): string {
  return buildHomeSerpCopy().description;
}

export function buildHomeKeywords(): string[] {
  return [...HOME_SERP_KEYWORDS];
}

export function buildHomeOpenGraph() {
  const siteUrl = getSiteUrl();

  return {
    title: buildHomeTitle(),

    description: buildHomeDescription(),

    url: siteUrl,

    siteName: PRODUCT_NAME,

    locale: "ja_JP",

    alternateLocale: ["en_US", "ko_KR", "zh_CN"],

    type: "website" as const,
  };
}

export function buildHomeTwitter() {
  return {
    card: "summary_large_image" as const,

    title: buildHomeTitle(),

    description: buildHomeDescription(),

    creator: "@LibertyCanvas",
  };
}

export function buildPlayPageJsonLd(diagnosis: Diagnosis) {
  const siteUrl = getSiteUrl();

  const playUrl = `${siteUrl}/play/${diagnosis.id}`;

  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "Quiz",

        "@id": `${playUrl}#quiz`,

        name: diagnosis.title,

        description: buildPlayPageDescription(diagnosis),

        url: playUrl,

        inLanguage: diagnosis.language,

        author: {
          "@type": "Organization",

          name: "Liberty Canvas",

          url: siteUrl,
        },

        numberOfQuestions: 1,

        educationalLevel: "general audience",

        isAccessibleForFree: true,
      },

      {
        "@type": "Organization",

        "@id": `${siteUrl}#organization`,

        name: "Liberty Canvas",

        alternateName: [...buildHomeSoftwareAlternateNames()],

        url: siteUrl,

        description: BRAND_NARRATIVE,
      },

      {
        "@type": "FAQPage",

        "@id": `${playUrl}#faq`,

        mainEntity: [
          {
            "@type": "Question",

            name: "ログインは必要ですか？",

            acceptedAnswer: {
              "@type": "Answer",

              text: "不要です。1問答えるだけで即座に診断結果とAIチャットが始まります。",
            },
          },

          {
            "@type": "Question",

            name: `${PRODUCT_NAME} とは？`,

            acceptedAnswer: {
              "@type": "Answer",

              text: BRAND_NARRATIVE,
            },
          },
        ],
      },
    ],
  };
}

export function buildHomeJsonLd(diagnosisCount: number) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "WebApplication",

        "@id": `${siteUrl}#webapp`,

        name: PRODUCT_NAME,

        alternateName: [...buildHomeSoftwareAlternateNames()],

        description: buildHomeDescription(),

        url: siteUrl,

        applicationCategory: "EntertainmentApplication",

        operatingSystem: "Web",

        browserRequirements: "Requires JavaScript",

        offers: {
          "@type": "Offer",

          price: "0",

          priceCurrency: "JPY",
        },

        featureList: [
          "All-Affirming AI Chat",

          "Empathetic Personality Test",

          "No-Login Personality Diagnosis",

          "Free Personality Spectrum Test",

          "全肯定 AI チャット",

          "AI 性格診断",

          "1問即診断",

          "Big Five OCEAN entry",

          "Motivation Spectrum entry",
        ],

        numberOfItems: diagnosisCount,
      },

      {
        "@type": "Organization",

        "@id": `${siteUrl}#organization`,

        name: PRODUCT_NAME,

        alternateName: [...buildHomeSoftwareAlternateNames()],

        url: siteUrl,

        description: BRAND_NARRATIVE,

        sameAs: [siteUrl],
      },

      {
        "@type": "FAQPage",

        "@id": `${siteUrl}#faq`,

        mainEntity: [
          {
            "@type": "Question",

            name: `What is ${PRODUCT_NAME}?`,

            acceptedAnswer: {
              "@type": "Answer",

              text: BRAND_NARRATIVE,
            },
          },

          {
            "@type": "Question",

            name: "Is Liberty Canvas a free personality test alternative?",

            acceptedAnswer: {
              "@type": "Answer",

              text: "Yes. Liberty Canvas offers no-login empathetic personality tests with all-affirming AI chat — built on academic Big Five science and original Liberty archetypes.",
            },
          },

          {
            "@type": "Question",

            name: "全肯定 AI チャットとは？",

            acceptedAnswer: {
              "@type": "Answer",

              text: `診断結果に合わせた AI が、あなたの選択をそのまま引用しながら100%共感的に応答する ${PRODUCT_NAME} 独自のチャット体験です。`,
            },
          },

          {
            "@type": "Question",

            name: "Where are Big Five and Motivation Spectrum tests?",

            acceptedAnswer: {
              "@type": "Answer",

              text: `Big Five OCEAN: ${siteUrl}/diagnosis/play/big-five. Motivation Spectrum: ${siteUrl}/diagnosis/play/motivation-spectrum. Both are free, multilingual, and powered by affirming AI on Liberty Canvas.`,
            },
          },
        ],
      },

      {
        "@type": "ItemList",

        "@id": `${siteUrl}#psych-entry-points`,

        name: "Psychological Diagnosis Entry Points",

        itemListElement: [
          {
            "@type": "ListItem",

            position: 1,

            name: "Big Five OCEAN Personality Test",

            url: `${siteUrl}/diagnosis/play/big-five`,
          },

          {
            "@type": "ListItem",

            position: 2,

            name: "Motivation Spectrum Personality Test",

            url: `${siteUrl}/diagnosis/play/motivation-spectrum`,
          },
        ],
      },
    ],
  };
}

export function buildCreatePageJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",

    "@type": "WebPage",

    name: `オリジナル性格診断を作成 — ${getBrand("liberty-forge").nameJa}`,

    description: "1問・2択でオリジナル性格診断をノーコード公開。AIキャラクター付き。",

    url: `${siteUrl}/create`,

    isPartOf: {
      "@type": "WebApplication",

      name: "Liberty Canvas",
    },
  };
}

export { BRAND_NARRATIVE, HIGH_VALUE_KEYWORDS };
