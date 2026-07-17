import type { Metadata } from "next";
import { Suspense } from "react";
import { DiagnosisDiscoveryHub } from "@/components/diagnosis/DiagnosisDiscoveryHub";
import { DiagnosisFlow } from "@/components/diagnosis/DiagnosisFlow";
import { DiagnosisRefCapture } from "@/components/diagnosis/DiagnosisRefCapture";
import { DiagnosisSeoSection } from "@/components/diagnosis/DiagnosisSeoSection";
import { DIAGNOSTIC_QUESTION_COUNT } from "@/types/diagnosis";
import { buildDiagnosisOgImageUrl, buildDiagnosisPageUrl } from "@/lib/diagnosis/share";
import {
  buildUserAwareJsonLd,
  generateUserAwareMetadata,
} from "@/lib/seo/generateUserAwareMetadata";

const PAGE_TITLE = "心の色診断";
const PAGE_DESCRIPTION = `${DIAGNOSTIC_QUESTION_COUNT}問のやさしい多肢選択で、あなたらしい心の色を見つけます。診断後は AI がパーソナルアドバイスをお届け。大人可愛い、洗練された日本語体験。`;

const BASE_DIAGNOSIS_METADATA: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: buildDiagnosisPageUrl(),
  },
  keywords: [
    "性格診断",
    "心の色診断",
    "AI アドバイス",
    "大人可愛い",
    "LibertyCanvas",
    "全肯定 AI チャット",
    "自己肯定感 上げる 診断",
  ],
  openGraph: {
    type: "website",
    url: buildDiagnosisPageUrl(),
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    locale: "ja_JP",
    images: [
      {
        url: buildDiagnosisOgImageUrl(),
        width: 1200,
        height: 630,
        alt: PAGE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [buildDiagnosisOgImageUrl()],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return generateUserAwareMetadata({
    landingPath: "/diagnosis",
    baseMetadata: BASE_DIAGNOSIS_METADATA,
  });
}

export default async function DiagnosisPage() {
  const userJsonLd = await buildUserAwareJsonLd("/diagnosis");

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(userJsonLd) }}
      />
      <Suspense fallback={null}>
        <DiagnosisRefCapture />
      </Suspense>
      <DiagnosisFlow />
      <Suspense fallback={null}>
        <DiagnosisDiscoveryHub />
      </Suspense>
      <DiagnosisSeoSection />
    </main>
  );
}
