import { NextResponse } from "next/server";
import { z } from "zod";
import { searchCatalog } from "@/lib/catalog/searchPort";
import { resolveSearchBackend } from "@/lib/catalog/searchConfig";
import { logCatalogSearchEvent } from "@/lib/catalog/logSearchAnalytics";
import { appendSearchRefToHref } from "@/lib/seo/searchIntent";

const querySchema = z.object({
  q: z.string().trim().min(1).max(120),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    q: searchParams.get("q") ?? "",
    limit: searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid search query" }, { status: 400 });
  }

  const limit = parsed.data.limit ?? 24;
  const result = await searchCatalog(parsed.data.q, limit);

  void logCatalogSearchEvent({
    query: result.query,
    backend: result.backend,
    total: result.total,
    queryIntent: result.queryIntent,
  });

  return NextResponse.json({
    query: result.query,
    queryIntent: result.queryIntent,
    backend: result.backend,
    configuredBackend: resolveSearchBackend(),
    total: result.total,
    results: result.results.map((hit) => ({
      id: hit.entry.id,
      slug: hit.entry.slug,
      title: hit.entry.title,
      subtitle: hit.entry.subtitle,
      href: appendSearchRefToHref(hit.entry.href, hit.entry.slug),
      kind: hit.entry.kind,
      score: hit.score,
      matchedTokens: hit.matchedTokens,
      queryIntent: hit.queryIntent,
      entryIntent: hit.entryIntent,
    })),
  });
}
