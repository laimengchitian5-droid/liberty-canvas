import {
  buildLocaleCookie,
  type LocaleCookieDescriptor,
} from "@/lib/edge/crossDomainSession";
import {
  resolveEdgeRoute,
  type EdgeRouteResolution,
} from "@/lib/edge/edgeRoutingOptimizer";
import type { SiteKind } from "@/lib/edge/appDomains";
import { getDirection, LOCALE_STORAGE_KEY, type Locale } from "@/lib/i18n/config";
import { resolveDiscoverPathLocale } from "@/lib/i18n/resolveAppLocale";

/**
 * Minimal edge request view — avoid forcing a Map allocation per hit.
 * Compatible with NextRequest via {@link edgeRequestFromNext}.
 */
export interface EdgeRequest {
  readonly url: URL;
  readonly headers: Headers;
  readonly getCookie: (name: string) => string | undefined;
}

export interface EdgeCoreResolution {
  readonly locale: Locale;
  /** Internal pathname after discover/locale sanitization. */
  readonly resolvedPath: string;
  readonly isRtl: boolean;
  readonly siteKind: SiteKind;
  readonly shouldRewrite: boolean;
  /**
   * Cookie descriptor when locale was explicitly established
   * (?lang= or /discover/{locale}/ or discover-host rewrite injecting locale).
   */
  readonly cookieToSet?: LocaleCookieDescriptor;
}

export interface ResolveEdgeCoreOptions {
  readonly secure?: boolean;
  /** When true, persist locale cookie after discover rewrite injects locale. */
  readonly persistOnDiscoverRewrite?: boolean;
}

/**
 * Pure edge core resolver (no class instance — tree-shakeable, zero `this`).
 *
 * Stack truth (do not violate):
 * - Locale lives in `/discover/[locale]/…`, not `/{locale}/diagnosis`.
 * - Cookie name is {@link LOCALE_STORAGE_KEY}, not `preferred_locale`.
 * - Default locale is `ja` (via resolveAppLocaleFromRequest).
 * - Shared cookie Domain only on `*.liberty-canvas.app`.
 */
export function resolveEdgeCore(
  req: EdgeRequest,
  options: ResolveEdgeCoreOptions = {},
): EdgeCoreResolution {
  const pathname = req.url.pathname;
  const hostname = req.url.hostname;
  const queryLang = req.url.searchParams.get("lang");

  const route: EdgeRouteResolution = resolveEdgeRoute({
    hostname,
    pathname,
    cookieLocale: req.getCookie(LOCALE_STORAGE_KEY),
    queryLang,
    acceptLanguage: req.headers.get("accept-language"),
  });

  const pathLocale =
    resolveDiscoverPathLocale(route.rewritePath) ??
    resolveDiscoverPathLocale(pathname);

  const injectedDiscoverLocale =
    Boolean(options.persistOnDiscoverRewrite) &&
    route.shouldRewrite &&
    resolveDiscoverPathLocale(route.rewritePath) !== null;

  const shouldSetCookie = Boolean(queryLang || pathLocale || injectedDiscoverLocale);

  const cookieToSet = shouldSetCookie
    ? buildLocaleCookie(route.locale, hostname, {
        secure: options.secure ?? req.url.protocol === "https:",
      })
    : undefined;

  return {
    locale: route.locale,
    resolvedPath: route.rewritePath,
    isRtl: getDirection(route.locale) === "rtl",
    siteKind: route.siteKind,
    shouldRewrite: route.shouldRewrite,
    cookieToSet,
  };
}

/** Adapter: Next.js middleware request → EdgeRequest (O(1), no Map copy). */
export function edgeRequestFromNext(request: {
  readonly nextUrl: URL;
  readonly headers: Headers;
  readonly cookies: { get: (name: string) => { value: string } | undefined };
}): EdgeRequest {
  return {
    url: request.nextUrl,
    headers: request.headers,
    getCookie: (name) => request.cookies.get(name)?.value,
  };
}

/**
 * Optional Map-based constructor for tests / non-Next runtimes.
 * Prefer {@link edgeRequestFromNext} on the hot path.
 */
export function edgeRequestFromParts(input: {
  readonly url: URL;
  readonly headers?: Headers;
  readonly cookies?: ReadonlyMap<string, string>;
}): EdgeRequest {
  const cookies = input.cookies ?? new Map<string, string>();
  return {
    url: input.url,
    headers: input.headers ?? new Headers(),
    getCookie: (name) => cookies.get(name),
  };
}
