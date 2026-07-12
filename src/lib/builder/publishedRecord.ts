import type { BuilderDiagnosisDefinition } from "@/types/builder";

export type BuilderPublishStatus = "draft" | "published";

export interface PublishedBuilderRecord {
  id: string;
  slug: string;
  creatorId: string;
  status: BuilderPublishStatus;
  publishedAt: number | null;
  updatedAt: number;
  definition: BuilderDiagnosisDefinition;
}

export function buildPublishedBuilderRecord(input: {
  definition: BuilderDiagnosisDefinition;
  creatorId: string;
  status: BuilderPublishStatus;
  existing?: PublishedBuilderRecord | null;
}): PublishedBuilderRecord {
  const now = Date.now();

  return {
    id: input.definition.id,
    slug: input.definition.slug,
    creatorId: input.creatorId,
    status: input.status,
    publishedAt:
      input.status === "published"
        ? (input.existing?.publishedAt ?? now)
        : input.existing?.publishedAt ?? null,
    updatedAt: now,
    definition: input.definition,
  };
}
