import type { Metadata } from "next";
import { getMergedPlugDiagnosisBySlug } from "@/lib/builder/plugCatalog";
import {
  getCosmicPlanetVisualSpec,
  isCosmicPlanetKind,
} from "@/lib/diagnosis/cosmicPlanetEngine";
import { extractResultBlock } from "@/lib/diagnosis/extractDiagnosisElements";
import {
  buildCosmicOgImageUrl,
  buildPlugResultPagePath,
  decodePlugResultShareQuery,
  type PlugResultShareQuery,
} from "@/lib/diagnosis/plugResultShare";
import { generateUserAwareMetadata } from "@/lib/seo/generateUserAwareMetadata";
import { getSiteUrl } from "@/lib/site/url";
import type { PlugDiagnosisDefinition } from "@/types/diagnosisCompiler";

function resolveArchetypeTitle(
  definition: PlugDiagnosisDefinition,
  archetypeId: string | null,
): string {
  if (!archetypeId) {
    return definition.title;
  }

  const resultBlock = extractResultBlock(definition);
  const archetype = resultBlock?.results.find((entry) => entry.id === archetypeId);

  return archetype?.title ?? definition.title;
}

export function buildPlugResultShareBaseMetadata(
  definition: PlugDiagnosisDefinition,
  query: PlugResultShareQuery | null,
): Metadata {
  const landingPath = buildPlugResultPagePath(
    definition.slug,
    query ?? undefined,
  );
  const pageUrl = `${getSiteUrl()}${landingPath}`;

  const planetSpec = query
    ? getCosmicPlanetVisualSpec(query.planet)
    : null;

  const title = planetSpec
    ? `${planetSpec.nickname} | ${definition.title}`
    : `${definition.title} · 診断結果`;

  const description = planetSpec
    ? `${planetSpec.coreStatus} — LibertyCanvas 独自のコズミック・プラネット診断結果。`
    : definition.subtitle;

  const ogImageUrl = query
    ? buildCosmicOgImageUrl({
        slug: definition.slug,
        planet: query.planet,
        archetypeId: query.archetypeId,
        factors: query.factors,
      })
    : `${getSiteUrl()}/api/og/diagnosis?slug=${encodeURIComponent(definition.slug)}`;

  const archetypeTitle = resolveArchetypeTitle(
    definition,
    query?.archetypeId ?? null,
  );

  return {
    title,
    description: query
      ? `${description} ${archetypeTitle}`
      : description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title,
      description,
      locale: "ja_JP",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: planetSpec?.nickname ?? definition.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export async function buildPlugResultShareMetadata(
  slug: string,
  searchParams: Record<string, string | string[] | undefined>,
): Promise<Metadata> {
  const definition = await getMergedPlugDiagnosisBySlug(slug);

  if (!definition) {
    return {};
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      params.set(key, value);
    }
  }

  const query = decodePlugResultShareQuery(params);
  const landingPath = buildPlugResultPagePath(slug, query ?? undefined);

  return generateUserAwareMetadata({
    landingPath,
    baseMetadata: buildPlugResultShareBaseMetadata(definition, query),
  });
}

export function parseResultSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): PlugResultShareQuery | null {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      params.set(key, value);
    }
  }

  const query = decodePlugResultShareQuery(params);

  if (!query) {
    return null;
  }

  if (!isCosmicPlanetKind(query.planet)) {
    return null;
  }

  return query;
}
