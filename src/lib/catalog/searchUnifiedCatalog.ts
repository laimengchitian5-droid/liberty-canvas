import {
  expandQueryTokens,
  normalizeSearchToken,
  tokenMatchesCandidate,
} from "@/lib/rubel/i18n/constants";
import type { UnifiedDiscoveryEntry } from "@/lib/catalog/unifiedDiscoveryTypes";
import type { SearchIntent } from "@/lib/seo/searchIntent";
import {
  expandSemanticTokens,
  inferQueryIntent,
  intentRankBoost,
} from "@/lib/seo/searchIntent";

export interface UnifiedSearchHit {
  entry: UnifiedDiscoveryEntry;
  score: number;
  matchedTokens: string[];
  queryIntent: SearchIntent;
  entryIntent?: SearchIntent;
}

function scoreEntry(
  entry: UnifiedDiscoveryEntry,
  queryTokens: Set<string>,
  semanticTokens: Set<string>,
  queryIntent: SearchIntent,
): { score: number; matchedTokens: string[] } {
  const candidates = [
    entry.title,
    entry.subtitle,
    entry.eyebrow,
    entry.slug,
    ...(entry.searchTags ?? []),
  ];
  const matchedTokens = new Set<string>();
  let score = 0;

  for (const candidate of candidates) {
    if (
      tokenMatchesCandidate(queryTokens, candidate) ||
      tokenMatchesCandidate(semanticTokens, candidate)
    ) {
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

  for (const token of semanticTokens) {
    if (normalizeSearchToken(`${entry.title} ${entry.subtitle}`).includes(token)) {
      matchedTokens.add(token);
      score += 1;
    }
  }

  score += intentRankBoost(entry.searchIntent, queryIntent, entry.kind);

  return { score, matchedTokens: Array.from(matchedTokens) };
}

export function searchUnifiedCatalog(
  entries: readonly UnifiedDiscoveryEntry[],
  query: string,
): UnifiedSearchHit[] {
  const trimmed = query.trim();
  const queryIntent = inferQueryIntent(trimmed);

  if (!trimmed) {
    return entries.map((entry) => ({
      entry,
      score: 0,
      matchedTokens: [],
      queryIntent,
      entryIntent: entry.searchIntent,
    }));
  }

  const queryTokens = expandQueryTokens(trimmed);
  const semanticTokens = expandSemanticTokens(trimmed);

  return entries
    .map((entry) => {
      const { score, matchedTokens } = scoreEntry(
        entry,
        queryTokens,
        semanticTokens,
        queryIntent,
      );
      return {
        entry,
        score,
        matchedTokens,
        queryIntent,
        entryIntent: entry.searchIntent,
      };
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
