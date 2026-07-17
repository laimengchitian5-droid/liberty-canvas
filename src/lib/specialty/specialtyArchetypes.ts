import {
  buildCountryPlayPath,
  GLOBAL_SPECIALTY_TAXONOMY,
} from "@/lib/specialty/globalSpecialtyTaxonomy";
import type {
  ResolvedSpecialtyArchetype,
  SpecialtyBArchetypeSeed,
  SpecialtyCArchetypeSeed,
  SpecialtyCountryRecord,
} from "@/lib/specialty/types";
import { isSpecialtyDeepDiveLive } from "@/lib/specialty/types";

function buildDeepDiveCompatibilityHint(country: SpecialtyCountryRecord): string {
  const deepDivePath = buildCountryPlayPath(country.cSlug);

  if (isSpecialtyDeepDiveLive(country.releasePhase)) {
    return `${country.flagEmoji} 深掘り診断「${country.cTitleJa}」で、あなたの職人品質をさらに細分化できます。`;
  }

  return `${country.flagEmoji} 深掘り診断「${country.cTitleJa}」は近日公開予定です（${deepDivePath}）。`;
}

function toResultArchetype(
  country: SpecialtyCountryRecord,
  seed: SpecialtyBArchetypeSeed,
): ResolvedSpecialtyArchetype {
  return {
    id: seed.id,
    title: seed.title,
    subtitle: seed.subtitle,
    analysis: seed.analysis,
    themeColor: seed.themeColor,
    traitProfile: seed.traitProfile,
    affirmationLine: seed.affirmationLine,
    compatibilityHint: buildDeepDiveCompatibilityHint(country),
    countryId: country.id,
    deepDivePath: buildCountryPlayPath(country.cSlug),
    deepDiveLive: isSpecialtyDeepDiveLive(country.releasePhase),
  };
}

export function buildWorldSpecialtyBArchetypes(
  taxonomy: readonly SpecialtyCountryRecord[] = GLOBAL_SPECIALTY_TAXONOMY,
): readonly ResolvedSpecialtyArchetype[] {
  return taxonomy.map((country) => toResultArchetype(country, country.bArchetype));
}

export function buildCountrySpecialtyCArchetypes(
  country: SpecialtyCountryRecord,
): readonly ResolvedSpecialtyArchetype[] {
  return country.cArchetypes.map((seed: SpecialtyCArchetypeSeed) => ({
    id: seed.id,
    title: seed.title,
    subtitle: seed.subtitle,
    analysis: seed.analysis,
    themeColor: seed.themeColor,
    traitProfile: seed.traitProfile,
    affirmationLine: seed.affirmationLine,
    countryId: country.id,
    deepDivePath: buildCountryPlayPath(country.cSlug),
    deepDiveLive: isSpecialtyDeepDiveLive(country.releasePhase),
  }));
}
