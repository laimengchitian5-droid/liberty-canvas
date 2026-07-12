import type { LandingLocale } from "@/lib/landing/landingLocales";
import type { EnneagramLocaleCopy, EnneagramTypeDefinition } from "@/lib/psychology/types";

function typesEn(): EnneagramTypeDefinition[] {
  return [
    { typeNumber: 1, name: "Type 1 · Reformer", tagline: "Principled idealist", description: "You seek integrity and improvement." },
    { typeNumber: 2, name: "Type 2 · Helper", tagline: "Warm connector", description: "You lead with care and generosity." },
    { typeNumber: 3, name: "Type 3 · Achiever", tagline: "Driven performer", description: "You move fast toward visible success." },
    { typeNumber: 4, name: "Type 4 · Individualist", tagline: "Deep feeler", description: "You crave authentic emotional depth." },
    { typeNumber: 5, name: "Type 5 · Investigator", tagline: "Quiet analyst", description: "You observe before you engage." },
    { typeNumber: 6, name: "Type 6 · Loyalist", tagline: "Steady guardian", description: "You value trust and preparedness." },
    { typeNumber: 7, name: "Type 7 · Enthusiast", tagline: "Spark optimist", description: "You chase possibility and joy." },
    { typeNumber: 8, name: "Type 8 · Challenger", tagline: "Bold protector", description: "You confront life with direct strength." },
    { typeNumber: 9, name: "Type 9 · Peacemaker", tagline: "Harmony anchor", description: "You soften tension and unify people." },
  ];
}

function typesJa(): EnneagramTypeDefinition[] {
  return [
    { typeNumber: 1, name: "タイプ1 · 改革者", tagline: "理想を貫く完璧主義", description: "正しさと改善への強い志向。" },
    { typeNumber: 2, name: "タイプ2 · 援助者", tagline: "温かいサポーター", description: "他者のケアでつながる。" },
    { typeNumber: 3, name: "タイプ3 · 達成者", tagline: "結果を出す推進力", description: "成功と評価への高いエネルギー。" },
    { typeNumber: 4, name: "タイプ4 · 個性主義者", tagline: "深い感受性", description: "独自性と本音の感情を大切に。" },
    { typeNumber: 5, name: "タイプ5 · 調査者", tagline: "静かな分析家", description: "距離を保ちながら理解する。" },
    { typeNumber: 6, name: "タイプ6 · 忠実者", tagline: "信頼の守護者", description: "安心と備えを重視。" },
    { typeNumber: 7, name: "タイプ7 · 熱狂者", tagline: "可能性の探求者", description: "楽しさと自由を追い求める。" },
    { typeNumber: 8, name: "タイプ8 · 挑戦者", tagline: "強さの守護者", description: "率直に前へ進む。" },
    { typeNumber: 9, name: "タイプ9 · 平和主義者", tagline: "調和の架け橋", description: "争いを和らげ統合する。" },
  ];
}

function typesKo(): EnneagramTypeDefinition[] {
  return [
    { typeNumber: 1, name: "유형 1 · 개혁가", tagline: "원칙주의 이상가", description: "올바름과 개선을 추구합니다." },
    { typeNumber: 2, name: "유형 2 · 조력자", tagline: "따뜻한 연결자", description: "돌봄과 배려로 관계를 만듭니다." },
    { typeNumber: 3, name: "유형 3 · 성취자", tagline: "추진력 있는 수행자", description: "눈에 보이는 성과를 향해 달립니다." },
    { typeNumber: 4, name: "유형 4 · 개성주의자", tagline: "깊은 감수성", description: "진정성과 감정의 깊이를 원합니다." },
    { typeNumber: 5, name: "유형 5 · 탐구자", tagline: "조용한 분석가", description: "관찰 후 깊이 이해합니다." },
    { typeNumber: 6, name: "유형 6 · 충성가", tagline: "신뢰의 수호자", description: "안전과 준비를 중시합니다." },
    { typeNumber: 7, name: "유형 7 · 열정가", tagline: "가능성의 낙관주의자", description: "즐거움과 자유를 추구합니다." },
    { typeNumber: 8, name: "유형 8 · 도전자", tagline: "대담한 수호자", description: "직접적 힘으로 앞으로 나아갑니다." },
    { typeNumber: 9, name: "유형 9 · 평화주의자", tagline: "조화의 중재자", description: "긴장을 완화하고 통합합니다." },
  ];
}

function typesZh(): EnneagramTypeDefinition[] {
  return [
    { typeNumber: 1, name: "类型 1 · 改革者", tagline: "原则型理想主义", description: "追求正确与持续改进。" },
    { typeNumber: 2, name: "类型 2 · 助人者", tagline: "温暖连接者", description: "以关怀建立关系。" },
    { typeNumber: 3, name: "类型 3 · 成就者", tagline: "结果导向", description: "向可见成功快速推进。" },
    { typeNumber: 4, name: "类型 4 · 个人主义者", tagline: "深度感受者", description: "渴望真实情感深度。" },
    { typeNumber: 5, name: "类型 5 · 调查者", tagline: "冷静分析者", description: "先观察再深入理解。" },
    { typeNumber: 6, name: "类型 6 · 忠诚者", tagline: "信任守护者", description: "重视安全与准备。" },
    { typeNumber: 7, name: "类型 7 · 热情者", tagline: "可能性乐观派", description: "追逐快乐与自由。" },
    { typeNumber: 8, name: "类型 8 · 挑战者", tagline: "力量守护者", description: "以直接力量面对人生。" },
    { typeNumber: 9, name: "类型 9 · 和平者", tagline: "和谐桥梁", description: "缓和冲突并整合。" },
  ];
}

export const ENNEAGRAM_COPY: Record<LandingLocale, EnneagramLocaleCopy> = {
  en: {
    locale: "en",
    keyword: "Enneagram 9 Types Personality Test",
    headline: "Empathetic Enneagram Nine-Types Diagnosis",
    subhead:
      "Pick the type that resonates. Instant archetype reveal. All-affirming AI chat powered by Qwen.",
    promptLabel: "Which type feels most like you right now?",
    submitLabel: "Reveal My Enneagram",
    trustLine: "No login · Free · All-Affirming AI Chat",
    revealTitle: "Your Enneagram mirror is ready",
    chatPlaceholder: "Ask the AI about your type…",
    shareLabel: "Share on X / LINE",
    retakeLabel: "Retake",
    typingLabel: "AI is reflecting…",
    faq: [
      {
        question: "Is Enneagram diagnosis free on Rubel Canvas?",
        answer:
          "Yes — no login, no paywall. Lu + Bel = a liberating, beautiful AI mirror for your inner type.",
      },
      {
        question: "Can I chat with AI about my type?",
        answer:
          "Absolutely. Qwen-powered all-affirming chat quotes your exact selection for empathetic validation.",
      },
    ],
    types: typesEn(),
  },
  ja: {
    locale: "ja",
    keyword: "エニアグラム 9タイプ 性格診断",
    headline: "共感型エニアグラム9タイプ診断",
    subhead:
      "今の自分に近いタイプを直感選択。即アーキタイプ表示。全肯定 AI チャット付き。",
    promptLabel: "今の自分に一番近いタイプは？",
    submitLabel: "エニアグラムを表示",
    trustLine: "ログイン不要 · 無料 · 全肯定 AI チャット",
    revealTitle: "あなたのエニアグラムミラー完成",
    chatPlaceholder: "このタイプについて AI に聞いてみよう",
    shareLabel: "X / LINE でシェア",
    retakeLabel: "もう一度",
    typingLabel: "AI が共感中…",
    faq: [
      {
        question: "エニアグラム診断は無料ですか？",
        answer:
          "はい。Rubel Canvas はログイン不要の全肯定 AI 性格診断です。",
      },
      {
        question: "AI とタイプについて話せますか？",
        answer:
          "もちろん。Qwen 搭載の全肯定 AI があなたの選択を引用して共感します。",
      },
    ],
    types: typesJa(),
  },
  ko: {
    locale: "ko",
    keyword: "에니어그램 9유형 성격 검사",
    headline: "공감형 에니어그램 9유형 진단",
    subhead:
      "지금의 나와 가장 가까운 유형을 선택하세요. 즉시 아키타입 공개. 전격 긍정 AI 채팅.",
    promptLabel: "지금의 나와 가장 가까운 유형은?",
    submitLabel: "에니어그램 보기",
    trustLine: "로그인 불필요 · 무료 · 전격 긍정 AI",
    revealTitle: "에니어그램 미러 완성",
    chatPlaceholder: "이 유형에 대해 AI에게 물어보세요",
    shareLabel: "X / LINE 공유",
    retakeLabel: "다시 하기",
    typingLabel: "AI가 공감 중…",
    faq: [
      {
        question: "에니어그램 진단은 무료인가요?",
        answer: "네. Rubel Canvas는 로그인 없이 이용 가능합니다.",
      },
      {
        question: "AI와 유형에 대해 대화할 수 있나요?",
        answer: "네. Qwen 기반 전격 긍정 AI가 선택을 인용해 공감합니다.",
      },
    ],
    types: typesKo(),
  },
  zh: {
    locale: "zh",
    keyword: "九型人格 Enneagram 测试",
    headline: "共情型九型人格诊断",
    subhead:
      "选择最贴近当下的类型，即时原型揭示，全肯定 AI 聊天。",
    promptLabel: "哪个类型最像现在的你？",
    submitLabel: "查看九型结果",
    trustLine: "无需登录 · 免费 · 全肯定 AI",
    revealTitle: "你的九型镜像已完成",
    chatPlaceholder: "向 AI 询问你的类型…",
    shareLabel: "分享到 X / LINE",
    retakeLabel: "重新测试",
    typingLabel: "AI 正在共情…",
    faq: [
      {
        question: "九型人格诊断免费吗？",
        answer: "是的，Rubel Canvas 无需登录即可使用。",
      },
      {
        question: "可以和 AI 聊类型吗？",
        answer: "可以，Qwen 全肯定 AI 会引用你的选择进行共情。",
      },
    ],
    types: typesZh(),
  },
};

export function getEnneagramCopy(locale: LandingLocale): EnneagramLocaleCopy {
  return ENNEAGRAM_COPY[locale];
}
