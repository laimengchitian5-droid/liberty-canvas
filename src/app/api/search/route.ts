import { NextResponse } from "next/server";
import { z } from "zod";
import { buildUnifiedDiscoveryCatalog } from "@/lib/catalog/unifiedDiscoveryCatalog";
import { searchUnifiedCatalog } from "@/lib/catalog/searchUnifiedCatalog";

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

  const catalog = await buildUnifiedDiscoveryCatalog();
  const hits = searchUnifiedCatalog(catalog, parsed.data.q);
  const limit = parsed.data.limit ?? 24;

  return NextResponse.json({
    query: parsed.data.q,
    queryIntent: hits[0]?.queryIntent ?? "navigational",
    total: hits.length,
    results: hits.slice(0, limit).map((hit) => ({
      id: hit.entry.id,
      slug: hit.entry.slug,
      title: hit.entry.title,
      subtitle: hit.entry.subtitle,
      href: hit.entry.href,
      kind: hit.entry.kind,
      score: hit.score,
      matchedTokens: hit.matchedTokens,
      queryIntent: hit.queryIntent,
      entryIntent: hit.entryIntent,
    })),
  });
}
