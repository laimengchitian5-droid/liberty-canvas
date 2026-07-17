import { describe, expect, it } from "vitest";
import {
  buildSpecialtyDeepDiveHref,
  buildSpecialtyDeepPlayStartPayload,
  isSpecialtyBridgeRef,
  shouldTrackSpecialtyBridgeDeepPlay,
  SPECIALTY_BRIDGE_REF,
} from "@/lib/specialty/specialtyBridge";
import { getSpecialtyCountryByCSlug } from "@/lib/specialty/globalSpecialtyTaxonomy";
import { buildSpecialtyBridgeReport } from "@/lib/specialty/specialtyBridgeAnalytics";
import type { StoredAnalyticsEvent } from "@/lib/diagnosis/analyticsServer";

describe("specialtyBridge", () => {
  it("recognizes bridge ref token", () => {
    expect(isSpecialtyBridgeRef(SPECIALTY_BRIDGE_REF)).toBe(true);
    expect(isSpecialtyBridgeRef("rubel-bridge")).toBe(false);
  });

  it("tracks only country C slugs reached via bridge ref", () => {
    expect(
      shouldTrackSpecialtyBridgeDeepPlay(SPECIALTY_BRIDGE_REF, "jp-sakamai-craft"),
    ).toBe(true);
    expect(
      shouldTrackSpecialtyBridgeDeepPlay(SPECIALTY_BRIDGE_REF, "world-specialty-soul"),
    ).toBe(false);
    expect(shouldTrackSpecialtyBridgeDeepPlay("discover-ja", "jp-sakamai-craft")).toBe(
      false,
    );
  });

  it("resolves country by C slug in O(1) lookup table", () => {
    const country = getSpecialtyCountryByCSlug("fr-terroir-poet");
    expect(country?.id).toBe("fr");
  });

  it("builds deep-play analytics payload with stable ref", () => {
    const payload = buildSpecialtyDeepPlayStartPayload("jp-sakamai-craft");
    expect(payload.ref).toBe(SPECIALTY_BRIDGE_REF);
    expect(payload.targetCountryId).toBe("jp");
    expect(payload.targetPath).toBe("/diagnosis/play/jp-sakamai-craft");
  });

  it("builds bridge href with encoded ref", () => {
    expect(buildSpecialtyDeepDiveHref("/diagnosis/play/jp-sakamai-craft")).toBe(
      "/diagnosis/play/jp-sakamai-craft?ref=specialty-bridge",
    );
  });
});

describe("buildSpecialtyBridgeReport", () => {
  it("aggregates funnel metrics in a single pass", () => {
    const events: StoredAnalyticsEvent[] = [
      {
        event: "specialty_bridge_impression",
        at: "2026-01-01T00:00:00Z",
        targetCountryId: "jp",
      },
      {
        event: "plug_result_specialty_bridge_click",
        at: "2026-01-01T00:00:01Z",
        targetCountryId: "jp",
      },
      {
        event: "specialty_deep_play_start",
        at: "2026-01-01T00:00:02Z",
        targetCountryId: "jp",
      },
    ];

    const report = buildSpecialtyBridgeReport(events);

    expect(report.impressions).toBe(1);
    expect(report.clicks).toBe(1);
    expect(report.deepPlayStarts).toBe(1);
    expect(report.clickToPlayRate).toBe(100);
  });
});
