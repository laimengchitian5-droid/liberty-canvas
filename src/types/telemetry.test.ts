import { describe, expect, it } from "vitest";
import { analyticsEventSchema } from "@/lib/diagnosis/analyticsServer";
import {
  parseConductorEvent,
  toConductorAnalyticsWire,
} from "@/types/telemetry";

describe("ConductorEventSchema", () => {
  it("accepts canonical conductor telemetry", () => {
    const event = parseConductorEvent({
      eventName: "conductor_pre_screen",
      locale: "ja",
      expressLineSlug: "personality-spectrum",
      occurredAtMs: 1_700_000_000_000,
      meta: "energy-high",
    });

    expect(event).toEqual({
      eventName: "conductor_pre_screen",
      locale: "ja",
      expressLineSlug: "personality-spectrum",
      occurredAtMs: 1_700_000_000_000,
      meta: "energy-high",
    });
  });

  it("normalizes sketch aliases and rejects invented slugs", () => {
    const aliased = parseConductorEvent({
      eventName: "express_line_boarded",
      locale: "en",
      expressLineSlug: "big-five",
      timestamp: 1_700_000_000_000,
      metaData: "board",
    });
    expect(aliased?.eventName).toBe("conductor_express_boarded");
    expect(aliased?.meta).toBe("board");

    expect(
      parseConductorEvent({
        eventName: "conductor_pre_screen",
        locale: "ja",
        expressLineSlug: "global-identity-core",
      }),
    ).toBeNull();

    expect(
      parseConductorEvent({
        eventName: "conductor_pre_screen",
        locale: "xx",
        expressLineSlug: "big-five",
      }),
    ).toBeNull();
  });

  it("maps onto the diagnosis analytics wire schema", () => {
    const event = parseConductorEvent({
      eventName: "conductor_express_boarded",
      locale: "en",
      expressLineSlug: "romance",
      occurredAtMs: 1_700_000_000_000,
    });
    expect(event).not.toBeNull();
    const wire = toConductorAnalyticsWire(event!);
    const parsed = analyticsEventSchema.safeParse(wire);
    expect(parsed.success).toBe(true);
    expect(wire.funnelStep).toBe("conductor_gate");
  });
});
