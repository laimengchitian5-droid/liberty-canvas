import type { Metadata } from "next";
import { LandingIntakeClient } from "@/components/landing/LandingIntakeClient";
import {
  buildLandingJsonLd,
  buildLandingMetadata,
  listLandingStaticParams,
  resolveLandingPage,
} from "@/lib/landing/landingCatalog";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/brand/registry";

interface DiscoverLandingPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return listLandingStaticParams();
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

export default async function DiscoverLandingPage({ params }: DiscoverLandingPageProps) {
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
