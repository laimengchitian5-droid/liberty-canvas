import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { CONDUCTOR_EXPRESS_SLUGS } from "@/types/conductor";

/**
 * Identity Hub Conductor telemetry contracts.
 *
 * Rejected sketch defects (do not reintroduce):
 * - bare `locale: string` / `expressLineSlug: string` (use closed enums)
 * - required unbounded `timestamp: z.number()` (use finite `occurredAtMs` window)
 * - `metaData` only (canonical field is `meta`; alias kept one release)
 * - inventing a second event bus (wire via {@link toConductorAnalyticsWire})
 */

export const CONDUCTOR_TELEMETRY_EVENTS = [
  "conductor_pre_screen",
  "conductor_express_boarded",
] as const;

export type ConductorTelemetryEventName =
  (typeof CONDUCTOR_TELEMETRY_EVENTS)[number];

/** Epoch ms window — rejects NaN/Infinity and absurd clock values. */
const OccurredAtMsSchema = z
  .number()
  .finite()
  .int()
  .min(1_577_836_800_000) // 2020-01-01 UTC
  .max(4_102_444_800_000); // 2100-01-01 UTC

const FlatMetaSchema = z.string().trim().max(200);

const ConductorEventInputSchema = z.object({
  eventName: z.enum([
    ...CONDUCTOR_TELEMETRY_EVENTS,
    /** @deprecated sketch alias → {@link ConductorTelemetryEventName} */
    "express_line_boarded",
  ]),
  locale: z.enum(SUPPORTED_LOCALES),
  expressLineSlug: z.enum(CONDUCTOR_EXPRESS_SLUGS),
  occurredAtMs: OccurredAtMsSchema.optional(),
  /** @deprecated Prefer {@link ConductorEvent.occurredAtMs} */
  timestamp: OccurredAtMsSchema.optional(),
  meta: FlatMetaSchema.optional(),
  /** @deprecated Prefer {@link ConductorEvent.meta} */
  metaData: FlatMetaSchema.optional(),
});

export const ConductorEventSchema = ConductorEventInputSchema.transform(
  (raw) => {
    const eventName: ConductorTelemetryEventName =
      raw.eventName === "express_line_boarded"
        ? "conductor_express_boarded"
        : raw.eventName;

    return {
      eventName,
      locale: raw.locale,
      expressLineSlug: raw.expressLineSlug,
      occurredAtMs: raw.occurredAtMs ?? raw.timestamp ?? Date.now(),
      meta: raw.meta ?? raw.metaData,
    };
  },
);

export type ConductorEvent = z.infer<typeof ConductorEventSchema>;

export function parseConductorEvent(input: unknown): ConductorEvent | null {
  const parsed = ConductorEventSchema.safeParse(input);
  return parsed.success ? parsed.data : null;
}

/**
 * Map a validated conductor event onto the diagnosis analytics wire shape
 * (`event` + ISO `at`) so the existing fail-closed API can accept it.
 */
export function toConductorAnalyticsWire(event: ConductorEvent): {
  event: ConductorTelemetryEventName;
  at: string;
  slug: string;
  locale: string;
  funnelStep: "conductor_gate";
  variant?: string;
} {
  return {
    event: event.eventName,
    at: new Date(event.occurredAtMs).toISOString(),
    slug: event.expressLineSlug,
    locale: event.locale,
    funnelStep: "conductor_gate",
    ...(event.meta ? { variant: event.meta } : {}),
  };
}
