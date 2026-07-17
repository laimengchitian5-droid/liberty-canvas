import type { Locale } from "@/lib/i18n/config";

export interface StationHeaderCopy {
  readonly navLabel: string;
  readonly stationHub: string;
  readonly dashboard: string;
  readonly playHub: string;
  readonly homeAria: string;
}

const COPY_JA: StationHeaderCopy = {
  navLabel: "ステーション案内",
  stationHub: "診断総合ターミナル",
  dashboard: "総合ダッシュボード",
  playHub: "プレイ一覧",
  homeAria: "Liberty Canvas ホーム",
};

const COPY_EN: StationHeaderCopy = {
  navLabel: "Station navigation",
  stationHub: "Central Terminal",
  dashboard: "Identity Dashboard",
  playHub: "Play hub",
  homeAria: "Liberty Canvas home",
};

/** ja keeps Adult-Cute Japanese; all other locales use EN pack. */
export function resolveStationHeaderCopy(
  locale: Locale | string,
): StationHeaderCopy {
  return locale === "ja" ? COPY_JA : COPY_EN;
}
