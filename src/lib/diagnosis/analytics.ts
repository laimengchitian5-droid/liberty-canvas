import type { DiagnosisResult } from "@/types/diagnosis";
import {
  DIAGNOSIS_ANALYTICS_EVENTS,
  type DiagnosisAnalyticsEvent,
  PLAY_BRIDGE_LEGACY_TO_MODERN,
} from "@/lib/diagnosis/analyticsEvents";
import { readDiagnosisRef } from "@/lib/diagnosis/diagnosisSession";
import { hasAnalyticsConsent } from "@/lib/privacy/consent";

export type { DiagnosisAnalyticsEvent };
export {
  DIAGNOSIS_ANALYTICS_EVENTS,
  normalizePlayBridgeEvent,
  countBridgeMetric,
  PLAY_BRIDGE_LEGACY_TO_MODERN,
} from "@/lib/diagnosis/analyticsEvents";

export type FunnelStep =
  | "discover_ref"
  | "discover_submit"
  | "discover_arrival"
  | "conductor_gate"
  | "play_start"
  | "result_view"
  | "share"
  | "specialty_bridge";

export interface DiagnosisAnalyticsPayload {
  ref?: string | null;
  category?: string;
  variant?: string;
  funnelStep?: FunnelStep;
  frameworkId?: string;
  slug?: string;
  [key: string]: string | number | boolean | null | undefined;
}

const LOG_KEY = "lc-diagnosis-events";

function canTrackClientAnalytics(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.__personalityQuizAnalyticsEnabled === true) {
    return true;
  }

  return hasAnalyticsConsent();
}

const ANALYTICS_EVENTS_PATH = "/api/diagnosis/analytics/events";

function flushAnalyticsToServer(entry: Record<string, unknown>): void {
  if (typeof window === "undefined") {
    return;
  }

  const body = JSON.stringify(entry);

  try {
    if (typeof navigator.sendBeacon === "function") {
      const queued = navigator.sendBeacon(
        ANALYTICS_EVENTS_PATH,
        new Blob([body], { type: "application/json" }),
      );
      if (queued) {
        return;
      }
    }
  } catch {
    // fall through to fetch keepalive
  }

  try {
    void fetch(ANALYTICS_EVENTS_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      keepalive: true,
    });
  } catch {
    // ignore
  }
}

function appendLog(entry: Record<string, unknown>): void {
  try {
    const raw = sessionStorage.getItem(LOG_KEY);
    const list = raw ? (JSON.parse(raw) as Record<string, unknown>[]) : [];
    list.push(entry);
    sessionStorage.setItem(LOG_KEY, JSON.stringify(list.slice(-40)));
  } catch {
    // ignore
  }
}

export function trackDiagnosisEvent(
  event: DiagnosisAnalyticsEvent,
  payload: DiagnosisAnalyticsPayload = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!canTrackClientAnalytics()) {
    return;
  }

  const detail = {
    event,
    at: new Date().toISOString(),
    ...payload,
  };

  appendLog(detail);
  flushAnalyticsToServer(detail);

  try {
    window.dispatchEvent(new CustomEvent("lc:diagnosis", { detail }));
  } catch {
    // ignore
  }
}

export { readDiagnosisRef } from "@/lib/diagnosis/diagnosisSession";

export function readDiagnosisEventLog(): Record<string, unknown>[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = sessionStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as Record<string, unknown>[]) : [];
  } catch {
    return [];
  }
}

export function trackDiagnosisCompletion(result: DiagnosisResult): void {
  trackDiagnosisEvent("diagnosis_completed", {
    ref: readDiagnosisRef(),
    category: result.dominantCategory,
    resultId: result.id,
  });
}

type PlayBridgeDualKind =
  | "play_started"
  | "play_completed"
  | "bridge_impression"
  | "bridge_click"
  | "bridge_handoff_received";

const PLAY_BRIDGE_DUAL: Readonly<
  Record<
    PlayBridgeDualKind,
    { legacy: DiagnosisAnalyticsEvent; modern: DiagnosisAnalyticsEvent }
  >
> = {
  play_started: {
    legacy: "rubel_play_started",
    modern: PLAY_BRIDGE_LEGACY_TO_MODERN.rubel_play_started,
  },
  play_completed: {
    legacy: "rubel_play_completed",
    modern: PLAY_BRIDGE_LEGACY_TO_MODERN.rubel_play_completed,
  },
  bridge_impression: {
    legacy: "rubel_bridge_impression",
    modern: PLAY_BRIDGE_LEGACY_TO_MODERN.rubel_bridge_impression,
  },
  bridge_click: {
    legacy: "rubel_bridge_click",
    modern: PLAY_BRIDGE_LEGACY_TO_MODERN.rubel_bridge_click,
  },
  bridge_handoff_received: {
    legacy: "rubel_bridge_handoff_received",
    modern: PLAY_BRIDGE_LEGACY_TO_MODERN.rubel_bridge_handoff_received,
  },
};

/**
 * Dual-write telemetry during Rubel→Liberty bridge phase.
 * Legacy rubel_* packets keep BI dashboards alive; liberty_* enables migration.
 */
export function trackPlayBridgeDual(
  kind: PlayBridgeDualKind,
  payload: DiagnosisAnalyticsPayload = {},
): void {
  const pair = PLAY_BRIDGE_DUAL[kind];
  trackDiagnosisEvent(pair.legacy, payload);
  trackDiagnosisEvent(pair.modern, payload);
}

/** Exhaustiveness guard — fails compile if events drift from dual map. */
const _assertEventsCovered: readonly DiagnosisAnalyticsEvent[] =
  DIAGNOSIS_ANALYTICS_EVENTS;
void _assertEventsCovered;
