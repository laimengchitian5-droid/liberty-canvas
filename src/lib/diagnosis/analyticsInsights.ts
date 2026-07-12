import type { StoredAnalyticsEvent } from "@/lib/diagnosis/analyticsServer";
import { readJsonStore } from "@/lib/storage/jsonStore";

const STORE_KEY = "diagnosis-analytics-events";

export interface AnalyticsVariantReport {
  variant: string;
  shareEvents: number;
  adviceOpens: number;
}

export interface ShareFunnelReport {
  discoverRefs: number;
  playStarts: number;
  resultViews: number;
  shareEvents: number;
  /** playStarts / discoverRefs when refs > 0 */
  refToPlayRate: number | null;
  /** shareEvents / resultViews when results > 0 */
  shareRate: number | null;
}

export interface AnalyticsInsightsSummary {
  totals: Record<string, number>;
  bySlug: Record<string, Record<string, number>>;
  variantReports: AnalyticsVariantReport[];
  funnel: ShareFunnelReport;
  recentEvents: StoredAnalyticsEvent[];
}

async function readEvents(): Promise<StoredAnalyticsEvent[]> {
  return readJsonStore<StoredAnalyticsEvent[]>(STORE_KEY, []);
}

function buildShareFunnelReport(events: readonly StoredAnalyticsEvent[]): ShareFunnelReport {
  let discoverRefs = 0;
  let playStarts = 0;
  let resultViews = 0;
  let shareEvents = 0;

  for (const entry of events) {
    if (entry.event === "diagnosis_ref_captured") {
      discoverRefs += 1;
    }

    if (entry.event === "diagnosis_started" || entry.funnelStep === "play_start") {
      playStarts += 1;
    }

    if (
      entry.event === "plug_result_completed" ||
      entry.funnelStep === "result_view"
    ) {
      resultViews += 1;
    }

    if (
      entry.event.startsWith("plug_result_share") ||
      entry.funnelStep === "share"
    ) {
      shareEvents += 1;
    }
  }

  return {
    discoverRefs,
    playStarts,
    resultViews,
    shareEvents,
    refToPlayRate:
      discoverRefs > 0 ? Math.round((playStarts / discoverRefs) * 1000) / 10 : null,
    shareRate:
      resultViews > 0 ? Math.round((shareEvents / resultViews) * 1000) / 10 : null,
  };
}

export async function buildAnalyticsInsights(): Promise<AnalyticsInsightsSummary> {
  const events = await readEvents();
  const totals: Record<string, number> = {};
  const bySlug: Record<string, Record<string, number>> = {};
  const variantMap = new Map<string, { share: number; advice: number }>();

  for (const entry of events) {
    totals[entry.event] = (totals[entry.event] ?? 0) + 1;

    if (entry.slug) {
      if (!bySlug[entry.slug]) {
        bySlug[entry.slug] = {};
      }

      bySlug[entry.slug]![entry.event] =
        (bySlug[entry.slug]![entry.event] ?? 0) + 1;
    }

    const variant =
      typeof entry.variant === "string" ? entry.variant : "unknown";
    const bucket = variantMap.get(variant) ?? { share: 0, advice: 0 };

    if (entry.event.startsWith("plug_result_share")) {
      bucket.share += 1;
    }

    if (entry.event.includes("advice")) {
      bucket.advice += 1;
    }

    variantMap.set(variant, bucket);
  }

  const variantReports = Array.from(variantMap.entries()).map(
    ([variant, counts]) => ({
      variant,
      shareEvents: counts.share,
      adviceOpens: counts.advice,
    }),
  );

  return {
    totals,
    bySlug,
    variantReports,
    funnel: buildShareFunnelReport(events),
    recentEvents: events.slice(-20).reverse(),
  };
}

export { buildShareFunnelReport };
