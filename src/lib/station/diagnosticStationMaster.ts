import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import { getSiteUrl } from "@/lib/site/url";
import {
  getDiagnosticRoute,
  listDiagnosticRoutes,
  resolveLineName,
} from "@/lib/station/diagnosticStationRegistry";
import { sanitizePlayPath } from "@/lib/visual/sanitizePlayPath";
import type {
  AvailableRouteView,
  DiagnosticRouteManifest,
  StationSeoPayload,
} from "@/types/diagnosticStation";

export type RouteAvailabilityMode = "native" | "with_english_fallback";

/**
 * Locale-filtered station views.
 *
 * Rejected sketch defects:
 * - `ValidLocale` / `@/src` / `internalPlayPath` → Locale + `libertyPath`
 * - partial view objects → full {@link AvailableRouteView} (lineName, isNativeLocale)
 * - Map.entries order → {@link listDiagnosticRoutes} (ROUTE_LIST order)
 *
 * Complexity: O(n) over fixed registry size (DIAGNOSTIC_PLATFORM_IDS.length = 15).
 */
export function getAvailableRoutes(
  userLocale: string,
  mode: RouteAvailabilityMode = "with_english_fallback",
): AvailableRouteView[] {
  const locale = resolveGameLocale(userLocale);
  const routes = listDiagnosticRoutes();
  const out: AvailableRouteView[] = new Array(routes.length);
  let count = 0;

  for (const route of routes) {
    const isNativeLocale = route.supportedLocales.includes(locale);
    const include =
      mode === "native"
        ? isNativeLocale
        : isNativeLocale || route.supportedLocales.includes("en");

    if (!include) {
      continue;
    }

    const view = buildAvailableRouteView(route.id, locale);
    if (!view) {
      continue;
    }

    out[count] = view;
    count += 1;
  }

  out.length = count;
  return out;
}

/**
 * O(1) single-route view — prefer over scanning {@link getAvailableRoutes}.
 * Returns null when id is unknown (fail-closed).
 */
export function buildAvailableRouteView(
  platformId: string,
  userLocale: string,
): AvailableRouteView | null {
  const route = getDiagnosticRoute(platformId);
  if (!route) {
    return null;
  }

  const locale = resolveGameLocale(userLocale);
  return {
    ...route,
    isNativeLocale: route.supportedLocales.includes(locale),
    lineName: resolveLineName(route.id, locale),
    libertyPath: sanitizeLibertyPath(route.libertyPath),
  };
}

/** Fail-closed: only whitelisted play/app/diagnosis/play paths; else omit. */
function sanitizeLibertyPath(path: string | undefined): string | undefined {
  if (!path) {
    return undefined;
  }
  return sanitizePlayPath(path) ?? undefined;
}

const SEO_COPY: Readonly<
  Record<
    "ja" | "en",
    (lineName: string) => { title: string; description: string }
  >
> = {
  ja: (lineName) => ({
    title: `【${lineName}】世界大手性格診断リンク・活用ハブ駅 | Liberty Canvas`,
    description: `世界の定番診断「${lineName}」へ、あなたの言語設定から安全にアクセスできる Liberty Canvas の乗り換え案内です。公式サイトへの案内と、当サイト内の無料体験導線をまとめています。`,
  }),
  en: (lineName) => ({
    title: `[${lineName}] Global Hub & Official Test Shortcuts | Liberty Canvas`,
    description: `Transfer hub for “${lineName}” — locale-aware links to the official test plus Liberty Canvas first-party experiences. Entertainment self-insight only; not clinical advice.`,
  }),
};

/**
 * pSEO station board metadata — canonical: /station/[locale]/[id].
 * Never throws for unknown ids; returns null (fail-closed).
 */
export function generateStationSEO(
  platformId: string,
  localeInput: string,
): StationSeoPayload | null {
  const route = getDiagnosticRoute(platformId);
  if (!route) {
    return null;
  }

  const locale = resolveGameLocale(localeInput);
  const lineName = resolveLineName(route.id, locale);
  const copyLocale = locale === "ja" ? "ja" : "en";
  const { title, description } = SEO_COPY[copyLocale](lineName);
  const path = `/station/${locale}/${route.id}`;
  const canonical = `${getSiteUrl()}${path}`;

  return {
    title: title.slice(0, 70),
    description: description.slice(0, 160),
    canonical,
    path,
  };
}

/** hreflang map for a station id — O(locales), uses site origin (no broken vercel.app{loc}). */
export function buildStationHreflangLanguages(
  platformId: string,
): Record<string, string> | null {
  if (!getDiagnosticRoute(platformId)) {
    return null;
  }

  const siteUrl = getSiteUrl();
  const languages: Record<string, string> = {};

  for (const locale of SUPPORTED_LOCALES) {
    languages[locale] = `${siteUrl}/station/${locale}/${platformId}`;
  }

  languages["x-default"] = `${siteUrl}/station/en/${platformId}`;
  return languages;
}

/** O(1) registry peek. */
export function getRouteById(
  platformId: string,
): DiagnosticRouteManifest | null {
  return getDiagnosticRoute(platformId);
}

/** Sketch-compatible alias. */
export const getRouteManifest = getRouteById;

/** Sketch-compatible facade. */
export const DiagnosticStationMaster = {
  getAvailableRoutes,
  buildAvailableRouteView,
  generateStationSEO,
  getRouteById,
  getRouteManifest,
  buildStationHreflangLanguages,
} as const;
