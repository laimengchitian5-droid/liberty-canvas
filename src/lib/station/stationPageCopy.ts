import type { Locale } from "@/lib/i18n/config";

export interface StationPageCopy {
  readonly welcome: string;
  readonly sub: string;
  readonly internalNav: string;
}

const COPY: Readonly<Record<"ja" | "en", StationPageCopy>> = {
  ja: {
    welcome: "自己分析の旅へ、出発進行！",
    sub: "世界で親しまれる診断テストへの特設『乗り換え改札口』です。エンタメの自己理解として、公式サイトへ安全にご案内します。",
    internalNav: "Liberty Canvas の診断一覧へ戻る",
  },
  en: {
    welcome: "Ready for your inner journey?",
    sub: "Your premium transit gate to a widely loved personality test — entertainment self-insight only, with a safe link to the official site.",
    internalNav: "Back to Liberty Canvas play hub",
  },
};

export function resolveStationPageCopy(locale: Locale): StationPageCopy {
  return locale === "ja" ? COPY.ja : COPY.en;
}
