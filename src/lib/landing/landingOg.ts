import {
  buildGenericOgImageUrl,
  buildPlayOgImageUrl,
  buildPlugOgImageUrl,
} from "@/lib/seo/ogUrls";

const PLUG_PLAY_PATH_RE = /^\/diagnosis\/play\/([^/?#]+)/u;

/**
 * Resolve Discover OG image from plug path — O(1) regex, no topic table scan.
 * Non-play paths (e.g. `/diagnosis` brand hub) fall back to headline card.
 */
export function resolveLandingOgImageUrl(
  plugPlayPath: string,
  headline: string,
  metaDescription: string,
): string {
  const trimmed = plugPlayPath.trim();

  if (!trimmed) {
    return buildGenericOgImageUrl();
  }

  const match = PLUG_PLAY_PATH_RE.exec(trimmed);
  const plugSlug = match?.[1];

  if (plugSlug) {
    return buildPlugOgImageUrl(plugSlug);
  }

  return buildPlayOgImageUrl(headline, metaDescription);
}
