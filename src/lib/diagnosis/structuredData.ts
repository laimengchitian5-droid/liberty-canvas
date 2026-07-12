import type { DiagnosisResult, PersonalityCategory } from "@/types/diagnosis";
import { DIAGNOSTIC_QUESTION_COUNT } from "@/types/diagnosis";
import {
  buildDiagnosisPageUrl,
  buildDiagnosisResultPageUrl,
} from "@/lib/diagnosis/share";
import { getSiteUrl } from "@/lib/site/url";

export function buildDiagnosisQuizJsonLd(result: DiagnosisResult) {
  const siteUrl = getSiteUrl();
  const pageUrl = buildDiagnosisResultPageUrl(result.dominantCategory);

  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "心の色診断",
    description:
      `${DIAGNOSTIC_QUESTION_COUNT}問のやさしい多肢選択で、あなたらしい心の色を見つける大人可愛い性格診断。`,
    url: buildDiagnosisPageUrl(),
    educationalLevel: "General",
    inLanguage: "ja",
    numberOfQuestions: DIAGNOSTIC_QUESTION_COUNT,
    about: {
      "@type": "Thing",
      name: result.title,
      description: result.subtitle,
    },
    hasPart: {
      "@type": "Question",
      name: "あなたの心の色タイプ",
      acceptedAnswer: {
        "@type": "Answer",
        text: `${result.title} — ${result.baseAnalysis}`,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "LibertyCanvas",
      url: siteUrl,
    },
    mainEntityOfPage: pageUrl,
  };
}

export function buildDiagnosisResultPageJsonLd(
  category: PersonalityCategory,
  result: DiagnosisResult,
) {
  return [buildDiagnosisQuizJsonLd(result), buildDiagnosisWebAppJsonLd(category, result)];
}

function buildDiagnosisWebAppJsonLd(
  category: PersonalityCategory,
  result: DiagnosisResult,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "心の色診断",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: buildDiagnosisPageUrl(),
    inLanguage: "ja",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    description: result.baseAnalysis,
    identifier: category,
  };
}
