import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const INSIGHTS_COOKIE = "lc-insights";

export function getInsightsSecret(): string | null {
  return process.env.LC_INSIGHTS_SECRET?.trim() ?? null;
}

export function isInsightsAccessAllowed(input: {
  cookieValue?: string | null;
  headerKey?: string | null;
}): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const secret = getInsightsSecret();

  if (!secret) {
    return false;
  }

  if (input.headerKey === secret) {
    return true;
  }

  return input.cookieValue === secret;
}

export async function isInsightsAllowedFromCookies(
  cookies: ReadonlyRequestCookies,
): Promise<boolean> {
  return isInsightsAccessAllowed({
    cookieValue: cookies.get(INSIGHTS_COOKIE)?.value ?? null,
  });
}

export function verifyInsightsApiAccess(request: Request): {
  allowed: boolean;
  status: number;
} {
  const allowed = isInsightsAccessAllowed({
    headerKey: request.headers.get("x-lc-insights-key"),
    cookieValue: null,
  });

  return {
    allowed,
    status: allowed ? 200 : 401,
  };
}

export { INSIGHTS_COOKIE };
