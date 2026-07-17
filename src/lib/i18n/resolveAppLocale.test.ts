import { describe, expect, it } from "vitest";
import {
  resolveAppLocaleFromRequest,
  resolveDiscoverPathLocale,
} from "@/lib/i18n/resolveAppLocale";

describe("resolveAppLocaleFromRequest", () => {
  it("prefers query lang over cookie", () => {
    expect(
      resolveAppLocaleFromRequest({
        queryLang: "ko",
        cookieLocale: "ja",
      }),
    ).toBe("ko");
  });

  it("prefers path locale over cookie when query is absent", () => {
    expect(
      resolveAppLocaleFromRequest({
        pathLocale: "en",
        cookieLocale: "ja",
      }),
    ).toBe("en");
  });

  it("prefers query lang over discover path locale", () => {
    expect(
      resolveAppLocaleFromRequest({
        queryLang: "zh",
        pathLocale: "ja",
      }),
    ).toBe("zh");
  });

  it("resolves discover path locale from pathname", () => {
    expect(resolveDiscoverPathLocale("/discover/ko/mbti-personality-types")).toBe("ko");
    expect(resolveDiscoverPathLocale("/discover/fr/enneagram-nine-types")).toBe("fr");
    expect(resolveDiscoverPathLocale("/discover/de/big-five-ocean")).toBe("de");
    expect(resolveDiscoverPathLocale("/diagnosis/play/romance")).toBeNull();
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
