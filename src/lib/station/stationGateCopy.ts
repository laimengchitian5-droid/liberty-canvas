import type { Locale } from "@/lib/i18n/config";

export function buildStationDisclaimer(
  lineName: string,
  locale: Locale,
): string {
  if (locale === "ja") {
    return `【権利者様への中立な案内】本枠は「${lineName}」公式サイトへの乗り換え案内です。Liberty Canvas は独立したポータルであり、当該サービスの運営・提携・公式認定ではありません。新しいタブで公式の https ページを開きます。`;
  }

  return `[Independent directory notice] This gate links to the official “${lineName}” site. Liberty Canvas is an independent hub and is not affiliated with, operated by, or endorsed by that entity. Opens an external https page in a new tab.`;
}

export function buildStationCtaLabel(locale: Locale): string {
  return locale === "ja" ? "公式の診断テストへ乗車する" : "Board the official test";
}

export function buildLibertyCtaLabel(locale: Locale): string {
  return locale === "ja"
    ? "Liberty 内の特設スタジオで体験する"
    : "Experience in Liberty Studio";
}

/** Fail-closed: only https absolute URLs. Never return "#" (false affordance). */
export function toSafeExternalHref(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}
