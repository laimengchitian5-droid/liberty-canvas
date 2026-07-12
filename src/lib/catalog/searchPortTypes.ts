import type { UnifiedSearchHit } from "@/lib/catalog/searchUnifiedCatalog";
import type { CatalogSearchBackend } from "@/lib/catalog/searchConfig";

export interface CatalogSearchResult {
  query: string;
  queryIntent: UnifiedSearchHit["queryIntent"];
  backend: CatalogSearchBackend;
  total: number;
  results: UnifiedSearchHit[];
}

export interface CatalogSearchPort {
  readonly backend: CatalogSearchBackend;
  search(query: string, limit: number): Promise<CatalogSearchResult>;
}
