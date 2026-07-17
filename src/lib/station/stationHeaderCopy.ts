import type { Locale } from "@/lib/i18n/config";

export interface StationHeaderCopy {
  readonly navLabel: string;
  readonly stationHub: string;
  readonly dashboard: string;
  readonly playHub: string;
  readonly homeAria: string;
  /** Immersive shell escape → central terminal */
  readonly backToTerminal: string;
  readonly backToTerminalAria: string;
}

const COPY_JA: StationHeaderCopy = {
  navLabel: "ステーション案内",
  stationHub: "診断ターミナル",
  dashboard: "マイ実績",
  playHub: "プレイルーム",
  homeAria: "Liberty Canvas ホーム",
  backToTerminal: "総合ターミナルへ戻る",
  backToTerminalAria: "診断総合ターミナルへ戻る",
};

const COPY_EN: StationHeaderCopy = {
  navLabel: "Station navigation",
  stationHub: "Terminal Hub",
  dashboard: "My Dashboard",
  playHub: "Playroom",
  homeAria: "Liberty Canvas home",
  backToTerminal: "Back to Terminal",
  backToTerminalAria: "Return to the central diagnostic terminal hub",
};

/** ja keeps Adult-Cute Japanese; all other locales use EN pack. */
export function resolveStationHeaderCopy(
  locale: Locale | string,
): StationHeaderCopy {
  return locale === "ja" ? COPY_JA : COPY_EN;
}
