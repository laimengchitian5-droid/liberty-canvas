import type { Metadata } from "next";
import { getDiagnosisById, getSeedDiagnosisById } from "@/lib/rubel/repository";
import { SEED_DIAGNOSES } from "@/lib/rubel/seedDiagnoses";
import {
  buildPlayPageDescription,
  buildPlayPageJsonLd,
  buildPlayPageTitle,
  BRAND_NARRATIVE,
} from "@/lib/rubel/rubelSeo";
import { RubelPlayPageClient } from "@/components/rubel/RubelPlayPageClient";
import { getSiteUrl } from "@/lib/site/url";
import { buildPlayOgImageUrl, buildPlayResultOgImageUrl } from "@/lib/seo/ogUrls";
import { getBrand } from "@/lib/brand/registry";

const playBrand = getBrand("liberty-play");

const BRAND_STORY = BRAND_NARRATIVE;

interface PlayPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ r?: string }>;
}

export function generateStaticParams() {
  return SEED_DIAGNOSES.map((diagnosis) => ({ id: diagnosis.id }));
}

export async function generateMetadata({
  params,
  searchParams,
}: PlayPageProps): Promise<Metadata> {
  const { id } = await params;
  const query = await searchParams;
  const diagnosis = getSeedDiagnosisById(id) ?? (await getDiagnosisById(id));
  const siteUrl = getSiteUrl();

  if (!diagnosis) {
    return {
      title: `性格診断が見つかりません | ${playBrand.name}`,
      description: `${playBrand.name} — ${playBrand.taglineJa}`,
      robots: { index: false, follow: true },
    };
  }

  const resultName = query.r?.trim().slice(0, 80);
  const matchedResult = resultName
    ? diagnosis.results.find((entry) => entry.name === resultName)
    : null;

  const title = matchedResult
    ? `${matchedResult.name} — ${diagnosis.title}`
    : buildPlayPageTitle(diagnosis);
  const description = matchedResult
    ? `${matchedResult.name} — ${buildPlayPageDescription(diagnosis)}`
    : buildPlayPageDescription(diagnosis);
  const playUrl = matchedResult
    ? `${siteUrl}/play/${diagnosis.id}?r=${encodeURIComponent(matchedResult.name)}`
    : `${siteUrl}/play/${diagnosis.id}`;
  const ogImage = matchedResult
    ? buildPlayResultOgImageUrl(matchedResult.name, diagnosis.title)
    : buildPlayOgImageUrl(diagnosis.title, description);

  return {
    title,
    description,
    keywords: diagnosis.searchKeywords,
    alternates: { canonical: `${siteUrl}/play/${diagnosis.id}` },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title,
      description,
      url: playUrl,
      siteName: playBrand.name,
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
  const diagnosis = getSeedDiagnosisById(id) ?? (await getDiagnosisById(id));
  const jsonLd = diagnosis ? buildPlayPageJsonLd(diagnosis) : null;
  const seoDescription = diagnosis ? buildPlayPageDescription(diagnosis) : null;

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
