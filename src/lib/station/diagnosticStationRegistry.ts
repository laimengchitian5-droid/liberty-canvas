import { isLocale, type Locale } from "@/lib/i18n/config";
import type {
  DiagnosticPlatform,
  DiagnosticRouteManifest,
} from "@/types/diagnosticStation";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";
import { sanitizePlayPath } from "@/lib/visual/sanitizePlayPath";

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
  const libertyRaw = manifest.libertyPath?.trim();
  const libertyPath = libertyRaw
    ? (sanitizePlayPath(libertyRaw) ?? undefined)
    : undefined;

  if (manifest.stationTheme.lineNameKey !== manifest.id) {
    throw new Error(
      `[station] lineNameKey must equal id (${manifest.id}), got ${manifest.stationTheme.lineNameKey}`,
    );
  }

  return {
    ...manifest,
    officialUrl: assertHttpsUrl(manifest.officialUrl),
    stationTheme: {
      ...manifest.stationTheme,
      gateColor: assertGateColor(manifest.stationTheme.gateColor),
    },
    supportedLocales: manifest.supportedLocales.filter(isLocale),
    ...(libertyPath ? { libertyPath } : {}),
  };
}

/**
 * Immutable 15-route registry — O(1) Map lookup after load.
 *
 * Rejected sketch defects:
 * - lineNameKey aliases ("mbti", "bigFive") → must equal platform id
 * - invented `/play/*-mock` attractions → omit until routes exist
 * - `libertyPath: null` → omit optional field
 * - es/pt locales → filtered by isLocale
 */
const ROUTE_LIST: readonly DiagnosticRouteManifest[] = [
  route({
    id: "16personalities",
    officialUrl: "https://www.16personalities.com",
    supportedLocales: ["en", "ja", "ko", "zh", "fr", "de"],
    stationTheme: { gateColor: "#4299E1", lineNameKey: "16personalities" },
    libertyPath: "/diagnosis/play/personality-spectrum",
  }),
  route({
    id: "strengths-finder",
    officialUrl: "https://www.gallup.com/cliftonstrengths",
    supportedLocales: ["en", "ja", "de", "fr", "ko", "zh"],
    stationTheme: { gateColor: "#38A169", lineNameKey: "strengths-finder" },
  }),
  route({
    id: "enneagram",
    officialUrl: "https://www.enneagraminstitute.com",
    supportedLocales: ["en", "ja", "ko"],
    stationTheme: { gateColor: "#ED8936", lineNameKey: "enneagram" },
    libertyPath: "/diagnosis/play/motivation-spectrum",
  }),
  route({
    id: "big-five",
    officialUrl: "https://bigfive-test.com",
    supportedLocales: ["en", "ja", "zh", "fr"],
    stationTheme: { gateColor: "#5C6BC0", lineNameKey: "big-five" },
    libertyPath: "/diagnosis/play/big-five",
  }),
  route({
    id: "disc",
    officialUrl: "https://www.discprofile.com",
    supportedLocales: ["en", "ja", "de", "fr"],
    stationTheme: { gateColor: "#B85D53", lineNameKey: "disc" },
  }),
  route({
    id: "via-strengths",
    officialUrl: "https://www.viacharacter.org",
    supportedLocales: ["en", "ja", "de", "fr"],
    stationTheme: { gateColor: "#7EA182", lineNameKey: "via-strengths" },
  }),
  route({
    id: "16pf",
    officialUrl: "https://www.16pf.com",
    supportedLocales: ["en", "ja", "de", "fr"],
    stationTheme: { gateColor: "#8C564B", lineNameKey: "16pf" },
  }),
  route({
    id: "animal-psychology",
    officialUrl: "https://doubutsu-uranai.com",
    supportedLocales: ["ja", "en", "zh"],
    stationTheme: { gateColor: "#D4A373", lineNameKey: "animal-psychology" },
  }),
  route({
    id: "riasec",
    officialUrl: "https://www.onetcenter.org",
    supportedLocales: ["en", "ja"],
    stationTheme: { gateColor: "#6B9080", lineNameKey: "riasec" },
  }),
  route({
    id: "love-languages",
    officialUrl: "https://5lovelanguages.com",
    supportedLocales: ["en", "ja", "fr", "zh"],
    stationTheme: { gateColor: "#CD8D7B", lineNameKey: "love-languages" },
  }),
  route({
    id: "egogram",
    officialUrl: "https://www.egogramtest.ch",
    supportedLocales: ["en", "ja", "de", "fr"],
    stationTheme: { gateColor: "#64748B", lineNameKey: "egogram" },
  }),
  route({
    id: "tritype",
    officialUrl: "https://www.tritypes.com",
    supportedLocales: ["en", "ja"],
    stationTheme: { gateColor: "#C2B2A2", lineNameKey: "tritype" },
  }),
  route({
    id: "love-type-16",
    officialUrl: "https://lovecharacter64.jp",
    supportedLocales: ["ja", "en", "ko"],
    stationTheme: { gateColor: "#A393EB", lineNameKey: "love-type-16" },
  }),
  route({
    id: "blood-type",
    officialUrl: "https://bloodtype-quiz.com",
    supportedLocales: ["ja", "en", "ko", "zh"],
    stationTheme: { gateColor: "#D39E82", lineNameKey: "blood-type" },
  }),
  route({
    id: "zodiac-astrology",
    officialUrl: "https://www.astro.com",
    supportedLocales: ["en", "ja", "de", "fr"],
    stationTheme: { gateColor: "#BFA38A", lineNameKey: "zodiac-astrology" },
  }),
];

if (ROUTE_LIST.length !== DIAGNOSTIC_PLATFORM_IDS.length) {
  throw new Error(
    `[station] ROUTE_LIST (${ROUTE_LIST.length}) ≠ DIAGNOSTIC_PLATFORM_IDS (${DIAGNOSTIC_PLATFORM_IDS.length})`,
  );
}

export const DIAGNOSTIC_STATION_REGISTRY: ReadonlyMap<
  DiagnosticPlatform,
  DiagnosticRouteManifest
> = new Map(ROUTE_LIST.map((entry) => [entry.id, entry]));

/** Sketch-compatible alias. */
export const diagnosticStationRegistry = DIAGNOSTIC_STATION_REGISTRY;

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

type LineNameTable = Readonly<
  Partial<Record<Locale, string>> & { readonly en: string }
>;

/** Locale-native line names (Adult-Cute, entertainment framing). */
const LINE_NAMES: Readonly<Record<DiagnosticPlatform, LineNameTable>> = {
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
  disc: {
    en: "DiSC Behavior Pattern Rapid",
    ja: "DiSC 行動パターン快速",
    ko: "DiSC 행동 패턴 급행",
    zh: "DiSC 行为模式快线",
    fr: "DiSC Comportement Rapide",
    de: "DiSC Verhaltensmuster-Schnellzug",
  },
  "via-strengths": {
    en: "VIA Character Strengths Line",
    ja: "VIA 強みの品格線",
    fr: "VIA Forces de caractère",
    de: "VIA Charakterstärken-Linie",
  },
  "16pf": {
    en: "16PF Questionnaire Line",
    ja: "16PF パーソナリティ線",
    fr: "Ligne 16PF",
    de: "16PF-Fragebogenlinie",
  },
  "animal-psychology": {
    en: "Animal Psychology Express",
    ja: "動物占い特急",
    zh: "动物占卜特快",
  },
  riasec: {
    en: "Holland RIASEC Career Line",
    ja: "ホランド RIASEC 適職線",
  },
  "love-languages": {
    en: "Five Love Languages Line",
    ja: "5つの愛の言語線",
    fr: "Cinq langages de l’amour",
    zh: "五种爱之语线",
  },
  egogram: {
    en: "Egogram Transaction Line",
    ja: "エゴグラム交流分析線",
    fr: "Ligne Égogramme",
    de: "Egogramm-Linie",
  },
  tritype: {
    en: "Enneagram Tritype Branch",
    ja: "トライタイプ支線",
  },
  "love-type-16": {
    en: "Love Type / Love Character 64",
    ja: "ラブタイプ / ラブキャラ64",
    ko: "러브타입 / 러브캐릭터64",
  },
  "blood-type": {
    en: "Blood Type Persona Local",
    ja: "血液型ペルソナ各停",
    ko: "혈액형 페르소나",
    zh: "血型人格线",
  },
  "zodiac-astrology": {
    en: "Astro Birth Chart Express",
    ja: "天体バースチャート特急",
    fr: "Thème natal Express",
    de: "Geburtshoroskop-Express",
  },
};

export function resolveLineName(
  platformId: DiagnosticPlatform,
  locale: Locale,
): string {
  const table = LINE_NAMES[platformId];
  return table[locale] ?? table.en;
}
