import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingIntakeClient } from "@/components/landing/LandingIntakeClient";
import { getBrand } from "@/lib/brand/registry";
import {
  buildLandingJsonLd,
  buildLandingMetadata,
  resolveLandingPage,
} from "@/lib/landing/landingCatalog";
import { generateAllPseoRoutes } from "@/lib/station/pseoManifestEngine";

/**
 * Discover pSEO SSG — locale × topic landings that hand off to first-party play.
 *
 * Sketch map (do NOT ship the thin outbound LP):
 * - `PSEO_REGISTRY.entries()` static params → {@link generateAllPseoRoutes}
 * - `getPageMetadata` + `targetRedirectUrl` → {@link resolveLandingPage} + catalog
 * - Conductor `.ctaBoarding` + inline `<main>` → {@link LandingIntakeClient}
 *
 * Rejected sketch defects (do not reintroduce):
 * - `@/src/...` · IdentityHubConductor CSS on Discover · navy/inline LP styles
 * - `target="_blank"` to external assessment vendors (16personalities et al.)
 * - always `robots: { index: true }` (use {@link buildLandingMetadata} / index policy)
 * - dropping JSON-LD · `notFound()` fail-closed · LandingIntakeClient
 * - Page-local `GlobalNavbar` / stacking a second header over AppShell
 * - claiming “197カ国” SSG from a 2-slug hand Map
 *
 * Do not conflate with `/diagnosis/play/[slug]` (Plug compiler runtime).
 */
interface DiscoverLandingPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return generateAllPseoRoutes();
}

export async function generateMetadata({
  params,
}: DiscoverLandingPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = resolveLandingPage(locale, slug);

  if (!page) {
    return { title: `${getBrand("liberty-discover").name} Discover` };
  }

  return buildLandingMetadata(page);
}

export default async function DiscoverLandingPage({
  params,
}: DiscoverLandingPageProps) {
  const { locale, slug } = await params;
  const page = resolveLandingPage(locale, slug);

  if (!page) {
    notFound();
  }

  const jsonLd = buildLandingJsonLd(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingIntakeClient page={page} />
    </>
  );
}
