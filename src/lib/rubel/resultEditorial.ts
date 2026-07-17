import type { Diagnosis, Result } from "@/types/rubel";
import { getBrand } from "@/lib/brand/registry";
import { buildPlayResultOgImageUrl } from "@/lib/seo/ogUrls";
import { getSiteUrl } from "@/lib/site/url";

export interface ResultEditorial {
  tagline: string;
  strength: string;
  shareLine: string;
}

const PLAY_BRAND = getBrand("liberty-play").nameJa;

const DEFAULT_EDITORIAL: ResultEditorial = {
  tagline: "あなたらしさが、ここに凝縮されています。",
  strength: "自己理解と共感のバランス",
  shareLine: `${PLAY_BRAND}で診断したら当たりすぎた…`,
};

export function getResultEditorial(result: Result): ResultEditorial {
  const name = result.name;

  if (name.includes("猫") || name.toLowerCase().includes("cat")) {
    return {
      tagline: "マイペースだけど、心の奥はやわらかい。",
      strength: "独立心とセンスの良さ",
      shareLine: `${PLAY_BRAND}：${name}だった🐱 当たりすぎ`,
    };
  }

  if (name.includes("犬") || name.toLowerCase().includes("dog")) {
    return {
      tagline: "人を大切にする、エネルギッシュなタイプ。",
      strength: "共感力と行動力",
      shareLine: `${PLAY_BRAND}：${name}🐶 めっちゃ当たった`,
    };
  }

  if (name.includes("内向") || name.toLowerCase().includes("introvert")) {
    return {
      tagline: "静かな観察眼が、深い洞察を生む。",
      strength: "内省と集中力",
      shareLine: `16P級に当たる…${name}でした`,
    };
  }

  return {
    ...DEFAULT_EDITORIAL,
    shareLine: `${PLAY_BRAND}：${name} — 当たりすぎ`,
  };
}

/** Shareable result deep link — crawlers resolve OG via ?r= */
export function buildPlayResultShareUrl(diagnosis: Diagnosis, result: Result): string {
  const params = new URLSearchParams({ r: result.name.slice(0, 80) });
  return `${getSiteUrl()}/play/${encodeURIComponent(diagnosis.id)}?${params.toString()}`;
}

export function buildShareText(diagnosis: Diagnosis, result: Result): string {
  const editorial = getResultEditorial(result);
  const shareUrl = buildPlayResultShareUrl(diagnosis, result);
  return `${editorial.shareLine}\n${diagnosis.title}\n${shareUrl}`;
}

export function buildPlayResultSharePayload(
  diagnosis: Diagnosis,
  result: Result,
): { title: string; text: string; url: string; ogImageUrl: string } {
  const editorial = getResultEditorial(result);
  const url = buildPlayResultShareUrl(diagnosis, result);
  return {
    title: `${result.name} — ${diagnosis.title}`,
    text: buildShareText(diagnosis, result),
    url,
    ogImageUrl: buildPlayResultOgImageUrl(
      result.name,
      `${diagnosis.title} · ${editorial.tagline}`,
    ),
  };
}
