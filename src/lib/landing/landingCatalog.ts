import type { Metadata } from "next";
import type { LandingPageCopy } from "@/lib/landing/landingCopy";
import type { LandingLocale } from "@/lib/landing/landingLocales";
import { LANDING_LOCALES, LANDING_LOCALE_META } from "@/lib/landing/landingLocales";
import type { LandingTopicConfig } from "@/lib/landing/landingTopics";
import { getLandingCopy } from "@/lib/landing/landingCopy";
import { getLandingTopic, LANDING_TOPIC_SLUGS, LANDING_TOPICS } from "@/lib/landing/landingTopics";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import { getSiteUrl } from "@/lib/site/url";

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

export function listLandingStaticParams(): Array<{ locale: string; slug: string }> {
  return LANDING_TOPIC_SLUGS.flatMap((slug) =>
    LANDING_LOCALES.map((locale) => ({ locale, slug })),
  );
}

export function buildLandingMetadata(page: LandingPageDefinition): Metadata {
  const meta = LANDING_LOCALE_META[page.locale];
  const languages: Record<string, string> = {};

  for (const locale of LANDING_LOCALES) {
    languages[locale] = buildLandingPath(locale, page.slug);
  }

  return {
    title: page.copy.title,
    description: page.copy.metaDescription,
    keywords: page.copy.keywords,
    alternates: {
      canonical: page.absoluteUrl,
      languages,
    },
    openGraph: {
      title: page.copy.title,
      description: page.copy.metaDescription,
      url: page.absoluteUrl,
      siteName: PRODUCT_NAME,
      locale: meta.ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.copy.headline,
      description: page.copy.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export function buildLandingJsonLd(page: LandingPageDefinition) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": page.topic.schemaType,
        "@id": `${page.absoluteUrl}#assessment`,
        name: page.copy.schemaName,
        description: page.copy.schemaDescription,
        url: page.absoluteUrl,
        inLanguage: LANDING_LOCALE_META[page.locale].htmlLang,
        isAccessibleForFree: true,
        provider: {
          "@type": "Organization",
          name: PRODUCT_NAME,
          url: siteUrl,
          alternateName: "liberty-canvas",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${page.absoluteUrl}#faq`,
        mainEntity: page.copy.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "WebPage",
        "@id": page.absoluteUrl,
        name: page.copy.title,
        description: page.copy.metaDescription,
        inLanguage: LANDING_LOCALE_META[page.locale].htmlLang,
        isPartOf: {
          "@type": "WebSite",
          name: PRODUCT_NAME,
          url: siteUrl,
        },
      },
    ],
  };
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
