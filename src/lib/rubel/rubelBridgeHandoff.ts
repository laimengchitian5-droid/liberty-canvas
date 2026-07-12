import { buildFiveFactorRadar } from "@/lib/diagnosis/fiveFactorDisplay";
import { mapRubelProfileToAcademicVector } from "@/lib/rubel/mapRubelProfileToAcademic";
import type { SuggestedPlugSlug } from "@/lib/rubel/suggestPlugDiagnosisSlug";
import type { TraitVector } from "@/types/rubel";

const HANDOFF_KEY = "lc-rubel-bridge-handoff";

export interface RubelBridgeHandoff {
  slug: SuggestedPlugSlug;
  rubelDiagnosisId: string;
  factors: string;
  at: string;
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Five-factor blob for `f=` query (matches plugResultShare dash format). */
export function encodeRubelBridgeFactorParam(profile: TraitVector): string {
  const radar = buildFiveFactorRadar(mapRubelProfileToAcademicVector(profile));

  const lookup = (key: (typeof radar)[number]["key"]) =>
    clampPercent(radar.find((entry) => entry.key === key)?.percentile ?? 0);

  return [
    lookup("extraversion"),
    lookup("openness"),
    lookup("empathy_agreeableness"),
    lookup("conscientiousness"),
    lookup("emotional_stability"),
  ].join("-");
}

export function seedRubelBridgeHandoff(input: {
  profile: TraitVector;
  slug: SuggestedPlugSlug;
  rubelDiagnosisId: string;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: RubelBridgeHandoff = {
    slug: input.slug,
    rubelDiagnosisId: input.rubelDiagnosisId,
    factors: encodeRubelBridgeFactorParam(input.profile),
    at: new Date().toISOString(),
  };

  try {
    sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function readRubelBridgeHandoff(): RubelBridgeHandoff | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(HANDOFF_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as RubelBridgeHandoff;

    if (
      typeof parsed.slug !== "string" ||
      typeof parsed.rubelDiagnosisId !== "string" ||
      typeof parsed.factors !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearRubelBridgeHandoff(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(HANDOFF_KEY);
  } catch {
    // ignore
  }
}
