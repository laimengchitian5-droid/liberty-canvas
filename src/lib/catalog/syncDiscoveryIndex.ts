import { buildUnifiedDiscoveryCatalog } from "@/lib/catalog/unifiedDiscoveryCatalog";
import type { UnifiedDiscoveryEntry } from "@/lib/catalog/unifiedDiscoveryTypes";
import { embedCatalogEntry } from "@/lib/ai/embeddings";
import {
  ensureDiscoveryIndexSchema,
  formatPgTextArray,
  getSqlTag,
} from "@/lib/catalog/postgresClient";
import { isVectorSearchEnabled } from "@/lib/catalog/searchConfig";
import { buildCatalogEmbeddingText } from "@/lib/catalog/localEmbedding";

export interface SyncDiscoveryIndexResult {
  indexed: number;
  backend: "postgres" | "skipped";
  vectorEnabled: boolean;
}

async function upsertDiscoveryEntry(
  entry: UnifiedDiscoveryEntry,
  embedding: number[] | null,
): Promise<void> {
  const sql = await getSqlTag();

  if (!sql) {
    return;
  }

  const documentText = buildCatalogEmbeddingText({
    title: entry.title,
    subtitle: entry.subtitle,
    eyebrow: entry.eyebrow,
    slug: entry.slug,
    searchTags: entry.searchTags,
  });

  await sql`
    INSERT INTO discovery_index (
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
      search_document,
      embedding,
      updated_at
    ) VALUES (
      ${entry.id},
      ${entry.slug},
      ${entry.title},
      ${entry.subtitle},
      ${entry.eyebrow},
      ${entry.href},
      ${entry.kind},
      ${entry.questionCount},
      ${entry.estimatedMinutes},
      ${entry.themeColor},
      ${entry.searchIntent ?? null},
      ${formatPgTextArray(entry.searchTags)},
      to_tsvector('simple', ${documentText}),
      ${embedding ? JSON.stringify(embedding) : null},
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      eyebrow = EXCLUDED.eyebrow,
      href = EXCLUDED.href,
      kind = EXCLUDED.kind,
      question_count = EXCLUDED.question_count,
      estimated_minutes = EXCLUDED.estimated_minutes,
      theme_color = EXCLUDED.theme_color,
      search_intent = EXCLUDED.search_intent,
      search_tags = EXCLUDED.search_tags,
      search_document = EXCLUDED.search_document,
      embedding = EXCLUDED.embedding,
      updated_at = NOW()
  `;
}

export async function syncDiscoveryIndex(): Promise<SyncDiscoveryIndexResult> {
  const ready = await ensureDiscoveryIndexSchema();

  if (!ready) {
    return { indexed: 0, backend: "skipped", vectorEnabled: false };
  }

  const catalog = await buildUnifiedDiscoveryCatalog();
  const vectorEnabled = isVectorSearchEnabled();

  for (const entry of catalog) {
    const embedding = vectorEnabled
      ? await embedCatalogEntry({
          title: entry.title,
          subtitle: entry.subtitle,
          eyebrow: entry.eyebrow,
          slug: entry.slug,
          searchTags: entry.searchTags,
        })
      : null;

    await upsertDiscoveryEntry(entry, embedding);
  }

  return {
    indexed: catalog.length,
    backend: "postgres",
    vectorEnabled,
  };
}
