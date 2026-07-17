import { FIVE_FACTOR_LABELS } from "@/lib/diagnosis/fiveFactorDisplay";
import type { CosmicCharacterSheet } from "@/lib/diagnosis/cosmicPlanetEngine";
import { DIAGNOSIS_ADVICE_BLUEPRINT } from "@/lib/diagnosis/buildAdvicePrompt";
import type { PlugDiagnosisAdviceRequestBody } from "@/types/diagnosisCompiler";
import type { LegallySafeDiagnosisOutcome } from "@/types/diagnosisCompiler";

export { DIAGNOSIS_ADVICE_BLUEPRINT };

export function buildPlugAdviceRequestBody(params: {
  slug: string;
  diagnosisTitle: string;
  outcome: LegallySafeDiagnosisOutcome;
  cosmicSheet: CosmicCharacterSheet;
}): PlugDiagnosisAdviceRequestBody {
  const factorSummary = Object.fromEntries(
    params.cosmicSheet.energyLevels.map((level) => [
      FIVE_FACTOR_LABELS[level.key],
      level.percentile,
    ]),
  );

  return {
    mode: "plug",
    slug: params.slug,
    diagnosisTitle: params.diagnosisTitle,
    archetypeTitle: params.outcome.winningArchetype.title,
    archetypeAnalysis: params.outcome.winningArchetype.analysis,
    planetNickname: params.cosmicSheet.planet.nickname,
    planetCoreStatus: params.cosmicSheet.planet.coreStatus,
    cosmicStrengths: params.cosmicSheet.narrative.strengths,
    factorSummary,
  };
}

export function buildPlugAdviceUserPrompt(body: PlugDiagnosisAdviceRequestBody): string {
  return [
    `Diagnosis: ${body.diagnosisTitle} (${body.slug})`,
    `Archetype: ${body.archetypeTitle}`,
    `Analysis: ${body.archetypeAnalysis}`,
    `Cosmic planet: ${body.planetNickname}`,
    `Planet status: ${body.planetCoreStatus}`,
    `Cosmic strengths: ${body.cosmicStrengths}`,
    `Five-factor percentiles: ${JSON.stringify(body.factorSummary)}`,
    "Generate deeply personalized advice for this cosmic personality result.",
    "Reference the planet metaphor gently; stay warm and non-clinical.",
  ].join("\n");
}
