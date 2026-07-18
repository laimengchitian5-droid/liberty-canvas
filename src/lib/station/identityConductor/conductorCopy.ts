import type { Locale } from "@/lib/i18n/config";
import { resolveExpressLineCopy } from "@/lib/station/identityConductor/expressLines";
import type { ConductorExpressSlug } from "@/types/conductor";

export interface ConductorSurfaceCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly question: string;
  readonly placeholder: string;
  readonly submitLabel: string;
  readonly submittingLabel: string;
  readonly errorLabel: string;
}

const SURFACE: Record<
  Locale,
  ConductorSurfaceCopy | undefined
> & { en: ConductorSurfaceCopy; ja: ConductorSurfaceCopy } = {
  en: {
    eyebrow: "Identity Hub Conductor · 10-second pre-screen",
    title: "One soft question before you board",
    question:
      "Right now, what color is the air around your emotional energy at work — warm amber, cool silver, or something quieter?",
    placeholder: "e.g. Warm amber, but a little tired behind the smile…",
    submitLabel: "Capture my frequency →",
    submittingLabel: "Reading the matrix…",
    errorLabel: "Please share a short vibe in your own words.",
  },
  ja: {
    eyebrow: "Identity Hub Conductor · 10秒プレ診断",
    title: "発車前に、ひとつだけ聞かせてください",
    question:
      "いま職場や日常の空気のなかで、あなたの心のエネルギーはどんな色に近いですか？ — やさしい琥珀、静かな銀、それとも別のニュアンス？",
    placeholder: "例：琥珀だけど、笑顔の奥が少しお疲れ気味…",
    submitLabel: "周波数を読み取る →",
    submittingLabel: "マトリクスを解析中…",
    errorLabel: "いまの気配を、短い言葉で教えてください。",
  },
  ko: {
    eyebrow: "Identity Hub Conductor · 10초 프리스크린",
    title: "탑승 전, 질문 하나만",
    question:
      "지금 일터의 공기 속에서, 당신의 감정 에너지는 어떤 색에 가깝나요 — 따뜻한 호박, 차가운 은빛, 아니면 더 고요한 톤?",
    placeholder: "예: 따뜻한 호박인데, 미소 뒤가 조금 피곤해요…",
    submitLabel: "주파수 읽기 →",
    submittingLabel: "매트릭스 분석 중…",
    errorLabel: "짧은 느낌으로 알려 주세요.",
  },
  zh: {
    eyebrow: "Identity Hub Conductor · 10 秒预筛",
    title: "上车前，只问一句",
    question:
      "此刻工作氛围里，你的情绪能量更接近什么颜色 — 温暖琥珀、冷静银灰，还是更安静的层次？",
    placeholder: "例如：温暖琥珀，但笑容背后有点疲惫…",
    submitLabel: "读取频率 →",
    submittingLabel: "正在解析矩阵…",
    errorLabel: "请用简短的话描述当下的感觉。",
  },
  fr: undefined,
  de: undefined,
  ar: undefined,
  he: undefined,
};

export function resolveConductorSurfaceCopy(locale: Locale): ConductorSurfaceCopy {
  return SURFACE[locale] ?? SURFACE.en;
}

export function buildFallbackTeaser(
  locale: Locale,
  answer: string,
  lineId: ConductorExpressSlug,
): { acknowledge: string; teaser: string } {
  const line = resolveExpressLineCopy(lineId, locale);
  const snippet = answer.trim().slice(0, 42);

  if (locale === "ja") {
    return {
      acknowledge: `「${snippet}${answer.trim().length > 42 ? "…" : ""}」——その気配、とてもあなたらしい周波数です。`,
      teaser: `潜在マトリクスには、まだ言葉になっていない強い隠れトーンが映っています。いま乗るべきは「${line.name}」。本線で丁寧に解きほぐしましょう。`,
    };
  }

  if (locale === "ko") {
    return {
      acknowledge: `"${snippet}" — 그 분위기, 당신다운 주파수예요.`,
      teaser: `잠재 매트릭스에 숨은 강한 주파수가 보입니다. 지금 타야 할 노선은 「${line.name}」입니다.`,
    };
  }

  if (locale === "zh") {
    return {
      acknowledge: `「${snippet}」——这股气场，很像你的频率。`,
      teaser: `潜意识矩阵里有一股尚未命名的强信号。此刻请搭乘「${line.name}」。`,
    };
  }

  return {
    acknowledge: `"${snippet}" — that vibe carries a refined frequency that feels unmistakably yours.`,
    teaser: `Your sub-conscious matrix shows a powerful hidden frequency. Board the "${line.name}" for the authentic reading.`,
  };
}
