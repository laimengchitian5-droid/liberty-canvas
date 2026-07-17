import { z } from "zod";
import { DIAGNOSIS_ANALYTICS_EVENTS } from "@/lib/diagnosis/analyticsEvents";
import { jsonRepository } from "@/lib/storage/repositoryPort";

const STORE_KEY = "diagnosis-analytics-events";
const MAX_EVENTS = 2_000;

/** Fail-closed: unknown event names rejected at API boundary. */
export const analyticsEventSchema = z.object({
  event: z.enum(DIAGNOSIS_ANALYTICS_EVENTS),
  at: z.string().min(1),
  slug: z.string().optional(),
  ref: z.string().nullable().optional(),
  funnelStep: z
    .enum([
      "discover_ref",
      "discover_submit",
      "discover_arrival",
      "play_start",
      "result_view",
      "share",
      "search",
      "specialty_bridge",
    ])
    .optional(),
  frameworkId: z.string().optional(),
  query: z.string().optional(),
  searchBackend: z.string().optional(),
  queryIntent: z.string().optional(),
  resultCount: z.number().optional(),
  pathname: z.string().optional(),
  userAgent: z.string().optional(),
  planet: z.string().optional(),
  variant: z.string().optional(),
  source: z.string().optional(),
  target: z.string().optional(),
  rubelDiagnosisId: z.string().optional(),
  targetCountryId: z.string().optional(),
  targetPath: z.string().optional(),
  isLive: z.boolean().optional(),
  traceId: z.string().optional(),
});

export type StoredAnalyticsEvent = z.infer<typeof analyticsEventSchema> &
  Record<string, string | number | boolean | null | undefined>;

async function readEvents(): Promise<StoredAnalyticsEvent[]> {
  return jsonRepository.read<StoredAnalyticsEvent[]>(STORE_KEY, []);
}

export async function appendAnalyticsEvent(entry: StoredAnalyticsEvent): Promise<void> {
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
