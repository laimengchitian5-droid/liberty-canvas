/**
 * Extract a JSON object from raw model text (plain JSON or markdown-fenced).
 * O(n) scan; fail-closed → null on any parse error.
 */
export function extractJsonObject(raw: string): unknown | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    // continue
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim()) as unknown;
    } catch {
      // continue
    }
  }

  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) {
    try {
      return JSON.parse(trimmed.slice(first, last + 1)) as unknown;
    } catch {
      return null;
    }
  }

  return null;
}
