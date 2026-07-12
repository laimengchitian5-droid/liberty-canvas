import type { Metadata } from "next";
import { LandingHubClient } from "@/components/landing/LandingIntakeClient";
import { getLandingCopy } from "@/lib/landing/landingCopy";
import {
  LANDING_LOCALES,
  LANDING_LOCALE_META,
  isLandingLocale,
  type LandingLocale,
} from "@/lib/landing/landingLocales";
import { LANDING_TOPIC_SLUGS } from "@/lib/landing/landingTopics";
import { notFound } from "next/navigation";

interface DiscoverLocaleHubProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LANDING_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: DiscoverLocaleHubProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLandingLocale(locale)) {
    return { title: "Discover | Rubel Canvas" };
  }

  const titles: Record<LandingLocale, string> = {
    en: "Global Personality Tests — Rubel Canvas Discover",
    ja: "世界の性格診断キーワード — Rubel Canvas Discover",
    ko: "글로벌 성격 검사 키워드 — Rubel Canvas Discover",
    zh: "全球性格测试关键词 — Rubel Canvas Discover",
  };

  return {
    title: titles[locale],
    description:
      "Programmatic SEO landing pages for Big Five, Enneagram, 16Personalities, MBTI and more. One answer → Rubel Canvas AI engine.",
    alternates: {
      languages: Object.fromEntries(
        LANDING_LOCALES.map((code) => [code, `/discover/${code}`]),
      ),
    },
  };
}

export default async function DiscoverLocaleHub({ params }: DiscoverLocaleHubProps) {
  const { locale } = await params;

  if (!isLandingLocale(locale)) {
    notFound();
  }

  const pages = LANDING_TOPIC_SLUGS.map((slug) => {
    const copy = getLandingCopy(slug, locale);
    return { slug, headline: copy.headline, keyword: copy.keyword };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Rubel Canvas Discover (${locale})`,
            inLanguage: LANDING_LOCALE_META[locale].htmlLang,
            hasPart: pages.map((entry) => ({
              "@type": "WebPage",
              url: `/discover/${locale}/${entry.slug}`,
              name: entry.headline,
            })),
          }),
        }}
      />
      <LandingHubClient locale={locale} pages={pages} />
    </>
  );
}
