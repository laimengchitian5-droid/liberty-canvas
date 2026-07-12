import type { Metadata } from "next";

import Link from "next/link";

import { notFound } from "next/navigation";

import {

  buildDiagnosisOgImageUrl,

  buildDiagnosisResultPageUrl,

  getDiagnosisResult,

  isPersonalityCategory,

} from "@/lib/diagnosis/share";

import { DIAGNOSIS_TYPE_EDITORIAL } from "@/lib/diagnosis/seoContent";

import { buildDiagnosisResultPageJsonLd } from "@/lib/diagnosis/structuredData";

import { PERSONALITY_CATEGORIES } from "@/types/diagnosis";

import styles from "@/components/diagnosis/diagnosis.module.css";

import seoStyles from "@/components/diagnosis/diagnosisSeo.module.css";



interface ResultPageProps {

  params: Promise<{ category: string }>;

}



export function generateStaticParams() {

  return PERSONALITY_CATEGORIES.map((category) => ({ category }));

}



export async function generateMetadata({

  params,

}: ResultPageProps): Promise<Metadata> {

  const { category } = await params;



  if (!isPersonalityCategory(category)) {

    return {};

  }



  const result = getDiagnosisResult(category);

  const editorial = DIAGNOSIS_TYPE_EDITORIAL[category];

  const pageUrl = buildDiagnosisResultPageUrl(category);

  const ogImage = buildDiagnosisOgImageUrl(category);

  const description = `${result.subtitle}。${editorial.overview.slice(0, 100)}…`;



  return {

    title: `${result.title} | 心の色診断`,

    description,

    alternates: { canonical: pageUrl },

    openGraph: {

      type: "website",

      url: pageUrl,

      title: result.title,

      description: result.subtitle,

      images: [{ url: ogImage, width: 1200, height: 630, alt: result.title }],

      locale: "ja_JP",

    },

    twitter: {

      card: "summary_large_image",

      title: result.title,

      description: result.subtitle,

      images: [ogImage],

    },

  };

}



export default async function DiagnosisResultPage({ params }: ResultPageProps) {

  const { category } = await params;



  if (!isPersonalityCategory(category)) {

    notFound();

  }



  const result = getDiagnosisResult(category);

  const editorial = DIAGNOSIS_TYPE_EDITORIAL[category];

  const pageUrl = buildDiagnosisResultPageUrl(category);

  const jsonLd = buildDiagnosisResultPageJsonLd(category, result);



  return (

    <main className={styles.shell}>

      <script

        type="application/ld+json"

        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}

      />

      <div className={styles.container}>

        <article

          id="diagnosis-result-print"

          className={styles.card}

          style={{ borderColor: `${result.themeColor}33` }}

        >

          <p className={styles.resultBadge}>診断結果タイプ</p>

          <h1 className={styles.resultTitle}>{result.title}</h1>

          <p className={styles.resultSubtitle}>{result.subtitle}</p>

          <p className={styles.resultAnalysis}>{result.baseAnalysis}</p>

          <p className={styles.resultAnalysis}>{editorial.overview}</p>



          <h2 className={seoStyles.subheading}>このタイプの強み</h2>

          <ul className={seoStyles.steps}>

            {editorial.strengths.map((item) => (

              <li key={item}>{item}</li>

            ))}

          </ul>



          <h2 className={seoStyles.subheading}>力を発揮しやすい場面</h2>

          <p className={styles.resultAnalysis}>{editorial.whenToShine}</p>



          <div className={styles.actions}>

            <Link

              href="/diagnosis"

              className={styles.primaryButton}

              style={{ textDecoration: "none" }}

            >

              あなたも診断する

            </Link>

            <Link

              href="/diagnosis/play/personality-spectrum"

              className={styles.secondaryButton}

              style={{

                textDecoration: "none",

                display: "inline-flex",

                alignItems: "center",

                justifyContent: "center",

              }}

            >

              深掘り Assessment

            </Link>

          </div>

          <p className={styles.sharePreview}>

            <Link href={pageUrl}>{pageUrl}</Link>

          </p>

        </article>

      </div>

    </main>

  );

}


