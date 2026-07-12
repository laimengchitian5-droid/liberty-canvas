import { describe, expect, it } from "vitest";
import {
  buildDiscoverFunnelRef,
  buildDiscoverPlayHandoffUrl,
  isDiscoverFunnelRef,
} from "@/lib/landing/discoverFunnelRef";

describe("discoverFunnelRef", () => {
  it("builds locale-aware ref tokens", () => {
    expect(buildDiscoverFunnelRef("ko", "mbti-personality-types")).toBe(
      "discover-ko-mbti-personality-types",
    );
  });

  it("builds play handoff urls with lang, ref, and direct mode", () => {
    expect(
      buildDiscoverPlayHandoffUrl(
        "/diagnosis/play/personality-spectrum",
        "ja",
        "sixteen-personalities",
        { direct: true },
      ),
    ).toBe(
      "/diagnosis/play/personality-spectrum?lang=ja&ref=discover-ja-sixteen-personalities&mode=direct",
    );
  });

  it("detects discover funnel refs", () => {
    expect(isDiscoverFunnelRef("discover-en-mbti-personality-types")).toBe(true);
    expect(isDiscoverFunnelRef("gsc-legacy")).toBe(false);
  });
});
