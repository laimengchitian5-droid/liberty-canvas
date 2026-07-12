import type { Metadata } from "next";
import {
  getDiagnosisById,
  getSeedDiagnosisById,
} from "@/lib/rubel/repository";
import { SEED_DIAGNOSES } from "@/lib/rubel/seedDiagnoses";
import {
  buildPlayPageDescription,
  buildPlayPageJsonLd,
  buildPlayPageTitle,
  BRAND_NARRATIVE,
} from "@/lib/rubel/rubelSeo";
import { RubelPlayPageClient } from "@/components/rubel/RubelPlayPageClient";
import { getSiteUrl } from "@/lib/site/url";
import { buildPlayOgImageUrl } from "@/lib/seo/ogUrls";
import { PRODUCT_NAME } from "@/lib/brand/constants";

const BRAND_STORY = BRAND_NARRATIVE;

interface PlayPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return SEED_DIAGNOSES.map((diagnosis) => ({ id: diagnosis.id }));
}

export async function generateMetadata({
  params,
}: PlayPageProps): Promise<Metadata> {
  const { id } = await params;
  const diagnosis =
    getSeedDiagnosisById(id) ?? (await getDiagnosisById(id));
  const siteUrl = getSiteUrl();

  if (!diagnosis) {
    return {
      title: `性格診断が見つかりません | ${PRODUCT_NAME}`,
      description: `${PRODUCT_NAME} — 無料AI性格診断プラットフォーム`,
      robots: { index: false, follow: true },
    };
  }

  const title = buildPlayPageTitle(diagnosis);
  const description = buildPlayPageDescription(diagnosis);
  const playUrl = `${siteUrl}/play/${diagnosis.id}`;
  const ogImage = buildPlayOgImageUrl(diagnosis.title, description);

  return {
    title,
    description,
    keywords: diagnosis.searchKeywords,
    alternates: { canonical: playUrl },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title,
      description,
      url: playUrl,
      siteName: PRODUCT_NAME,
      locale: diagnosis.language === "ja" ? "ja_JP" : "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { id } = await params;
  const diagnosis =
    getSeedDiagnosisById(id) ?? (await getDiagnosisById(id));
  const jsonLd = diagnosis ? buildPlayPageJsonLd(diagnosis) : null;
  const seoDescription = diagnosis
    ? buildPlayPageDescription(diagnosis)
    : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      {diagnosis ? (
        <article className="border-b border-slate-800/60 bg-slate-950 px-4 py-4">
          <div className="mx-auto max-w-lg">
            <h1 className="text-xl font-bold text-slate-100">{diagnosis.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {seoDescription}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{BRAND_STORY}</p>
            <p className="mt-2 text-xs text-slate-600">
              1問 · {diagnosis.results.length}タイプ · 無料 · ログイン不要
            </p>
          </div>
        </article>
      ) : null}
      <RubelPlayPageClient diagnosisId={id} serverDiagnosis={diagnosis} />
    </>
  );
}
