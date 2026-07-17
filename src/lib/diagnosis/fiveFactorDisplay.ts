import type {
  AcademicTraitVector,
  LegalTraitKey,
} from "@/lib/diagnosis/academicTraitVector";

export const FIVE_FACTOR_KEYS = [
  "extraversion",
  "openness",
  "empathy_agreeableness",
  "conscientiousness",
  "emotional_stability",
] as const;

export type FiveFactorKey = (typeof FIVE_FACTOR_KEYS)[number];

export interface FiveFactorRadarPoint {
  key: FiveFactorKey;
  label: string;
  description: string;
  score: number;
  percentile: number;
}

export const FIVE_FACTOR_LABELS: Readonly<Record<FiveFactorKey, string>> = {
  extraversion: "外向性",
  openness: "開放性",
  empathy_agreeableness: "共感・協調性",
  conscientiousness: "誠実性",
  emotional_stability: "感情安定性",
};

export const FIVE_FACTOR_DESCRIPTIONS: Readonly<Record<FiveFactorKey, string>> = {
  extraversion: "人との交流や場のエネルギーにどれだけ自然に向かうか",
  openness: "新しい体験や発想への好奇心の広がり",
  empathy_agreeableness: "相手の気持ちを汲み取り、やさしく協調する力",
  conscientiousness: "計画性・誠実さ・丁寧に積み重ねる姿勢",
  emotional_stability: "ストレスや感情の揺れに対する安定度（高いほど落ち着き）",
};

const DOMINANT_TRAIT_BEHAVIOR: Readonly<Record<LegalTraitKey, string>> = {
  trait_extraversion:
    "人との距離を自然に縮め、場に明るさと活気を届けやすい傾向があります。グループの中では、空気をやわらげる存在として頼りにされることが多いでしょう。",
  trait_openness:
    "新しい刺激や発想に心が動き、固定概念よりも可能性を探る姿勢が強いタイプです。好奇心が行動の原動力になりやすいでしょう。",
  trait_agreeableness:
    "相手の立場を尊重し、対立より調和を選びやすい傾向があります。人間関係の土台となる信頼を、丁寧に築いていくタイプです。",
  trait_conscientiousness:
    "計画性と誠実さを大切にし、約束や積み重ねを守る力が強いタイプです。長期的な信頼関係を築くうえで、大きな強みになります。",
  trait_neuroticism:
    "感受性が豊かで、感情の機微に気づける繊細さがあります。その分、深い共感と洞察につながる場面も多いでしょう。",
  trait_empathy:
    "相手の気持ちに寄り添う力が自然と育っています。言葉にされないニュアンスまで汲み取れる共感力が、あなたの魅力の核です。",
};

function clampScore(value: number): number {
  return Math.round(Math.max(0, Math.min(1, value)) * 100) / 100;
}

function toPercentile(score: number): number {
  return Math.round(clampScore(score) * 100);
}

/**
 * Converts the internal 6-dimensional academic vector into a
 * user-facing 5-factor radar structure (industry-standard presentation).
 */
export function buildFiveFactorRadar(
  vector: AcademicTraitVector,
): readonly FiveFactorRadarPoint[] {
  const empathyAgree = (vector.trait_agreeableness + vector.trait_empathy) / 2;
  const emotionalStability = clampScore(1 - vector.trait_neuroticism);

  const raw: Readonly<Record<FiveFactorKey, number>> = {
    extraversion: vector.trait_extraversion,
    openness: vector.trait_openness,
    empathy_agreeableness: empathyAgree,
    conscientiousness: vector.trait_conscientiousness,
    emotional_stability: emotionalStability,
  };

  return FIVE_FACTOR_KEYS.map((key) => ({
    key,
    label: FIVE_FACTOR_LABELS[key],
    description: FIVE_FACTOR_DESCRIPTIONS[key],
    score: clampScore(raw[key]),
    percentile: toPercentile(raw[key]),
  }));
}

export function buildDetailedBehavioralAnalysis(
  baseAnalysis: string,
  dominantTraits: readonly LegalTraitKey[],
): string {
  const behaviorNotes = dominantTraits
    .map((traitKey) => DOMINANT_TRAIT_BEHAVIOR[traitKey])
    .filter(Boolean);

  if (behaviorNotes.length === 0) {
    return baseAnalysis;
  }

  return `${baseAnalysis}\n\n${behaviorNotes.join("\n\n")}`;
}
