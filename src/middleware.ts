import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { verifyUserApiAccess } from "@/lib/auth/verifyUserApiAccess";

import { buildContentSecurityPolicy } from "@/lib/security/csp";
import {
  LOCALE_STORAGE_KEY,
  resolveAppLocaleFromRequest,
  resolveDiscoverPathLocale,
} from "@/lib/i18n/resolveAppLocale";
import { applyEdgeSeoHeaders, isSearchCrawler, normalizeRefParam } from "@/lib/seo/edgeSeo";
import {
  buildLegacyRedirectUrl,
  resolveLegacyDiagnosisRedirect,
} from "@/lib/seo/legacyRouteMatrix";
import { postCrawlerVisitFromEdge } from "@/lib/catalog/crawlerAnalyticsEdge";
import {
  isRubelConvergeRedirectEnabled,
  resolveRubelPlugRedirectPath,
} from "@/lib/rubel/rubelPlugConvergence";


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

  const queryLang = request.nextUrl.searchParams.get("lang");
  const pathLocale = resolveDiscoverPathLocale(request.nextUrl.pathname);
  const resolvedLocale = resolveAppLocaleFromRequest({
    cookieLocale: request.cookies.get(LOCALE_STORAGE_KEY)?.value,
    queryLang,
    pathLocale,
    acceptLanguage: request.headers.get("accept-language"),
  });

  requestHeaders.set("x-lc-locale", resolvedLocale);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (queryLang || pathLocale) {
    response.cookies.set(LOCALE_STORAGE_KEY, resolvedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
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


