import type { LocaleCode } from "@/types/rubel-i18n";

/**
 * Cross-lingual semantic clusters for mock multilingual search.
 * Any token in a cluster matches any other token in the same cluster.
 */
export const SEMANTIC_CLUSTERS: readonly (readonly string[])[] = [
  ["cat", "cats", "neko", "ネコ", "猫", "gato", "gatos", "feline", "kitten"],
  ["dog", "dogs", "inu", "犬", "perro", "perros", "puppy", "loyal"],
  ["introvert", "introverted", "内向", "introvertido", "shy", "quiet", "recharge"],
  ["burnout", "exhausted", "burn", "燃え尽き", "agotamiento", "stress", "overwork"],
  ["personality", "diagnosis", "quiz", "診断", "personalidad", "test", "タイプ"],
  ["party", "social", "gathering", "パーティ", "fiesta", "people"],
  ["work", "job", "office", "仕事", "trabajo", "remote"],
  ["weekend", "weekends", "週末", "fin de semana", "saturday"],
  ["praise", "compliment", "褒め", "elogio", "validation"],
  ["mistake", "error", "失敗", "error", "perfectionist"],
] as const;

export function normalizeSearchToken(value: string): string {
  return value.trim().toLowerCase();
}

export function expandQueryTokens(query: string): Set<string> {
  const rawTokens = query
    .split(/[\s,、。]+/)
    .map(normalizeSearchToken)
    .filter((token) => token.length > 0);

  const expanded = new Set<string>();

  for (const token of rawTokens) {
    expanded.add(token);

    for (const cluster of SEMANTIC_CLUSTERS) {
      const normalizedCluster = cluster.map(normalizeSearchToken);

      if (
        normalizedCluster.some((entry) => entry.includes(token) || token.includes(entry))
      ) {
        for (const clusterToken of normalizedCluster) {
          expanded.add(clusterToken);
        }
      }
    }
  }

  return expanded;
}

export function tokenMatchesCandidate(
  queryTokens: Set<string>,
  candidate: string,
): boolean {
  const normalized = normalizeSearchToken(candidate);

  if (queryTokens.has(normalized)) {
    return true;
  }

  for (const token of queryTokens) {
    if (normalized.includes(token) || token.includes(normalized)) {
      return true;
    }
  }

  return false;
}

export function inferCrossLingualKeywords(title: string, language: LocaleCode): string[] {
  const keywords = new Set<string>();
  const titleTokens = title.split(/[\s、。]+/).map(normalizeSearchToken);

  for (const token of titleTokens) {
    if (token.length > 0) {
      keywords.add(token);
    }
  }

  keywords.add(language);

  for (const cluster of SEMANTIC_CLUSTERS) {
    const normalizedCluster = cluster.map(normalizeSearchToken);
    const hit = normalizedCluster.some((entry) =>
      titleTokens.some((token) => entry.includes(token) || token.includes(entry)),
    );

    if (hit) {
      for (const clusterToken of normalizedCluster) {
        keywords.add(clusterToken);
      }
    }
  }

  return Array.from(keywords);
}

export function buildGlobalReachLabel(language: LocaleCode): string {
  const reachMap: Record<LocaleCode, string> = {
    en: "Tokyo · New York · London",
    ja: "東京 · ニューヨーク · ロンドン",
    es: "Tokio · Nueva York · Londres",
    ko: "도쿄 · 뉴욕 · 런던",
    fr: "Tokyo · New York · Londres",
  };

  return reachMap[language];
}
