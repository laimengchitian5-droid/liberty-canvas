import { readJsonStore, writeJsonStore } from "@/lib/storage/jsonStore";

const AUDIT_STORE_KEY = "builder-audit-log";
const MAX_AUDIT_ENTRIES = 200;

export type BuilderAuditAction = "save_draft" | "publish" | "unpublish" | "delete";

export interface BuilderAuditEntry {
  at: number;
  action: BuilderAuditAction;
  recordId: string;
  slug: string;
  creatorId: string;
  detail?: string;
}

export const RESERVED_BUILDER_SLUGS = [
  "oshikatsu",
  "romance",
  "genz",
  "big-five",
  "motivation-spectrum",
  "personality-spectrum",
  "diagnosis",
  "create",
  "api",
  "admin",
] as const;

export function isReservedBuilderSlug(slug: string): boolean {
  return (RESERVED_BUILDER_SLUGS as readonly string[]).includes(slug);
}

async function readAuditLog(): Promise<BuilderAuditEntry[]> {
  return readJsonStore<BuilderAuditEntry[]>(AUDIT_STORE_KEY, []);
}

export async function appendBuilderAuditEntry(entry: BuilderAuditEntry): Promise<void> {
  const log = await readAuditLog();
  log.push(entry);
  await writeJsonStore(AUDIT_STORE_KEY, log.slice(-MAX_AUDIT_ENTRIES));
}

export async function listBuilderAuditEntries(limit = 50): Promise<BuilderAuditEntry[]> {
  const log = await readAuditLog();
  return log.slice(-limit).reverse();
}

export async function listBuilderAuditBySlug(
  slug: string,
  limit = 20,
): Promise<BuilderAuditEntry[]> {
  const log = await readAuditLog();
  return log
    .filter((entry) => entry.slug === slug)
    .slice(-limit)
    .reverse();
}
