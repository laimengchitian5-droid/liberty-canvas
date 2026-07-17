import type { Metadata } from "next";
import { LandingHubClient } from "@/components/landing/LandingIntakeClient";
import { getLandingCopy } from "@/lib/landing/landingCopy";
import {
  LANDING_DISCOVER_NAME,
  LANDING_DISCOVER_IDENTITY_JA,
} from "@/lib/landing/landingBrand";
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
    return { title: `Discover | ${LANDING_DISCOVER_NAME}` };
  }

  const titles: Record<LandingLocale, string> = {
    en: `Global Personality Tests — ${LANDING_DISCOVER_NAME}`,
    ja: `世界の性格診断キーワード — ${LANDING_DISCOVER_NAME}`,
    ko: `글로벌 성격 검사 키워드 — ${LANDING_DISCOVER_NAME}`,
    zh: `全球性格测试关键词 — ${LANDING_DISCOVER_NAME}`,
    fr: `Tests de personnalité mondiaux — ${LANDING_DISCOVER_NAME}`,
    de: `Globale Persönlichkeitstests — ${LANDING_DISCOVER_NAME}`,
  };

  return {
    title: titles[locale],
    description:
      locale === "ja"
        ? `${LANDING_DISCOVER_IDENTITY_JA} — 1回答から Liberty Plug 診断へ。`
        : `Which nation's culinary terroir echoes your implicit data profile? One answer → ${LANDING_DISCOVER_NAME} → Liberty Plug.`,
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
            name: `${LANDING_DISCOVER_NAME} (${locale})`,
            alternateName: LANDING_DISCOVER_IDENTITY_JA,
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
