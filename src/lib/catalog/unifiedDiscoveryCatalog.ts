import { buildDiagnosisDiscoveryCatalog } from "@/lib/builder/discoveryCatalog";
import { listHubCards } from "@/lib/rubel/repository";
import type { UnifiedDiscoveryEntry } from "@/lib/catalog/unifiedDiscoveryTypes";
import { LANDING_TOPICS } from "@/lib/landing/landingTopics";
import { isSpecialtyPlugSlug } from "@/lib/specialty/specialtyHubCatalog";

export type {
  UnifiedDiscoveryEntry,
  UnifiedDiscoveryKind,
} from "@/lib/catalog/unifiedDiscoveryTypes";
export { groupUnifiedDiscoveryCatalog } from "@/lib/catalog/unifiedDiscoveryTypes";

const RUBEL_ACCENT = "#6366F1";

function resolveSearchMetaForSlug(
  slug: string,
): Pick<UnifiedDiscoveryEntry, "searchIntent" | "searchTags"> {
  const topic = LANDING_TOPICS.find((entry) => entry.plugPlayPath.endsWith(`/${slug}`));

  if (topic) {
    return {
      searchIntent: topic.searchIntent,
      searchTags: topic.searchTags,
    };
  }

  return {
    searchIntent: slug.includes("romance") ? "transactional" : "navigational",
    searchTags: [slug.replace(/-/g, " ")],
  };
}

export async function buildUnifiedDiscoveryCatalog(): Promise<UnifiedDiscoveryEntry[]> {
  const [plugEntries, rubelCards] = await Promise.all([
    buildDiagnosisDiscoveryCatalog(),
    listHubCards(),
  ]);

  const plug: UnifiedDiscoveryEntry[] = plugEntries.map((entry) => ({
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    subtitle: entry.subtitle,
    eyebrow: entry.eyebrow,
    estimatedMinutes: entry.estimatedMinutes,
    themeColor: entry.themeColor,
    href: entry.href,
    kind:
      entry.source === "official"
        ? isSpecialtyPlugSlug(entry.slug)
          ? "plug-specialty"
          : "plug-official"
        : "plug-community",
    questionCount: entry.questionCount,
    ...resolveSearchMetaForSlug(entry.slug),
  }));

  const quick: UnifiedDiscoveryEntry[] = rubelCards.map((card) => ({
    id: card.id,
    slug: card.id,
    title: card.title,
    subtitle: card.globalReachLabel,
    eyebrow: "1問クイック",
    estimatedMinutes: 1,
    themeColor: card.creatorAccent ?? RUBEL_ACCENT,
    href: card.href,
    kind: "rubel-quick",
    questionCount: card.questionCount,
    trendingLabel: card.trendingLabel,
    searchIntent: "transactional",
    searchTags: [card.title, "quick", "1問"],
  }));

  return [...plug, ...quick];
}

export type PlayCatalogSort = "trending" | "title";

/**
 * Liberty Play catalogue — O(n) filter over unified catalog, no second data source.
 */
export async function listPlayCatalogEntries(options?: {
  query?: string;
  sort?: PlayCatalogSort;
  limit?: number;
}): Promise<UnifiedDiscoveryEntry[]> {
  const catalog = await buildUnifiedDiscoveryCatalog();
  const query = options?.query?.trim().toLowerCase() ?? "";
  const sort = options?.sort ?? "trending";
  const limit = options?.limit ?? 48;

  let entries = catalog.filter((entry) => entry.kind === "rubel-quick");

  if (query) {
    entries = entries.filter((entry) => {
      const haystack = [entry.title, entry.subtitle, ...(entry.searchTags ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  entries = [...entries].sort((left, right) => {
    if (sort === "title") {
      return left.title.localeCompare(right.title, "ja");
    }
    const leftTrend = left.trendingLabel ? 1 : 0;
    const rightTrend = right.trendingLabel ? 1 : 0;
    if (leftTrend !== rightTrend) {
      return rightTrend - leftTrend;
    }
    return left.title.localeCompare(right.title, "ja");
  });

  return entries.slice(0, Math.max(1, limit));
}
