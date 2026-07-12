import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCT_NAME, PRODUCT_TAGLINE_EN } from "@/lib/brand/constants";
import { buildDiscoverLocaleAlternates } from "@/lib/seo/hreflang";
import { buildGenericOgImageUrl } from "@/lib/seo/ogUrls";
import { LANDING_LOCALES, LANDING_LOCALE_META } from "@/lib/landing/landingLocales";
import { getSiteUrl } from "@/lib/site/url";

export const metadata: Metadata = {
  title: `Discover — Global Personality SEO Hub | ${PRODUCT_NAME}`,
  description: PRODUCT_TAGLINE_EN,
  alternates: {
    canonical: `${getSiteUrl()}/discover`,
    languages: buildDiscoverLocaleAlternates(),
  },
  openGraph: {
    title: `Discover | ${PRODUCT_NAME}`,
    description: PRODUCT_TAGLINE_EN,
    url: `${getSiteUrl()}/discover`,
    siteName: PRODUCT_NAME,
    images: [{ url: buildGenericOgImageUrl(), width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function DiscoverIndexPage() {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${PRODUCT_NAME} Discover`,
    description: PRODUCT_TAGLINE_EN,
    url: `${siteUrl}/discover`,
    inLanguage: ["ja", "en", "ko", "zh"],
    isPartOf: {
      "@type": "WebSite",
      name: PRODUCT_NAME,
      url: siteUrl,
    },
  };

  return (
    <main className="mx-auto min-h-[100dvh] max-w-md bg-slate-950 px-4 py-10 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-2xl font-bold">{PRODUCT_NAME} Discover</h1>
      <p className="mt-2 text-sm text-slate-400">
        Programmatic SEO — pick your region:
      </p>
      <ul className="mt-6 grid gap-3">
        {LANDING_LOCALES.map((locale) => (
          <li key={locale}>
            <Link
              href={`/discover/${locale}`}
              className="block rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 hover:border-indigo-400/40"
              hrefLang={LANDING_LOCALE_META[locale].htmlLang}
            >
              <span className="font-semibold">{LANDING_LOCALE_META[locale].label}</span>
              <span className="mt-1 block text-xs uppercase text-slate-500">{locale}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
