import type { LandingLocale } from "@/lib/landing/landingLocales";

export function buildDiscoverFunnelRef(
  locale: LandingLocale,
  slug: string,
): string {
  return `discover-${locale}-${slug}`;
}

export function isDiscoverFunnelRef(ref: string | null | undefined): boolean {
  return Boolean(ref?.startsWith("discover-"));
}

export function buildDiscoverPlayHandoffUrl(
  plugPath: string,
  locale: LandingLocale,
  slug: string,
  options?: { direct?: boolean },
): string {
  const params = new URLSearchParams({
    lang: locale,
    ref: buildDiscoverFunnelRef(locale, slug),
  });

  if (options?.direct) {
    params.set("mode", "direct");
  }

  return `${plugPath}?${params.toString()}`;
}
