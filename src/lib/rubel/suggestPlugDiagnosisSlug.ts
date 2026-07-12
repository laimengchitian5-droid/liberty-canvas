import type { TraitVector } from "@/types/rubel";
import { encodeRubelBridgeFactorParam } from "@/lib/rubel/rubelBridgeHandoff";

const PLUG_SLUGS = [
  "personality-spectrum",
  "big-five",
  "motivation-spectrum",
  "oshikatsu",
  "romance",
  "genz",
] as const;

export type SuggestedPlugSlug = (typeof PLUG_SLUGS)[number];

export interface PlugPlayHrefOptions {
  ref?: string;
  profile?: TraitVector;
}

function normalizeRubelTrait(value: number): number {
  return Math.max(0, Math.min(1, (value + 5) / 10));
}

/** Maps a Rubel 1-Q trait profile to the best-fit official Plug diagnosis slug. */
export function suggestPlugDiagnosisSlug(profile: TraitVector): SuggestedPlugSlug {
  const openness = normalizeRubelTrait(profile.openness);
  const empathy = normalizeRubelTrait(profile.empathy_need);
  const ego = normalizeRubelTrait(profile.ego);

  if (empathy >= 0.72 && openness >= 0.55) {
    return "romance";
  }

  if (ego >= 0.68 && openness >= 0.6) {
    return "genz";
  }

  if (empathy >= 0.65) {
    return "oshikatsu";
  }

  if (openness >= 0.62 && empathy < 0.45) {
    return "big-five";
  }

  if (ego >= 0.55 && empathy < 0.5) {
    return "motivation-spectrum";
  }

  return "personality-spectrum";
}

export function buildPlugPlayHref(
  slug: SuggestedPlugSlug,
  refOrOptions: string | PlugPlayHrefOptions = "rubel-bridge",
): string {
  const options: PlugPlayHrefOptions =
    typeof refOrOptions === "string" ? { ref: refOrOptions } : refOrOptions;
  const ref = options.ref ?? "rubel-bridge";
  const params = new URLSearchParams();
  params.set("ref", ref);

  if (options.profile) {
    params.set("f", encodeRubelBridgeFactorParam(options.profile));
  }

  return `/diagnosis/play/${slug}?${params.toString()}`;
}
