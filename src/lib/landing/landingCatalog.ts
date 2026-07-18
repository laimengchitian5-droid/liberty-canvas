import type { Metadata } from "next";
import type { LandingFaqItem, LandingPageCopy } from "@/lib/landing/landingCopy";
import type { LandingLocale } from "@/lib/landing/landingLocales";
import { LANDING_LOCALES, LANDING_LOCALE_META } from "@/lib/landing/landingLocales";
import type { LandingTopicConfig } from "@/lib/landing/landingTopics";
import { getLandingCopy } from "@/lib/landing/landingCopy";
import {
  getLandingTopic,
  LANDING_TOPIC_SLUGS,
  LANDING_TOPICS,
} from "@/lib/landing/landingTopics";
import { LANDING_DISCOVER_NAME } from "@/lib/landing/landingBrand";
import {
  resolveLandingCanonicalPath,
  shouldIndexLandingSlug,
} from "@/lib/landing/landingIndexPolicy";
import { resolveLandingOgImageUrl } from "@/lib/landing/landingOg";
import { getSiteUrl } from "@/lib/site/url";
import {
  buildDiscoverLandingAssessmentEntity,
  buildDiscoverLandingWebPageEntity,
  buildDiscoverWebSiteEntity,
  buildOrganizationEntity,
  mergeSchemaGraphs,
} from "@/lib/seo/schemaGraph";

const MAX_FAQ_SCHEMA_ITEMS = 6;

function buildFaqPageEntity(
  absoluteUrl: string,
  faq: readonly LandingFaqItem[],
): Record<string, unknown> | null {
  const mainEntity = faq
    .filter((item) => item.question.trim().length > 0 && item.answer.trim().length > 0)
    .slice(0, MAX_FAQ_SCHEMA_ITEMS)
    .map((item) => ({
      "@type": "Question" as const,
      name: item.question.trim(),
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.answer.trim(),
      },
    }));

  if (mainEntity.length === 0) {
    return null;
  }

  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl}#faq`,
    mainEntity,
  };
}

export interface LandingPageDefinition {
  locale: LandingLocale;
  slug: string;
  topic: LandingTopicConfig;
  copy: LandingPageCopy;
  path: string;
  absoluteUrl: string;
}

export function buildLandingPath(locale: LandingLocale, slug: string): string {
  return `/discover/${locale}/${slug}`;
}

export function buildLandingPageDefinition(
  locale: LandingLocale,
  slug: string,
): LandingPageDefinition | null {
  const topic = getLandingTopic(slug);

  if (!topic) {
    return null;
  }

  const copy = getLandingCopy(topic.slug, locale);
  const path = buildLandingPath(locale, slug);
  const siteUrl = getSiteUrl();

  return {
    locale,
    slug,
    topic,
    copy,
    path,
    absoluteUrl: `${siteUrl}${path}`,
  };
}

export function listAllLandingPages(): LandingPageDefinition[] {
  const pages: LandingPageDefinition[] = [];

  for (const topic of LANDING_TOPICS) {
    for (const locale of LANDING_LOCALES) {
      const page = buildLandingPageDefinition(locale, topic.slug);
      if (page) {
        pages.push(page);
      }
    }
  }

  return pages;
}

/** Indexable Discover landings only — excludes upcoming specialty bait URLs. */
export function listIndexableLandingPages(): LandingPageDefinition[] {
  return listAllLandingPages().filter((page) => shouldIndexLandingSlug(page.slug));
}

export function listLandingStaticParams(): Array<{ locale: string; slug: string }> {
  return LANDING_TOPIC_SLUGS.flatMap((slug) =>
    LANDING_LOCALES.map((locale) => ({ locale, slug })),
  );
}

export function buildLandingMetadata(page: LandingPageDefinition): Metadata {
  const meta = LANDING_LOCALE_META[page.locale];
  const languages: Record<string, string> = {};
  const indexable = shouldIndexLandingSlug(page.slug);
  const canonicalPath = resolveLandingCanonicalPath(page.locale, page.slug);
  const canonicalUrl = `${getSiteUrl()}${canonicalPath}`;
  const ogImageUrl = resolveLandingOgImageUrl(
    page.topic.plugPlayPath,
    page.copy.headline,
    page.copy.metaDescription,
  );
  const ogImages = [{ url: ogImageUrl, width: 1200, height: 630, alt: page.copy.headline }];

  for (const locale of LANDING_LOCALES) {
    languages[locale] = resolveLandingCanonicalPath(locale, page.slug);
  }

  return {
    title: page.copy.title,
    description: page.copy.metaDescription,
    keywords: page.copy.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: page.copy.title,
      description: page.copy.metaDescription,
      url: canonicalUrl,
      siteName: LANDING_DISCOVER_NAME,
      locale: meta.ogLocale,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: page.copy.headline,
      description: page.copy.metaDescription,
      images: [ogImageUrl],
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
  };
}

export function buildLandingJsonLd(page: LandingPageDefinition) {
  const siteUrl = getSiteUrl();
  const htmlLang = LANDING_LOCALE_META[page.locale].htmlLang;
  const faqNode = buildFaqPageEntity(page.absoluteUrl, page.copy.faq);
  const graph: Record<string, unknown>[] = [
    buildOrganizationEntity(siteUrl),
    buildDiscoverWebSiteEntity(siteUrl),
    buildDiscoverLandingAssessmentEntity({
      absoluteUrl: page.absoluteUrl,
      schemaType: page.topic.schemaType,
      name: page.copy.schemaName,
      description: page.copy.schemaDescription,
      inLanguage: htmlLang,
      siteUrl,
    }),
    buildDiscoverLandingWebPageEntity({
      absoluteUrl: page.absoluteUrl,
      name: page.copy.title,
      description: page.copy.metaDescription,
      inLanguage: htmlLang,
      siteUrl,
    }),
  ];

  if (faqNode) {
    graph.push(faqNode);
  }

  return mergeSchemaGraphs({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}

export function resolveLandingPage(
  locale: string,
  slug: string,
): LandingPageDefinition | null {
  if (!LANDING_LOCALES.includes(locale as LandingLocale)) {
    return null;
  }

  return buildLandingPageDefinition(locale as LandingLocale, slug);
}
