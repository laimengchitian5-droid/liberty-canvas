import { LEGAL_TRAIT_KEYS } from "@/lib/diagnosis/academicTraitVector";
import type {
  SpecialtyTraitProfileInput,
  ValidatedTraitProfile,
} from "@/lib/specialty/types";

const TRAIT_MIN = 0;
const TRAIT_MAX = 1;

function clampTraitValue(value: number): number {
  if (!Number.isFinite(value)) {
    throw new RangeError(`Trait value must be finite, received ${String(value)}`);
  }

  return Math.min(TRAIT_MAX, Math.max(TRAIT_MIN, value));
}

/** Builds a complete six-axis profile — missing keys are rejected at compile time via input type. */
export function defineTraitProfile(
  input: SpecialtyTraitProfileInput,
  context = "trait profile",
): ValidatedTraitProfile {
  const profile = {} as Record<string, number>;

  for (const key of LEGAL_TRAIT_KEYS) {
    profile[key] = clampTraitValue(input[key]);
  }

  return profile as ValidatedTraitProfile;
}

export function assertDistinctTraitProfiles(
  profiles: readonly ValidatedTraitProfile[],
  context: string,
): void {
  if (profiles.length < 2) {
    return;
  }

  for (let left = 0; left < profiles.length; left += 1) {
    for (let right = left + 1; right < profiles.length; right += 1) {
      const a = profiles[left]!;
      const b = profiles[right]!;
      let identical = true;

      for (const key of LEGAL_TRAIT_KEYS) {
        if (a[key] !== b[key]) {
          identical = false;
          break;
        }
      }

      if (identical) {
        throw new Error(
          `${context}: profiles at index ${left} and ${right} are identical`,
        );
      }
    }
  }
}
