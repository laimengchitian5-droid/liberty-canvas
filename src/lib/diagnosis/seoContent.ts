import type { PersonalityCategory } from "@/types/diagnosis";
import { DIAGNOSTIC_QUESTION_COUNT } from "@/types/diagnosis";
import { DIAGNOSIS_RESULT_CATALOG } from "@/lib/diagnosis/resultCatalog";

export const DIAGNOSIS_FAQ = [
  {
    question: "心の色診断とは何ですか？",
    answer: `LibertyCanvas の心の色診断は、${DIAGNOSTIC_QUESTION_COUNT}問のやさしい多肢選択から、共感・論理・感性・導きの4軸であなたの傾向を見つける無料の性格診断です。結果に応じて AI がパーソナルアドバイスをストリーム配信します。`,
  },
  {
    question: "所要時間はどのくらいですか？",
    answer: `通常60秒〜90秒程度です。${DIAGNOSTIC_QUESTION_COUNT}問に答えるだけで結果が表示され、希望すれば AI アドバイスまで続けられます。`,
  },
  {
    question: "正解や不正解はありますか？",
    answer:
      "ありません。直感で選んでください。すべての選択肢は、あなたらしさを映すための設計です。",
  },
  {
    question: "結果はシェアできますか？",
    answer:
      "はい。結果画面から X・LINE 向けの文面コピー、リンク共有、印刷が可能です。タイプ別の OG 画像付き URL も用意しています。",
  },
  {
    question: "占いや運勢判定ですか？",
    answer:
      "いいえ。選択肢に紐づくスコアを加算する決定論的なロジックでタイプを判定します。AI は結果を踏まえたアドバイス生成に使われます。",
  },
] as const;

export const DIAGNOSIS_TYPE_EDITORIAL: Record<
  PersonalityCategory,
  { overview: string; strengths: string[]; whenToShine: string }
> = {
  empathy: {
    overview:
      "やさしい調和タイプは、場の空気や相手の感情の変化を繊細に感じ取り、関係性の安心を優先する傾向があります。論争よりも理解、効率よりも寄り添いを選びやすいタイプです。",
    strengths: [
      "相手の本音をやわらかく引き出す聴き方",
      "チームの温度差をならす調整力",
      "信頼関係を長く育てる安定感",
    ],
    whenToShine:
      "相談役、ファシリテーション、接客・教育・ケアの場面で、あなたの「共感」は周囲の支えになります。",
  },
  logic: {
    overview:
      "静かな明晰タイプは、情報を整理し、本質を見抜く力に優れます。感情に流されず、根拠と構造を大切にするため、迷いの多い状況で道筋を示せます。",
    strengths: [
      "複雑な問題の分解と優先順位づけ",
      "冷静な分析に基づく提案",
      "再現性のある判断",
    ],
    whenToShine:
      "研究、企画、データ整理、学習設計など「考える時間」が求められる場面で力を発揮します。",
  },
  creativity: {
    overview:
      "感性の開花タイプは、固定観念にとらわれず、新しい視点や表現を生み出す力があります。日常の中の小さな美しさや違和感に気づき、柔らかな発想で世界を更新します。",
    strengths: [
      "独自の視点からのアイデア提案",
      "感性を言語化する表現力",
      "退屈な状況を楽しさに変える発想",
    ],
    whenToShine:
      "デザイン、ライティング、企画、SNS 発信など、創造性が評価される場面で輝きます。",
  },
  leadership: {
    overview:
      "凛とした導きタイプは、決断力と配慮を両立させ、周囲を無理なく前に進める力を持ちます。押し付けではなく信頼で人を動かし、静かな自信で道を照らします。",
    strengths: [
      "目的に向けた実行計画の立案",
      "役割分担と進行管理",
      "困難な場面での冷静な決断",
    ],
    whenToShine:
      "プロジェクト推進、イベント運営、チームリードなど、前に進める役割で力を発揮します。",
  },
};

export function buildDiagnosisFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DIAGNOSIS_FAQ.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function buildDiagnosisLandingQuizJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "心の色診断",
    description: `${DIAGNOSTIC_QUESTION_COUNT}問の多肢選択で4タイプを判定する、LibertyCanvas 無料性格診断。`,
    inLanguage: "ja",
    numberOfQuestions: DIAGNOSTIC_QUESTION_COUNT,
    educationalLevel: "General",
    about: Object.values(DIAGNOSIS_RESULT_CATALOG).map((result) => ({
      "@type": "Thing",
      name: result.title,
      description: result.subtitle,
    })),
  };
}
