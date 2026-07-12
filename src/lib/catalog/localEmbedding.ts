const DEFAULT_DIMENSIONS = 64;

export function cosineSimilarity(left: readonly number[], right: readonly number[]): number {
  const length = Math.min(left.length, right.length);
  let dot = 0;
  let leftMag = 0;
  let rightMag = 0;

  for (let index = 0; index < length; index += 1) {
    const a = left[index] ?? 0;
    const b = right[index] ?? 0;
    dot += a * b;
    leftMag += a * a;
    rightMag += b * b;
  }

  const magnitude = Math.sqrt(leftMag) * Math.sqrt(rightMag);

  if (magnitude === 0) {
    return 0;
  }

  return dot / magnitude;
}

/** Deterministic local embedding for dev / fallback when OpenAI is unavailable. */
export function buildLocalEmbedding(
  text: string,
  dimensions = DEFAULT_DIMENSIONS,
): number[] {
  const vector = Array.from({ length: dimensions }, () => 0);
  const normalized = text.trim().toLowerCase();

  for (let index = 0; index < normalized.length; index += 1) {
    const code = normalized.charCodeAt(index);
    vector[(code + index) % dimensions]! += 1;
  }

  for (const token of normalized.split(/\s+/)) {
    for (let index = 0; index < token.length; index += 1) {
      const code = token.charCodeAt(index);
      vector[(code * 3 + index) % dimensions]! += 0.5;
    }
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => Math.round((value / magnitude) * 1000) / 1000);
}

export function buildCatalogEmbeddingText(input: {
  title: string;
  subtitle: string;
  eyebrow: string;
  slug: string;
  searchTags?: readonly string[];
}): string {
  return [
    input.title,
    input.subtitle,
    input.eyebrow,
    input.slug.replace(/-/g, " "),
    ...(input.searchTags ?? []),
  ]
    .join(" ")
    .trim();
}
