import type { Metadata } from "next";
import Link from "next/link";
import {
  LANDING_DISCOVER_IDENTITY_JA,
  LANDING_DISCOVER_NAME,
  LANDING_DISCOVER_NAME_JA,
} from "@/lib/landing/landingBrand";
import { buildDiscoverLocaleAlternates } from "@/lib/seo/hreflang";
import { buildGenericOgImageUrl } from "@/lib/seo/ogUrls";
import {
  buildDiscoverHubCollectionPage,
  buildDiscoverWebSiteEntity,
  buildOrganizationEntity,
  mergeSchemaGraphs,
} from "@/lib/seo/schemaGraph";
import { LANDING_LOCALES, LANDING_LOCALE_META } from "@/lib/landing/landingLocales";
import { getSiteUrl } from "@/lib/site/url";

/** Phase 8C — JA-first hub (GSC clicks are Japan-heavy). */
const DISCOVER_HUB_LEAD_JA =
  "無料の性格診断キーワードから、1回答で本編へ。ビッグファイブ・動機スペクトル・シャドウまで。";
const DISCOVER_HUB_LEAD_EN =
  "From global personality keywords to one-answer Liberty Plug quizzes — Big Five, motivation spectrum, shadow themes.";

export const metadata: Metadata = {
  title: `性格診断ディスカバー｜${LANDING_DISCOVER_NAME}`,
  description: DISCOVER_HUB_LEAD_JA,
  alternates: {
    canonical: `${getSiteUrl()}/discover`,
    languages: buildDiscoverLocaleAlternates(),
  },
  openGraph: {
    title: `性格診断ディスカバー｜${LANDING_DISCOVER_NAME}`,
    description: DISCOVER_HUB_LEAD_JA,
    url: `${getSiteUrl()}/discover`,
    siteName: LANDING_DISCOVER_NAME,
    locale: "ja_JP",
    images: [{ url: buildGenericOgImageUrl(), width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function DiscoverIndexPage() {
  const siteUrl = getSiteUrl();
  const jsonLd = mergeSchemaGraphs({
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationEntity(siteUrl),
      buildDiscoverWebSiteEntity(siteUrl),
      {
        ...buildDiscoverHubCollectionPage(siteUrl),
        alternateName: LANDING_DISCOVER_IDENTITY_JA,
        description: DISCOVER_HUB_LEAD_JA,
        inLanguage: ["ja", "en", "ko", "zh", "fr", "de"],
      },
    ],
  });

  return (
    <main className="mx-auto min-h-[100dvh] max-w-md bg-slate-950 px-4 py-10 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-2xl font-bold">{LANDING_DISCOVER_NAME_JA}</h1>
      <p className="mt-2 text-sm text-slate-400">{LANDING_DISCOVER_IDENTITY_JA}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">{DISCOVER_HUB_LEAD_JA}</p>
      <p className="mt-2 text-sm text-slate-500">{DISCOVER_HUB_LEAD_EN}</p>
      <p className="mt-4 text-sm text-slate-400">地域を選んでください / Pick your region:</p>
      <ul className="mt-6 grid gap-3">
        {LANDING_LOCALES.map((locale) => (
          <li key={locale}>
            <Link
              href={`/discover/${locale}`}
              className="block rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 hover:border-indigo-400/40"
              hrefLang={LANDING_LOCALE_META[locale].htmlLang}
            >
              <span className="font-semibold">{LANDING_LOCALE_META[locale].label}</span>
              <span className="mt-1 block text-xs uppercase text-slate-500">
                {locale}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
