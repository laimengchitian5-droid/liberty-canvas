import { trackDiagnosisEvent } from "@/lib/diagnosis/analytics";
import {
  parseConductorEvent,
  toConductorAnalyticsWire,
  type ConductorEvent,
  type ConductorTelemetryEventName,
} from "@/types/telemetry";
import type { ConductorExpressSlug } from "@/types/conductor";
import type { Locale } from "@/lib/i18n/config";

/**
 * Identity Hub Conductor client telemetry.
 *
 * Rejected sketch defects:
 * - `@/src/types` import path
 * - parallel `/api/station/telemetry` sink (diagnosis analytics is SSOT)
 * - `timestamp` field on wire (use `occurredAtMs` → ISO `at`)
 * - sendBeacon without consent / Zod / fetch fallback
 * - emoji console chrome
 */

export type TrackConductorEventInput = {
  readonly eventName: ConductorTelemetryEventName | "express_line_boarded";
  readonly locale: Locale;
  readonly expressLineSlug: ConductorExpressSlug;
  readonly occurredAtMs?: number;
  readonly meta?: string;
};

/**
 * Non-blocking conductor funnel ping.
 * Validates → maps to diagnosis analytics wire → consent-gated flush
 * (`sendBeacon` preferred, `fetch({ keepalive: true })` fallback).
 */
export function trackConductorEvent(input: TrackConductorEventInput): void {
  if (typeof window === "undefined") {
    return;
  }

  const parsed = parseConductorEvent({
    eventName: input.eventName,
    locale: input.locale,
    expressLineSlug: input.expressLineSlug,
    occurredAtMs: input.occurredAtMs ?? Date.now(),
    meta: input.meta,
  });

  if (!parsed) {
    console.warn(
      "[telemetryEngine] blocked invalid conductor telemetry payload",
    );
    return;
  }

  flushConductorAnalytics(parsed);
}

function flushConductorAnalytics(event: ConductorEvent): void {
  const wire = toConductorAnalyticsWire(event);

  trackDiagnosisEvent(wire.event, {
    slug: wire.slug,
    locale: wire.locale,
    funnelStep: wire.funnelStep,
    ...(wire.variant ? { variant: wire.variant } : {}),
  });
}
