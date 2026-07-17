import { describe, expect, it } from "vitest";
import {
  APP_DOMAINS,
  detectSiteKind,
  normalizeHostname,
  resolveCookieDomain,
  SITE_KIND,
} from "@/lib/edge/appDomains";
import { buildLocaleCookie } from "@/lib/edge/crossDomainSession";
import {
  calculateRewritePath,
  resolveEdgeRoute,
} from "@/lib/edge/edgeRoutingOptimizer";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/config";

describe("appDomains", () => {
  it("normalizes hostnames and detects sites in O(1) exact map", () => {
    expect(normalizeHostname("Discover.Liberty-Canvas.App:443")).toBe(
      APP_DOMAINS.DISCOVER,
    );
    expect(detectSiteKind(APP_DOMAINS.DISCOVER)).toBe(SITE_KIND.DISCOVER);
    expect(detectSiteKind(APP_DOMAINS.DASHBOARD)).toBe(SITE_KIND.DASHBOARD);
    expect(detectSiteKind(APP_DOMAINS.MAIN)).toBe(SITE_KIND.MAIN);
    expect(detectSiteKind("localhost:3000")).toBe(SITE_KIND.MAIN);
  });

  it("does not treat arbitrary hosts containing 'discover' as Discover", () => {
    expect(detectSiteKind("evil-discover.example.com")).toBe(SITE_KIND.MAIN);
    expect(detectSiteKind("notdiscover.liberty-canvas.app")).toBe(SITE_KIND.MAIN);
  });

  it("only emits shared cookie domain on apex tree", () => {
    expect(resolveCookieDomain(APP_DOMAINS.DISCOVER)).toBe(".liberty-canvas.app");
    expect(resolveCookieDomain(APP_DOMAINS.MAIN)).toBeUndefined();
    expect(resolveCookieDomain("localhost")).toBeUndefined();
  });
});

describe("calculateRewritePath", () => {
  it("rewrites Discover apex host traffic onto /discover/[locale]", () => {
    expect(calculateRewritePath(SITE_KIND.DISCOVER, "/", "ja")).toBe("/discover/ja");
    expect(calculateRewritePath(SITE_KIND.DISCOVER, "/mbti-personality-types", "en")).toBe(
      "/discover/en/mbti-personality-types",
    );
  });

  it("does not double-prefix existing /discover paths", () => {
    expect(
      calculateRewritePath(SITE_KIND.DISCOVER, "/discover/ko/big-five-ocean", "ja"),
    ).toBe("/discover/ko/big-five-ocean");
    expect(calculateRewritePath(SITE_KIND.DISCOVER, "/discover", "fr")).toBe(
      "/discover/fr",
    );
  });

  it("leaves MAIN path-based discover untouched", () => {
    expect(
      calculateRewritePath(SITE_KIND.MAIN, "/discover/ja/enneagram-nine-types", "en"),
    ).toBe("/discover/ja/enneagram-nine-types");
    expect(calculateRewritePath(SITE_KIND.MAIN, "/diagnosis", "ja")).toBe("/diagnosis");
  });
});

describe("resolveEdgeRoute", () => {
  it("prefers query lang and marks rewrite on Discover host", () => {
    const result = resolveEdgeRoute({
      hostname: APP_DOMAINS.DISCOVER,
      pathname: "/",
      queryLang: "ko",
      cookieLocale: "ja",
    });

    expect(result.locale).toBe("ko");
    expect(result.siteKind).toBe(SITE_KIND.DISCOVER);
    expect(result.rewritePath).toBe("/discover/ko");
    expect(result.shouldRewrite).toBe(true);
  });

  it("defaults locale to ja on MAIN without signals", () => {
    const result = resolveEdgeRoute({
      hostname: "localhost",
      pathname: "/play/rubel-burnout-v1",
    });

    expect(result.locale).toBe("ja");
    expect(result.shouldRewrite).toBe(false);
  });
});

describe("buildLocaleCookie", () => {
  it("uses canonical LOCALE_STORAGE_KEY and optional shared domain", () => {
    const cookie = buildLocaleCookie("en", APP_DOMAINS.DISCOVER);
    expect(cookie.name).toBe(LOCALE_STORAGE_KEY);
    expect(cookie.value).toBe("en");
    expect(cookie.options.domain).toBe(".liberty-canvas.app");
    expect(cookie.options.httpOnly).toBe(false);
    expect(cookie.options.sameSite).toBe("lax");

    const vercel = buildLocaleCookie("ja", APP_DOMAINS.MAIN);
    expect(vercel.options.domain).toBeUndefined();
  });
});
