import { z } from "zod";
import { jsonRepository } from "@/lib/storage/repositoryPort";

const STORE_KEY = "diagnosis-analytics-events";
const MAX_EVENTS = 2_000;

const analyticsEventSchema = z.object({
  event: z.string().min(1),
  at: z.string().min(1),
  slug: z.string().optional(),
  ref: z.string().nullable().optional(),
  planet: z.string().optional(),
  variant: z.string().optional(),
  source: z.string().optional(),
  target: z.string().optional(),
});

export type StoredAnalyticsEvent = z.infer<typeof analyticsEventSchema> &
  Record<string, string | number | boolean | null | undefined>;

async function readEvents(): Promise<StoredAnalyticsEvent[]> {
  return jsonRepository.read<StoredAnalyticsEvent[]>(STORE_KEY, []);
}

export async function appendAnalyticsEvent(
  entry: StoredAnalyticsEvent,
): Promise<void> {
  const events = await readEvents();
  events.push(entry);
  await jsonRepository.write(STORE_KEY, events.slice(-MAX_EVENTS));
}

export async function summarizeAnalyticsEvents(): Promise<Record<string, number>> {
  const events = await readEvents();
  const counts: Record<string, number> = {};

  for (const entry of events) {
    counts[entry.event] = (counts[entry.event] ?? 0) + 1;
  }

  return counts;
}

export async function summarizeAnalyticsBySlug(
  slug: string,
): Promise<Record<string, number>> {
  const events = await readEvents().then((list) =>
    list.filter((entry) => entry.slug === slug),
  );

  const counts: Record<string, number> = {};

  for (const entry of events) {
    counts[entry.event] = (counts[entry.event] ?? 0) + 1;
  }

  return counts;
}

export { analyticsEventSchema };
