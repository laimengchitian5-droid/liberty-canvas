import type { Locale } from "@/lib/i18n/config";

export interface StationPageCopy {
  readonly welcome: string;
  readonly sub: string;
  readonly internalNav: string;
}

/**
 * Page chrome copy (ja / EN fallback). CTA + disclaimer live in stationGateCopy.
 *
 * Rejected sketch defects:
 * - inline fr/LLM dictionaries on the page
 * - "197 countries" packs
 * - welcome without sanitized lineName
 */
export function resolveStationPageCopy(
  locale: Locale | string,
  lineName: string,
): StationPageCopy {
  const safeName = lineName.trim();

  if (locale === "ja") {
    return {
      welcome: safeName ? `${safeName} へようこそ` : "改札口へようこそ",
      sub: "世界中で愛される診断テストへご案内する、特設の『乗り換え改札口』です。エンタメの自己理解として、公式サイトへ安全にご案内します。",
      internalNav: "セントラル・ターミナルへ戻る",
    };
  }

  return {
    welcome: safeName
      ? `Welcome to ${safeName} Station`
      : "Welcome to this Station",
    sub: "Your transit gate to a widely loved personality test — entertainment self-insight only, with a safe link to the official site.",
    internalNav: "Back to Central Terminal",
  };
}
