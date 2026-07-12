export interface CrawlerVisitAnalyticsPayload {
  event: "crawler_visit";
  at: string;
  pathname: string;
  ref: string | null;
  userAgent?: string;
  funnelStep: "discover_ref";
}

export function buildCrawlerVisitPayload(input: {
  pathname: string;
  ref: string | null;
  userAgent: string | null;
}): CrawlerVisitAnalyticsPayload {
  return {
    event: "crawler_visit",
    at: new Date().toISOString(),
    pathname: input.pathname.slice(0, 180),
    ref: input.ref,
    userAgent: input.userAgent?.slice(0, 180),
    funnelStep: "discover_ref",
  };
}

export function postCrawlerVisitFromEdge(
  origin: string,
  input: {
    pathname: string;
    ref: string | null;
    userAgent: string | null;
  },
): void {
  void fetch(`${origin}/api/diagnosis/analytics/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildCrawlerVisitPayload(input)),
  }).catch(() => {
    // ignore
  });
}
