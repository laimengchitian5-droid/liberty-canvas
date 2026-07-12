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

export function buildCreateOgImageUrl(): string {
  return buildPlugOgImageUrl("personality-spectrum");
}
