export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

export function buildQuizPageUrl(quizId: string): string {
  return `${getSiteUrl()}/quiz/${encodeURIComponent(quizId)}`;
}

export function buildAppPageUrl(appId: string): string {
  return `${getSiteUrl()}/app/${encodeURIComponent(appId)}`;
}

export function buildQuizOgImageUrl(quizId: string): string {
  return `${getSiteUrl()}/api/og/quiz?id=${encodeURIComponent(quizId)}`;
}

export function buildAppOgImageUrl(appId: string): string {
  return `${getSiteUrl()}/api/og/quiz?id=${encodeURIComponent(appId)}`;
}
