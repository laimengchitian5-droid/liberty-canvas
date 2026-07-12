import {
  isPostgresConfigured,
  isVectorSearchEnabled,
  resolveSearchBackend,
  type CatalogSearchBackend,
} from "@/lib/catalog/searchConfig";
import type { CatalogSearchPort, CatalogSearchResult } from "@/lib/catalog/searchPortTypes";
import {
  searchDiscoveryIndexFts,
  searchDiscoveryIndexHybrid,
} from "@/lib/catalog/postgresSearchAdapter";
import { mergeSearchHits, tokenSearchAdapter } from "@/lib/catalog/tokenSearchAdapter";
import { inferQueryIntent } from "@/lib/seo/searchIntent";

function createPostgresSearchPort(mode: Extract<CatalogSearchBackend, "postgres" | "hybrid">): CatalogSearchPort {
  return {
    backend: mode,

    async search(query: string, limit: number): Promise<CatalogSearchResult> {
      const trimmed = query.trim();

      if (!trimmed) {
        return tokenSearchAdapter.search(query, limit);
      }

      const hits =
        mode === "hybrid" && isVectorSearchEnabled()
          ? await searchDiscoveryIndexHybrid(trimmed, limit)
          : await searchDiscoveryIndexFts(trimmed, limit);

      if (hits.length === 0) {
        const fallback = await tokenSearchAdapter.search(query, limit);
        return {
          ...fallback,
          backend: mode,
        };
      }

      return {
        query: trimmed,
        queryIntent: hits[0]?.queryIntent ?? inferQueryIntent(trimmed),
        backend: mode,
        total: hits.length,
        results: hits,
      };
    },
  };
}

const hybridSearchPort = createPostgresSearchPort("hybrid");
const postgresSearchPort = createPostgresSearchPort("postgres");

export async function resolveCatalogSearchPort(): Promise<CatalogSearchPort> {
  const backend = resolveSearchBackend();

  if (!isPostgresConfigured() || backend === "token") {
    return tokenSearchAdapter;
  }

  if (backend === "postgres") {
    return postgresSearchPort;
  }

  return hybridSearchPort;
}

export async function searchCatalog(
  query: string,
  limit: number,
): Promise<CatalogSearchResult> {
  const backend = resolveSearchBackend();

  try {
    const port = await resolveCatalogSearchPort();
    const result = await port.search(query, limit);

    if (result.results.length > 0) {
      return result;
    }

    if (backend !== "token") {
      const fallback = await tokenSearchAdapter.search(query, limit);
      return mergeCatalogSearchResult(result, fallback);
    }

    return result;
  } catch (error) {
    console.error("[searchCatalog] fallback to token search:", error);
    return tokenSearchAdapter.search(query, limit);
  }
}

function mergeCatalogSearchResult(
  primary: CatalogSearchResult,
  fallback: CatalogSearchResult,
): CatalogSearchResult {
  return {
    query: primary.query,
    queryIntent: primary.queryIntent,
    backend: primary.backend,
    total: fallback.total,
    results: mergeSearchHits(primary.results, fallback.results, fallback.results.length),
  };
}
