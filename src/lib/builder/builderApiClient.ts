import type { PublishedBuilderRecord } from "@/lib/builder/publishedRecord";
import type { BuilderDiagnosisDefinition } from "@/types/builder";

export async function saveBuilderDiagnosisRemote(input: {
  definition: BuilderDiagnosisDefinition;
  status: "draft" | "published";
  creatorId: string;
}): Promise<PublishedBuilderRecord> {
  const response = await fetch("/api/builder/diagnoses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(payload?.error ?? `Save failed (${response.status})`);
  }

  const payload = (await response.json()) as { record: PublishedBuilderRecord };
  return payload.record;
}

export async function listCreatorBuilderRecords(
  creatorId: string,
): Promise<PublishedBuilderRecord[]> {
  const response = await fetch(
    `/api/builder/diagnoses?scope=creator&creatorId=${encodeURIComponent(creatorId)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as { records: PublishedBuilderRecord[] };
  return payload.records;
}

export async function unpublishBuilderDiagnosisRemote(input: {
  recordId: string;
  creatorId: string;
}): Promise<PublishedBuilderRecord> {
  const response = await fetch(
    `/api/builder/diagnoses/${encodeURIComponent(input.recordId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-lc-creator-id": input.creatorId,
      },
      body: JSON.stringify({ action: "unpublish" }),
    },
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(payload?.error ?? `Unpublish failed (${response.status})`);
  }

  const payload = (await response.json()) as { record: PublishedBuilderRecord };
  return payload.record;
}
