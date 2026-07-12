# SQL bootstrap — discovery search index (Phase 4)

Run automatically via `POST /api/catalog/sync-index` or `syncDiscoveryIndex()`.

```sql
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
);

CREATE INDEX IF NOT EXISTS discovery_index_fts
  ON discovery_index USING GIN (search_document);

CREATE INDEX IF NOT EXISTS discovery_index_slug
  ON discovery_index (slug);
```

## Env

| Variable | Default | Purpose |
|----------|---------|---------|
| `POSTGRES_URL` | — | Vercel Postgres / Neon connection |
| `LC_SEARCH_BACKEND` | `token` | `token` / `postgres` / `hybrid` |
| `LC_SEARCH_VECTOR_ENABLED` | auto | Vector leg for hybrid |
| `OPENAI_API_KEY` | — | OpenAI embeddings (falls back to local hash vectors) |
| `LC_SCORING_BACKEND` | `typescript` | Future Wasm scoring port |

## Reindex

```bash
curl -X POST https://liberty-canvas.vercel.app/api/catalog/sync-index \
  -H "x-lc-insights-key: $LC_INSIGHTS_SECRET"
```
