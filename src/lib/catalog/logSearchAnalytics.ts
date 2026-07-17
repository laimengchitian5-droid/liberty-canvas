import { appendAnalyticsEvent } from "@/lib/diagnosis/analyticsServer";
import type { StoredAnalyticsEvent } from "@/lib/diagnosis/analyticsServer";
import type { CatalogSearchBackend } from "@/lib/catalog/searchConfig";
import { buildCrawlerVisitPayload } from "@/lib/catalog/crawlerAnalyticsEdge";

export {
  buildCrawlerVisitPayload,
  postCrawlerVisitFromEdge,
} from "@/lib/catalog/crawlerAnalyticsEdge";

export async function logCatalogSearchEvent(input: {
  query: string;
  backend: CatalogSearchBackend;
  total: number;
  queryIntent: string;
}): Promise<void> {
  try {
    await appendAnalyticsEvent({
      event: "catalog_search",
      at: new Date().toISOString(),
      query: input.query.slice(0, 120),
      searchBackend: input.backend,
      queryIntent: input.queryIntent,
      resultCount: input.total,
      funnelStep: "search",
    });
  } catch {
    // non-blocking
  }
}

export async function logCrawlerVisitEvent(input: {
  pathname: string;
  ref: string | null;
  userAgent: string | null;
}): Promise<void> {
  try {
    await appendAnalyticsEvent(buildCrawlerVisitPayload(input) as StoredAnalyticsEvent);
  } catch {
    // non-blocking
  }
}
