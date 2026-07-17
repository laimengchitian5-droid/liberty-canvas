import { readJsonStore, writeJsonStore } from "@/lib/storage/jsonStore";
import type { IndexingAuditEntry } from "@/types/platform";

const AUDIT_KEY = "indexing-audit";
const MAX_RETRY_ATTEMPTS = 5;

async function readAuditLog(): Promise<IndexingAuditEntry[]> {
  return readJsonStore<IndexingAuditEntry[]>(AUDIT_KEY, []);
}

async function writeAuditLog(entries: IndexingAuditEntry[]): Promise<void> {
  await writeJsonStore(AUDIT_KEY, entries);
}

function logIndexingEvent(entry: IndexingAuditEntry, message: string): void {
  console.info(
    `[indexing-audit] quiz=${entry.quizId} status=${entry.status} attempts=${entry.attemptCount} ${message}`,
  );
}

export async function recordIndexingQueued(params: {
  quizId: string;
  url: string;
}): Promise<IndexingAuditEntry> {
  const entries = await readAuditLog();
  const now = new Date().toISOString();
  const existing = entries.find((entry) => entry.quizId === params.quizId);

  if (existing) {
    existing.url = params.url;
    existing.status = "pending";
    existing.updatedAt = now;
    await writeAuditLog(entries);
    logIndexingEvent(existing, "queued for Google Indexing API");
    return existing;
  }

  const entry: IndexingAuditEntry = {
    id: crypto.randomUUID(),
    quizId: params.quizId,
    url: params.url,
    status: "pending",
    attemptCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  entries.push(entry);
  await writeAuditLog(entries);
  logIndexingEvent(entry, "queued for Google Indexing API");
  return entry;
}

export async function enqueueIndexingFailure(params: {
  quizId: string;
  url: string;
  error: string;
}): Promise<IndexingAuditEntry> {
  const entries = await readAuditLog();
  const now = new Date().toISOString();
  const existing = entries.find(
    (entry) => entry.quizId === params.quizId && entry.status !== "success",
  );

  if (existing) {
    existing.attemptCount += 1;
    existing.lastError = params.error;
    existing.status = "failed";
    existing.url = params.url;
    existing.updatedAt = now;
    await writeAuditLog(entries);
    logIndexingEvent(
      existing,
      `failure captured (${existing.attemptCount}/${MAX_RETRY_ATTEMPTS})`,
    );
    return existing;
  }

  const entry: IndexingAuditEntry = {
    id: crypto.randomUUID(),
    quizId: params.quizId,
    url: params.url,
    status: "failed",
    attemptCount: 1,
    lastError: params.error,
    createdAt: now,
    updatedAt: now,
  };

  entries.push(entry);
  await writeAuditLog(entries);
  logIndexingEvent(entry, "failure captured (1/5)");
  return entry;
}

export async function markIndexingSuccess(params: {
  quizId: string;
  url: string;
}): Promise<IndexingAuditEntry> {
  const entries = await readAuditLog();
  const now = new Date().toISOString();
  const existing = entries.find((item) => item.quizId === params.quizId);

  if (existing) {
    existing.status = "success";
    existing.url = params.url;
    existing.updatedAt = now;
    existing.lastError = undefined;
    await writeAuditLog(entries);
    logIndexingEvent(existing, "indexed successfully");
    return existing;
  }

  const entry: IndexingAuditEntry = {
    id: crypto.randomUUID(),
    quizId: params.quizId,
    url: params.url,
    status: "success",
    attemptCount: 1,
    createdAt: now,
    updatedAt: now,
  };

  entries.push(entry);
  await writeAuditLog(entries);
  logIndexingEvent(entry, "indexed successfully");
  return entry;
}

export async function listRetryableIndexingEntries(): Promise<IndexingAuditEntry[]> {
  const entries = await readAuditLog();
  return entries.filter(
    (entry) => entry.status === "failed" && entry.attemptCount < MAX_RETRY_ATTEMPTS,
  );
}

export async function listIndexingAuditEntries(): Promise<IndexingAuditEntry[]> {
  return readAuditLog();
}

export { MAX_RETRY_ATTEMPTS };
