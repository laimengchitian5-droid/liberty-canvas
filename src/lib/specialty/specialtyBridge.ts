import type { DiagnosisAnalyticsPayload, FunnelStep } from "@/lib/diagnosis/analytics";
import {
  buildCountryPlayPath,
  getSpecialtyCountryByCSlug,
  WORLD_SPECIALTY_SOUL_SLUG,
} from "@/lib/specialty/globalSpecialtyTaxonomy";
import { isSpecialtyPlugSlug } from "@/lib/specialty/specialtyHubCatalog";
import type { SpecialtyCountryId } from "@/lib/specialty/types";

/** Stable ref token for B→C handoff URLs and analytics. */
export const SPECIALTY_BRIDGE_REF = "specialty-bridge" as const;

export type SpecialtyBridgeRef = typeof SPECIALTY_BRIDGE_REF;

export interface SpecialtyDeepPlayStartPayload extends DiagnosisAnalyticsPayload {
  readonly slug: string;
  readonly ref: SpecialtyBridgeRef;
  readonly funnelStep: Extract<FunnelStep, "specialty_bridge">;
  readonly targetCountryId: SpecialtyCountryId | undefined;
  readonly targetPath: string;
}

export function isSpecialtyBridgeRef(
  ref: string | null | undefined,
): ref is SpecialtyBridgeRef {
  return ref === SPECIALTY_BRIDGE_REF;
}

export function shouldTrackSpecialtyBridgeDeepPlay(
  ref: string | null | undefined,
  slug: string,
): boolean {
  return (
    isSpecialtyBridgeRef(ref) &&
    isSpecialtyPlugSlug(slug) &&
    slug !== WORLD_SPECIALTY_SOUL_SLUG
  );
}

export function buildSpecialtyDeepPlayStartPayload(
  slug: string,
): SpecialtyDeepPlayStartPayload {
  const country = getSpecialtyCountryByCSlug(slug);

  return {
    slug,
    ref: SPECIALTY_BRIDGE_REF,
    funnelStep: "specialty_bridge",
    targetCountryId: country?.id,
    targetPath: buildCountryPlayPath(slug),
  };
}

export function buildSpecialtyDeepDiveHref(path: string): string {
  return `${path}?ref=${SPECIALTY_BRIDGE_REF}`;
}
