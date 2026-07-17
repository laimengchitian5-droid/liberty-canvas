import type { SearchIntent } from "@/lib/seo/searchIntent";
import { isSpecialtyPlugSlug } from "@/lib/specialty/specialtyHubCatalog";

export type UnifiedDiscoveryKind =
  "plug-official" | "plug-community" | "plug-specialty" | "rubel-quick";

export interface UnifiedDiscoveryEntry {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  estimatedMinutes: number;
  themeColor: string;
  href: string;
  kind: UnifiedDiscoveryKind;
  questionCount: number;
  trendingLabel?: string;
  searchIntent?: SearchIntent;
  searchTags?: readonly string[];
}

export function groupUnifiedDiscoveryCatalog(entries: readonly UnifiedDiscoveryEntry[]): {
  specialtySeries: UnifiedDiscoveryEntry[];
  plugOfficial: UnifiedDiscoveryEntry[];
  plugCommunity: UnifiedDiscoveryEntry[];
  rubelQuick: UnifiedDiscoveryEntry[];
} {
  return {
    specialtySeries: entries.filter(
      (entry) => entry.kind === "plug-specialty" || isSpecialtyPlugSlug(entry.slug),
    ),
    plugOfficial: entries.filter(
      (entry) => entry.kind === "plug-official" && !isSpecialtyPlugSlug(entry.slug),
    ),
    plugCommunity: entries.filter((entry) => entry.kind === "plug-community"),
    rubelQuick: entries.filter((entry) => entry.kind === "rubel-quick"),
  };
}
