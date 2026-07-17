import { isLocale, type Locale } from "@/lib/i18n/config";
import type {
  DiagnosticPlatform,
  DiagnosticRouteManifest,
} from "@/types/diagnosticStation";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";

const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function assertHttpsUrl(url: string): string {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") {
    throw new Error(`[station] officialUrl must be https: ${url}`);
  }
  return parsed.origin + (parsed.pathname === "/" ? "" : parsed.pathname);
}

function assertGateColor(color: string): string {
  if (!HEX_COLOR_RE.test(color)) {
    throw new Error(`[station] invalid gateColor: ${color}`);
  }
  return color;
}

function route(
  manifest: DiagnosticRouteManifest,
): DiagnosticRouteManifest {
  return {
    ...manifest,
    officialUrl: assertHttpsUrl(manifest.officialUrl),
    stationTheme: {
      ...manifest.stationTheme,
      gateColor: assertGateColor(manifest.stationTheme.gateColor),
    },
    supportedLocales: manifest.supportedLocales.filter(isLocale),
  };
}

/**
 * O(1) registry — frozen at module load.
 * Line colors are distinct for wayfinding (not page chrome defaults).
 */
const ROUTE_LIST: readonly DiagnosticRouteManifest[] = [
  route({
    id: "16personalities",
    officialUrl: "https://www.16personalities.com",
    supportedLocales: ["en", "ja", "ko", "zh", "fr", "de"],
    stationTheme: {
      gateColor: "#4299E1",
      lineNameKey: "16personalities",
    },
    libertyPath: "/diagnosis/play/personality-spectrum",
  }),
  route({
    id: "strengths-finder",
    officialUrl: "https://www.gallup.com/cliftonstrengths",
    supportedLocales: ["en", "ja", "de", "fr"],
    stationTheme: {
      gateColor: "#38A169",
      lineNameKey: "strengths-finder",
    },
  }),
  route({
    id: "enneagram",
    officialUrl: "https://www.enneagraminstitute.com",
    supportedLocales: ["en", "ja", "ko"],
    stationTheme: {
      gateColor: "#ED8936",
      lineNameKey: "enneagram",
    },
    libertyPath: "/diagnosis/play/motivation-spectrum",
  }),
  route({
    id: "big-five",
    officialUrl: "https://bigfive-test.com",
    supportedLocales: ["en", "ja", "zh", "fr"],
    stationTheme: {
      gateColor: "#6366F1",
      lineNameKey: "big-five",
    },
    libertyPath: "/diagnosis/play/big-five",
  }),
];

export const DIAGNOSTIC_STATION_REGISTRY: ReadonlyMap<
  DiagnosticPlatform,
  DiagnosticRouteManifest
> = new Map(ROUTE_LIST.map((entry) => [entry.id, entry]));

export function isDiagnosticPlatform(value: string): value is DiagnosticPlatform {
  return (DIAGNOSTIC_PLATFORM_IDS as readonly string[]).includes(value);
}

export function getDiagnosticRoute(
  platformId: string,
): DiagnosticRouteManifest | null {
  if (!isDiagnosticPlatform(platformId)) {
    return null;
  }
  return DIAGNOSTIC_STATION_REGISTRY.get(platformId) ?? null;
}

export function listDiagnosticRoutes(): readonly DiagnosticRouteManifest[] {
  return ROUTE_LIST;
}

/** Locale-native line names (Adult-Cute, non-clinical). */
const LINE_NAMES: Readonly<
  Record<DiagnosticPlatform, Readonly<Partial<Record<Locale, string>> & { en: string }>>
> = {
  "16personalities": {
    en: "MBTI / 16Personalities Express",
    ja: "MBTI / 16Personalities 特急",
    ko: "MBTI / 16Personalities 특급",
    zh: "MBTI / 16Personalities 特快",
    fr: "MBTI / 16Personalities Express",
    de: "MBTI / 16Personalities Express",
  },
  "strengths-finder": {
    en: "Gallup CliftonStrengths Main Line",
    ja: "Gallup 才能解析本線",
    ko: "Gallup 강점 본선",
    zh: "Gallup 才干本线",
    fr: "Ligne Gallup CliftonStrengths",
    de: "Gallup CliftonStrengths-Stammstrecke",
  },
  enneagram: {
    en: "Enneagram Personality Line",
    ja: "エニアグラム 人格心理線",
    ko: "에니어그램 성격선",
    zh: "九型人格线",
  },
  "big-five": {
    en: "Big Five Science Local",
    ja: "Big Five 科学特性各停",
    ko: "Big Five 과학 각역",
    zh: "大五人格科学线",
    fr: "Big Five Scientifique",
  },
};

export function resolveLineName(
  platformId: DiagnosticPlatform,
  locale: Locale,
): string {
  const table = LINE_NAMES[platformId];
  return table[locale] ?? table.en;
}
