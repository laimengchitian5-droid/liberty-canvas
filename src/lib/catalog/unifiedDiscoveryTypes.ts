export type UnifiedDiscoveryKind =
  | "plug-official"
  | "plug-community"
  | "rubel-quick";

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
}

export function groupUnifiedDiscoveryCatalog(
  entries: readonly UnifiedDiscoveryEntry[],
): {
  plugOfficial: UnifiedDiscoveryEntry[];
  plugCommunity: UnifiedDiscoveryEntry[];
  rubelQuick: UnifiedDiscoveryEntry[];
} {
  return {
    plugOfficial: entries.filter((entry) => entry.kind === "plug-official"),
    plugCommunity: entries.filter((entry) => entry.kind === "plug-community"),
    rubelQuick: entries.filter((entry) => entry.kind === "rubel-quick"),
  };
}
