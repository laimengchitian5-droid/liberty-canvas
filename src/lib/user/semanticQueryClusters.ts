import type { Locale } from "@/lib/i18n/config";

export const SEMANTIC_QUERY_CLUSTER_IDS = {
  rubelCanvasJa: "rubel-canvas-ja",
  libertyCanvasEn: "liberty-canvas-en",
  sixteenPersonalitiesAlt: "16personalities-free-alternative",
  allAffirmingChatJa: "all-affirming-ai-chat-ja",
  selfEsteemDiagnosisJa: "self-esteem-diagnosis-ja",
} as const;

export type SemanticQueryClusterId =
  (typeof SEMANTIC_QUERY_CLUSTER_IDS)[keyof typeof SEMANTIC_QUERY_CLUSTER_IDS];

export interface SemanticQueryCluster {
  id: SemanticQueryClusterId;
  primaryQuery: string;
  alternateQueries: readonly string[];
  locales: readonly Locale[];
  title: string;
  description: string;
  keywords: readonly string[];
  landingPath: string;
}

export const SEMANTIC_QUERY_CLUSTERS: readonly SemanticQueryCluster[] = [
  {
    id: SEMANTIC_QUERY_CLUSTER_IDS.rubelCanvasJa,
    primaryQuery: "ルベルキャンバス",
    alternateQueries: ["ルベル キャンバス", "Rubel Canvas 日本語"],
    locales: ["ja"],
    title: "ルベルキャンバス — 無料AI性格診断",
    description:
      "ルベルキャンバスで、やさしい性格診断と全肯定AIチャットをログイン不要で体験できます。",
    keywords: ["ルベルキャンバス", "AI性格診断", "無料", "全肯定"],
    landingPath: "/",
  },
  {
    id: SEMANTIC_QUERY_CLUSTER_IDS.libertyCanvasEn,
    primaryQuery: "liberty canvas",
    alternateQueries: ["Liberty Canvas", "liberty-canvas"],
    locales: ["en"],
    title: "Liberty Canvas — Free AI Personality Workspace",
    description:
      "Liberty Canvas (Rubel Canvas) offers empathetic personality tests and all-affirming AI chat with no login required.",
    keywords: ["liberty canvas", "personality test", "AI chat", "free"],
    landingPath: "/",
  },
  {
    id: SEMANTIC_QUERY_CLUSTER_IDS.sixteenPersonalitiesAlt,
    primaryQuery: "16personalities free alternative",
    alternateQueries: [
      "16 personalities free alternative",
      "16personalities 無料 代替",
    ],
    locales: ["en", "ja"],
    title: "16Personalities Free Alternative — Rubel Canvas",
    description:
      "A warm, inclusive 16Personalities-style experience with instant results and affirming AI follow-up chat.",
    keywords: [
      "personality test free",
      "personality test",
      "性格診断 無料",
      "パーソナリティ診断",
    ],
    landingPath: "/diagnosis/play/personality-spectrum",
  },
  {
    id: SEMANTIC_QUERY_CLUSTER_IDS.allAffirmingChatJa,
    primaryQuery: "全肯定 AI チャット",
    alternateQueries: ["全肯定AI", "肯定感 AI チャット"],
    locales: ["ja"],
    title: "全肯定 AI チャット — Rubel Canvas",
    description:
      "診断結果に合わせた、やさしく全肯定のAIチャット。自己否定の声をそっと受け止めます。",
    keywords: ["全肯定 AI チャット", "AI チャット", "自己肯定感", "性格診断"],
    landingPath: "/diagnosis",
  },
  {
    id: SEMANTIC_QUERY_CLUSTER_IDS.selfEsteemDiagnosisJa,
    primaryQuery: "自己肯定感 上げる 診断",
    alternateQueries: ["自己肯定感 診断", "自信 診断 無料"],
    locales: ["ja"],
    title: "自己肯定感を上げる診断 — Rubel Canvas",
    description:
      "やさしい質問で自分らしさを見つけ、全肯定メッセージで自己肯定感を育てる診断体験。",
    keywords: [
      "自己肯定感 上げる 診断",
      "自己肯定感 診断",
      "性格診断",
      "メンタルケア",
    ],
    landingPath: "/diagnosis",
  },
] as const;

export function resolveSemanticClustersForLocale(
  locale: Locale,
): SemanticQueryCluster[] {
  return SEMANTIC_QUERY_CLUSTERS.filter((cluster) =>
    cluster.locales.includes(locale),
  );
}

export function resolvePrimaryClusterForPath(
  landingPath: string,
  locale: Locale,
): SemanticQueryCluster | null {
  const normalizedPath = landingPath === "" ? "/" : landingPath;

  return (
    SEMANTIC_QUERY_CLUSTERS.find(
      (cluster) =>
        cluster.landingPath === normalizedPath &&
        cluster.locales.includes(locale),
    ) ?? null
  );
}
