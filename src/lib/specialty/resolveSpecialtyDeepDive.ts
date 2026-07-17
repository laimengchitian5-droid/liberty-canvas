import {
  buildCountryPlayPath,
  getSpecialtyCountryByBArchetypeId,
  WORLD_SPECIALTY_SOUL_SLUG,
} from "@/lib/specialty/globalSpecialtyTaxonomy";
import { buildSpecialtyDeepDiveHref } from "@/lib/specialty/specialtyBridge";
import type { SpecialtyCountryId } from "@/lib/specialty/types";
import { isSpecialtyDeepDiveLive } from "@/lib/specialty/types";

export interface SpecialtyDeepDiveOffer {
  readonly countryId: SpecialtyCountryId;
  readonly flagEmoji: string;
  readonly title: string;
  readonly path: string;
  readonly isLive: boolean;
}
export function resolveSpecialtyDeepDiveOffer(
  diagnosisSlug: string,
  archetypeId: string,
): SpecialtyDeepDiveOffer | null {
  if (diagnosisSlug !== WORLD_SPECIALTY_SOUL_SLUG) {
    return null;
  }

  const country = getSpecialtyCountryByBArchetypeId(archetypeId);

  if (!country) {
    return null;
  }

  return {
    countryId: country.id,
    flagEmoji: country.flagEmoji,
    title: country.cTitleJa,
    path: buildCountryPlayPath(country.cSlug),
    isLive: isSpecialtyDeepDiveLive(country.releasePhase),
  };
}

export { buildSpecialtyDeepDiveHref };
