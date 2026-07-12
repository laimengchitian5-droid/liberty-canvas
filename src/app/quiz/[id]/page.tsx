import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { QuizLdJson } from "@/app/quiz/[id]/ld-json";
import { QuizPageShell } from "@/app/quiz/[id]/QuizPageShell";
import { getCustomQuizById } from "@/lib/quiz/repository";
import {
  buildQuizOgImageUrl,
  buildQuizPageUrl,
  getSiteUrl,
} from "@/lib/site/url";
import styles from "./page.module.css";

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { id } = await params;
  const quiz = await getCustomQuizById(id);

  if (!quiz) {
    return {
      title: "クイズが見つかりません",
      robots: { index: false, follow: false },
    };
  }

  const pageUrl = buildQuizPageUrl(quiz.id);
  const ogImageUrl = buildQuizOgImageUrl(quiz.id);
  const title = `${quiz.title} | パーソナリティ診断`;
  const description = quiz.description;
  const siteName = "LibertyCanvas";

  return {
    title,
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      url: pageUrl,
      siteName,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${quiz.title} preview image`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@personalityquiz",
      creator: "@personalityquiz",
      title,
      description,
      images: {
        url: ogImageUrl,
        alt: `${quiz.title} preview image`,
      },
    },
    appleWebApp: {
      capable: true,
      title: quiz.title.slice(0, 12),
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { id } = await params;
  const quiz = await getCustomQuizById(id);

  if (!quiz) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <QuizLdJson quiz={quiz} />

      <article className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>ユーザー作成クイズ</p>
          <h1 className={styles.title}>{quiz.title}</h1>
          <p className={styles.description}>{quiz.description}</p>
        </header>

        <div className={styles.metaGrid} role="group" aria-label="Quiz metadata">
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>質問数</span>
            <strong className={styles.metaValue}>{quiz.questions.length}</strong>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>結果タイプ</span>
            <strong className={styles.metaValue}>
              {quiz.resultsMapping.length}
            </strong>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>作成者 ID</span>
            <strong className={styles.metaValue}>{quiz.authorId}</strong>
          </div>
        </div>

        <QuizPageShell quiz={quiz} />

        <div className={styles.ctaRow}>
          <Link className={styles.ctaButton} href="/">
            ホームに戻る
          </Link>
        </div>
      </article>
    </main>
  );
}
