export const SEARCH_INTENTS = [
  "informational",
  "navigational",
  "commercial",
  "transactional",
] as const;

export type SearchIntent = (typeof SEARCH_INTENTS)[number];

/** Synonym expansion for hybrid token search (no external embedding API). */
export const SEMANTIC_SYNONYMS: Readonly<Record<string, readonly string[]>> = {
  love: ["romance", "恋愛", "ラブ", "love", "恋"],
  cat: ["neko", "ネコ", "猫", "cat"],
  personality: ["性格", "personality", "16", "mbti", "spectrum"],
  big: ["big", "five", "ocean", "big-five", "ffm", "5因子"],
  enneagram: ["enneagram", "エニアグラム", "motivation", "9型"],
  introvert: ["introvert", "内向", "intro", "ひとり"],
  burnout: ["burnout", "燃え尽き", "疲労", "stress"],
  oshikatsu: ["推し", "oshikatsu", "推し活", "fandom"],
  genz: ["genz", "z世代", "tiktok"],
  cosmic: ["宇宙", "cosmic", "planet", "星"],
  free: ["無料", "free", "no-login"],
};

export function expandSemanticTokens(query: string): Set<string> {
  const tokens = new Set<string>();
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return tokens;
  }

  tokens.add(normalized);

  for (const part of normalized.split(/\s+/)) {
    tokens.add(part);
  }

  for (const [key, synonyms] of Object.entries(SEMANTIC_SYNONYMS)) {
    const hit = synonyms.some(
      (synonym) =>
        normalized.includes(synonym.toLowerCase()) ||
        [...tokens].some((token) => synonym.toLowerCase().includes(token)),
    );

    if (hit) {
      tokens.add(key);
      for (const synonym of synonyms) {
        tokens.add(synonym.toLowerCase());
      }
    }
  }

  return tokens;
}

export function inferQueryIntent(query: string): SearchIntent {
  const q = query.trim().toLowerCase();

  if (!q) {
    return "navigational";
  }

  if (
    /(診断|test|quiz|play|開始|start|try|無料|free)/i.test(q)
  ) {
    return "transactional";
  }

  if (
    /(16personalities|mbti|big five|enneagram|alternative|比較|vs)/i.test(q)
  ) {
    return "commercial";
  }

  if (/(liberty|liberty-canvas|ルベル|rubel|discover|公式)/i.test(q)) {
    return "navigational";
  }

  return "informational";
}

export function intentRankBoost(
  entryIntent: SearchIntent | undefined,
  queryIntent: SearchIntent,
  kind: "plug-official" | "plug-community" | "rubel-quick",
): number {
  let boost = 0;

  if (entryIntent === queryIntent) {
    boost += 2;
  }

  if (queryIntent === "transactional" && kind === "plug-official") {
    boost += 2;
  }

  if (queryIntent === "commercial" && kind === "plug-official") {
    boost += 1;
  }

  if (queryIntent === "transactional" && kind === "rubel-quick") {
    boost += 1;
  }

  return boost;
}

export function buildSearchRef(slug: string): string {
  return `search-${slug}`;
}

export function appendSearchRefToHref(href: string, slug: string): string {
  const ref = buildSearchRef(slug);
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}ref=${encodeURIComponent(ref)}`;
}
