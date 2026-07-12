import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/site/url";
import {
  resolveSemanticClustersForLocale,
  type SemanticQueryCluster,
  type SemanticQueryClusterId,
} from "@/lib/user/semanticQueryClusters";
import type { UserData, UserSeoContext } from "@/types/user";

function buildClusterKeywords(clusters: readonly SemanticQueryCluster[]): string[] {
  const keywords = new Set<string>();

  for (const cluster of clusters) {
    keywords.add(cluster.primaryQuery);
    for (const alternate of cluster.alternateQueries) {
      keywords.add(alternate);
    }
    for (const keyword of cluster.keywords) {
      keywords.add(keyword);
    }
  }

  return [...keywords];
}

function buildPrimaryCluster(clusters: readonly SemanticQueryCluster[]): SemanticQueryCluster {
  return clusters[0] ?? resolveSemanticClustersForLocale("ja")[0]!;
}

function buildWebApplicationJsonLd(
  userData: UserData,
  clusters: readonly SemanticQueryCluster[],
): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  const primary = buildPrimaryCluster(clusters);

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: primary.title,
    description: primary.description,
    url: `${siteUrl}${primary.landingPath}`,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    inLanguage: userData.profile.locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    audience: {
      "@type": "Audience",
      audienceType: userData.profile.displayName,
    },
    keywords: buildClusterKeywords(clusters).join(", "),
  };
}

function buildProfilePageJsonLd(
  userData: UserData,
  clusters: readonly SemanticQueryCluster[],
): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${userData.profile.displayName} — Rubel Canvas`,
    url: `${siteUrl}/api/users/${encodeURIComponent(userData.profile.userId)}`,
    inLanguage: userData.profile.locale,
    mainEntity: {
      "@type": "Person",
      name: userData.profile.displayName,
      identifier: userData.profile.userId,
      knowsAbout: clusters.map((cluster) => cluster.primaryQuery),
    },
  };
}

export function mapUserDataToSeoContext(
  userData: UserData,
  localeOverride?: Locale | null,
): UserSeoContext {
  const locale = localeOverride ?? userData.profile.locale;
  const clusters = resolveSemanticClustersForLocale(locale);
  const activeClusterIds = clusters.map((cluster) => cluster.id);
  const primary = buildPrimaryCluster(clusters);
  const keywords = buildClusterKeywords(clusters);

  if (userData.activity.appsAuthored > 0) {
    keywords.push("クリエイター", "クイズ作成");
  }

  return Object.freeze({
    locale,
    activeClusterIds: Object.freeze(activeClusterIds) as readonly SemanticQueryClusterId[],
    primaryTitle: primary.title,
    primaryDescription: primary.description,
    keywords: Object.freeze(keywords),
    landingPath: primary.landingPath,
    jsonLd: Object.freeze([
      buildWebApplicationJsonLd(userData, clusters),
      buildProfilePageJsonLd(userData, clusters),
    ]),
  });
}

export function buildUserSeoMetadata(seoContext: UserSeoContext): Metadata {
  return {
    title: seoContext.primaryTitle,
    description: seoContext.primaryDescription,
    keywords: [...seoContext.keywords],
    alternates: {
      canonical: seoContext.landingPath,
    },
    openGraph: {
      title: seoContext.primaryTitle,
      description: seoContext.primaryDescription,
      type: "website",
    },
  };
}

export interface UserSeoPayload {
  metadata: Metadata;
  jsonLd: readonly Record<string, unknown>[];
  seoContext: UserSeoContext;
}

export function buildUserSeoPayload(
  userData: UserData,
  localeOverride?: Locale | null,
): UserSeoPayload {
  const seoContext = mapUserDataToSeoContext(userData, localeOverride);

  return {
    metadata: buildUserSeoMetadata(seoContext),
    jsonLd: seoContext.jsonLd,
    seoContext,
  };
}
