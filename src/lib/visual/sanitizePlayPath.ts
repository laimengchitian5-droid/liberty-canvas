import { resolveLegacyDiagnosisRedirect } from "@/lib/seo/legacyRouteMatrix";

/**
 * Allowed clean runtime paths (stack truth):
 * - `/play/[id]` — Rubel / Liberty Play
 * - `/app/[id]` — Forge apps
 * - `/diagnosis/play/[slug]` — Plug diagnoses
 */
export const CLEAN_PLAY_PATH_PATTERN =
  /^\/(play|app|diagnosis\/play)\/[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/;

const SLUG_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/;

function extractSlug(segment: string): string | null {
  const trimmed = segment.trim();
  if (!SLUG_PATTERN.test(trimmed)) {
    return null;
  }
  return trimmed;
}

/**
 * Deterministic path sanitizer — never trust model output for navigation.
 * O(n) in path length; fail-closed to null when unrecoverable.
 */
export function sanitizePlayPath(rawPath: string): string | null {
  const trimmed = rawPath.trim();
  if (!trimmed || trimmed.includes("://") || trimmed.startsWith("//")) {
    return null;
  }

  let pathname = trimmed.split(/[?#]/, 1)[0] ?? "";
  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  // Collapse accidental doubles; block traversal.
  pathname = pathname.replace(/\/{2,}/g, "/");
  if (pathname.includes("..") || pathname.includes("\\")) {
    return null;
  }

  const legacy = resolveLegacyDiagnosisRedirect(pathname);
  if (legacy) {
    return CLEAN_PLAY_PATH_PATTERN.test(legacy) ? legacy : null;
  }

  if (CLEAN_PLAY_PATH_PATTERN.test(pathname)) {
    return pathname;
  }

  // `/diagnosis/[slug]` (missing /play) → `/diagnosis/play/[slug]`
  const diagnosisBare = pathname.match(/^\/diagnosis\/([a-zA-Z0-9][a-zA-Z0-9_-]{0,79})$/);
  if (diagnosisBare?.[1]) {
    return `/diagnosis/play/${diagnosisBare[1]}`;
  }

  // Twisted `/quiz/[slug]` → keep under play runtime when slug is safe
  const quiz = pathname.match(/^\/quiz\/([a-zA-Z0-9][a-zA-Z0-9_-]{0,79})$/);
  if (quiz?.[1]) {
    return `/play/${quiz[1]}`;
  }

  // Last-resort: trailing segment as play id
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  const slug = last ? extractSlug(last) : null;
  if (slug) {
    return `/play/${slug}`;
  }

  return null;
}

export function assertCleanPlayPath(path: string): path is string {
  return CLEAN_PLAY_PATH_PATTERN.test(path);
}
