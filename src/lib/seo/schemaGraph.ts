import {
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  PRODUCT_TAGLINE_EN,
} from "@/lib/brand/constants";
import { extractQuestionBlocks, extractSeoBlock } from "@/lib/diagnosis/extractDiagnosisElements";
import { buildBuilderSeoContext } from "@/lib/builder/compileBuilderRuntime";
import { getSiteUrl } from "@/lib/site/url";
import { buildPlugOgImageUrl } from "@/lib/seo/ogUrls";
import type { BuilderDiagnosisDefinition } from "@/types/builder";
import { isBuilderDiagnosisDefinition } from "@/types/builder";
import type { PlugDiagnosisDefinition, SeoTuningBlock } from "@/types/diagnosisCompiler";

export interface SchemaGraphDocument {
  "@context": "https://schema.org";
  "@graph": readonly Record<string, unknown>[];
}

type DiagnosisSchemaInput = PlugDiagnosisDefinition | BuilderDiagnosisDefinition;

function resolvePlaySeo(
  definition: DiagnosisSchemaInput,
): {
  landingPath: string;
  title: string;
  description: string;
  keywords: readonly string[];
} {
  if (isBuilderDiagnosisDefinition(definition)) {
    const seo = buildBuilderSeoContext(definition);
    return {
      landingPath: seo.landingPath,
      title: seo.title,
      description: seo.description,
      keywords: seo.viralKeywords,
    };
  }

  const seoBlock = extractSeoBlock(definition);
  const landingPath = seoBlock?.landingPath ?? `/diagnosis/play/${definition.slug}`;

  return {
    landingPath,
    title: seoBlock?.titleTemplate ?? definition.title,
    description: seoBlock?.descriptionTemplate ?? definition.subtitle,
    keywords: seoBlock
      ? [...seoBlock.desireTags, ...seoBlock.targetDemographics]
      : [definition.title],
  };
}

function resolveQuestionCount(definition: DiagnosisSchemaInput): number {
  if (isBuilderDiagnosisDefinition(definition)) {
    return definition.blocks.filter((block) => block.type === "CONVERSATIONAL_QUESTION")
      .length;
  }

  return extractQuestionBlocks(definition).length;
}

export function buildOrganizationEntity(siteUrl = getSiteUrl()): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: PRODUCT_NAME,
    url: siteUrl,
    description: PRODUCT_DESCRIPTION,
    slogan: PRODUCT_TAGLINE_EN,
  };
}

export function buildWebSiteEntity(siteUrl = getSiteUrl()): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    name: PRODUCT_NAME,
    url: siteUrl,
    publisher: { "@id": `${siteUrl}#organization` },
    inLanguage: ["ja", "en", "ko", "zh"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/diagnosis?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildQuizEntity(
  definition: DiagnosisSchemaInput,
  seoBlock: SeoTuningBlock | null,
  siteUrl = getSiteUrl(),
): Record<string, unknown> {
  const seo = resolvePlaySeo(definition);
  const pageUrl = `${siteUrl}${seo.landingPath}`;
  const questionCount = resolveQuestionCount(definition);

  return {
    "@type": "Quiz",
    "@id": `${pageUrl}#quiz`,
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    inLanguage: "ja",
    keywords: seo.keywords.join(", "),
    numberOfQuestions: questionCount,
    educationalLevel: "General",
    isAccessibleForFree: true,
    publisher: { "@id": `${siteUrl}#organization` },
    isPartOf: { "@id": `${siteUrl}#website` },
    about: seoBlock?.desireTags ?? [],
  };
}

export function buildPlayWebPageEntity(
  definition: DiagnosisSchemaInput,
  siteUrl = getSiteUrl(),
): Record<string, unknown> {
  const seo = resolvePlaySeo(definition);
  const pageUrl = `${siteUrl}${seo.landingPath}`;

  return {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    isPartOf: { "@id": `${siteUrl}#website` },
    mainEntity: { "@id": `${pageUrl}#quiz` },
  };
}

/** Deduplicate @graph nodes by `@id` when present. */
export function mergeSchemaGraphs(
  ...documents: readonly (SchemaGraphDocument | Record<string, unknown>)[]
): SchemaGraphDocument {
  const nodeById = new Map<string, Record<string, unknown>>();
  const unkeyed: Record<string, unknown>[] = [];

  for (const document of documents) {
    const graph = Array.isArray(document["@graph"])
      ? (document["@graph"] as Record<string, unknown>[])
      : [document as Record<string, unknown>];

    for (const node of graph) {
      const nodeId = typeof node["@id"] === "string" ? node["@id"] : null;

      if (nodeId) {
        nodeById.set(nodeId, node);
      } else {
        unkeyed.push(node);
      }
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": [...nodeById.values(), ...unkeyed],
  };
}

export function buildPlayDiagnosisSchemaGraph(
  definition: DiagnosisSchemaInput,
): SchemaGraphDocument {
  const siteUrl = getSiteUrl();
  const seoBlock = isBuilderDiagnosisDefinition(definition)
    ? null
    : extractSeoBlock(definition);

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationEntity(siteUrl),
      buildWebSiteEntity(siteUrl),
      buildQuizEntity(definition, seoBlock, siteUrl),
      buildPlayWebPageEntity(definition, siteUrl),
    ],
  };
}

export function resolvePlayOgImageUrl(definition: DiagnosisSchemaInput): string {
  if (isBuilderDiagnosisDefinition(definition)) {
    const seo = buildBuilderSeoContext(definition);
    return `${getSiteUrl()}${seo.ogImagePath}`;
  }

  return buildPlugOgImageUrl(definition.slug);
}
