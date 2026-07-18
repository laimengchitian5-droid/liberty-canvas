import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DiagnosisCompiler } from "@/components/diagnosis/DiagnosisCompiler";
import { DiagnosisRefCapture } from "@/components/diagnosis/DiagnosisRefCapture";
import { RubelBridgeHandoffCapture } from "@/components/diagnosis/RubelBridgeHandoffCapture";
import { SchemaGraphJsonLd } from "@/components/seo/SchemaGraphJsonLd";
import { listPlugDiagnosisSlugs } from "@/config/diagnoses";
import { getMergedPlugDiagnosisBySlug } from "@/lib/builder/plugCatalog";
import { extractSeoBlock } from "@/lib/diagnosis/extractDiagnosisElements";
import { buildPlugDiagnosisMetadata } from "@/lib/diagnosis/buildPlugDiagnosisMetadata";
import { buildUserAwareJsonLd } from "@/lib/seo/generateUserAwareMetadata";
import {
  buildPlayDiagnosisSchemaGraph,
  mergeSchemaGraphs,
  resolvePlayOgImageUrl,
} from "@/lib/seo/schemaGraph";

/**
 * Liberty Plug play runtime — DiagnosisCompiler owns the UI.
 *
 * Rejected sketch defects (do not reintroduce):
 * - Replace this page with a thin pSEO / affiliate shell
 * - `generateAllPseoRoutes()` (Discover locale×slug) as play static params
 * - IdentityHubConductor CSS reuse + outbound `targetRedirectUrl`
 * - Invented `params.locale` on a slug-only route
 *
 * Multilingual LP SSG lives at `/discover/[locale]/[slug]`.
 */
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
  const playSchema = buildPlayDiagnosisSchemaGraph(definition);
  const userJsonLd = await buildUserAwareJsonLd(landingPath);
  const schemaDocument = mergeSchemaGraphs(playSchema, userJsonLd);
  const ogImageUrl = resolvePlayOgImageUrl(definition);

  return (
    <main>
      <link rel="preload" as="image" href={ogImageUrl} fetchPriority="high" />
      <SchemaGraphJsonLd document={schemaDocument} />
      <Suspense fallback={null}>
        <DiagnosisRefCapture />
        <RubelBridgeHandoffCapture />
      </Suspense>
      <DiagnosisCompiler definition={definition} />
    </main>
  );
}
