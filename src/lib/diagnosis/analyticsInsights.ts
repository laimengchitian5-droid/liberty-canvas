import type { StoredAnalyticsEvent } from "@/lib/diagnosis/analyticsServer";
import { readJsonStore } from "@/lib/storage/jsonStore";

const STORE_KEY = "diagnosis-analytics-events";

export interface AnalyticsVariantReport {
  variant: string;
  shareEvents: number;
  adviceOpens: number;
}

export interface AnalyticsInsightsSummary {
  totals: Record<string, number>;
  bySlug: Record<string, Record<string, number>>;
  variantReports: AnalyticsVariantReport[];
  recentEvents: StoredAnalyticsEvent[];
}

async function readEvents(): Promise<StoredAnalyticsEvent[]> {
  return readJsonStore<StoredAnalyticsEvent[]>(STORE_KEY, []);
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
    recentEvents: events.slice(-20).reverse(),
  };
}
