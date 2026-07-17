import type { Metadata } from "next";
import Link from "next/link";
import { getBrand } from "@/lib/brand/registry";
import { resolveBrandAbsolute, resolveBrandPath } from "@/lib/brand/urlResolver";
import { listPlayCatalogEntries } from "@/lib/catalog/unifiedDiscoveryCatalog";
import { buildPlayOgImageUrl } from "@/lib/seo/ogUrls";
import a11y from "@/styles/accessibility.module.css";

const playBrand = getBrand("liberty-play");

export const metadata: Metadata = {
  title: `${playBrand.nameJa} — 1問クイズ・カタログ`,
  description: playBrand.taglineJa,
  alternates: { canonical: resolveBrandAbsolute("liberty-play", "hub") },
  openGraph: {
    title: playBrand.name,
    description: playBrand.taglineJa,
    url: resolveBrandAbsolute("liberty-play", "hub"),
    siteName: playBrand.name,
    images: [
      {
        url: buildPlayOgImageUrl(playBrand.name, playBrand.taglineJa),
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: { index: true, follow: true },
};

/**
 * Liberty Play catalogue / marketplace portal.
 * Backed by unifiedDiscoveryCatalog (rubel-quick) — no seed duplication.
 */
export default async function PlayCataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = await searchParams;
  const diagnoses = await listPlayCatalogEntries({
    query: query.q,
    sort: "trending",
    limit: 48,
  });
  const hubPath = resolveBrandPath("liberty-play", "hub");

  return (
    <main className="mx-auto min-h-[100dvh] max-w-lg bg-slate-950 px-4 py-10 text-slate-100">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
        {playBrand.name}
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight">
        {playBrand.nameJa}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        {playBrand.taglineJa}。気になる診断を選んで、すぐに1問クイズを楽しめます。
      </p>

      <form className="mt-6" action={hubPath} method="get" role="search">
        <label className="sr-only" htmlFor="play-catalog-q">
          カタログ検索
        </label>
        <input
          id="play-catalog-q"
          name="q"
          type="search"
          defaultValue={query.q ?? ""}
          placeholder="タイトルで検索…"
          className={`w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 ${a11y.focusRing}`}
        />
      </form>

      <ul className="mt-8 grid gap-3" aria-label="Play 診断カタログ">
        {diagnoses.length === 0 ? (
          <li className="rounded-2xl border border-white/10 px-4 py-6 text-sm text-slate-400">
            該当する診断が見つかりませんでした。
          </li>
        ) : (
          diagnoses.map((diagnosis) => (
            <li key={diagnosis.id}>
              <Link
                href={diagnosis.href}
                className={`block rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 transition hover:border-indigo-400/40 ${a11y.focusRing}`}
              >
                <span className="block text-base font-semibold text-slate-50">
                  {diagnosis.title}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  {diagnosis.subtitle}
                  {diagnosis.trendingLabel ? ` · ${diagnosis.trendingLabel}` : ""}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
