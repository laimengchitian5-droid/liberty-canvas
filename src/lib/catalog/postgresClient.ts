import { isPostgresConfigured } from "@/lib/catalog/searchConfig";

type SqlTag = typeof import("@vercel/postgres").sql;

let cachedSql: SqlTag | null | undefined;

/** Formats JS strings for Postgres `TEXT[]` via tagged-template (Primitive-only). */
export function formatPgTextArray(values: readonly string[] | undefined): string {
  const items = values ? [...values] : [];

  if (items.length === 0) {
    return "{}";
  }

  const escaped = items.map(
    (value) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`,
  );

  return `{${escaped.join(",")}}`;
}

export async function getSqlTag(): Promise<SqlTag | null> {
  if (!isPostgresConfigured()) {
    return null;
  }

  if (cachedSql !== undefined) {
    return cachedSql;
  }

  try {
    const postgres = await import("@vercel/postgres");
    cachedSql = postgres.sql;
    return cachedSql;
  } catch {
    cachedSql = null;
    return null;
  }
}

export async function ensureDiscoveryIndexSchema(): Promise<boolean> {
  const sql = await getSqlTag();

  if (!sql) {
    return false;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS discovery_index (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL DEFAULT '',
      eyebrow TEXT NOT NULL DEFAULT '',
      href TEXT NOT NULL,
      kind TEXT NOT NULL,
      question_count INTEGER NOT NULL DEFAULT 0,
      estimated_minutes INTEGER NOT NULL DEFAULT 5,
      theme_color TEXT NOT NULL DEFAULT '#6366F1',
      search_intent TEXT,
      search_tags TEXT[] DEFAULT '{}',
      search_document TSVECTOR,
      embedding JSONB,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS discovery_index_fts
    ON discovery_index USING GIN (search_document)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS discovery_index_slug
    ON discovery_index (slug)
  `;

  await sql`
    ALTER TABLE discovery_index
    ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER NOT NULL DEFAULT 5
  `;

  await sql`
    ALTER TABLE discovery_index
    ADD COLUMN IF NOT EXISTS theme_color TEXT NOT NULL DEFAULT '#6366F1'
  `;

  return true;
}
