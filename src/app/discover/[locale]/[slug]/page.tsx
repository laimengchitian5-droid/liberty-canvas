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
 * Rejected sketch defects (do not reintroduce):
 * - Page-local `GlobalNavbar` (Discover is immersive → AppShell brand bar;
 *   never stack a second header or fork GlobalNav)
 * - `@/src/...` · Conductor CSS · navy inline LP · 16personalities outbound
 * - `getPageMetadata` / `targetRedirectUrl` (use resolveLandingPage + catalog)
 * - Drop LandingIntakeClient / JSON-LD / notFound fail-closed
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
