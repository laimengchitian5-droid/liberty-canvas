import type { NavMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/config";

export interface GlobalNavItem {
  readonly href: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly ariaLabel: string;
  readonly isActive: (pathname: string) => boolean;
}

export interface GlobalNavPathContext {
  readonly canvasHub: string;
  readonly discoverHub: string;
  readonly plugEngine: string;
  readonly playHub: string;
  readonly stationHub: string;
  readonly stationDashboard: string;
  readonly plugCatalog: string;
  readonly forgeHub: string;
}

/**
 * Pure nav matrix — O(1) allocation of a fixed route table.
 *
 * Sketch route rewrites (do not reintroduce dead paths):
 * - `/home` → canvas hub `/`
 * - `/ai-diagnostic` → plug engine
 * - `/my-achievements` → station dashboard
 * - `/play-room` → play hub
 * - `/station/ja` → `/station/{locale}`
 */
export function buildGlobalNavItems(
  nav: NavMessages,
  paths: GlobalNavPathContext,
): readonly GlobalNavItem[] {
  const {
    canvasHub,
    discoverHub,
    plugEngine,
    playHub,
    stationHub,
    stationDashboard,
    plugCatalog,
    forgeHub,
  } = paths;

  return [
    {
      href: canvasHub,
      label: nav.hub,
      shortLabel: nav.hubShort,
      ariaLabel: nav.hub,
      isActive: (path) => path === "/" || path === canvasHub,
    },
    {
      href: discoverHub,
      label: nav.discover,
      shortLabel: nav.discoverShort,
      ariaLabel: nav.discover,
      isActive: (path) => path === "/discover" || path.startsWith("/discover/"),
    },
    {
      href: plugEngine,
      label: nav.assessment,
      shortLabel: nav.assessmentShort,
      ariaLabel: nav.assessment,
      isActive: (path) =>
        path === plugEngine || path.startsWith(`${plugEngine}/`),
    },
    {
      href: playHub,
      label: nav.play,
      shortLabel: nav.playShort,
      ariaLabel: nav.play,
      isActive: (path) => path === "/play" || path.startsWith("/play/"),
    },
    {
      href: stationHub,
      label: nav.station,
      shortLabel: nav.stationShort,
      ariaLabel: nav.station,
      isActive: (path) =>
        path === stationHub ||
        (path.startsWith(`${stationHub}/`) &&
          !path.startsWith(stationDashboard)),
    },
    {
      href: stationDashboard,
      label: nav.dashboard,
      shortLabel: nav.dashboardShort,
      ariaLabel: nav.dashboard,
      isActive: (path) =>
        path === stationDashboard || path.startsWith(`${stationDashboard}/`),
    },
    {
      href: plugCatalog,
      label: nav.diagnosis,
      shortLabel: nav.diagnosisShort,
      ariaLabel: nav.diagnosis,
      isActive: (path) =>
        path === plugCatalog || path.startsWith(`${plugCatalog}/`),
    },
    {
      href: forgeHub,
      label: nav.create,
      shortLabel: nav.createShort,
      ariaLabel: nav.create,
      isActive: (path) => path.startsWith("/create"),
    },
  ];
}

export function buildDiscoverHubPath(locale: Locale): string {
  return `/discover/${locale}`;
}
