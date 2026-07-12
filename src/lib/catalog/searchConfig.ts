export type SearchBackend = "token" | "postgres" | "hybrid";

export type CatalogSearchBackend = SearchBackend;

export function resolveSearchBackend(): CatalogSearchBackend {
  const raw = process.env.LC_SEARCH_BACKEND?.trim().toLowerCase();

  if (raw === "postgres" || raw === "hybrid" || raw === "token") {
    return raw;
  }

  return isPostgresConfigured() ? "hybrid" : "token";
}

export function isVectorSearchEnabled(): boolean {
  if (process.env.LC_SEARCH_VECTOR_ENABLED === "false") {
    return false;
  }

  if (process.env.LC_SEARCH_VECTOR_ENABLED === "true") {
    return true;
  }

  return resolveSearchBackend() === "hybrid";
}

export function isPostgresConfigured(): boolean {
  return Boolean(
    process.env.POSTGRES_URL?.trim() || process.env.DATABASE_URL?.trim(),
  );
}

export function resolvePostgresConnectionString(): string | null {
  return (
    process.env.POSTGRES_URL?.trim() ??
    process.env.DATABASE_URL?.trim() ??
    null
  );
}
