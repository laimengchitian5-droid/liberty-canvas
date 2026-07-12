import { describe, expect, it } from "vitest";
import { buildShareFunnelReport } from "@/lib/diagnosis/analyticsInsights";
import type { StoredAnalyticsEvent } from "@/lib/diagnosis/analyticsServer";

describe("buildShareFunnelReport", () => {
  it("computes ref-to-play and share rates", () => {
    const events: StoredAnalyticsEvent[] = [
      { event: "diagnosis_ref_captured", at: "2026-01-01T00:00:00Z", ref: "discover-ja" },
      { event: "diagnosis_ref_captured", at: "2026-01-01T00:01:00Z", ref: "discover-en" },
      { event: "diagnosis_started", at: "2026-01-01T00:02:00Z", funnelStep: "play_start", slug: "big-five" },
      { event: "plug_result_completed", at: "2026-01-01T00:03:00Z", funnelStep: "result_view", slug: "big-five" },
      { event: "plug_result_share_copy", at: "2026-01-01T00:04:00Z", funnelStep: "share", slug: "big-five" },
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
