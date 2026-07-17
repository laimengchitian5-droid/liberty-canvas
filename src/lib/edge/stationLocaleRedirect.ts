import { isLocale, type Locale } from "@/lib/i18n/config";

const STATION_PREFIX = "/station";

/**
 * SEO-safe station paths are `/station/[locale]/[id]`.
 * When locale is missing, return the canonical path for a 307 redirect.
 *
 * Stack truth — this is NOT `/{locale}/station/...` and never touches `/diagnosis`.
 */
export function resolveStationLocaleRedirect(
  pathname: string,
  locale: Locale,
): string | null {
  if (pathname !== STATION_PREFIX && !pathname.startsWith(`${STATION_PREFIX}/`)) {
    return null;
  }

  if (pathname === STATION_PREFIX) {
    return `${STATION_PREFIX}/${locale}`;
  }

  // "/station/" → treat as hub
  const rest = pathname.slice(STATION_PREFIX.length + 1);
  if (!rest) {
    return `${STATION_PREFIX}/${locale}`;
  }

  const slash = rest.indexOf("/");
  const first = slash === -1 ? rest : rest.slice(0, slash);
  const after = slash === -1 ? "" : rest.slice(slash + 1);

  // Already canonical: /station/{locale} or /station/{locale}/...
  if (isLocale(first)) {
    return null;
  }

  // /station/{id} → /station/{locale}/{id}
  return after
    ? `${STATION_PREFIX}/${locale}/${first}/${after}`
    : `${STATION_PREFIX}/${locale}/${first}`;
}
