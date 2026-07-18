import type { Locale } from "@/lib/i18n/config";
import {
  CONDUCTOR_EXPRESS_SLUGS,
  type ConductorExpressSlug,
} from "@/types/conductor";

export { CONDUCTOR_EXPRESS_SLUGS, isConductorExpressSlug } from "@/types/conductor";
export type { ConductorExpressSlug as ConductorExpressLineId } from "@/types/conductor";

/** @deprecated Use CONDUCTOR_EXPRESS_SLUGS */
export const PLUG_DIAGNOSIS_SLUGS = CONDUCTOR_EXPRESS_SLUGS;

interface ExpressLineCopy {
  readonly name: string;
  readonly cta: string;
}

const LINE_COPY: Record<
  ConductorExpressSlug,
  Readonly<Partial<Record<Locale, ExpressLineCopy>> & { en: ExpressLineCopy }>
> = {
  "personality-spectrum": {
    en: {
      name: "Personality Spectrum Express",
      cta: "Board the authentic spectrum test →",
    },
    ja: {
      name: "性格スペクトル特急",
      cta: "本線の無料診断へ改札する →",
    },
    ko: {
      name: "성격 스펙트럼 특급",
      cta: "본선 무료 검사로 이동 →",
    },
    zh: {
      name: "性格光谱特快",
      cta: "前往正式免费测试 →",
    },
  },
  "big-five": {
    en: {
      name: "Big Five Science Local",
      cta: "Board the OCEAN science line →",
    },
    ja: {
      name: "ビッグファイブ科学各停",
      cta: "OCEAN 本線診断へ →",
    },
  },
  "motivation-spectrum": {
    en: {
      name: "Motivation Spectrum Express",
      cta: "Board the motivation pattern line →",
    },
    ja: {
      name: "動機スペクトル特急",
      cta: "動機パターン本線へ →",
    },
  },
  oshikatsu: {
    en: {
      name: "Passion Craft Express",
      cta: "Board the passion-craft line →",
    },
    ja: {
      name: "推し活クラフト特急",
      cta: "情熱クラフト本線へ →",
    },
  },
  romance: {
    en: {
      name: "Bond Resonance Express",
      cta: "Board the bond-resonance line →",
    },
    ja: {
      name: "絆レゾナンス特急",
      cta: "絆の本線診断へ →",
    },
  },
  genz: {
    en: {
      name: "Cosmic Shadow Express",
      cta: "Board the cosmic shadow line →",
    },
    ja: {
      name: "宇宙シャドウ特急",
      cta: "宇宙シャドウ本線へ →",
    },
  },
};

export function resolveExpressLineCopy(
  lineId: ConductorExpressSlug,
  locale: Locale,
): ExpressLineCopy {
  const table = LINE_COPY[lineId];
  return table[locale] ?? table.en;
}

export function buildConductorCtaHref(
  lineId: ConductorExpressSlug,
  locale: Locale,
): string {
  const params = new URLSearchParams({
    lang: locale,
    ref: "identity-conductor",
  });
  return `/diagnosis/play/${lineId}?${params.toString()}`;
}
