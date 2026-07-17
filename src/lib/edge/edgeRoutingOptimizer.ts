import { detectSiteKind, SITE_KIND, type SiteKind } from "@/lib/edge/appDomains";
import {
  resolveAppLocaleFromRequest,
  resolveDiscoverPathLocale,
} from "@/lib/i18n/resolveAppLocale";
import { isLandingLocale } from "@/lib/landing/landingLocales";
import type { Locale } from "@/lib/i18n/config";

export const EDGE_SITE_HEADER = "x-lc-site";

export interface EdgeRouteInput {
  readonly hostname: string;
  readonly pathname: string;
  readonly cookieLocale?: string | null;
  readonly queryLang?: string | null;
  readonly acceptLanguage?: string | null;
}

export interface EdgeRouteResolution {
  readonly siteKind: SiteKind;
  readonly locale: Locale;
  /** Internal pathname for Next.js rewrite (may equal input pathname). */
  readonly rewritePath: string;
  /** True when middleware should NextResponse.rewrite. */
  readonly shouldRewrite: boolean;
}

const DISCOVER_PREFIX = "/discover";

/**
 * Pure edge resolver — no class instance, no allocations beyond return object.
 * Locale resolution reuses resolveAppLocaleFromRequest (single source of truth).
 */
export function resolveEdgeRoute(input: EdgeRouteInput): EdgeRouteResolution {
  const pathname = normalizePathname(input.pathname);
  const siteKind = detectSiteKind(input.hostname);
  const pathLocale = resolveDiscoverPathLocale(pathname);

  const locale = resolveAppLocaleFromRequest({
    queryLang: input.queryLang,
    pathLocale,
    cookieLocale: input.cookieLocale,
    acceptLanguage: input.acceptLanguage,
  });

  const rewritePath = calculateRewritePath(siteKind, pathname, locale);
  const shouldRewrite = rewritePath !== pathname;

  return {
    siteKind,
    locale,
    rewritePath,
    shouldRewrite,
  };
}

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  // Collapse duplicate slashes; strip trailing slash except root (O(n)).
  let path = pathname.replace(/\/{2,}/g, "/");
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Discover subdomain → path-based App Router tree `/discover/[locale]/...`.
 * MAIN keeps existing path-based discover URLs untouched.
 */
export function calculateRewritePath(
  siteKind: SiteKind,
  pathname: string,
  locale: Locale,
): string {
  if (siteKind !== SITE_KIND.DISCOVER) {
    return pathname;
  }

  // Already on the App Router discover tree — avoid double prefix.
  if (pathname === DISCOVER_PREFIX || pathname.startsWith(`${DISCOVER_PREFIX}/`)) {
    return ensureDiscoverLocaleSegment(pathname, locale);
  }

  // Landing locales only for discover segments; fall back handled by isLandingLocale.
  const discoverLocale = isLandingLocale(locale) ? locale : "en";

  if (pathname === "/") {
    return `${DISCOVER_PREFIX}/${discoverLocale}`;
  }

  return `${DISCOVER_PREFIX}/${discoverLocale}${pathname}`;
}

function ensureDiscoverLocaleSegment(pathname: string, locale: Locale): string {
  const existing = resolveDiscoverPathLocale(pathname);
  if (existing) {
    return pathname;
  }

  const discoverLocale = isLandingLocale(locale) ? locale : "en";

  if (pathname === DISCOVER_PREFIX) {
    return `${DISCOVER_PREFIX}/${discoverLocale}`;
  }

  // `/discover/foo` (missing locale) → `/discover/{locale}/foo`
  const rest = pathname.slice(DISCOVER_PREFIX.length);
  return `${DISCOVER_PREFIX}/${discoverLocale}${rest}`;
}
