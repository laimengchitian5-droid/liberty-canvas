import { PLUG_DIAGNOSIS_CATALOG } from "@/config/diagnoses";
import { listPublishedBuilderRecords } from "@/lib/builder/repository";

export interface DiagnosisDiscoveryCard {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  estimatedMinutes: number;
  themeColor: string;
  href: string;
  source: "official" | "community";
  questionCount: number;
}

export async function buildDiagnosisDiscoveryCatalog(): Promise<
  DiagnosisDiscoveryCard[]
> {
  const official = PLUG_DIAGNOSIS_CATALOG.map((entry) => ({
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    subtitle: entry.subtitle,
    eyebrow: entry.eyebrow,
    estimatedMinutes: entry.estimatedMinutes,
    themeColor: entry.themeColor,
    href: `/diagnosis/play/${entry.slug}`,
    source: "official" as const,
    questionCount: entry.elements.filter(
      (element) => element.kind === "QUESTION_BLOCK",
    ).length,
  }));

  const published = await listPublishedBuilderRecords();
  const community = published.map((record) => ({
    id: record.id,
    slug: record.slug,
    title: record.definition.title,
    subtitle: record.definition.subtitle,
    eyebrow: record.definition.eyebrow,
    estimatedMinutes: record.definition.estimatedMinutes,
    themeColor: record.definition.themeColor,
    href: `/diagnosis/play/${record.slug}`,
    source: "community" as const,
    questionCount: record.definition.blocks.filter(
      (block) => block.type === "CONVERSATIONAL_QUESTION",
    ).length,
  }));

  return [...official, ...community];
}
