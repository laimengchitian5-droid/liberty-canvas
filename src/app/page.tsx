import type { Metadata } from "next";
import { Suspense } from "react";
import { RubelDiscoveryHub } from "@/components/rubel/RubelDiscoveryHub";
import { PlugDiscoveryStrip } from "@/components/catalog/PlugDiscoveryStrip";
import {
  buildHomeDescription,
  buildHomeJsonLd,
  buildHomeKeywords,
  buildHomeOpenGraph,
  buildHomeTitle,
  buildHomeTwitter,
} from "@/lib/rubel/rubelSeo";
import { listDiagnoses } from "@/lib/rubel/repository";
import { generateUserAwareMetadata } from "@/lib/seo/generateUserAwareMetadata";
import { buildHreflangAlternates } from "@/lib/seo/hreflang";
import { buildGenericOgImageUrl } from "@/lib/seo/ogUrls";
import { UserSeoJsonLd } from "@/components/seo/UserSeoJsonLd";
import { getSiteUrl } from "@/lib/site/url";

const BASE_HOME_METADATA: Metadata = {
  title: buildHomeTitle(),
  description: buildHomeDescription(),
  keywords: buildHomeKeywords(),
  alternates: {
    canonical: getSiteUrl(),
    languages: buildHreflangAlternates("/"),
  },
  openGraph: {
    ...buildHomeOpenGraph(),
    images: [{ url: buildGenericOgImageUrl(), width: 1200, height: 630 }],
  },
  twitter: buildHomeTwitter(),
  robots: { index: true, follow: true },
  category: "Entertainment",
};

export async function generateMetadata(): Promise<Metadata> {
  return generateUserAwareMetadata({
    landingPath: "/",
    baseMetadata: BASE_HOME_METADATA,
  });
}

export default async function HomePage() {
  const diagnoses = await listDiagnoses();
  const jsonLd = buildHomeJsonLd(diagnoses.length);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UserSeoJsonLd />
      <RubelDiscoveryHub />
      <Suspense fallback={null}>
        <PlugDiscoveryStrip />
      </Suspense>
    </>
  );
}
