/**
 * Offline generator for artifacts/sitemap-resubmit.xml (optional local artifact).
 * Do NOT write under public/ — that would shadow App Router /sitemap-resubmit.xml.
 *
 * Prefer live URL after deploy: https://{host}/sitemap-resubmit.xml
 *
 *   NEXT_PUBLIC_SITE_URL=https://your.domain node scripts/generate-resubmit-sitemap.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

const LOCALES = ["en", "ja", "ko", "zh", "fr", "de"];

/** Keep in sync with LANDING_TOPIC_SLUGS − upcoming specialty countries. */
const INDEXABLE_LANDING_SLUGS = [
  "big-five-ocean",
  "enneagram-nine-types",
  "sixteen-personalities",
  "mbti-personality-types",
  "introvert-personality",
  "love-language-test",
  "attachment-style",
  "burnout-personality",
  "inner-child-healing",
  "shadow-self-archetype",
  "world-specialty-soul",
  "jp-sakamai-craft",
  "fr-terroir-poet",
  "uk-maturation-highlander",
];

/** Keep in sync with listPlugDiagnosisSlugs() (live plug + live specialty only). */
const PLUG_SLUGS = [
  "oshikatsu",
  "romance",
  "genz",
  "big-five",
  "motivation-spectrum",
  "personality-spectrum",
  "world-specialty-soul",
  "jp-sakamai-craft",
  "fr-terroir-poet",
  "uk-maturation-highlander",
];

/** Keep in sync with SEED_DIAGNOSES ids. */
const PLAY_IDS = [
  "rubel-neko-ja-v1",
  "rubel-cat-dog-v1",
  "rubel-introvert-level-v1",
  "rubel-burnout-v1",
  "rubel-ura-seishiki-v1",
];

const CATEGORIES = ["empathy", "logic", "creativity", "leadership"];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function url(path, changefreq, priority) {
  return { loc: `${SITE}${path}`, changefreq, priority };
}

function main() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries = [
    url("", "daily", 1),
    url("/discover", "weekly", 0.9),
    url("/play", "weekly", 0.9),
    url("/create", "weekly", 0.95),
    url("/diagnosis", "weekly", 0.7),
    ...LOCALES.map((locale) => url(`/discover/${locale}`, "weekly", 0.85)),
    ...INDEXABLE_LANDING_SLUGS.flatMap((slug) =>
      LOCALES.map((locale) => url(`/discover/${locale}/${slug}`, "weekly", 0.88)),
    ),
    ...PLUG_SLUGS.map((slug) => url(`/diagnosis/play/${slug}`, "weekly", 0.93)),
    ...PLAY_IDS.map((id) => url(`/play/${id}`, "weekly", 0.92)),
    ...CATEGORIES.map((category) => url(`/diagnosis/result/${category}`, "monthly", 0.6)),
  ];

  const deduped = [...new Map(entries.map((e) => [e.loc, e])).values()].sort((a, b) =>
    a.loc.localeCompare(b.loc),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${deduped
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const outPath = join(root, "artifacts", "sitemap-resubmit.xml");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, xml, "utf8");

  console.log(`[sitemap:resubmit] ${deduped.length} URLs → ${outPath}`);
  console.log(`[sitemap:resubmit] siteUrl=${SITE}`);
  console.log(
    `[sitemap:resubmit] After deploy submit GSC: ${SITE}/sitemap.xml and ${SITE}/sitemap-resubmit.xml`,
  );
}

main();
