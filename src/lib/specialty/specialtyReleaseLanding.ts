import {
  getSpecialtyCountry,
  WORLD_SPECIALTY_PLAY_PATH,
} from "@/lib/specialty/globalSpecialtyTaxonomy";
import type { SpecialtyCountryId } from "@/lib/specialty/types";
import { isSpecialtyDeepDiveLive } from "@/lib/specialty/types";

/** Landing play path for a specialty country (live → C deep dive, else world entry). */
export function resolveSpecialtyLandingRouteForCountry(
  countryId: SpecialtyCountryId,
): string {
  const country = getSpecialtyCountry(countryId);
  if (isSpecialtyDeepDiveLive(country.releasePhase)) {
    return `/diagnosis/play/${country.cSlug}`;
  }
  return WORLD_SPECIALTY_PLAY_PATH;
}
