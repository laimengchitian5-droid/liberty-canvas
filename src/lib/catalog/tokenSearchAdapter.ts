import { buildUnifiedDiscoveryCatalog } from "@/lib/catalog/unifiedDiscoveryCatalog";
import {
  searchUnifiedCatalog,
  type UnifiedSearchHit,
} from "@/lib/catalog/searchUnifiedCatalog";
import type {
  CatalogSearchPort,
  CatalogSearchResult,
} from "@/lib/catalog/searchPortTypes";
import { inferQueryIntent } from "@/lib/seo/searchIntent";

export const tokenSearchAdapter: CatalogSearchPort = {
  backend: "token",

  async search(query: string, limit: number): Promise<CatalogSearchResult> {
    const catalog = await buildUnifiedDiscoveryCatalog();
    const hits = searchUnifiedCatalog(catalog, query).slice(0, limit);

    return {
      query,
      queryIntent: hits[0]?.queryIntent ?? inferQueryIntent(query),
      backend: "token",
      total: hits.length,
      results: hits,
    };
  },
};

export function mergeSearchHits(
  primary: readonly UnifiedSearchHit[],
  secondary: readonly UnifiedSearchHit[],
  limit: number,
): UnifiedSearchHit[] {
  const merged = new Map<string, UnifiedSearchHit>();

  for (const hit of [...primary, ...secondary]) {
    const existing = merged.get(hit.entry.id);

    if (!existing || hit.score > existing.score) {
      merged.set(hit.entry.id, {
        ...hit,
        score: existing ? Math.max(existing.score, hit.score) : hit.score,
        matchedTokens: Array.from(
          new Set([...(existing?.matchedTokens ?? []), ...hit.matchedTokens]),
        ),
      });
    }
  }

  return Array.from(merged.values())
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
