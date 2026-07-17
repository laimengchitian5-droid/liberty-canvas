import {
  getPlugDiagnosisBySlug as getStaticPlugDiagnosisBySlug,
  listPlugDiagnosisSlugs as listStaticPlugDiagnosisSlugs,
} from "@/config/diagnoses";
import { convertBuilderToPlugDefinition } from "@/lib/builder/convertBuilderToPlugDefinition";
import {
  getPublishedBuilderBySlug,
  listPublishedBuilderSlugs,
} from "@/lib/builder/repository";
import type { PlugDiagnosisDefinition } from "@/types/diagnosisCompiler";

export function getStaticPlugDiagnosisBySlugOrNull(
  slug: string,
): PlugDiagnosisDefinition | null {
  return getStaticPlugDiagnosisBySlug(slug);
}

export async function getMergedPlugDiagnosisBySlug(
  slug: string,
): Promise<PlugDiagnosisDefinition | null> {
  const staticDefinition = getStaticPlugDiagnosisBySlug(slug);

  if (staticDefinition) {
    return staticDefinition;
  }

  const published = await getPublishedBuilderBySlug(slug);

  if (!published) {
    return null;
  }

  return convertBuilderToPlugDefinition(published.definition);
}

export async function listMergedPlugDiagnosisSlugs(): Promise<string[]> {
  const staticSlugs = listStaticPlugDiagnosisSlugs();
  const publishedSlugs = await listPublishedBuilderSlugs();
  const merged = new Set<string>([...staticSlugs, ...publishedSlugs]);

  return Array.from(merged);
}
