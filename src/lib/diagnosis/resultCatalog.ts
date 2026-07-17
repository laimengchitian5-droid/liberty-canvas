import type { DiagnosisResult, PersonalityCategory } from "@/types/diagnosis";

export const DIAGNOSIS_RESULT_CATALOG: Record<PersonalityCategory, DiagnosisResult> = {
  empathy: {
    id: "empathy-harmonizer",
    dominantCategory: "empathy",
    title: "やさしい調和タイプ",
    subtitle: "心の温度で、場をあたためる存在",
    baseAnalysis:
      "あなたは相手の感情の変化に敏感で、言葉の裏にある本音をやさしく受け止める力があります。論よりも共感を選び、関係性の安心感を大切にする傾向が強いタイプです。",
    themeColor: "#C9A09A",
  },
  logic: {
    id: "logic-clarity",
    dominantCategory: "logic",
    title: "静かな明晰タイプ",
    subtitle: "迷いの中で、道筋を照らす存在",
    baseAnalysis:
      "あなたは物事の構造を整理し、感情に流されずに本質を見抜く力を持っています。丁寧な判断と誠実な分析で、周囲に安心感を与えるタイプです。",
    themeColor: "#9CAF88",
  },
  creativity: {
    id: "creativity-bloom",
    dominantCategory: "creativity",
    title: "感性の開花タイプ",
    subtitle: "日常に、小さな美しさを添える存在",
    baseAnalysis:
      "あなたは固定観念にとらわれず、新しい視点や表現を自然に生み出す力があります。繊細な感性と柔らかな発想で、世界を少しだけ明るくするタイプです。",
    themeColor: "#C4A962",
  },
  leadership: {
    id: "leadership-grace",
    dominantCategory: "leadership",
    title: "凛とした導きタイプ",
    subtitle: "静かな自信で、一歩先を照らす存在",
    baseAnalysis:
      "あなたは決断力と配慮を両立させ、周囲を無理なく前に進める力を持っています。押し付けではなく、信頼で人を動かすタイプです。",
    themeColor: "#A8988E",
  },
};
