import type { DiagnosisResult } from "@/types/diagnosis";

export type DiagnosisAnalyticsEvent =
  | "diagnosis_ref_captured"
  | "diagnosis_started"
  | "diagnosis_completed"
  | "diagnosis_advice_opened"
  | "diagnosis_share_copy"
  | "diagnosis_share_native"
  | "diagnosis_share_print"
  | "plug_result_share_x"
  | "plug_result_share_copy"
  | "plug_result_share_link"
  | "plug_result_share_print"
  | "plug_result_deeplink_view"
  | "plug_result_deeplink_cta"
  | "plug_result_advice_opened"
  | "plug_result_advice_completed"
  | "plug_result_gallery_preview"
  | "plug_result_offline_restored"
  | "plug_result_completed"
  | "catalog_search"
  | "crawler_visit"
  | "builder_draft_saved"
  | "builder_preview_started";

export type FunnelStep =
  | "discover_ref"
  | "play_start"
  | "result_view"
  | "share";

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

function flushAnalyticsToServer(entry: Record<string, unknown>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    void fetch("/api/diagnosis/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
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

export function readDiagnosisRef(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return sessionStorage.getItem("lc-diagnosis-ref");
  } catch {
    return null;
  }
}

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
