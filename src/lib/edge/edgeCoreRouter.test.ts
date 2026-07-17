import { describe, expect, it } from "vitest";
import { APP_DOMAINS } from "@/lib/edge/appDomains";
import {
  edgeRequestFromParts,
  resolveEdgeCore,
} from "@/lib/edge/edgeCoreRouter";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/config";

function req(
  href: string,
  init?: { cookie?: string; acceptLanguage?: string },
) {
  const url = new URL(href);
  const headers = new Headers();
  if (init?.acceptLanguage) {
    headers.set("accept-language", init.acceptLanguage);
  }
  const cookies = new Map<string, string>();
  if (init?.cookie) {
    cookies.set(LOCALE_STORAGE_KEY, init.cookie);
  }
  return edgeRequestFromParts({ url, headers, cookies });
}

describe("resolveEdgeCore", () => {
  it("does not force /{locale} onto main app routes (stack truth)", () => {
    const result = resolveEdgeCore(
      req("https://liberty-canvas.vercel.app/diagnosis/play/big-five"),
    );

    expect(result.resolvedPath).toBe("/diagnosis/play/big-five");
    expect(result.shouldRewrite).toBe(false);
    expect(result.locale).toBe("ja");
  });

  it("rewrites Discover host onto /discover/[locale] for SEO", () => {
    const result = resolveEdgeCore(
      req("https://discover.liberty-canvas.app/", {
        acceptLanguage: "ko-KR,en;q=0.8",
      }),
      { persistOnDiscoverRewrite: true },
    );

    expect(result.resolvedPath).toBe("/discover/ko");
    expect(result.shouldRewrite).toBe(true);
    expect(result.locale).toBe("ko");
    expect(result.cookieToSet?.name).toBe(LOCALE_STORAGE_KEY);
    expect(result.cookieToSet?.options.domain).toBe(".liberty-canvas.app");
  });

  it("reads discover path locale and marks RTL from cookie/header", () => {
    const pathEn = resolveEdgeCore(
      req(`https://${APP_DOMAINS.MAIN}/discover/en/mbti-personality-types`),
    );
    expect(pathEn.locale).toBe("en");
    expect(pathEn.isRtl).toBe(false);
    expect(pathEn.cookieToSet?.value).toBe("en");

    // ar/he are app locales (RTL) but not Discover landing locales — cookie path.
    const ar = resolveEdgeCore(
      req("https://localhost:3000/play/demo", { cookie: "ar" }),
    );
    expect(ar.locale).toBe("ar");
    expect(ar.isRtl).toBe(true);

    const he = resolveEdgeCore(
      req("https://localhost:3000/play/demo", {
        acceptLanguage: "he-IL,en;q=0.8",
      }),
    );
    expect(he.locale).toBe("he");
    expect(he.isRtl).toBe(true);
  });

  it("prefers ?lang= over cookie and never uses preferred_locale", () => {
    const result = resolveEdgeCore(
      req("https://localhost:3000/play/cat?lang=fr", { cookie: "ja" }),
    );

    expect(result.locale).toBe("fr");
    expect(result.cookieToSet?.name).toBe(LOCALE_STORAGE_KEY);
    expect(result.cookieToSet?.value).toBe("fr");
  });

  it("omits shared Domain on vercel.app hosts", () => {
    const result = resolveEdgeCore(
      req("https://liberty-canvas.vercel.app/discover/en/big-five"),
    );

    expect(result.cookieToSet?.options.domain).toBeUndefined();
  });
});
