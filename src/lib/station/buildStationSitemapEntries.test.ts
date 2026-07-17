import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { buildStationSitemapEntries } from "@/lib/station/buildStationSitemapEntries";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";

describe("buildStationSitemapEntries", () => {
  it("emits the full locale×platform matrix with canonical station paths", () => {
    const entries = buildStationSitemapEntries("https://liberty-canvas.vercel.app/");
    expect(entries).toHaveLength(
      SUPPORTED_LOCALES.length * DIAGNOSTIC_PLATFORM_IDS.length,
    );
    expect(entries[0]?.url).toBe(
      "https://liberty-canvas.vercel.app/station/en/16personalities",
    );
    expect(entries.every((e) => e.url.includes("/station/"))).toBe(true);
    expect(entries.some((e) => /\/[a-z]{2}\/station\//.test(e.url))).toBe(false);
    expect(entries.some((e) => e.url.includes("vercel.app{"))).toBe(false);
  });
});
