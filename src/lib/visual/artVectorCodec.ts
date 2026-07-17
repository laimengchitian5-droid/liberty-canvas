import { clampArtAxis, toCognitiveArtVector } from "@/lib/visual/cognitiveArt";
import type { LibertyDashboardLocale } from "@/types/libertyDashboard";

/** Serialize an art vector for `?vector=` (comma-separated). */
export function serializeArtVectorParam(vector: readonly number[]): string {
  return toCognitiveArtVector(vector).join(",");
}

/**
 * Parse `?vector=4,5,6,3,5,4,6,5` into a clamped 8-axis vector.
 * Returns null when missing/invalid.
 */
export function parseArtVectorParam(raw: string | null | undefined): number[] | null {
  if (!raw || raw.trim() === "") {
    return null;
  }

  const parts = raw.split(",").map((part) => Number(part.trim()));
  if (parts.length === 0 || parts.some((value) => !Number.isFinite(value))) {
    return null;
  }

  return toCognitiveArtVector(parts.map(clampArtAxis));
}

/** Build share/result path that reopens the dashboard from the vector. */
export function buildLibertyResultPath(input: {
  readonly vector: readonly number[];
  readonly seed?: string;
  readonly locale?: LibertyDashboardLocale;
}): string {
  const params = new URLSearchParams();
  params.set("vector", serializeArtVectorParam(input.vector));
  if (input.seed) {
    params.set("seed", input.seed.slice(0, 80));
  }
  if (input.locale && input.locale !== "ja") {
    params.set("locale", input.locale);
  }
  return `/result?${params.toString()}`;
}
