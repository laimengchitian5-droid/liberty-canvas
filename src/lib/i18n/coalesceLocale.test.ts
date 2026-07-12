import { describe, expect, it } from "vitest";
import { firstResolvedLocale } from "@/lib/i18n/resolveAppLocale";

describe("firstResolvedLocale", () => {
  it("returns first valid locale in priority order", () => {
    expect(firstResolvedLocale(null, "ko", "ja")).toBe("ko");
    expect(firstResolvedLocale(undefined, "", "zh")).toBe("zh");
    expect(firstResolvedLocale("invalid", "fr")).toBe("fr");
  });

  it("returns null when no candidate resolves", () => {
    expect(firstResolvedLocale(null, "xx")).toBeNull();
  });
});
