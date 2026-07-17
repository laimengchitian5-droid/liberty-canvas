import type { StoredAnalyticsEvent } from "@/lib/diagnosis/analyticsServer";
import type { SpecialtyCountryId } from "@/lib/specialty/types";

export interface SpecialtyBridgeCountryMetrics {
  readonly countryId: SpecialtyCountryId | "unknown";
  readonly clicks: number;
  readonly deepPlayStarts: number;
}

export interface SpecialtyBridgeReport {
  impressions: number;
  clicks: number;
  deepPlayStarts: number;
  /** deepPlayStarts / clicks when clicks > 0 */
  clickToPlayRate: number | null;
  byCountry: readonly SpecialtyBridgeCountryMetrics[];
}

const SPECIALTY_BRIDGE_EVENTS = {
  impression: "specialty_bridge_impression",
  click: "plug_result_specialty_bridge_click",
  deepPlayStart: "specialty_deep_play_start",
} as const;

function readTargetCountryId(
  entry: StoredAnalyticsEvent,
): SpecialtyCountryId | "unknown" {
  const countryId = entry.targetCountryId;

  if (typeof countryId === "string" && countryId.length > 0) {
    return countryId as SpecialtyCountryId | "unknown";
  }

  return "unknown";
}

function bumpCountryMetric(
  countryMap: Map<
    SpecialtyCountryId | "unknown",
    { clicks: number; deepPlayStarts: number }
  >,
  countryId: SpecialtyCountryId | "unknown",
  field: "clicks" | "deepPlayStarts",
): void {
  const bucket = countryMap.get(countryId) ?? { clicks: 0, deepPlayStarts: 0 };
  bucket[field] += 1;
  countryMap.set(countryId, bucket);
}

export function buildSpecialtyBridgeReport(
  events: readonly StoredAnalyticsEvent[],
): SpecialtyBridgeReport {
  let impressions = 0;
  let clicks = 0;
  let deepPlayStarts = 0;
  const countryMap = new Map<
    SpecialtyCountryId | "unknown",
    { clicks: number; deepPlayStarts: number }
  >();

  for (const entry of events) {
    switch (entry.event) {
      case SPECIALTY_BRIDGE_EVENTS.impression:
        impressions += 1;
        break;
      case SPECIALTY_BRIDGE_EVENTS.click:
        clicks += 1;
        bumpCountryMetric(countryMap, readTargetCountryId(entry), "clicks");
        break;
      case SPECIALTY_BRIDGE_EVENTS.deepPlayStart:
        deepPlayStarts += 1;
        bumpCountryMetric(countryMap, readTargetCountryId(entry), "deepPlayStarts");
        break;
      default:
        break;
    }
  }

  const byCountry = Array.from(countryMap.entries())
    .map(([countryId, counts]) => ({
      countryId,
      clicks: counts.clicks,
      deepPlayStarts: counts.deepPlayStarts,
    }))
    .sort((left, right) => right.clicks - left.clicks);

  return {
    impressions,
    clicks,
    deepPlayStarts,
    clickToPlayRate:
      clicks > 0 ? Math.round((deepPlayStarts / clicks) * 1000) / 10 : null,
    byCountry,
  };
}
