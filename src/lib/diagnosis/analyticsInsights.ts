import type { StoredAnalyticsEvent } from "@/lib/diagnosis/analyticsServer";
import {
  countBridgeMetric,
  isPlayBridgeLegacyEvent,
  normalizePlayBridgeEvent,
} from "@/lib/diagnosis/analyticsEvents";
import {
  buildSpecialtyBridgeReport,
  type SpecialtyBridgeReport,
} from "@/lib/specialty/specialtyBridgeAnalytics";
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
  refToPlayRate: number | null;
  shareRate: number | null;
}

export interface SearchAnalyticsReport {
  totalSearches: number;
  crawlerVisits: number;
  topQueries: Array<{ query: string; count: number }>;
  backendCounts: Record<string, number>;
}

export interface PlayBridgeReport {
  impressions: number;
  clicks: number;
  handoffsReceived: number;
  plugStartsFromBridge: number;
  clickToPlayRate: number | null;
}

/** @deprecated Prefer PlayBridgeReport */
export type RubelBridgeReport = PlayBridgeReport;

export interface AnalyticsInsightsSummary {
  totals: Record<string, number>;
  bySlug: Record<string, Record<string, number>>;
  byRef: Record<string, number>;
  variantReports: AnalyticsVariantReport[];
  funnel: ShareFunnelReport;
  search: SearchAnalyticsReport;
  bridge: PlayBridgeReport;
  specialtyBridge: SpecialtyBridgeReport;
  recentEvents: StoredAnalyticsEvent[];
}

async function readEvents(): Promise<StoredAnalyticsEvent[]> {
  return readJsonStore<StoredAnalyticsEvent[]>(STORE_KEY, []);
}

function buildShareFunnelReport(
  events: readonly StoredAnalyticsEvent[],
): ShareFunnelReport {
  let discoverRefs = 0;
  let playStarts = 0;
  let resultViews = 0;
  let shareEvents = 0;

  for (const entry of events) {
    if (
      entry.event === "diagnosis_ref_captured" ||
      entry.event === "discover_funnel_submit" ||
      entry.event === "discover_funnel_direct"
    ) {
      discoverRefs += 1;
    }

    if (entry.event === "diagnosis_started" || entry.funnelStep === "play_start") {
      playStarts += 1;
    }

    if (entry.event === "plug_result_completed" || entry.funnelStep === "result_view") {
      resultViews += 1;
    }

    if (entry.event.startsWith("plug_result_share") || entry.funnelStep === "share") {
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

function buildSearchAnalyticsReport(
  events: readonly StoredAnalyticsEvent[],
): SearchAnalyticsReport {
  const queryCounts = new Map<string, number>();
  const backendCounts: Record<string, number> = {};
  let totalSearches = 0;
  let crawlerVisits = 0;

  for (const entry of events) {
    if (entry.event === "catalog_search") {
      totalSearches += 1;
      const query = typeof entry.query === "string" ? entry.query : "unknown";
      queryCounts.set(query, (queryCounts.get(query) ?? 0) + 1);

      const backend =
        typeof entry.searchBackend === "string" ? entry.searchBackend : "unknown";
      backendCounts[backend] = (backendCounts[backend] ?? 0) + 1;
    }

    if (entry.event === "crawler_visit") {
      crawlerVisits += 1;
    }
  }

  const topQueries = Array.from(queryCounts.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 10);

  return {
    totalSearches,
    crawlerVisits,
    topQueries,
    backendCounts,
  };
}

function buildPlayBridgeReport(
  events: readonly StoredAnalyticsEvent[],
): PlayBridgeReport {
  const impressions = countBridgeMetric(
    events,
    "liberty_bridge_impression",
    "rubel_bridge_impression",
  );
  const clicks = countBridgeMetric(events, "liberty_bridge_click", "rubel_bridge_click");
  const handoffsReceived = countBridgeMetric(
    events,
    "liberty_bridge_handoff_received",
    "rubel_bridge_handoff_received",
  );

  let plugStartsFromBridge = 0;
  for (const entry of events) {
    if (
      entry.event === "diagnosis_started" &&
      (entry.ref === "rubel-bridge" || entry.ref === "liberty-bridge")
    ) {
      plugStartsFromBridge += 1;
    }
  }

  return {
    impressions,
    clicks,
    handoffsReceived,
    plugStartsFromBridge,
    clickToPlayRate:
      clicks > 0 ? Math.round((plugStartsFromBridge / clicks) * 1000) / 10 : null,
  };
}

/** @deprecated Use buildPlayBridgeReport */
const buildRubelBridgeReport = buildPlayBridgeReport;

function buildByRefReport(
  events: readonly StoredAnalyticsEvent[],
): Record<string, number> {
  const byRef: Record<string, number> = {};

  for (const entry of events) {
    const ref = typeof entry.ref === "string" ? entry.ref : null;
    if (!ref) {
      continue;
    }
    byRef[ref] = (byRef[ref] ?? 0) + 1;
  }

  return byRef;
}

/**
 * Fold dual-write legacy events out of totals to prevent 2× inflation.
 */
function buildCanonicalTotals(
  events: readonly StoredAnalyticsEvent[],
): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const entry of events) {
    if (isPlayBridgeLegacyEvent(entry.event)) {
      continue;
    }
    const key = normalizePlayBridgeEvent(entry.event);
    totals[key] = (totals[key] ?? 0) + 1;
  }

  return totals;
}

export async function buildAnalyticsInsights(): Promise<AnalyticsInsightsSummary> {
  const events = await readEvents();
  const totals = buildCanonicalTotals(events);
  const bySlug: Record<string, Record<string, number>> = {};
  const variantMap = new Map<string, { share: number; advice: number }>();

  for (const entry of events) {
    if (isPlayBridgeLegacyEvent(entry.event)) {
      continue;
    }

    if (entry.slug) {
      if (!bySlug[entry.slug]) {
        bySlug[entry.slug] = {};
      }
      const eventKey = normalizePlayBridgeEvent(entry.event);
      bySlug[entry.slug]![eventKey] = (bySlug[entry.slug]![eventKey] ?? 0) + 1;
    }

    const variant = typeof entry.variant === "string" ? entry.variant : "unknown";
    const bucket = variantMap.get(variant) ?? { share: 0, advice: 0 };

    if (entry.event.startsWith("plug_result_share")) {
      bucket.share += 1;
    }
    if (entry.event.includes("advice")) {
      bucket.advice += 1;
    }
    variantMap.set(variant, bucket);
  }

  const variantReports = Array.from(variantMap.entries()).map(([variant, counts]) => ({
    variant,
    shareEvents: counts.share,
    adviceOpens: counts.advice,
  }));

  return {
    totals,
    bySlug,
    byRef: buildByRefReport(events),
    variantReports,
    funnel: buildShareFunnelReport(events),
    search: buildSearchAnalyticsReport(events),
    bridge: buildPlayBridgeReport(events),
    specialtyBridge: buildSpecialtyBridgeReport(events),
    recentEvents: events.slice(-20).reverse(),
  };
}

export { buildShareFunnelReport, buildRubelBridgeReport, buildPlayBridgeReport };
export {
  buildSpecialtyBridgeReport,
  type SpecialtyBridgeReport,
} from "@/lib/specialty/specialtyBridgeAnalytics";
