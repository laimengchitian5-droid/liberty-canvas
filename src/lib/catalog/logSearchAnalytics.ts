import { appendAnalyticsEvent } from "@/lib/diagnosis/analyticsServer";
import type { CatalogSearchBackend } from "@/lib/catalog/searchConfig";

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
    await appendAnalyticsEvent({
      event: "crawler_visit",
      at: new Date().toISOString(),
      pathname: input.pathname.slice(0, 180),
      ref: input.ref,
      userAgent: input.userAgent?.slice(0, 180),
      funnelStep: "discover_ref",
    });
  } catch {
    // non-blocking
  }
}
