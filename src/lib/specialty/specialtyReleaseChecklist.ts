import { getPlugDiagnosisBySlug } from "@/config/diagnoses";
import {
  buildCountrySpecialtyDefinition,
  isCountrySpecialtyReady,
} from "@/lib/specialty/buildSpecialtyDiagnosis";
import {
  getSpecialtyCountry,
  WORLD_SPECIALTY_PLAY_PATH,
} from "@/lib/specialty/globalSpecialtyTaxonomy";
import { isSpecialtyNativeDraftComplete } from "@/lib/specialty/specialtyNativeDraftSlots";
import type { SpecialtyCountryId } from "@/lib/specialty/types";
import { isSpecialtyDeepDiveLive } from "@/lib/specialty/types";
import {
  extractQuestionBlocks,
  extractResultBlock,
} from "@/lib/diagnosis/extractDiagnosisElements";
import { resolveSpecialtyLandingRouteForCountry } from "@/lib/specialty/specialtyReleaseLanding";

export type SpecialtyReleaseCheckId =
  | "taxonomy_c_archetypes"
  | "question_bank"
  | "trait_profiles_buildable"
  | "taboo_copy_review"
  | "release_phase_live"
  | "plug_catalog_registered"
  | "landing_deep_dive_path"
  | "native_draft_complete";

export interface SpecialtyReleaseCheckResult {
  readonly id: SpecialtyReleaseCheckId;
  readonly ok: boolean;
  readonly detailJa: string;
}

export interface SpecialtyReleaseReadiness {
  readonly countryId: SpecialtyCountryId;
  readonly readyForLive: boolean;
  readonly checks: readonly SpecialtyReleaseCheckResult[];
}

const MIN_C_ARCHETYPES = 3;
const MIN_C_QUESTIONS = 12;

const TABOO_PATTERNS = [
  /酒米/,
  /ワイン/,
  /蒸留/,
  /モルト/,
  /樽熟成/,
  /\bsake\b/i,
  /\bwine\b/i,
  /\bwhisky\b/i,
  /\bwhiskey\b/i,
  /\bmalt\b/i,
] as const;

function runTabooScan(countryId: SpecialtyCountryId): SpecialtyReleaseCheckResult {
  const country = getSpecialtyCountry(countryId);
  const corpus = [
    country.specialtyLabelJa,
    country.specialtyLabelEn,
    ...country.history,
    ...country.context,
    ...country.significance,
    ...country.cArchetypes.map((a) => `${a.title} ${a.subtitle}`),
  ].join("\n");

  const hit = TABOO_PATTERNS.find((pattern) => pattern.test(corpus));
  return {
    id: "taboo_copy_review",
    ok: !hit,
    detailJa: hit
      ? `タブー候補ヒット: ${hit.source || String(hit)}`
      : "アルコール宣伝表現なし（簡易スキャン）",
  };
}

/**
 * Executable release runbook: upcoming → live promotion checklist.
 * Fail-closed — any failed check blocks readyForLive.
 */
export function evaluateSpecialtyReleaseReadiness(
  countryId: SpecialtyCountryId,
): SpecialtyReleaseReadiness {
  const country = getSpecialtyCountry(countryId);
  const checks: SpecialtyReleaseCheckResult[] = [];

  checks.push({
    id: "release_phase_live",
    ok: isSpecialtyDeepDiveLive(country.releasePhase),
    detailJa: `releasePhase=${country.releasePhase}`,
  });

  checks.push({
    id: "taxonomy_c_archetypes",
    ok: country.cArchetypes.length >= MIN_C_ARCHETYPES,
    detailJa: `C archetypes=${country.cArchetypes.length} (min ${MIN_C_ARCHETYPES})`,
  });

  let questionCount = 0;
  let buildOk = false;
  try {
    const definition = buildCountrySpecialtyDefinition(countryId);
    questionCount = extractQuestionBlocks(definition).length;
    const results = extractResultBlock(definition)?.results.length ?? 0;
    buildOk = questionCount >= MIN_C_QUESTIONS && results >= MIN_C_ARCHETYPES;
  } catch (error) {
    buildOk = false;
    checks.push({
      id: "trait_profiles_buildable",
      ok: false,
      detailJa: error instanceof Error ? error.message : "build failed",
    });
  }

  if (buildOk) {
    checks.push({
      id: "trait_profiles_buildable",
      ok: true,
      detailJa: "buildCountrySpecialtyDefinition OK",
    });
  }

  checks.push({
    id: "question_bank",
    ok: questionCount >= MIN_C_QUESTIONS,
    detailJa: `questions=${questionCount} (min ${MIN_C_QUESTIONS})`,
  });

  checks.push(runTabooScan(countryId));

  const catalog = getPlugDiagnosisBySlug(country.cSlug);
  checks.push({
    id: "plug_catalog_registered",
    ok: catalog?.slug === country.cSlug && isCountrySpecialtyReady(countryId),
    detailJa: catalog ? `catalog slug=${catalog.slug}` : "not in PLUG catalog",
  });

  const landingPath = resolveSpecialtyLandingRouteForCountry(countryId);
  checks.push({
    id: "landing_deep_dive_path",
    ok:
      isSpecialtyDeepDiveLive(country.releasePhase) &&
      landingPath === `/diagnosis/play/${country.cSlug}` &&
      landingPath !== WORLD_SPECIALTY_PLAY_PATH,
    detailJa: `landing=${landingPath}`,
  });

  checks.push({
    id: "native_draft_complete",
    ok: isSpecialtyNativeDraftComplete(countryId),
    detailJa: isSpecialtyNativeDraftComplete(countryId)
      ? "全 native draft slots ready"
      : "テンプレ／レビュー待ちスロットあり",
  });

  return {
    countryId,
    readyForLive: checks.every((check) => check.ok),
    checks,
  };
}

export function assertLiveCountriesReleaseReady(
  countryIds: readonly SpecialtyCountryId[],
): void {
  for (const countryId of countryIds) {
    const report = evaluateSpecialtyReleaseReadiness(countryId);
    if (!report.readyForLive) {
      const failed = report.checks
        .filter((check) => !check.ok)
        .map((check) => `${check.id}: ${check.detailJa}`)
        .join("; ");
      throw new Error(`Specialty release blocked for ${countryId}: ${failed}`);
    }
  }
}
