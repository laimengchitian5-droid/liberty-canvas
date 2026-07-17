import type { Locale } from "@/lib/i18n/config";

export interface StationDashboardCopy {
  readonly title: string;
  readonly subtitle: string;
  readonly progress: string;
  readonly statusEmpty: string;
  readonly historyTitle: string;
  readonly matrixTitle: string;
  readonly boardedProof: string;
  readonly openStation: string;
}

const COPY_JA: StationDashboardCopy = {
  title: "あなたの自己分析ターミナル",
  subtitle: "世界中の診断を巡った、あなただけの心の乗車履歴です。",
  progress: "全路線コンプリート率",
  statusEmpty: "まだ乗車履歴がありません。改札口から診断の旅へ出発しましょう。",
  historyTitle: "走破済みの路線スタンプ",
  matrixTitle: "蓄積された特質マトリクス",
  boardedProof: "乗車証明",
  openStation: "駅へ行く",
};

const COPY_EN: StationDashboardCopy = {
  title: "Your Identity Terminal",
  subtitle:
    "A gentle map of routes you have boarded across global diagnostic hubs.",
  progress: "Total route completion",
  statusEmpty:
    "No boarding history yet. Pass through a station gate to begin.",
  historyTitle: "Cleared route stamps",
  matrixTitle: "Accumulated trait matrix",
  boardedProof: "Boarded",
  openStation: "Open station",
};

/** ja keeps Adult-Cute Japanese; all other locales use EN pack (station SEO parity). */
export function resolveStationDashboardCopy(
  locale: Locale | string,
): StationDashboardCopy {
  return locale === "ja" ? COPY_JA : COPY_EN;
}
