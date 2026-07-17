import { LC_DESIGN_TOKENS } from "@/lib/design/tokens";

/** 1–7 intensity per axis — abstract profile shape (not Likert/MBTI labels). */
export type CognitiveArtVector = readonly number[];

export interface CognitiveArtPalette {
  readonly background: string;
  readonly ink: string;
  readonly rose: string;
  readonly sage: string;
  readonly gold: string;
}

export const ADULT_CUTE_ART_PALETTE: CognitiveArtPalette = {
  background: LC_DESIGN_TOKENS.color.cream,
  ink: LC_DESIGN_TOKENS.color.ink,
  rose: LC_DESIGN_TOKENS.color.dustyRose,
  sage: LC_DESIGN_TOKENS.color.sageSoft,
  gold: LC_DESIGN_TOKENS.color.goldAccent,
};

export function clampArtAxis(value: number): number {
  if (!Number.isFinite(value)) {
    return 4;
  }
  return Math.min(7, Math.max(1, value));
}

/** Normalize any numeric profile into an 8-axis art vector. */
export function toCognitiveArtVector(
  values: readonly number[],
  fallbackSeed = "liberty",
): number[] {
  if (values.length >= 8) {
    return values.slice(0, 8).map(clampArtAxis);
  }

  if (values.length > 0) {
    const out: number[] = [];
    for (let i = 0; i < 8; i += 1) {
      out.push(clampArtAxis(values[i % values.length]!));
    }
    return out;
  }

  let hash = 0;
  for (let i = 0; i < fallbackSeed.length; i += 1) {
    hash = (hash * 31 + fallbackSeed.charCodeAt(i)) >>> 0;
  }

  return Array.from({ length: 8 }, (_, i) => clampArtAxis(((hash >> (i * 3)) % 7) + 1));
}

export function intensityFromVector(vector: readonly number[]): number {
  if (vector.length === 0) {
    return 50;
  }
  const avg = vector.reduce((sum, v) => sum + v, 0) / vector.length;
  return Math.round(((avg - 1) / 6) * 100);
}
