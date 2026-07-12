import { describe, expect, it } from "vitest";
import { resolveAppLocaleFromRequest } from "@/lib/i18n/resolveAppLocale";

describe("resolveAppLocaleFromRequest", () => {
  it("prefers query lang over cookie", () => {
    expect(
      resolveAppLocaleFromRequest({
        queryLang: "ko",
        cookieLocale: "ja",
      }),
    ).toBe("ko");
  });

  it("falls back to accept-language", () => {
    expect(
      resolveAppLocaleFromRequest({
        acceptLanguage: "zh-CN,en;q=0.9",
      }),
    ).toBe("zh");
  });

  it("defaults to ja", () => {
    expect(resolveAppLocaleFromRequest({})).toBe("ja");
  });
});
