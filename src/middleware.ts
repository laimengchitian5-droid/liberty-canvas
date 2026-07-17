import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { verifyUserApiAccess } from "@/lib/auth/verifyUserApiAccess";

import { buildContentSecurityPolicy } from "@/lib/security/csp";
import {
  edgeRequestFromNext,
  resolveEdgeCore,
} from "@/lib/edge/edgeCoreRouter";
import { EDGE_SITE_HEADER } from "@/lib/edge/edgeRoutingOptimizer";
import { buildLocaleCookie } from "@/lib/edge/crossDomainSession";
import { resolveStationLocaleRedirect } from "@/lib/edge/stationLocaleRedirect";
import {
  applyEdgeSeoHeaders,
  isSearchCrawler,
  normalizeRefParam,
} from "@/lib/seo/edgeSeo";
import {
  buildLegacyRedirectUrl,
  resolveLegacyDiagnosisRedirect,
} from "@/lib/seo/legacyRouteMatrix";
import { postCrawlerVisitFromEdge } from "@/lib/catalog/crawlerAnalyticsEdge";
import {
  isRubelConvergeRedirectEnabled,
  resolveRubelPlugRedirectPath,
} from "@/lib/rubel/rubelPlugConvergence";
import { resolveBrandId } from "@/lib/brand/resolveBrand";

function applySecurityHeaders(response: NextResponse, csp: string): NextResponse {
  response.headers.set("Content-Security-Policy", csp);

  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  response.headers.set("X-Content-Type-Options", "nosniff");

  response.headers.set("X-Frame-Options", "DENY");

  response.headers.set(
    "Permissions-Policy",

    "camera=(), microphone=(), geolocation=()",
  );

  return response;
}

async function handleUserApiGate(request: NextRequest): Promise<NextResponse> {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);

  const rawUserId = segments[2] ?? "";

  const userId = decodeURIComponent(rawUserId);

  const decision = await verifyUserApiAccess(
    userId,

    request.headers.get("cookie"),
  );

  if (!decision.allowed) {
    return NextResponse.json(
      { error: decision.message },

      { status: decision.status },
    );
  }

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-lc-session-user", decision.sessionUserId ?? "");

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/users/")) {
    return handleUserApiGate(request);
  }

  const legacyTarget = resolveLegacyDiagnosisRedirect(request.nextUrl.pathname);

  if (legacyTarget) {
    const redirectUrl = buildLegacyRedirectUrl(request.nextUrl, legacyTarget);
    return NextResponse.redirect(redirectUrl, 308);
  }

  if (isRubelConvergeRedirectEnabled()) {
    const playMatch = request.nextUrl.pathname.match(/^\/play\/([^/]+)$/);

    if (playMatch?.[1]) {
      const redirectPath = resolveRubelPlugRedirectPath(
        playMatch[1],
        request.nextUrl.searchParams,
      );

      if (redirectPath) {
        return NextResponse.redirect(new URL(redirectPath, request.url), 307);
      }
    }
  }

  const csp = buildContentSecurityPolicy();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", csp);

  const edge = resolveEdgeCore(edgeRequestFromNext(request), {
    persistOnDiscoverRewrite: true,
  });

  // Station SEO: /station/{id} → /station/{locale}/{id} (not /{locale}/station/...).
  const stationPath = resolveStationLocaleRedirect(
    request.nextUrl.pathname,
    edge.locale,
  );
  if (stationPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = stationPath;
    const redirectResponse = NextResponse.redirect(redirectUrl, 307);
    const localeCookie =
      edge.cookieToSet ??
      buildLocaleCookie(edge.locale, request.nextUrl.hostname, {
        secure: request.nextUrl.protocol === "https:",
      });
    redirectResponse.cookies.set(
      localeCookie.name,
      localeCookie.value,
      localeCookie.options,
    );
    return applySecurityHeaders(redirectResponse, csp);
  }

  const brandPath = edge.shouldRewrite
    ? edge.resolvedPath
    : request.nextUrl.pathname;
  const brandId = resolveBrandId(brandPath);

  requestHeaders.set("x-lc-locale", edge.locale);
  requestHeaders.set(EDGE_SITE_HEADER, edge.siteKind);
  requestHeaders.set("x-lc-brand", brandId);
  if (edge.isRtl) {
    requestHeaders.set("x-lc-dir", "rtl");
  }

  let response: NextResponse;

  if (edge.shouldRewrite) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = edge.resolvedPath;
    response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
  } else {
    response = NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  response.headers.set("x-lc-brand", brandId);
  response.headers.set(EDGE_SITE_HEADER, edge.siteKind);

  if (edge.cookieToSet) {
    response.cookies.set(
      edge.cookieToSet.name,
      edge.cookieToSet.value,
      edge.cookieToSet.options,
    );
  }

  const userAgent = request.headers.get("user-agent");

  if (isSearchCrawler(userAgent)) {
    const ref = normalizeRefParam(request.nextUrl.searchParams.get("ref"));
    postCrawlerVisitFromEdge(request.nextUrl.origin, {
      pathname: request.nextUrl.pathname,
      ref,
      userAgent,
    });
  }

  return applyEdgeSeoHeaders(request, applySecurityHeaders(response, csp));
}

export const config = {
  matcher: [
    "/api/users/:path*",

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2)$).*)",

      missing: [
        { type: "header", key: "next-router-prefetch" },

        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
