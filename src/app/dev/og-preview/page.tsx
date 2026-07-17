import type { Metadata } from "next";
import Link from "next/link";
import { buildOgPalette } from "@/lib/brand/ogBrand";
import { SUB_BRAND_IDS, getBrand } from "@/lib/brand/registry";

export const metadata: Metadata = {
  title: "OG Preview — Dev",
  robots: { index: false, follow: false },
};

const OG_SAMPLES = [
  { label: "心の色診断（Generic）", href: "/api/og/diagnosis" },
  { label: "Plug slug", href: "/api/og/diagnosis?slug=personality-spectrum" },
  { label: "世界名産ソウル B", href: "/api/og/diagnosis?slug=world-specialty-soul" },
  {
    label: "世界名産ソウル 結果",
    href: "/api/og/diagnosis?slug=world-specialty-soul&archetype=lc-specialty-jp-winter-brewer",
  },
  { label: "麹魂 C", href: "/api/og/diagnosis?slug=jp-sakamai-craft" },
  { label: "テロワール C", href: "/api/og/diagnosis?slug=fr-terroir-poet" },
  { label: "Play headline", href: "/api/og/diagnosis?headline=Test%20Quiz" },
  { label: "Quiz runtime", href: "/api/og/quiz?id=rubel-introvert-level-v1" },
] as const;

const OgPreviewPage = () => {
  if (process.env.NODE_ENV === "production") {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Not Found</h1>
      </main>
    );
  }

  const canvasPalette = buildOgPalette("liberty-canvas");

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: 960,
        margin: "0 auto",
      }}
    >
      <h1>OG Preview (dev only)</h1>
      <p style={{ color: canvasPalette.muted }}>
        Registry palette: {canvasPalette.nameJa} · accent {canvasPalette.accent}
      </p>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Brand registry</h2>
        <ul>
          {SUB_BRAND_IDS.map((id) => {
            const brand = getBrand(id);
            const palette = buildOgPalette(id);
            return (
              <li key={id}>
                {brand.nameJa} — {palette.accent}
              </li>
            );
          })}
        </ul>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Sample OG endpoints</h2>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1.5rem" }}>
          {OG_SAMPLES.map((sample) => (
            <li key={sample.href}>
              <Link href={sample.href} target="_blank" rel="noopener noreferrer">
                {sample.label}
              </Link>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sample.href}
                alt={sample.label}
                width={600}
                height={315}
                style={{
                  display: "block",
                  marginTop: "0.5rem",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default OgPreviewPage;
