import {
  createEmptyAcademicVector,
  freezeAcademicVector,
  resolveDominantTraits,
} from "@/lib/diagnosis/academicTraitVector";
import {
  buildFiveFactorRadar,
  type FiveFactorRadarPoint,
} from "@/lib/diagnosis/fiveFactorDisplay";
import {
  buildCosmicCharacterSheet,
  isCosmicPlanetKind,
  type CosmicCharacterSheet,
  type CosmicPlanetKind,
} from "@/lib/diagnosis/cosmicPlanetEngine";
import {
  extractResultBlock,
  extractSeoBlock,
  extractViralPresets,
} from "@/lib/diagnosis/extractDiagnosisElements";
import { getSiteUrl } from "@/lib/site/url";
import type {
  LegallySafeDiagnosisOutcome,
  PlugDiagnosisDefinition,
  ResultArchetype,
} from "@/types/diagnosisCompiler";

export const PLUG_RESULT_SNAPSHOT_PREFIX = "lc-plug-result";
const DURABLE_SNAPSHOT_PREFIX = "lc-plug-result-durable";
export const PLUG_RESULT_SNAPSHOT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface PlugResultShareQuery {
  planet: CosmicPlanetKind;
  archetypeId: string;
  factors: readonly [number, number, number, number, number];
}

export interface PlugResultSnapshot {
  slug: string;
  outcome: LegallySafeDiagnosisOutcome;
  cosmicSheet: CosmicCharacterSheet;
  savedAt: number;
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildSnapshotKey(slug: string): string {
  return `${PLUG_RESULT_SNAPSHOT_PREFIX}:${slug}`;
}

export function extractFactorPercentiles(
  outcome: LegallySafeDiagnosisOutcome,
): PlugResultShareQuery["factors"] {
  const radar = buildFiveFactorRadar(outcome.academicVector);

  const lookup = (key: (typeof radar)[number]["key"]) =>
    clampPercent(radar.find((entry) => entry.key === key)?.percentile ?? 0);

  return [
    lookup("extraversion"),
    lookup("openness"),
    lookup("empathy_agreeableness"),
    lookup("conscientiousness"),
    lookup("emotional_stability"),
  ];
}

export function encodePlugResultShareQuery(
  params: PlugResultShareQuery,
): URLSearchParams {
  const search = new URLSearchParams();
  search.set("planet", params.planet);
  search.set("archetype", params.archetypeId);
  search.set("f", params.factors.map((value) => String(clampPercent(value))).join("-"));
  return search;
}

export function decodePlugResultShareQuery(
  searchParams: URLSearchParams,
): PlugResultShareQuery | null {
  const planet = searchParams.get("planet");
  const archetypeId = searchParams.get("archetype");
  const factorsRaw = searchParams.get("f");

  if (!planet || !isCosmicPlanetKind(planet) || !archetypeId || !factorsRaw) {
    return null;
  }

  const parts = factorsRaw.split("-").map((value) => Number(value));

  if (parts.length !== 5 || parts.some((value) => Number.isNaN(value))) {
    return null;
  }

  return {
    planet,
    archetypeId,
    factors: [
      clampPercent(parts[0]!),
      clampPercent(parts[1]!),
      clampPercent(parts[2]!),
      clampPercent(parts[3]!),
      clampPercent(parts[4]!),
    ],
  };
}

function vectorFromFactorPercentiles(
  factors: PlugResultShareQuery["factors"],
): ReturnType<typeof freezeAcademicVector> {
  const raw = createEmptyAcademicVector();
  const empathyAgree = factors[2] / 100;

  raw.trait_extraversion = factors[0] / 100;
  raw.trait_openness = factors[1] / 100;
  raw.trait_agreeableness = empathyAgree;
  raw.trait_empathy = empathyAgree;
  raw.trait_conscientiousness = factors[3] / 100;
  raw.trait_neuroticism = clampPercent(100 - factors[4]) / 100;

  return freezeAcademicVector(raw);
}

function findArchetype(
  definition: PlugDiagnosisDefinition,
  archetypeId: string,
): ResultArchetype | null {
  const resultBlock = extractResultBlock(definition);
  return resultBlock?.results.find((entry) => entry.id === archetypeId) ?? null;
}

export function rebuildOutcomeFromShareQuery(
  definition: PlugDiagnosisDefinition,
  query: PlugResultShareQuery,
): LegallySafeDiagnosisOutcome | null {
  const archetype = findArchetype(definition, query.archetypeId);

  if (!archetype) {
    return null;
  }

  const academicVector = vectorFromFactorPercentiles(query.factors);
  const seoBlock = extractSeoBlock(definition);
  const resultBlock = extractResultBlock(definition);
  const questionCount = definition.elements.filter(
    (element) => element.kind === "QUESTION_BLOCK",
  ).length;

  return {
    diagnosisId: definition.id,
    academicVector,
    traitScores: academicVector,
    winningArchetype: archetype,
    dominantTraits: resolveDominantTraits(academicVector, 2),
    resultLayout: resultBlock?.layout ?? "character_archetype_card",
    viralPresets: extractViralPresets(definition),
    seoTags: seoBlock ? [...seoBlock.desireTags, ...seoBlock.targetDemographics] : [],
    isComplete: true,
    answeredCount: questionCount,
    totalQuestions: questionCount,
  };
}

export function buildPlugResultPagePath(
  slug: string,
  query?: PlugResultShareQuery,
): string {
  const base = `/diagnosis/play/${encodeURIComponent(slug)}/result`;

  if (!query) {
    return base;
  }

  return `${base}?${encodePlugResultShareQuery(query).toString()}`;
}

export function buildPlugResultShareUrl(
  slug: string,
  outcome: LegallySafeDiagnosisOutcome,
  planetKind: CosmicPlanetKind,
): string {
  const query: PlugResultShareQuery = {
    planet: planetKind,
    archetypeId: outcome.winningArchetype.id,
    factors: extractFactorPercentiles(outcome),
  };

  return `${getSiteUrl()}${buildPlugResultPagePath(slug, query)}`;
}

export function buildRadarLevelsFromFactorPercentiles(
  factors: PlugResultShareQuery["factors"],
): readonly FiveFactorRadarPoint[] {
  return buildFiveFactorRadar(vectorFromFactorPercentiles(factors));
}

export function parseFactorPercentiles(
  raw: string | null,
): PlugResultShareQuery["factors"] | null {
  if (!raw) {
    return null;
  }

  const parts = raw.split("-").map((value) => Number(value));

  if (parts.length !== 5 || parts.some((value) => Number.isNaN(value))) {
    return null;
  }

  return [
    clampPercent(parts[0]!),
    clampPercent(parts[1]!),
    clampPercent(parts[2]!),
    clampPercent(parts[3]!),
    clampPercent(parts[4]!),
  ];
}

export function buildCosmicOgImageUrl(params: {
  slug: string;
  planet: CosmicPlanetKind;
  archetypeId?: string;
  factors?: PlugResultShareQuery["factors"];
}): string {
  const search = new URLSearchParams({
    slug: params.slug,
    planet: params.planet,
  });

  if (params.archetypeId) {
    search.set("archetype", params.archetypeId);
  }

  if (params.factors) {
    search.set("f", params.factors.map((value) => String(clampPercent(value))).join("-"));
  }

  return `${getSiteUrl()}/api/og/diagnosis?${search.toString()}`;
}

function buildDurableSnapshotKey(slug: string): string {
  return `${DURABLE_SNAPSHOT_PREFIX}:${slug}`;
}

interface DurablePlugResultSnapshot extends PlugResultSnapshot {
  expiresAt: number;
}

function persistDurablePlugResultSnapshot(snapshot: PlugResultSnapshot): void {
  try {
    const durable: DurablePlugResultSnapshot = {
      ...snapshot,
      expiresAt: Date.now() + PLUG_RESULT_SNAPSHOT_TTL_MS,
    };

    localStorage.setItem(buildDurableSnapshotKey(snapshot.slug), JSON.stringify(durable));
  } catch {
    // quota exceeded — session snapshot still works for same tab
  }
}

function readDurablePlugResultSnapshot(slug: string): PlugResultSnapshot | null {
  try {
    const raw = localStorage.getItem(buildDurableSnapshotKey(slug));

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as DurablePlugResultSnapshot;

    if (
      parsed.slug !== slug ||
      !parsed.outcome?.winningArchetype ||
      parsed.expiresAt <= Date.now()
    ) {
      localStorage.removeItem(buildDurableSnapshotKey(slug));
      return null;
    }

    return {
      slug: parsed.slug,
      outcome: parsed.outcome,
      cosmicSheet: parsed.cosmicSheet,
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
}

export function listOfflineResultSlugs(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const slugs: string[] = [];

  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);

      if (!key?.startsWith(`${DURABLE_SNAPSHOT_PREFIX}:`)) {
        continue;
      }

      const slug = key.slice(`${DURABLE_SNAPSHOT_PREFIX}:`.length);
      const snapshot = readDurablePlugResultSnapshot(slug);

      if (snapshot) {
        slugs.push(slug);
      }
    }
  } catch {
    return slugs;
  }

  return slugs;
}

export function persistPlugResultSnapshot(
  slug: string,
  outcome: LegallySafeDiagnosisOutcome,
  cosmicSheet?: CosmicCharacterSheet,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const sheet = cosmicSheet ?? buildCosmicCharacterSheet(outcome.academicVector);
  const snapshot: PlugResultSnapshot = {
    slug,
    outcome,
    cosmicSheet: sheet,
    savedAt: Date.now(),
  };

  try {
    sessionStorage.setItem(buildSnapshotKey(slug), JSON.stringify(snapshot));
  } catch {
    // quota exceeded — share URL still works via query params
  }

  persistDurablePlugResultSnapshot(snapshot);
}

export function readPlugResultSnapshot(slug: string): PlugResultSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(buildSnapshotKey(slug));

    if (raw) {
      const parsed = JSON.parse(raw) as PlugResultSnapshot;

      if (parsed.slug === slug && parsed.outcome?.winningArchetype) {
        return parsed;
      }
    }
  } catch {
    // fall through to durable snapshot
  }

  return readDurablePlugResultSnapshot(slug);
}

export function clearPlugResultSnapshot(slug: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(buildSnapshotKey(slug));
  } catch {
    // ignore
  }
}
