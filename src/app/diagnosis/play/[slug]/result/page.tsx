import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiagnosisResultDeepLinkShell } from "@/components/diagnosis/DiagnosisResultDeepLinkShell";
import { listPlugDiagnosisSlugs } from "@/config/diagnoses";
import { getMergedPlugDiagnosisBySlug } from "@/lib/builder/plugCatalog";
import {
  buildPlugResultShareMetadata,
  parseResultSearchParams,
} from "@/lib/diagnosis/buildPlugResultShareMetadata";
import { buildUserAwareJsonLd } from "@/lib/seo/generateUserAwareMetadata";

export const dynamicParams = true;

interface DiagnosisResultPageProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export function generateStaticParams(): { slug: string }[] {
  return listPlugDiagnosisSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: DiagnosisResultPageProps): Promise<Metadata> {
  return buildPlugResultShareMetadata(params.slug, searchParams);
}

export default async function PlugDiagnosisResultPage({
  params,
  searchParams,
}: DiagnosisResultPageProps) {
  const definition = await getMergedPlugDiagnosisBySlug(params.slug);

  if (!definition) {
    notFound();
  }

  const shareQuery = parseResultSearchParams(searchParams);
  const landingPath = `/diagnosis/play/${definition.slug}/result`;
  const userJsonLd = await buildUserAwareJsonLd(landingPath);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(userJsonLd) }}
      />
      <div style={{ maxWidth: "34rem", margin: "0 auto", padding: "1rem" }}>
        <DiagnosisResultDeepLinkShell
          definition={definition}
          shareQuery={shareQuery}
        />
      </div>
    </main>
  );
}
