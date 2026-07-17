import type {
  UnifiedDiscoveryEntry,
  UnifiedDiscoveryKind,
} from "@/lib/catalog/unifiedDiscoveryTypes";
import type { UnifiedSearchHit } from "@/lib/catalog/searchUnifiedCatalog";
import { embedSearchQuery } from "@/lib/ai/embeddings";
import { cosineSimilarity } from "@/lib/catalog/localEmbedding";
import { getSqlTag } from "@/lib/catalog/postgresClient";
import {
  inferQueryIntent,
  intentRankBoost,
  type SearchIntent,
} from "@/lib/seo/searchIntent";

interface DiscoveryIndexRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  href: string;
  kind: UnifiedDiscoveryKind;
  question_count: number;
  estimated_minutes: number;
  theme_color: string;
  search_intent: SearchIntent | null;
  search_tags: string[] | null;
  rank: number;
  embedding: number[] | null;
}

function rowToEntry(row: DiscoveryIndexRow): UnifiedDiscoveryEntry {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    eyebrow: row.eyebrow,
    href: row.href,
    kind: row.kind,
    questionCount: row.question_count,
    estimatedMinutes: row.estimated_minutes,
    themeColor: row.theme_color,
    searchIntent: row.search_intent ?? undefined,
    searchTags: row.search_tags ?? undefined,
  };
}

function parseEmbedding(value: unknown): number[] | null {
  if (Array.isArray(value)) {
    return value.filter((item): item is number => typeof item === "number");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed)
        ? parsed.filter((item): item is number => typeof item === "number")
        : null;
    } catch {
      return null;
    }
  }

  return null;
}

export async function searchDiscoveryIndexFts(
  query: string,
  limit: number,
): Promise<UnifiedSearchHit[]> {
  const sql = await getSqlTag();

  if (!sql) {
    return [];
  }

  const queryIntent = inferQueryIntent(query);

  const result = await sql`
    SELECT
      id,
      slug,
      title,
      subtitle,
      eyebrow,
      href,
      kind,
      question_count,
      estimated_minutes,
      theme_color,
      search_intent,
      search_tags,
      ts_rank(search_document, plainto_tsquery('simple', ${query})) AS rank,
      embedding
    FROM discovery_index
    WHERE search_document @@ plainto_tsquery('simple', ${query})
    ORDER BY rank DESC
    LIMIT ${Math.max(limit, 20)}
  `;

  return (result.rows as DiscoveryIndexRow[]).map((row) => {
    const entry = rowToEntry(row);
    const baseScore = Number(row.rank) * 10;
    const intentBoost = intentRankBoost(entry.searchIntent, queryIntent, entry.kind);

    return {
      entry,
      score: baseScore + intentBoost,
      matchedTokens: [query.trim()],
      queryIntent,
      entryIntent: entry.searchIntent,
    };
  });
}

export async function searchDiscoveryIndexVector(
  query: string,
  limit: number,
): Promise<UnifiedSearchHit[]> {
  const sql = await getSqlTag();

  if (!sql) {
    return [];
  }

  const queryIntent = inferQueryIntent(query);
  const queryEmbedding = await embedSearchQuery(query);

  const result = await sql`
    SELECT
      id,
      slug,
      title,
      subtitle,
      eyebrow,
      href,
      kind,
      question_count,
      estimated_minutes,
      theme_color,
      search_intent,
      search_tags,
      0 AS rank,
      embedding
    FROM discovery_index
    WHERE embedding IS NOT NULL
    LIMIT 200
  `;

  const scored = (result.rows as DiscoveryIndexRow[])
    .map((row): UnifiedSearchHit | null => {
      const embedding = parseEmbedding(row.embedding);

      if (!embedding) {
        return null;
      }

      const similarity = cosineSimilarity(queryEmbedding, embedding);
      const entry = rowToEntry(row);
      const intentBoost = intentRankBoost(entry.searchIntent, queryIntent, entry.kind);

      return {
        entry,
        score: similarity * 10 + intentBoost,
        matchedTokens: ["vector"],
        queryIntent,
        entryIntent: entry.searchIntent,
      };
    })
    .filter((hit): hit is UnifiedSearchHit => hit !== null)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);

  return scored;
}

export async function searchDiscoveryIndexHybrid(
  query: string,
  limit: number,
): Promise<UnifiedSearchHit[]> {
  const [ftsHits, vectorHits] = await Promise.all([
    searchDiscoveryIndexFts(query, limit),
    searchDiscoveryIndexVector(query, limit),
  ]);

  const merged = new Map<string, UnifiedSearchHit>();

  for (const hit of [...ftsHits, ...vectorHits]) {
    const existing = merged.get(hit.entry.id);

    if (!existing) {
      merged.set(hit.entry.id, hit);
      continue;
    }

    merged.set(hit.entry.id, {
      ...existing,
      score: existing.score + hit.score * 0.85,
      matchedTokens: Array.from(
        new Set([...existing.matchedTokens, ...hit.matchedTokens]),
      ),
    });
  }

  return Array.from(merged.values())
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
