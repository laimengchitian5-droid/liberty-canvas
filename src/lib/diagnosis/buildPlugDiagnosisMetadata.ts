import type { Metadata } from "next";

import { extractSeoBlock } from "@/lib/diagnosis/extractDiagnosisElements";

import { generateUserAwareMetadata } from "@/lib/seo/generateUserAwareMetadata";
import { buildHreflangAlternates } from "@/lib/seo/hreflang";
import { PRODUCT_NAME } from "@/lib/brand/constants";

import { getSiteUrl } from "@/lib/site/url";

import {

  buildBuilderOgDescription,

  buildBuilderOgImageUrl,

  buildBuilderOgKeywords,

  buildBuilderOgTitle,

} from "@/lib/builder/buildBuilderOgKeywords";

import { buildBuilderSeoContext } from "@/lib/builder/compileBuilderRuntime";

import type { BuilderDiagnosisDefinition } from "@/types/builder";

import { isBuilderDiagnosisDefinition } from "@/types/builder";

import type { PlugDiagnosisDefinition } from "@/types/diagnosisCompiler";



type DiagnosisMetadataInput =

  | PlugDiagnosisDefinition

  | BuilderDiagnosisDefinition;



function resolveSeoPayload(definition: DiagnosisMetadataInput): {

  landingPath: string;

  title: string;

  description: string;

  keywords: readonly string[];

  ogImageUrl: string;

} {

  if (isBuilderDiagnosisDefinition(definition)) {

    const seo = buildBuilderSeoContext(definition);



    return {

      landingPath: seo.landingPath,

      title: seo.title,

      description: seo.description,

      keywords: seo.viralKeywords,

      ogImageUrl: `${getSiteUrl()}${seo.ogImagePath}`,

    };

  }



  const seoBlock = extractSeoBlock(definition);

  const landingPath = seoBlock?.landingPath ?? `/diagnosis/play/${definition.slug}`;

  const creatorTags = seoBlock?.desireTags ?? [];

  const baseKeywords = seoBlock

    ? [...seoBlock.desireTags, ...seoBlock.targetDemographics]

    : [definition.eyebrow, definition.title];



  return {

    landingPath,

    title: buildBuilderOgTitle(

      seoBlock?.titleTemplate ?? definition.title,

      creatorTags,

    ),

    description: buildBuilderOgDescription(

      seoBlock?.descriptionTemplate ?? definition.subtitle,

      creatorTags,

      definition.estimatedMinutes,

    ),

    keywords: buildBuilderOgKeywords(creatorTags, baseKeywords),

    ogImageUrl: `${getSiteUrl()}${buildBuilderOgImageUrl(definition.slug)}`,

  };

}



export function buildPlugDiagnosisBaseMetadata(

  definition: DiagnosisMetadataInput,

): Metadata {

  const seo = resolveSeoPayload(definition);

  const pageUrl = `${getSiteUrl()}${seo.landingPath}`;



  return {

    title: seo.title,

    description: seo.description,

    keywords: [...seo.keywords],

    alternates: {

      canonical: pageUrl,

      languages: buildHreflangAlternates(seo.landingPath),

    },

    openGraph: {

      type: "website",

      url: pageUrl,

      title: seo.title,

      description: seo.description,

      siteName: PRODUCT_NAME,

      locale: "ja_JP",

      images: [

        {

          url: seo.ogImageUrl,

          width: 1200,

          height: 630,

          alt: seo.title,

        },

      ],

    },

    twitter: {

      card: "summary_large_image",

      title: seo.title,

      description: seo.description,

      images: [seo.ogImageUrl],

    },

  };

}



export async function buildPlugDiagnosisMetadata(

  definition: DiagnosisMetadataInput,

): Promise<Metadata> {

  const seo = resolveSeoPayload(definition);



  return generateUserAwareMetadata({

    landingPath: seo.landingPath,

    baseMetadata: buildPlugDiagnosisBaseMetadata(definition),

  });

}

