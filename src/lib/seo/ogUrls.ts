import { getSiteUrl } from "@/lib/site/url";

export function buildGenericOgImageUrl(): string {
  return `${getSiteUrl()}/api/og/diagnosis`;
}

export function buildPlugOgImageUrl(slug: string): string {
  return `${getSiteUrl()}/api/og/diagnosis?slug=${encodeURIComponent(slug)}`;
}

export function buildPlayOgImageUrl(title: string, subtitle?: string): string {
  const params = new URLSearchParams({ headline: title.slice(0, 72) });
  if (subtitle) {
    params.set("subtitle", subtitle.slice(0, 120));
  }
  return `${getSiteUrl()}/api/og/diagnosis?${params.toString()}`;
}

/** Play result viral card — result name as hero, quiz title as subtitle. */
export function buildPlayResultOgImageUrl(resultName: string, subtitle?: string): string {
  return buildPlayOgImageUrl(resultName, subtitle);
}

/** Viral share card for Play/Runtime scoring states (TikTok/X). */
export function buildQuizResultOgImageUrl(quizId: string, scoreLabel: string): string {
  const params = new URLSearchParams({
    id: quizId,
    score: scoreLabel.slice(0, 48),
  });
  return `${getSiteUrl()}/api/og/quiz?${params.toString()}`;
}

export function buildQuizResultShareUrl(
  quizId: string,
  archetype: string,
  totalScore?: number,
): string {
  const params = new URLSearchParams({
    result: archetype.slice(0, 80),
  });
  if (typeof totalScore === "number" && Number.isFinite(totalScore)) {
    params.set("score", String(Math.round(totalScore)));
  }
  return `${getSiteUrl()}/quiz/${encodeURIComponent(quizId)}?${params.toString()}`;
}

export function buildCreateOgImageUrl(): string {
  return buildPlugOgImageUrl("personality-spectrum");
}
