import type { Metadata } from "next";
import { getBrand } from "@/lib/brand/registry";
import {
  parseGameContent,
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  type GameContent,
  type ServiceManifest,
} from "@/lib/playable/gameContentSchema";
import { buildHreflangAlternates } from "@/lib/seo/hreflang";
import { getSiteUrl } from "@/lib/site/url";

const ABSOLUTE_URL_RE = /^https?:\/\//i;

/**
 * Normalize a canonical path or absolute URL onto the site origin.
 * Rejects protocol-relative / external hosts (SEO hijack defense).
 */
export function resolvePlatformCanonicalUrl(canonical: string): string {
  const siteUrl = getSiteUrl();
  const trimmed = canonical.trim();

  if (!trimmed) {
    return siteUrl;
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return `${siteUrl}${trimmed}`;
  }

  if (ABSOLUTE_URL_RE.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const site = new URL(siteUrl);
      if (url.origin === site.origin) {
        return `${site.origin}${url.pathname}${url.search}`;
      }
    } catch {
      // fall through
    }
  }

  return siteUrl;
}

/** Extract pathname for hreflang matrix (query stripped). */
export function canonicalUrlToPath(canonicalUrl: string): string {
  try {
    const url = new URL(resolvePlatformCanonicalUrl(canonicalUrl));
    return url.pathname || "/";
  } catch {
    return "/";
  }
}

export interface BuildPlatformGameMetadataInput {
  readonly content: GameContent;
  /** Absolute URL or site-relative path (`/play/…`). */
  readonly canonicalUrl: string;
  readonly manifest?: Pick<ServiceManifest, "id" | "brandId">;
  /** Prefer query `?lang=` alternates (main app) vs discover path locales. */
  readonly hreflangMode?: "query" | "discover";
}

/**
 * App Router Metadata for playable game pages.
 * Never emit `<head>` from client components — Next merges this server-side.
 */
export function buildPlatformGameMetadata(
  input: BuildPlatformGameMetadataInput,
): Metadata {
  const parsed = parseGameContent(input.content) ?? input.content;
  const title = parsed.title.slice(0, SEO_TITLE_MAX);
  const description = parsed.description.slice(0, SEO_DESCRIPTION_MAX);
  const canonical = resolvePlatformCanonicalUrl(input.canonicalUrl);
  const path = canonicalUrlToPath(canonical);

  const brandName = input.manifest
    ? getBrand(input.manifest.brandId).name
    : "Liberty Canvas";

  const languages =
    input.hreflangMode === "discover"
      ? buildHreflangAlternates(path.replace(/^\/discover\/[a-z]{2}/, "") || "/", {
          queryParamLang: false,
        })
      : buildHreflangAlternates(path, { queryParamLang: true });

  return {
    title: `${title} | ${brandName}`,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: `${title} | ${brandName}`,
      description,
      url: canonical,
      siteName: brandName,
      type: "website",
    },
  };
}
