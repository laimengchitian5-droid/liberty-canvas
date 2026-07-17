import { readJsonStore, writeJsonStore } from "@/lib/storage/jsonStore";
import type { PublishedBuilderRecord } from "@/lib/builder/publishedRecord";

const STORE_KEY = "builder-published-diagnoses";

async function readAllRecords(): Promise<PublishedBuilderRecord[]> {
  return readJsonStore<PublishedBuilderRecord[]>(STORE_KEY, []);
}

export async function listPublishedBuilderRecords(): Promise<PublishedBuilderRecord[]> {
  const records = await readAllRecords();
  return records.filter((entry) => entry.status === "published");
}

export async function listBuilderRecordsByCreator(
  creatorId: string,
): Promise<PublishedBuilderRecord[]> {
  const records = await readAllRecords();
  return records.filter((entry) => entry.creatorId === creatorId);
}

export async function getBuilderRecordById(
  id: string,
): Promise<PublishedBuilderRecord | null> {
  const records = await readAllRecords();
  return records.find((entry) => entry.id === id) ?? null;
}

export async function getPublishedBuilderBySlug(
  slug: string,
): Promise<PublishedBuilderRecord | null> {
  const records = await readAllRecords();
  return (
    records.find((entry) => entry.slug === slug && entry.status === "published") ?? null
  );
}

export async function upsertBuilderRecord(record: PublishedBuilderRecord): Promise<void> {
  const records = await readAllRecords();
  const next = [...records.filter((entry) => entry.id !== record.id), record];

  await writeJsonStore(STORE_KEY, next);
}

export async function deleteBuilderRecord(id: string): Promise<boolean> {
  const records = await readAllRecords();
  const next = records.filter((entry) => entry.id !== id);

  if (next.length === records.length) {
    return false;
  }

  await writeJsonStore(STORE_KEY, next);
  return true;
}

export async function listPublishedBuilderSlugs(): Promise<string[]> {
  const records = await listPublishedBuilderRecords();
  return records.map((entry) => entry.slug);
}
