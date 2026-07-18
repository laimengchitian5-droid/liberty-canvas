import { BRAND_LANDING_SLUG } from "@/lib/landing/brandLandingSlug";
import type { LandingFaqItem, LandingPageCopy } from "@/lib/landing/landingCopy";
import type { LandingTopicSlug } from "@/lib/landing/landingTopics";

/** Google FAQ rich results stay healthy around 2–6 Q&As. */
const MAX_FAQ_ITEMS = 6;

/**
 * Phase 8B — JA long-tail FAQ depth for GSC-hot themes.
 * Append-only, deduped by question; never invents review stars.
 */
const JA_SEO_DEPTH_FAQ: Partial<Record<LandingTopicSlug, readonly LandingFaqItem[]>> = {
  "enneagram-nine-types": [
    {
      question: "9タイプ系の無料診断と何が違いますか？",
      answer:
        "商標の類型名は使いません。学術寄りの動機パターンを Liberty 独自の動機スペクトルにマッピングする無料診断です。",
    },
    {
      question: "何分くらいで終わりますか？",
      answer: "インテークは1回答から始められ、本編はスマホで数分程度が目安です。",
    },
    {
      question: "結果はシェアできますか？",
      answer: "はい。宇宙キャラ結果カードをSNS向けに共有できます（個人情報の入力は不要です）。",
    },
  ],
  "big-five-ocean": [
    {
      question: "OCEAN（ビッグファイブ）は学術的ですか？",
      answer:
        "ビッグファイブは心理学で広く参照される5因子モデルです。当サービスは臨床検査ではなく、自己理解向けの高速マッピングです。",
    },
    {
      question: "ドイツ語の Persönlichkeitstest にも対応していますか？",
      answer:
        "Discover にドイツ語ランディングがあります。本編UIは言語設定に追従し、診断本文は順次ローカライズしています。",
    },
  ],
  "shadow-self-archetype": [
    {
      question: "シャドウ（ユング）の自己診断ですか？",
      answer:
        "ユング心理学に着想したシャドウ／影のテーマを、Gen-Z 宇宙キャラ診断へつなぐエンタメ自己理解です。臨床治療ではありません。",
    },
    {
      question: "怖い結果が出ませんか？",
      answer:
        "否定やレッテル貼りはしません。隠れたパターンをやさしく言語化し、全肯定チャットへつなぎます。",
    },
  ],
  "mbti-personality-types": [
    {
      question: "公式のタイプ検査ですか？",
      answer:
        "いいえ。商標の4文字型は使いません。学術5因子と Liberty 独自の性格スペクトルで、無料の性格タイプ体験を提供します。",
    },
    {
      question: "英語検索から来ても大丈夫？",
      answer:
        "英語ランディングから同じ本編へ進めます。UI言語はページの言語設定に追従します。",
    },
  ],
  "inner-child-healing": [
    {
      question: "インナーチャイルド診断は誰向けですか？",
      answer:
        "自分を責めがちな方の、やさしい自己理解向けです。治療やカウンセリングの代替ではありません。",
    },
  ],
  [BRAND_LANDING_SLUG]: [
    {
      question: "libertycanvas で検索すると何が見つかりますか？",
      answer:
        "リバティ・キャンバス公式の紹介・使い方と、無料AI性格診断への入口です。偽サイトではありません。",
    },
  ],
};

function mergeFaq(
  base: readonly LandingFaqItem[],
  extra: readonly LandingFaqItem[],
): LandingFaqItem[] {
  const seen = new Set<string>();
  const out: LandingFaqItem[] = [];

  for (const item of [...base, ...extra]) {
    const key = item.question.trim();
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(item);
    if (out.length >= MAX_FAQ_ITEMS) {
      break;
    }
  }

  return out;
}

export function applyJaSeoDepthPack(
  slug: LandingTopicSlug,
  locale: string,
  copy: LandingPageCopy,
): LandingPageCopy {
  if (locale !== "ja") {
    return copy;
  }

  const extra = JA_SEO_DEPTH_FAQ[slug];
  if (!extra || extra.length === 0) {
    return copy;
  }

  return {
    ...copy,
    faq: mergeFaq(copy.faq, extra),
  };
}
