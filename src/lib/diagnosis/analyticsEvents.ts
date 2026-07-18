/**
 * Single source of truth for diagnosis analytics event names.
 * Imported by client trackers and server Zod boundary (fail-closed).
 */
export const DIAGNOSIS_ANALYTICS_EVENTS = [
  "diagnosis_ref_captured",
  "discover_funnel_submit",
  "discover_funnel_direct",
  "discover_play_arrival",
  "conductor_pre_screen",
  "conductor_express_boarded",
  "diagnosis_started",
  "diagnosis_completed",
  "diagnosis_advice_opened",
  "diagnosis_share_copy",
  "diagnosis_share_native",
  "diagnosis_share_print",
  "plug_result_share_x",
  "plug_result_share_copy",
  "plug_result_share_link",
  "plug_result_share_print",
  "plug_result_deeplink_view",
  "plug_result_deeplink_cta",
  "plug_result_advice_opened",
  "plug_result_advice_completed",
  "plug_result_gallery_preview",
  "plug_result_offline_restored",
  "plug_result_completed",
  "plug_result_specialty_bridge_click",
  "specialty_bridge_impression",
  "specialty_deep_play_start",
  "catalog_search",
  "crawler_visit",
  "rubel_play_started",
  "rubel_play_completed",
  "rubel_bridge_impression",
  "rubel_bridge_click",
  "rubel_bridge_handoff_received",
  "liberty_play_started",
  "liberty_play_completed",
  "liberty_bridge_impression",
  "liberty_bridge_click",
  "liberty_bridge_handoff_received",
  "builder_draft_saved",
  "builder_preview_started",
] as const;

export type DiagnosisAnalyticsEvent = (typeof DIAGNOSIS_ANALYTICS_EVENTS)[number];

/** Legacy → modern dual-write map (bridge / play telemetry). */
export const PLAY_BRIDGE_LEGACY_TO_MODERN = {
  rubel_play_started: "liberty_play_started",
  rubel_play_completed: "liberty_play_completed",
  rubel_bridge_impression: "liberty_bridge_impression",
  rubel_bridge_click: "liberty_bridge_click",
  rubel_bridge_handoff_received: "liberty_bridge_handoff_received",
} as const satisfies Record<string, DiagnosisAnalyticsEvent>;

export type PlayBridgeLegacyEvent = keyof typeof PLAY_BRIDGE_LEGACY_TO_MODERN;

const LEGACY_EVENT_SET: ReadonlySet<string> = new Set(
  Object.keys(PLAY_BRIDGE_LEGACY_TO_MODERN),
);

export function isPlayBridgeLegacyEvent(event: string): event is PlayBridgeLegacyEvent {
  return LEGACY_EVENT_SET.has(event);
}

/** Canonical modern event name for insights aggregation. */
export function normalizePlayBridgeEvent(event: string): string {
  if (isPlayBridgeLegacyEvent(event)) {
    return PLAY_BRIDGE_LEGACY_TO_MODERN[event];
  }
  return event;
}

/**
 * Prefer modern liberty_* counts; fall back to rubel_* when modern absent
 * (pre-dual-write history or post-legacy-deprecation).
 */
export function countBridgeMetric(
  events: readonly { event: string }[],
  modern: DiagnosisAnalyticsEvent,
  legacy: PlayBridgeLegacyEvent,
): number {
  let modernCount = 0;
  let legacyCount = 0;
  for (const entry of events) {
    if (entry.event === modern) {
      modernCount += 1;
    } else if (entry.event === legacy) {
      legacyCount += 1;
    }
  }
  return modernCount > 0 ? modernCount : legacyCount;
}
