import {
  expandQueryTokens,
  normalizeSearchToken,
  tokenMatchesCandidate,
} from "@/lib/rubel/i18n/constants";
import type { UnifiedDiscoveryEntry } from "@/lib/catalog/unifiedDiscoveryTypes";

export interface UnifiedSearchHit {
  entry: UnifiedDiscoveryEntry;
  score: number;
  matchedTokens: string[];
}

function scoreEntry(
  entry: UnifiedDiscoveryEntry,
  queryTokens: Set<string>,
): { score: number; matchedTokens: string[] } {
  const candidates = [entry.title, entry.subtitle, entry.eyebrow, entry.slug];
  const matchedTokens = new Set<string>();
  let score = 0;

  for (const candidate of candidates) {
    if (tokenMatchesCandidate(queryTokens, candidate)) {
      matchedTokens.add(normalizeSearchToken(candidate));
      score += candidate === entry.title ? 3 : 1;
    }
  }

  for (const token of queryTokens) {
    if (normalizeSearchToken(entry.title).includes(token)) {
      matchedTokens.add(token);
      score += 2;
    }
  }

  return { score, matchedTokens: Array.from(matchedTokens) };
}

export function searchUnifiedCatalog(
  entries: readonly UnifiedDiscoveryEntry[],
  query: string,
): UnifiedSearchHit[] {
  const trimmed = query.trim();

  if (!trimmed) {
    return entries.map((entry) => ({
      entry,
      score: 0,
      matchedTokens: [],
    }));
  }

  const queryTokens = expandQueryTokens(trimmed);

  return entries
    .map((entry) => {
      const { score, matchedTokens } = scoreEntry(entry, queryTokens);
      return { entry, score, matchedTokens };
    })
    .filter((hit) => hit.score > 0)
    .sort((left, right) => right.score - left.score);
}

export function filterUnifiedCatalogByQuery(
  entries: readonly UnifiedDiscoveryEntry[],
  query: string,
): UnifiedDiscoveryEntry[] {
  const trimmed = query.trim();

  if (!trimmed) {
    return [...entries];
  }

  return searchUnifiedCatalog(entries, trimmed).map((hit) => hit.entry);
}
