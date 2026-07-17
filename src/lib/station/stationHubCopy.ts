import type { Locale } from "@/lib/i18n/config";

export interface StationHubCopy {
  readonly hubTitle: string;
  readonly hubSubtitle: string;
  readonly dashLink: string;
  readonly gateTitle: string;
  readonly statusCleared: string;
  readonly statusReady: string;
  readonly gateCta: string;
  readonly studioCta: string;
  readonly linesBadge: (cleared: number, total: number) => string;
}

const COPY_JA: StationHubCopy = {
  hubTitle: "リバティ・セントラル・ターミナル",
  hubSubtitle:
    "世界中の15大性格診断・バイラルアトラクションへ繋がる、パブリック中央総合ホームです。",
  dashLink: "あなたの『自己分析マイページ・総合ダッシュボード』へ乗り換える",
  gateTitle: "発車プラットフォーム一覧（全15路線）",
  statusCleared: "走破済み",
  statusReady: "未乗車",
  gateCta: "改札口（案内）へ",
  studioCta: "スタジオ体験",
  linesBadge: (cleared, total) => `${cleared} / ${total} Lines`,
};

const COPY_EN: StationHubCopy = {
  hubTitle: "Liberty Central Grand Terminal",
  hubSubtitle:
    "A public hub connecting you to 15 global diagnostics and first-party studio experiences.",
  dashLink: "Transfer to your identity dashboard",
  gateTitle: "Departure platforms (15 global lines)",
  statusCleared: "Cleared",
  statusReady: "Ready",
  gateCta: "Transit gate",
  studioCta: "Studio experience",
  linesBadge: (cleared, total) => `${cleared} / ${total} Lines`,
};

/** ja keeps Adult-Cute Japanese; all other locales use EN pack. */
export function resolveStationHubCopy(locale: Locale | string): StationHubCopy {
  return locale === "ja" ? COPY_JA : COPY_EN;
}
