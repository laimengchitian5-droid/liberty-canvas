import { describe, expect, it } from "vitest";
import {
  buildRubelBridgeReport,
  buildShareFunnelReport,
} from "@/lib/diagnosis/analyticsInsights";
import { buildSpecialtyBridgeReport } from "@/lib/specialty/specialtyBridgeAnalytics";
import { encodeRubelBridgeFactorParam } from "@/lib/rubel/rubelBridgeHandoff";
import { buildPlugPlayHref } from "@/lib/rubel/suggestPlugDiagnosisSlug";
import { resolveRubelPlugRedirectPath } from "@/lib/rubel/rubelPlugConvergence";
import { withTraceId } from "@/lib/observability/observabilityPort";
import type { StoredAnalyticsEvent } from "@/lib/diagnosis/analyticsServer";

describe("buildShareFunnelReport", () => {
  it("computes ref-to-play and share rates", () => {
    const events: StoredAnalyticsEvent[] = [
      { event: "diagnosis_ref_captured", at: "2026-01-01T00:00:00Z", ref: "discover-ja" },
      { event: "diagnosis_ref_captured", at: "2026-01-01T00:01:00Z", ref: "discover-en" },
      {
        event: "diagnosis_started",
        at: "2026-01-01T00:02:00Z",
        funnelStep: "play_start",
        slug: "big-five",
      },
      {
        event: "plug_result_completed",
        at: "2026-01-01T00:03:00Z",
        funnelStep: "result_view",
        slug: "big-five",
      },
      {
        event: "plug_result_share_copy",
        at: "2026-01-01T00:04:00Z",
        funnelStep: "share",
        slug: "big-five",
      },
    ];

    const report = buildShareFunnelReport(events);

    expect(report.discoverRefs).toBe(2);
    expect(report.playStarts).toBe(1);
    expect(report.resultViews).toBe(1);
    expect(report.shareEvents).toBe(1);
    expect(report.refToPlayRate).toBe(50);
    expect(report.shareRate).toBe(100);
  });
});

describe("buildSpecialtyBridgeReport", () => {
  it("computes specialty bridge click-to-play conversion by country", () => {
    const events: StoredAnalyticsEvent[] = [
      {
        event: "specialty_bridge_impression",
        at: "2026-01-01T00:00:00Z",
        slug: "world-specialty-soul",
        targetCountryId: "jp",
      },
      {
        event: "plug_result_specialty_bridge_click",
        at: "2026-01-01T00:00:01Z",
        slug: "world-specialty-soul",
        ref: "specialty-bridge",
        targetCountryId: "jp",
      },
      {
        event: "plug_result_specialty_bridge_click",
        at: "2026-01-01T00:00:02Z",
        slug: "world-specialty-soul",
        ref: "specialty-bridge",
        targetCountryId: "fr",
      },
      {
        event: "specialty_deep_play_start",
        at: "2026-01-01T00:00:03Z",
        slug: "jp-sakamai-craft",
        ref: "specialty-bridge",
        targetCountryId: "jp",
      },
    ];

    const report = buildSpecialtyBridgeReport(events);

    expect(report.impressions).toBe(1);
    expect(report.clicks).toBe(2);
    expect(report.deepPlayStarts).toBe(1);
    expect(report.clickToPlayRate).toBe(50);
    expect(report.byCountry).toEqual([
      { countryId: "jp", clicks: 1, deepPlayStarts: 1 },
      { countryId: "fr", clicks: 1, deepPlayStarts: 0 },
    ]);
  });
});

describe("buildRubelBridgeReport", () => {
  it("computes bridge click-to-play conversion", () => {
    const events: StoredAnalyticsEvent[] = [
      { event: "rubel_bridge_impression", at: "2026-01-01T00:00:00Z" },
      { event: "rubel_bridge_impression", at: "2026-01-01T00:00:01Z" },
      { event: "rubel_bridge_click", at: "2026-01-01T00:00:02Z", ref: "rubel-bridge" },
      {
        event: "rubel_bridge_handoff_received",
        at: "2026-01-01T00:00:03Z",
        ref: "rubel-bridge",
      },
      {
        event: "diagnosis_started",
        at: "2026-01-01T00:00:04Z",
        ref: "rubel-bridge",
        slug: "romance",
      },
    ];

    const report = buildRubelBridgeReport(events);

    expect(report.impressions).toBe(2);
    expect(report.clicks).toBe(1);
    expect(report.handoffsReceived).toBe(1);
    expect(report.plugStartsFromBridge).toBe(1);
    expect(report.clickToPlayRate).toBe(100);
  });

  it("prefers liberty_* over rubel_* during dual-write without 2× inflation", () => {
    const events: StoredAnalyticsEvent[] = [
      { event: "rubel_bridge_impression", at: "2026-01-01T00:00:00Z" },
      { event: "liberty_bridge_impression", at: "2026-01-01T00:00:00Z" },
      { event: "rubel_bridge_click", at: "2026-01-01T00:00:01Z", ref: "rubel-bridge" },
      { event: "liberty_bridge_click", at: "2026-01-01T00:00:01Z", ref: "rubel-bridge" },
    ];

    const report = buildRubelBridgeReport(events);
    expect(report.impressions).toBe(1);
    expect(report.clicks).toBe(1);
  });
});

describe("rubel bridge handoff", () => {
  it("encodes five-factor blob and appends to play href", () => {
    const factors = encodeRubelBridgeFactorParam({
      openness: 4,
      empathy_need: 4.5,
      ego: 0,
    });

    expect(factors.split("-")).toHaveLength(5);

    const href = buildPlugPlayHref("romance", {
      ref: "rubel-bridge",
      profile: { openness: 4, empathy_need: 4.5, ego: 0 },
    });

    expect(href).toContain("ref=rubel-bridge");
    expect(href).toContain(`f=${factors}`);
  });
});

describe("rubel plug convergence", () => {
  it("maps known rubel play ids to plug slugs", () => {
    const path = resolveRubelPlugRedirectPath(
      "rubel-neko-ja-v1",
      new URLSearchParams("lang=ja"),
    );

    expect(path).toBe("/diagnosis/play/romance?lang=ja&ref=rubel-converge");
  });
});

describe("observabilityPort", () => {
  it("adds traceId to payloads", () => {
    const traced = withTraceId({ event: "catalog_search", at: "2026-01-01T00:00:00Z" });

    expect(traced.traceId).toMatch(/^[0-9a-f-]{36}$|^trace-/);
    expect(traced.event).toBe("catalog_search");
  });
});
