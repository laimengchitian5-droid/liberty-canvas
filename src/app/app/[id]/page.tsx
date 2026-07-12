import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppRuntimeShell } from "@/app/app/[id]/AppRuntimeShell";
import { AppLdJson } from "@/app/app/[id]/ld-json";
import { getAppById } from "@/lib/apps/repository";
import {
  buildAppOgImageUrl,
  buildAppPageUrl,
  getSiteUrl,
} from "@/lib/site/url";
import styles from "./page.module.css";

interface AppPageProps {
  params: Promise<{ id: string }>;
}

function buildAppTitle(appTitle: string, appType: string): string {
  const suffix =
    appType === "assessment"
      ? "Assessment"
      : appType === "ai_agent"
        ? "AI Agent"
        : "Universal Tool";

  return `${appTitle} | LibertyCanvas ${suffix}`;
}

export async function generateMetadata({
  params,
}: AppPageProps): Promise<Metadata> {
  const { id } = await params;
  const app = await getAppById(id);

  if (!app) {
    return {
      title: "App not found",
      robots: { index: false, follow: false },
    };
  }

  const pageUrl = buildAppPageUrl(app.id);
  const ogImageUrl = buildAppOgImageUrl(app.id);
  const title = buildAppTitle(app.title, app.appType);
  const description = app.description;

  return {
    title,
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      url: pageUrl,
      siteName: "LibertyCanvas",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${app.title} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: { index: true, follow: true },
  };
}

export default async function AppPage({ params }: AppPageProps) {
  const { id } = await params;
  const app = await getAppById(id);

  if (!app) {
    notFound();
  }

  const appTypeLabel =
    app.appType === "ai_agent"
      ? "AI Agent"
      : app.appType === "assessment"
        ? "Assessment"
        : app.appType === "interactive_media"
          ? "Interactive Media"
          : "Custom Tool";

  return (
    <main className={styles.page}>
      <AppLdJson app={app} />

      <article className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>LibertyCanvas Runtime</p>
          <h1 className={styles.title}>{app.title}</h1>
          <p className={styles.description}>{app.description}</p>
        </header>

        <div className={styles.metaGrid} role="group" aria-label="App metadata">
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>App Type</span>
            <strong className={styles.metaValue}>{appTypeLabel}</strong>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Author</span>
            <strong className={styles.metaValue}>{app.authorId}</strong>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Published</span>
            <strong className={styles.metaValue}>
              {new Date(app.createdAt).toLocaleDateString("ja-JP")}
            </strong>
          </div>
        </div>

        <AppRuntimeShell app={app} />

        <div className={styles.ctaRow}>
          <Link className={styles.ctaButton} href="/">
            Back to Explore Hub
          </Link>
        </div>
      </article>
    </main>
  );
}
