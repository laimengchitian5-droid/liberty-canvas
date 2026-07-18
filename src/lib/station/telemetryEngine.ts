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
 * Sketch map (do NOT ship the thin beacon wrapper):
 * - `ConductorEventSchema` + `timestamp` → {@link parseConductorEvent} (`occurredAtMs`)
 * - `navigator.sendBeacon("/api/station/telemetry")` → {@link trackDiagnosisEvent}
 *   (consent-gated; beacon preferred inside diagnosis analytics SSOT)
 *
 * Rejected sketch defects:
 * - `@/src/types` import path
 * - inventing `/api/station/telemetry` (route does not exist; dual bus forbidden)
 * - wire field `timestamp` (canonical is `occurredAtMs` → ISO `at`)
 * - `Omit<ConductorEvent, "timestamp">` without Locale / Plug slug narrowing
 * - sendBeacon-only with no consent gate / no fetch keepalive fallback
 * - claiming "0ms INP" while skipping validation (Zod first, then flush)
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
