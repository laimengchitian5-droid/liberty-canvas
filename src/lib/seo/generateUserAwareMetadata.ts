import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LC_SESSION_COOKIE } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/edgeSession";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/site/url";
import {
  buildUserSeoMetadata,
  mapUserDataToSeoContext,
} from "@/lib/user/buildUserSeoPayload";
import { DEFAULT_GUEST_USER_ID } from "@/lib/user/constants";
import { resolveUserData } from "@/lib/user/repository";
import {
  resolvePrimaryClusterForPath,
  resolveSemanticClustersForLocale,
} from "@/lib/user/semanticQueryClusters";

export interface UserAwareMetadataOptions {
  landingPath: string;
  baseMetadata: Metadata;
  localeOverride?: Locale;
}

function mergeKeywordLists(
  baseKeywords: Metadata["keywords"],
  seoKeywords: readonly string[],
): string[] {
  const merged = new Set<string>();

  if (typeof baseKeywords === "string") {
    merged.add(baseKeywords);
  } else if (Array.isArray(baseKeywords)) {
    for (const keyword of baseKeywords) {
      if (typeof keyword === "string") {
        merged.add(keyword);
      }
    }
  }

  for (const keyword of seoKeywords) {
    merged.add(keyword);
  }

  return [...merged];
}

function resolveServerLocale(
  localeOverride: Locale | undefined,
  cookieLocale: string | undefined,
  profileLocale: Locale,
): Locale {
  if (localeOverride) {
    return localeOverride;
  }

  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  return profileLocale;
}

async function resolveActiveUserId(): Promise<string> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(LC_SESSION_COOKIE)?.value ?? null;
  const session = await verifySessionToken(sessionToken);

  return session?.userId ?? DEFAULT_GUEST_USER_ID;
}

export async function generateUserAwareMetadata(
  options: UserAwareMetadataOptions,
): Promise<Metadata> {
  const userId = await resolveActiveUserId();
  const userData = await resolveUserData(userId);
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get("personality-quiz-locale-v1")?.value;
  const locale = resolveServerLocale(
    options.localeOverride,
    cookieLocale,
    userData.profile.locale,
  );

  const pathCluster = resolvePrimaryClusterForPath(options.landingPath, locale);
  const seoContext = mapUserDataToSeoContext(userData, locale);
  const userMetadata = buildUserSeoMetadata(seoContext);
  const siteUrl = getSiteUrl();
  const canonicalPath = options.landingPath || "/";

  const title =
    pathCluster?.title ??
    (typeof options.baseMetadata.title === "string"
      ? options.baseMetadata.title
      : userMetadata.title);

  const description =
    pathCluster?.description ??
    options.baseMetadata.description ??
    userMetadata.description;

  const keywords = mergeKeywordLists(
    options.baseMetadata.keywords,
    pathCluster ? [...pathCluster.keywords, ...seoContext.keywords] : seoContext.keywords,
  );

  return {
    ...options.baseMetadata,
    ...userMetadata,
    title,
    description,
    keywords,
    alternates: {
      ...options.baseMetadata.alternates,
      canonical: `${siteUrl}${canonicalPath === "/" ? "" : canonicalPath}`,
    },
    openGraph: {
      ...options.baseMetadata.openGraph,
      ...userMetadata.openGraph,
      title: typeof title === "string" ? title : userMetadata.openGraph?.title,
      description:
        typeof description === "string"
          ? description
          : userMetadata.openGraph?.description,
      url: `${siteUrl}${canonicalPath}`,
    },
  };
}

export async function buildUserAwareJsonLd(
  landingPath: string,
  localeOverride?: Locale,
): Promise<Record<string, unknown>> {
  const userId = await resolveActiveUserId();
  const userData = await resolveUserData(userId);
  const locale = localeOverride ?? userData.profile.locale ?? DEFAULT_LOCALE;
  const seoContext = mapUserDataToSeoContext(userData, locale);
  const pathCluster = resolvePrimaryClusterForPath(landingPath, locale);
  const clusters = resolveSemanticClustersForLocale(locale);

  const graph = [...seoContext.jsonLd];

  if (pathCluster) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pathCluster.title,
      description: pathCluster.description,
      url: `${getSiteUrl()}${pathCluster.landingPath}`,
      inLanguage: locale,
      keywords: pathCluster.keywords.join(", "),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
    clusterCount: clusters.length,
  };
}
