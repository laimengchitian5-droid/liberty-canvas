import type { LandingLocale } from "@/lib/landing/landingLocales";
import type { BigFiveLocaleCopy } from "@/lib/psychology/types";

const SHARED_FAQ: Record<
  LandingLocale,
  Array<{ question: string; answer: string }>
> = {
  en: [
    {
      question: "Is this Big Five test free?",
      answer:
        "Yes. Rubel Canvas is a no-login, all-affirming AI personality experience — Lu (Liberate) + Bel (Beautiful) = your inner canvas.",
    },
    {
      question: "How is this different from other type quizzes?",
      answer:
        "We focus on OCEAN science with an empathetic AI chat that quotes your exact answers — built for emotional validation on LibertyCanvas.",
    },
  ],
  ja: [
    {
      question: "ビッグファイブ診断は無料ですか？",
      answer:
        "はい。Rubel Canvas はログイン不要の全肯定 AI 性格診断です。Lu（Liberate）+ Bel（Beautiful）= あなたの内面キャンバス。",
    },
    {
      question: "他のタイプ診断との違いは？",
      answer:
        "OCEAN 科学指標に基づき、あなたの選択をそのまま引用する共感的 AI チャットが特徴の LibertyCanvas 体験です。",
    },
  ],
  ko: [
    {
      question: "빅파이브 검사는 무료인가요?",
      answer:
        "네. Rubel Canvas는 로그인 없이 이용하는 전격 긍정 AI 성격 진단입니다.",
    },
    {
      question: "다른 유형 검사와 무엇이 다른가요?",
      answer:
        "OCEAN 과학 지표와 공감형 AI 채팅을 결합한 LibertyCanvas 경험입니다.",
    },
  ],
  zh: [
    {
      question: "大五人格测试免费吗？",
      answer:
        "是的。Rubel Canvas 是无需登录的全肯定 AI 性格测试。",
    },
    {
      question: "与其他类型测验有何不同？",
      answer:
        "基于 OCEAN 科学指标，并提供引用你原话的共情 AI 聊天——LibertyCanvas 原创体验。",
    },
  ],
};

export const BIG_FIVE_COPY: Record<LandingLocale, BigFiveLocaleCopy> = {
  en: {
    locale: "en",
    keyword: "Big Five OCEAN Personality Test",
    headline: "Empathetic Big Five (OCEAN) Diagnosis",
    subhead:
      "Five instinct taps. Instant trait map. All-affirming AI chat that mirrors your exact choices.",
    submitLabel: "See My OCEAN Profile",
    trustLine: "No login · Free · Qwen AI · Screenshot-ready results",
    revealTitle: "Your OCEAN signature is ready",
    chatPlaceholder: "Tell the AI how this feels…",
    shareLabel: "Share on X / LINE",
    retakeLabel: "Retake",
    typingLabel: "AI is reflecting…",
    faq: SHARED_FAQ.en,
    resultPrefix: "Dominant trait",
    traitLabels: {
      openness: "Openness",
      conscientiousness: "Conscientiousness",
      extraversion: "Extraversion",
      agreeableness: "Agreeableness",
      neuroticism: "Neuroticism",
    },
    questions: [
      {
        dimension: "openness",
        prompt: "When learning something new, you…",
        optionLow: "Prefer proven methods",
        optionHigh: "Get excited by novel ideas",
      },
      {
        dimension: "conscientiousness",
        prompt: "Your daily rhythm is…",
        optionLow: "Flexible, flow-based",
        optionHigh: "Planned and structured",
      },
      {
        dimension: "extraversion",
        prompt: "After social time, you…",
        optionLow: "Need solo recharge",
        optionHigh: "Feel energized by people",
      },
      {
        dimension: "agreeableness",
        prompt: "In conflict, you usually…",
        optionLow: "State your view clearly",
        optionHigh: "Prioritize harmony",
      },
      {
        dimension: "neuroticism",
        prompt: "When stress hits, you…",
        optionLow: "Stay relatively steady",
        optionHigh: "Feel things intensely",
      },
    ],
  },
  ja: {
    locale: "ja",
    keyword: "ビッグファイブ OCEAN 性格診断",
    headline: "共感型ビッグファイブ（OCEAN）性格診断",
    subhead:
      "5問だけ直感タップ。OCEAN プロファイルを即表示。全肯定 AI があなたの言葉をそのまま引用。",
    submitLabel: "OCEAN プロファイルを見る",
    trustLine: "ログイン不要 · 無料 · Qwen AI · シェア映え結果",
    revealTitle: "あなたの OCEAN シグネチャが完成",
    chatPlaceholder: "この結果、どう感じた？",
    shareLabel: "X / LINE でシェア",
    retakeLabel: "もう一度",
    typingLabel: "AI が共感中…",
    faq: SHARED_FAQ.ja,
    resultPrefix: "支配的トレイト",
    traitLabels: {
      openness: "開放性",
      conscientiousness: "誠実性",
      extraversion: "外向性",
      agreeableness: "協調性",
      neuroticism: "神経症傾向",
    },
    questions: [
      {
        dimension: "openness",
        prompt: "新しいことを学ぶとき…",
        optionLow: "慣れた方法が落ち着く",
        optionHigh: "未知のアイデアにワクワクする",
      },
      {
        dimension: "conscientiousness",
        prompt: "日々のリズムは…",
        optionLow: "その場の流れで進む",
        optionHigh: "計画通りに進めたい",
      },
      {
        dimension: "extraversion",
        prompt: "人と過ごしたあと…",
        optionLow: "一人時間で回復する",
        optionHigh: "人と会うほどエネルギーが湧く",
      },
      {
        dimension: "agreeableness",
        prompt: "意見がぶつかったとき…",
        optionLow: "自分の考えをはっきり言う",
        optionHigh: "相手の気持ちを優先する",
      },
      {
        dimension: "neuroticism",
        prompt: "ストレスを感じたとき…",
        optionLow: "比較的クールに割り切れる",
        optionHigh: "細部まで敏感に感じる",
      },
    ],
  },
  ko: {
    locale: "ko",
    keyword: "빅파이브 OCEAN 성격 검사",
    headline: "공감형 빅파이브(OCEAN) 성격 진단",
    subhead:
      "5문항 직감 선택. 즉시 OCEAN 프로필. 전격 긍정 AI가 당신의 선택을 그대로 인용합니다.",
    submitLabel: "OCEAN 프로필 보기",
    trustLine: "로그인 불필요 · 무료 · Qwen AI",
    revealTitle: "OCEAN 시그니처 완성",
    chatPlaceholder: "이 결과, 어떤 기분이에요?",
    shareLabel: "X / LINE 공유",
    retakeLabel: "다시 하기",
    typingLabel: "AI가 공감 중…",
    faq: SHARED_FAQ.ko,
    resultPrefix: "지배 특성",
    traitLabels: {
      openness: "개방성",
      conscientiousness: "성실성",
      extraversion: "외향성",
      agreeableness: "우호성",
      neuroticism: "신경증",
    },
    questions: [
      {
        dimension: "openness",
        prompt: "새로운 것을 배울 때…",
        optionLow: "익숙한 방법이 편하다",
        optionHigh: "새로운 아이디어에 설렌다",
      },
      {
        dimension: "conscientiousness",
        prompt: "일상 리듬은…",
        optionLow: "유연하게 흐름대로",
        optionHigh: "계획적으로 진행",
      },
      {
        dimension: "extraversion",
        prompt: "사람들과 시간을 보낸 후…",
        optionLow: "혼자 쉬어야 회복",
        optionHigh: "사람 만날수록 에너지 충전",
      },
      {
        dimension: "agreeableness",
        prompt: "갈등 상황에서…",
        optionLow: "내 의견을 분명히 말함",
        optionHigh: "상대 감정을 우선",
      },
      {
        dimension: "neuroticism",
        prompt: "스트레스를 받으면…",
        optionLow: "비교적 침착하게 넘김",
        optionHigh: "세세한 것까지 예민하게 느낌",
      },
    ],
  },
  zh: {
    locale: "zh",
    keyword: "大五人格 OCEAN 测试",
    headline: "共情型大五人格（OCEAN）诊断",
    subhead:
      "5 题直觉选择，即时 OCEAN 画像。全肯定 AI 会引用你的原话。",
    submitLabel: "查看 OCEAN 画像",
    trustLine: "无需登录 · 免费 · Qwen AI",
    revealTitle: "你的 OCEAN 签名已完成",
    chatPlaceholder: "这个结果让你有什么感受？",
    shareLabel: "分享到 X / LINE",
    retakeLabel: "重新测试",
    typingLabel: "AI 正在共情…",
    faq: SHARED_FAQ.zh,
    resultPrefix: "主导特质",
    traitLabels: {
      openness: "开放性",
      conscientiousness: "尽责性",
      extraversion: "外向性",
      agreeableness: "宜人性",
      neuroticism: "神经质",
    },
    questions: [
      {
        dimension: "openness",
        prompt: "学习新事物时…",
        optionLow: "偏好熟悉的方法",
        optionHigh: "对新点子感到兴奋",
      },
      {
        dimension: "conscientiousness",
        prompt: "日常节奏…",
        optionLow: "灵活随流而动",
        optionHigh: "按计划推进",
      },
      {
        dimension: "extraversion",
        prompt: "社交之后…",
        optionLow: "需要独处恢复",
        optionHigh: "与人相处更有能量",
      },
      {
        dimension: "agreeableness",
        prompt: "发生冲突时…",
        optionLow: "清楚表达自己的观点",
        optionHigh: "优先照顾对方感受",
      },
      {
        dimension: "neuroticism",
        prompt: "感到压力时…",
        optionLow: "相对冷静地处理",
        optionHigh: "对细节非常敏感",
      },
    ],
  },
};

export function getBigFiveCopy(locale: LandingLocale): BigFiveLocaleCopy {
  return BIG_FIVE_COPY[locale];
}
