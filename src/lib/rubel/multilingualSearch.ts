import {
  expandQueryTokens,
  normalizeSearchToken,
  tokenMatchesCandidate,
} from "@/lib/rubel/i18n/constants";
import type { Diagnosis } from "@/types/rubel";
import type { SearchResult } from "@/types/rubel-i18n";

function scoreDiagnosisMatch(
  diagnosis: Diagnosis,
  queryTokens: Set<string>,
): { score: number; matchedTokens: string[] } {
  const candidates = [diagnosis.title, ...diagnosis.searchKeywords, diagnosis.language];

  const matchedTokens = new Set<string>();
  let score = 0;

  for (const candidate of candidates) {
    if (tokenMatchesCandidate(queryTokens, candidate)) {
      matchedTokens.add(normalizeSearchToken(candidate));
      score += candidate === diagnosis.title ? 3 : 1;
    }
  }

  for (const token of queryTokens) {
    if (normalizeSearchToken(diagnosis.title).includes(token)) {
      matchedTokens.add(token);
      score += 2;
    }
  }

  return { score, matchedTokens: Array.from(matchedTokens) };
}

/**
 * Mock frontend semantic search across multilingual diagnosis metadata.
 * Example: query "cat" surfaces Japanese title "あなたのネコ度診断".
 */
export function multilingualSearch(query: string, catalog: Diagnosis[]): SearchResult[] {
  const trimmed = query.trim();

  if (!trimmed) {
    return catalog.map((diagnosis) => ({
      diagnosisId: diagnosis.id,
      score: 0,
      matchedTokens: [],
      title: diagnosis.title,
      language: diagnosis.language,
    }));
  }

  const queryTokens = expandQueryTokens(trimmed);

  return catalog
    .map((diagnosis) => {
      const { score, matchedTokens } = scoreDiagnosisMatch(diagnosis, queryTokens);

      return {
        diagnosisId: diagnosis.id,
        score,
        matchedTokens,
        title: diagnosis.title,
        language: diagnosis.language,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);
}

export function filterDiagnosesBySearch(
  catalog: Diagnosis[],
  query: string,
): Diagnosis[] {
  const trimmed = query.trim();

  if (!trimmed) {
    return catalog;
  }

  const ranked = multilingualSearch(trimmed, catalog);
  const order = new Map(ranked.map((entry, index) => [entry.diagnosisId, index]));

  return ranked
    .map((entry) => catalog.find((diagnosis) => diagnosis.id === entry.diagnosisId))
    .filter((diagnosis): diagnosis is Diagnosis => Boolean(diagnosis))
    .sort((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0));
}
