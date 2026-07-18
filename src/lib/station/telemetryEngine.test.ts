import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const trackDiagnosisEvent = vi.fn();

vi.mock("@/lib/diagnosis/analytics", () => ({
  trackDiagnosisEvent: (...args: unknown[]) => trackDiagnosisEvent(...args),
}));

describe("trackConductorEvent", () => {
  beforeEach(() => {
    trackDiagnosisEvent.mockClear();
    vi.stubGlobal("window", {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("forwards validated events onto diagnosis analytics SSOT", async () => {
    const { trackConductorEvent } = await import("@/lib/station/telemetryEngine");

    trackConductorEvent({
      eventName: "conductor_pre_screen",
      locale: "ja",
      expressLineSlug: "personality-spectrum",
      meta: "energy-high",
    });

    expect(trackDiagnosisEvent).toHaveBeenCalledTimes(1);
    expect(trackDiagnosisEvent).toHaveBeenCalledWith(
      "conductor_pre_screen",
      expect.objectContaining({
        slug: "personality-spectrum",
        locale: "ja",
        funnelStep: "conductor_gate",
        variant: "energy-high",
      }),
    );
  });

  it("blocks invented express slugs before flush", async () => {
    const { trackConductorEvent } = await import("@/lib/station/telemetryEngine");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    trackConductorEvent({
      eventName: "conductor_express_boarded",
      locale: "en",
      expressLineSlug: "global-identity-core" as never,
    });

    expect(trackDiagnosisEvent).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
