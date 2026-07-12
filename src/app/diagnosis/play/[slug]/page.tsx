import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiagnosisCompiler } from "@/components/diagnosis/DiagnosisCompiler";
import { listPlugDiagnosisSlugs } from "@/config/diagnoses";
import { getMergedPlugDiagnosisBySlug } from "@/lib/builder/plugCatalog";
import { extractSeoBlock } from "@/lib/diagnosis/extractDiagnosisElements";
import { buildPlugDiagnosisMetadata } from "@/lib/diagnosis/buildPlugDiagnosisMetadata";
import { buildUserAwareJsonLd } from "@/lib/seo/generateUserAwareMetadata";

export const dynamicParams = true;

interface DiagnosisPlayPageProps {
  params: { slug: string };
}

export function generateStaticParams(): { slug: string }[] {
  return listPlugDiagnosisSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DiagnosisPlayPageProps): Promise<Metadata> {
  const definition = await getMergedPlugDiagnosisBySlug(params.slug);

  if (!definition) {
    return {};
  }

  return buildPlugDiagnosisMetadata(definition);
}

export default async function DiagnosisPlayPage({ params }: DiagnosisPlayPageProps) {
  const definition = await getMergedPlugDiagnosisBySlug(params.slug);

  if (!definition) {
    notFound();
  }

  const seoBlock = extractSeoBlock(definition);
  const landingPath = seoBlock?.landingPath ?? `/diagnosis/play/${definition.slug}`;
  const userJsonLd = await buildUserAwareJsonLd(landingPath);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(userJsonLd) }}
      />
      <DiagnosisCompiler definition={definition} />
    </main>
  );
}
