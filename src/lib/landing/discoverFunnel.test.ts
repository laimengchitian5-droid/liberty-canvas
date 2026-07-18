import { describe, expect, it } from "vitest";
import {
  buildDiscoverFunnelRef,
  buildDiscoverPlayHandoffUrl,
  isDiscoverDirectMode,
  isDiscoverFunnelRef,
  parseDiscoverFunnelRef,
  resolveHandoffDisplayLocale,
  toLandingLocale,
} from "@/lib/landing/discoverFunnel";

describe("discoverFunnel", () => {
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

  it("hands brand hub to /diagnosis with locale ref", () => {
    expect(buildDiscoverPlayHandoffUrl("/diagnosis", "en", "libertycanvas")).toBe(
      "/diagnosis?lang=en&ref=discover-en-libertycanvas",
    );
  });

  it("parses funnel refs without splitting multi-hyphen slugs", () => {
    expect(parseDiscoverFunnelRef("discover-ko-mbti-personality-types")).toEqual({
      locale: "ko",
      slug: "mbti-personality-types",
    });
    expect(parseDiscoverFunnelRef("gsc-legacy")).toBeNull();
  });

  it("detects discover funnel refs and direct mode", () => {
    expect(isDiscoverFunnelRef("discover-en-mbti-personality-types")).toBe(true);
    expect(isDiscoverFunnelRef("gsc-legacy")).toBe(false);
    expect(isDiscoverDirectMode("direct")).toBe(true);
    expect(isDiscoverDirectMode("intro")).toBe(false);
  });

  it("resolves handoff display locale from query with fallback", () => {
    expect(resolveHandoffDisplayLocale("ko", "ja")).toBe("ko");
    expect(resolveHandoffDisplayLocale(null, "ja")).toBe("ja");
    expect(toLandingLocale("fr")).toBe("fr");
    expect(toLandingLocale("de")).toBe("de");
    expect(toLandingLocale("ar")).toBeNull();
    expect(toLandingLocale("zh")).toBe("zh");
  });
});
