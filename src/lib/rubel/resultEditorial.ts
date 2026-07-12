import type { Diagnosis, Result } from "@/types/rubel";

export interface ResultEditorial {
  tagline: string;
  strength: string;
  shareLine: string;
}

const DEFAULT_EDITORIAL: ResultEditorial = {
  tagline: "あなたらしさが、ここに凝縮されています。",
  strength: "自己理解と共感のバランス",
  shareLine: "Rubel Canvasで診断したら当たりすぎた…",
};

export function getResultEditorial(result: Result): ResultEditorial {
  const name = result.name;

  if (name.includes("猫") || name.toLowerCase().includes("cat")) {
    return {
      tagline: "マイペースだけど、心の奥はやわらかい。",
      strength: "独立心とセンスの良さ",
      shareLine: `Rubel Canvas：${name}だった🐱 当たりすぎ`,
    };
  }

  if (name.includes("犬") || name.toLowerCase().includes("dog")) {
    return {
      tagline: "人を大切にする、エネルギッシュなタイプ。",
      strength: "共感力と行動力",
      shareLine: `Rubel Canvas：${name}🐶 めっちゃ当たった`,
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
    shareLine: `Rubel Canvas：${name} — 当たりすぎ`,
  };
}

export function buildShareText(
  diagnosis: Diagnosis,
  result: Result,
): string {
  const editorial = getResultEditorial(result);
  return `${editorial.shareLine}\n${diagnosis.title}\nhttps://liberty-canvas.vercel.app/play/${diagnosis.id}`;
}
