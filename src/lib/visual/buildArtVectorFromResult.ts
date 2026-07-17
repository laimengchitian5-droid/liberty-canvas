import type { PsychQuizResult } from "@/lib/psychology/types";
import type { OceanDimension } from "@/lib/psychology/types";
import { toCognitiveArtVector } from "@/lib/visual/cognitiveArt";
import type { TraitVector } from "@/types/rubel";

const OCEAN_ORDER: OceanDimension[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "neuroticism",
];

/** Map Psych quiz result → 8-axis cognitive art vector. */
export function buildPsychArtVector(result: PsychQuizResult): number[] {
  if (result.oceanScores) {
    return toCognitiveArtVector(
      OCEAN_ORDER.map((dimension) => (result.oceanScores![dimension] >= 1 ? 6 : 3)),
      result.typeName,
    );
  }

  if (result.enneagramTypeNumber) {
    return toCognitiveArtVector(
      Array.from(
        { length: 8 },
        (_, index) => ((result.enneagramTypeNumber! + index) % 7) + 1,
      ),
      result.typeName,
    );
  }

  return toCognitiveArtVector([], result.typeName);
}

/** Map Play trait profile → 8-axis cognitive art vector. */
export function buildPlayArtVector(
  traitProfile: TraitVector | null | undefined,
  typeName: string,
): number[] {
  if (!traitProfile) {
    return toCognitiveArtVector([], typeName);
  }

  return toCognitiveArtVector(
    [
      traitProfile.openness * 6 + 1,
      traitProfile.empathy_need * 6 + 1,
      traitProfile.ego * 6 + 1,
      (traitProfile.openness + traitProfile.empathy_need) * 3 + 1,
      (traitProfile.empathy_need + traitProfile.ego) * 3 + 1,
      (traitProfile.openness + traitProfile.ego) * 3 + 1,
      traitProfile.openness * 5 + 2,
      traitProfile.empathy_need * 5 + 2,
    ],
    typeName,
  );
}
