import type { NextRequest, NextResponse } from "next/server";

const SEARCH_BOT_PATTERN =
  /googlebot|bingbot|slurp|duckduckbot|yandexbot|baiduspider|facebookexternalhit|twitterbot/i;

const REF_PARAM = "ref";
const MAX_REF_LENGTH = 96;

export function isSearchCrawler(userAgent: string | null): boolean {
  return SEARCH_BOT_PATTERN.test(userAgent ?? "");
}

export function normalizeRefParam(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim().slice(0, MAX_REF_LENGTH);

  if (!trimmed) {
    return null;
  }

  if (!/^[a-z0-9_-]+$/i.test(trimmed)) {
    return null;
  }

  return trimmed;
}

export function applyEdgeSeoHeaders(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  const userAgent = request.headers.get("user-agent");

  if (isSearchCrawler(userAgent)) {
    response.headers.set("X-LC-Crawler", "1");
  }

  const ref = normalizeRefParam(request.nextUrl.searchParams.get(REF_PARAM));

  if (ref) {
    response.headers.set("x-lc-ref", ref);
  }

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/discover/") || pathname.startsWith("/diagnosis/play/")) {
    response.headers.set(
      "Cache-Control",
      isSearchCrawler(userAgent)
        ? "public, s-maxage=3600, stale-while-revalidate=86400"
        : "private, no-cache",
    );
  }

  if (pathname.startsWith("/diagnosis/insights")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}
