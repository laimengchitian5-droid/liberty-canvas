/**
 * Multi-site host registry — O(1) hostname → site kind.
 * Path-based `/discover/*` on MAIN remains the production Discover surface today;
 * DISCOVER/DASHBOARD hosts are ready for apex subdomain cutover.
 */

export const SITE_KIND = {
  MAIN: "main",
  DISCOVER: "discover",
  DASHBOARD: "dashboard",
} as const;

export type SiteKind = (typeof SITE_KIND)[keyof typeof SITE_KIND];

/** Canonical production hostnames (no port, lowercase). */
export const APP_DOMAINS = {
  MAIN: "liberty-canvas.vercel.app",
  MAIN_APEX: "liberty-canvas.app",
  MAIN_WWW: "www.liberty-canvas.app",
  DISCOVER: "discover.liberty-canvas.app",
  DASHBOARD: "dashboard.liberty-canvas.app",
} as const;

export type AppDomainHost = (typeof APP_DOMAINS)[keyof typeof APP_DOMAINS];

const SHARED_COOKIE_PARENT = ".liberty-canvas.app";

/** Exact-host lookup — never use hostname.includes("discover"). */
const HOST_TO_SITE: ReadonlyMap<string, SiteKind> = new Map([
  [APP_DOMAINS.MAIN, SITE_KIND.MAIN],
  [APP_DOMAINS.MAIN_APEX, SITE_KIND.MAIN],
  [APP_DOMAINS.MAIN_WWW, SITE_KIND.MAIN],
  [APP_DOMAINS.DISCOVER, SITE_KIND.DISCOVER],
  [APP_DOMAINS.DASHBOARD, SITE_KIND.DASHBOARD],
]);

/** Strip port + lowercase for Map lookup. */
export function normalizeHostname(hostname: string): string {
  const trimmed = hostname.trim().toLowerCase();
  if (!trimmed) {
    return "";
  }

  // IPv6 literals: [::1]:3000
  if (trimmed.startsWith("[")) {
    const end = trimmed.indexOf("]");
    return end >= 0 ? trimmed.slice(0, end + 1) : trimmed;
  }

  const colon = trimmed.indexOf(":");
  return colon >= 0 ? trimmed.slice(0, colon) : trimmed;
}

export function detectSiteKind(hostname: string): SiteKind {
  const host = normalizeHostname(hostname);

  const exact = HOST_TO_SITE.get(host);
  if (exact) {
    return exact;
  }

  // Local / preview: treat as MAIN (path-based discover still works).
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app") ||
    host.endsWith(".local")
  ) {
    return SITE_KIND.MAIN;
  }

  // Env overrides for staging cutovers (comma-separated host lists).
  if (hostMatchesEnvList(host, process.env.LC_DISCOVER_HOSTS)) {
    return SITE_KIND.DISCOVER;
  }
  if (hostMatchesEnvList(host, process.env.LC_DASHBOARD_HOSTS)) {
    return SITE_KIND.DASHBOARD;
  }

  return SITE_KIND.MAIN;
}

function hostMatchesEnvList(host: string, raw: string | undefined): boolean {
  if (!raw) {
    return false;
  }
  const parts = raw.split(",");
  for (let i = 0; i < parts.length; i += 1) {
    if (normalizeHostname(parts[i]!) === host) {
      return true;
    }
  }
  return false;
}

/**
 * Cookie Domain attribute only when the request is on the shared apex tree.
 * Browsers reject Domain=.liberty-canvas.app from *.vercel.app origins.
 */
export function resolveCookieDomain(hostname: string): string | undefined {
  const host = normalizeHostname(hostname);
  if (host === "liberty-canvas.app" || host.endsWith(".liberty-canvas.app")) {
    return SHARED_COOKIE_PARENT;
  }
  return undefined;
}

export function canonicalHostForSite(site: SiteKind): AppDomainHost {
  switch (site) {
    case SITE_KIND.DISCOVER:
      return APP_DOMAINS.DISCOVER;
    case SITE_KIND.DASHBOARD:
      return APP_DOMAINS.DASHBOARD;
    case SITE_KIND.MAIN:
    default:
      return APP_DOMAINS.MAIN;
  }
}
