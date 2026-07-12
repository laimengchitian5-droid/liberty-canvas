import type { LandingLocale, CoreLandingLocale } from "@/lib/landing/landingLocales";
import { isEuropeanDiscoverLocale } from "@/lib/landing/landingLocales";
import { getDiscoverCopyFrDe } from "@/lib/landing/discoverCopyFrDe";
import { getLegalSafeLandingCopy } from "@/lib/landing/legalSafeLandingCopy";
import { applySerpClickPack } from "@/lib/landing/serpClickPack";
import type { LandingTopicSlug } from "@/lib/landing/landingTopics";

export interface LandingFaqItem {
  question: string;
  answer: string;
}

export interface LandingPageCopy {
  keyword: string;
  title: string;
  headline: string;
  subhead: string;
  metaDescription: string;
  keywords: string[];
  promptLabel: string;
  promptPlaceholder: string;
  submitLabel: string;
  trustLine: string;
  schemaName: string;
  schemaDescription: string;
  faq: LandingFaqItem[];
}

type CopyMatrix = Record<LandingTopicSlug, Record<CoreLandingLocale, LandingPageCopy>>;

export const LANDING_COPY: CopyMatrix = {
  "big-five-ocean": {
    en: {
      keyword: "Big Five OCEAN Personality Test",
      title: "Free Big Five (OCEAN) Personality Test — Instant AI Result",
      headline: "Discover your OCEAN profile in one honest answer",
      subhead:
        "Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism — mapped instantly by Rubel Canvas AI. No signup.",
      metaDescription:
        "Take a free Big Five OCEAN personality test. One response, instant AI diagnosis and chat. Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism.",
      keywords: [
        "Big Five personality test",
        "OCEAN test free",
        "five factor model",
        "personality test online",
        "Rubel Canvas",
      ],
      promptLabel: "What habit reveals your personality most?",
      promptPlaceholder: "e.g. I recharge alone with books after social events…",
      submitLabel: "Reveal My OCEAN Type →",
      trustLine: "Used by 12k+ global takers · HF open-source AI · No login",
      schemaName: "Big Five OCEAN Personality Quiz",
      schemaDescription:
        "Single-response Big Five (OCEAN) personality assessment with instant AI feedback on Rubel Canvas.",
      faq: [
        {
          question: "Is this the official Big Five test?",
          answer:
            "This is a fast Rubel Canvas intake mapped to OCEAN dimensions, designed for instant self-insight rather than clinical certification.",
        },
        {
          question: "Do I need an account?",
          answer: "No. One text answer routes directly into the global Rubel engine.",
        },
      ],
    },
    ja: {
      keyword: "ビッグファイブ OCEAN 性格診断",
      title: "無料ビッグファイブ（OCEAN）性格診断 — AI即結果",
      headline: "1つの回答で OCEAN プロフィールを解析",
      subhead:
        "開放性・誠実性・外向性・協調性・神経症傾向を Rubel Canvas AI が即座にマッピング。登録不要。",
      metaDescription:
        "無料ビッグファイブ OCEAN 性格診断。1回答でAI診断＆チャット。開放性・誠実性・外向性・協調性・神経症傾向。",
      keywords: [
        "ビッグファイブ 診断",
        "OCEAN 性格診断 無料",
        "五因子モデル",
        "性格診断 AI",
        "Rubel Canvas",
      ],
      promptLabel: "あなたの性格が一番出る習慣は？",
      promptPlaceholder: "例：人混みの後は一人で本を読んで recharge する…",
      submitLabel: "OCEANタイプを見る →",
      trustLine: "1.2万回以上プレイ · オープンソースAI · ログイン不要",
      schemaName: "ビッグファイブ OCEAN 性格クイズ",
      schemaDescription:
        "1回答型ビッグファイブ（OCEAN）性格診断。Rubel Canvas で即座にAIフィードバック。",
      faq: [
        {
          question: "本格的なビッグファイブ検査ですか？",
          answer:
            "Rubel Canvas の高速インテークで OCEAN 次元にマッピングする自己理解ツールです。",
        },
        {
          question: "アカウントは必要？",
          answer: "不要です。1つの回答がグローバルエンジンに直接注入されます。",
        },
      ],
    },
    ko: {
      keyword: "빅파이브 OCEAN 성격 검사",
      title: "무료 빅파이브(OCEAN) 성격 검사 — AI 즉시 결과",
      headline: "한 번의 답변으로 OCEAN 프로필 확인",
      subhead:
        "개방성·성실성·외향성·친화성·신경증 — Rubel Canvas AI가 즉시 분석. 가입 불필요.",
      metaDescription:
        "무료 빅파이브 OCEAN 성격 검사. 한 답변으로 AI 진단 및 채팅. 개방성, 성실성, 외향성, 친화성, 신경증.",
      keywords: [
        "빅파이브 검사",
        "OCEAN 성격검사 무료",
        "5요인 모델",
        "성격검사 AI",
        "Rubel Canvas",
      ],
      promptLabel: "당신의 성격이 가장 드러나는 습관은?",
      promptPlaceholder: "예: 사람들과 어울린 뒤 혼자 책을 읽으며 충전해요…",
      submitLabel: "OCEAN 유형 보기 →",
      trustLine: "1.2만+ 참여 · 오픈소스 AI · 로그인 불필요",
      schemaName: "빅파이브 OCEAN 성격 퀴즈",
      schemaDescription:
        "단일 응답 빅파이브(OCEAN) 성격 평가. Rubel Canvas에서 즉시 AI 피드백.",
      faq: [
        {
          question: "공식 빅파이브 검사인가요?",
          answer:
            "Rubel Canvas 고속 인테이크로 OCEAN 차원에 매핑하는 자기 이해 도구입니다.",
        },
        {
          question: "계정이 필요한가요?",
          answer: "아니요. 한 답변이 글로벌 엔진으로 바로 전달됩니다.",
        },
      ],
    },
    zh: {
      keyword: "大五人格 OCEAN 性格测试",
      title: "免费大五人格（OCEAN）测试 — AI 即时结果",
      headline: "一次回答，解析你的 OCEAN 画像",
      subhead:
        "开放性·尽责性·外向性·宜人性·神经质 — Rubel Canvas AI 即时映射。无需注册。",
      metaDescription:
        "免费大五人格 OCEAN 测试。一次回答，AI 诊断与聊天。开放性、尽责性、外向性、宜人性、神经质。",
      keywords: [
        "大五人格测试",
        "OCEAN 性格测试 免费",
        "五因素模型",
        "AI 性格测试",
        "Rubel Canvas",
      ],
      promptLabel: "哪个习惯最能体现你的性格？",
      promptPlaceholder: "例如：社交结束后我会独自看书恢复精力…",
      submitLabel: "查看我的 OCEAN 类型 →",
      trustLine: "1.2万+ 次测试 · 开源 AI · 无需登录",
      schemaName: "大五人格 OCEAN 性格测验",
      schemaDescription:
        "单次回答大五人格（OCEAN）评估。Rubel Canvas 即时 AI 反馈。",
      faq: [
        {
          question: "这是正式的大五人格测验吗？",
          answer:
            "这是 Rubel Canvas 快速摄入，映射到 OCEAN 维度的自我理解工具。",
        },
        {
          question: "需要账号吗？",
          answer: "不需要。一次回答将直接注入全球引擎。",
        },
      ],
    },
  },
  "enneagram-nine-types": {
    en: {
      keyword: "Enneagram 9 Types Test",
      title: "Free Enneagram 9 Types Test — AI Personality Match",
      headline: "Which of the 9 Enneagram types lives in you?",
      subhead:
        "One raw answer. Instant archetype match and affirming AI chat on Rubel Canvas.",
      metaDescription:
        "Free Enneagram 9 types personality test. One answer, instant AI type match and chat. Type 1–9 discovery without login.",
      keywords: [
        "Enneagram test free",
        "9 enneagram types",
        "Enneagram personality",
        "type finder",
        "Rubel Canvas",
      ],
      promptLabel: "What fear or desire drives you most?",
      promptPlaceholder: "e.g. I need to be perfect so others won't reject me…",
      submitLabel: "Find My Enneagram Type →",
      trustLine: "Global SEO landing · Instant routing · No signup",
      schemaName: "Enneagram Nine Types Quiz",
      schemaDescription:
        "Single-response Enneagram type discovery with AI companion chat.",
      faq: [
        {
          question: "Does this cover all 9 types?",
          answer: "Yes — your answer maps to the closest Enneagram archetype in our matrix.",
        },
        {
          question: "Is it free?",
          answer: "Completely free on liberty-canvas.vercel.app.",
        },
      ],
    },
    ja: {
      keyword: "エニアグラム 9タイプ 診断",
      title: "無料エニアグラム9タイプ診断 — AI性格マッチ",
      headline: "9タイプのどれが、あなたの核？",
      subhead: "1つの本音回答で、タイプ判定とAIチャットが即スタート。",
      metaDescription:
        "無料エニアグラム9タイプ性格診断。1回答でAIタイプ判定＆チャット。タイプ1〜9をログイン不要で。",
      keywords: [
        "エニアグラム 診断 無料",
        "9タイプ 性格診断",
        "エニアグラム タイプ",
        "性格診断 AI",
        "Rubel Canvas",
      ],
      promptLabel: "いちばん強い「恐れ」か「欲求」は？",
      promptPlaceholder: "例：嫌われたくなくて完璧でいようとする…",
      submitLabel: "エニアグラムタイプを見る →",
      trustLine: "グローバルSEO · 即ルーティング · 登録不要",
      schemaName: "エニアグラム9タイプクイズ",
      schemaDescription: "1回答型エニアグラムタイプ診断とAIコンパニオン。",
      faq: [
        {
          question: "9タイプすべて対応？",
          answer: "はい。回答は最も近いエニアグラム原型にマッピングされます。",
        },
        { question: "無料？", answer: "liberty-canvas.vercel.app で完全無料です。" },
      ],
    },
    ko: {
      keyword: "에니어그램 9유형 검사",
      title: "무료 에니어그램 9유형 검사 — AI 성격 매칭",
      headline: "9유형 중 당신의 핵심은?",
      subhead: "한 번의 솔직한 답변으로 유형 판정과 AI 채팅 즉시 시작.",
      metaDescription:
        "무료 에니어그램 9유형 성격 검사. 한 답변으로 AI 유형 매칭 및 채팅. 유형 1~9, 로그인 불필요.",
      keywords: [
        "에니어그램 검사 무료",
        "9유형 성격검사",
        "에니어그램 유형",
        "AI 성격검사",
        "Rubel Canvas",
      ],
      promptLabel: "가장 강한 '두려움' 또는 '욕구'는?",
      promptPlaceholder: "예: 거절당할까 봐 완벽해지려고 해요…",
      submitLabel: "에니어그램 유형 보기 →",
      trustLine: "글로벌 SEO · 즉시 라우팅 · 가입 불필요",
      schemaName: "에니어그램 9유형 퀴즈",
      schemaDescription: "단일 응답 에니어그램 유형 발견 및 AI 동반 채팅.",
      faq: [
        {
          question: "9유형 모두 지원하나요?",
          answer: "네. 답변은 가장 가까운 에니어그램 원형에 매핑됩니다.",
        },
        { question: "무료인가요?", answer: "liberty-canvas.vercel.app에서 완전 무료입니다." },
      ],
    },
    zh: {
      keyword: "九型人格 Enneagram 测试",
      title: "免费九型人格测试 — AI 类型匹配",
      headline: "九型中，哪一种活在你心里？",
      subhead: "一次真实回答，即时类型判定与 AI 聊天。",
      metaDescription:
        "免费九型人格测试。一次回答，AI 类型匹配与聊天。类型 1–9，无需登录。",
      keywords: [
        "九型人格测试 免费",
        "Enneagram 9 types",
        "九型人格 类型",
        "AI 性格测试",
        "Rubel Canvas",
      ],
      promptLabel: "最强的「恐惧」或「欲望」是什么？",
      promptPlaceholder: "例如：害怕被拒绝，所以总想做到完美…",
      submitLabel: "查看我的九型类型 →",
      trustLine: "全球 SEO · 即时路由 · 无需注册",
      schemaName: "九型人格测验",
      schemaDescription: "单次回答九型人格类型发现与 AI 陪伴聊天。",
      faq: [
        {
          question: "涵盖全部 9 型吗？",
          answer: "是的，回答会映射到最接近的原型。",
        },
        { question: "免费吗？", answer: "在 liberty-canvas.vercel.app 完全免费。" },
      ],
    },
  },
  "sixteen-personalities": {
    en: {
      keyword: "16Personalities Free Test",
      title: "16Personalities-Style Free Test — Instant AI Archetype",
      headline: "16Personalities accuracy. One answer. Zero friction.",
      subhead:
        "INFJ, ENTP, ISFP… Find your elegant archetype title and chat with a matched AI persona.",
      metaDescription:
        "Free 16Personalities-style MBTI test. One response, freakishly accurate AI archetype and chat. No login on Rubel Canvas.",
      keywords: [
        "16personalities",
        "16 personalities test free",
        "MBTI test online",
        "personality type test",
        "Rubel Canvas",
      ],
      promptLabel: "Describe how you recharge after a hard week.",
      promptPlaceholder: "e.g. Solo creative projects beat big parties every time…",
      submitLabel: "Get My 16P-Type →",
      trustLine: "16P-inspired matrix · Sub-second routing",
      schemaName: "16Personalities Style Quiz",
      schemaDescription:
        "Single-answer 16Personalities-inspired archetype discovery with AI chat.",
      faq: [
        {
          question: "Same as 16personalities.com?",
          answer:
            "Inspired by the same 16-type framework; powered by Rubel Canvas open AI.",
        },
        {
          question: "How fast is the result?",
          answer: "Instant — your text routes to the global engine immediately.",
        },
      ],
    },
    ja: {
      keyword: "16Personalities 日本語 無料",
      title: "16Personalities風 無料性格診断 — AI即タイプ判定",
      headline: "16Personalities級の精度。1問だけ。",
      subhead: "INFJ・ENTP・ISFP… エレガントなタイプ名とAIキャラチャット。",
      metaDescription:
        "16Personalities風 無料MBTI性格診断。1回答でAIタイプ判定＆チャット。Rubel Canvas ログイン不要。",
      keywords: [
        "16personalities 日本語",
        "16性格 診断 無料",
        "MBTI テスト 無料",
        "性格タイプ 診断",
        "Rubel Canvas",
      ],
      promptLabel: "しんどい1週間の後、どう recharge する？",
      promptPlaceholder: "例：大人数より、一人で創作する方が100倍回復する…",
      submitLabel: "16Pタイプを見る →",
      trustLine: "16P型マトリクス · サブ秒ルーティング",
      schemaName: "16Personalities風クイズ",
      schemaDescription: "1回答型16Personalities風アーキタイプ診断。",
      faq: [
        {
          question: "16personalities.com と同じ？",
          answer: "同じ16タイプ框架を参考に、Rubel Canvas オープンAIで駆動。",
        },
        { question: "結果はどれくらい早い？", answer: "即座 — テキストがグローバルエンジンへ。" },
      ],
    },
    ko: {
      keyword: "16Personalities 무료 검사",
      title: "16Personalities 스타일 무료 검사 — AI 즉시 유형",
      headline: "16Personalities급 정확도. 한 답변.",
      subhead: "INFJ, ENTP, ISFP… 우아한 유형명과 AI 페르소나 채팅.",
      metaDescription:
        "16Personalities 스타일 무료 MBTI 검사. 한 응답으로 AI 유형 및 채팅. Rubel Canvas 로그인 불필요.",
      keywords: [
        "16personalities 한국어",
        "16유형 성격검사",
        "MBTI 무료",
        "성격 유형 테스트",
        "Rubel Canvas",
      ],
      promptLabel: "힘든 한 주 후, 어떻게 재충전하나요?",
      promptPlaceholder: "예: 큰 파티보다 혼자 창작할 때 훨씬 회복돼요…",
      submitLabel: "16P 유형 보기 →",
      trustLine: "16P 매트릭스 · 서브초 라우팅",
      schemaName: "16Personalities 스타일 퀴즈",
      schemaDescription: "단일 응답 16Personalities 스타일 아키타입 발견.",
      faq: [
        {
          question: "16personalities.com 과 같나요?",
          answer: "동일 16유형 프레임워크 영감, Rubel Canvas 오픈 AI 구동.",
        },
        { question: "결과 속도는?", answer: "즉시 — 텍스트가 글로벌 엔진으로 전달." },
      ],
    },
    zh: {
      keyword: "16Personalities 免费测试",
      title: "16Personalities 风格免费测试 — AI 即时类型",
      headline: "16Personalities 级准确度。一次回答。",
      subhead: "INFJ、ENTP、ISFP… 优雅类型名与 AI 角色聊天。",
      metaDescription:
        "16Personalities 风格免费 MBTI 测试。一次回答，AI 类型与聊天。Rubel Canvas 无需登录。",
      keywords: [
        "16personalities 中文",
        "16型人格测试",
        "MBTI 免费",
        "性格类型测试",
        "Rubel Canvas",
      ],
      promptLabel: "辛苦一周后，你如何恢复精力？",
      promptPlaceholder: "例如：比起大型聚会，独自创作更能让我恢复…",
      submitLabel: "查看我的 16P 类型 →",
      trustLine: "16P 矩阵 · 亚秒级路由",
      schemaName: "16Personalities 风格测验",
      schemaDescription: "单次回答 16Personalities 风格原型发现。",
      faq: [
        {
          question: "与 16personalities.com 相同吗？",
          answer: "参考相同 16 型框架，由 Rubel Canvas 开源 AI 驱动。",
        },
        { question: "结果多快？", answer: "即时 — 文本直接注入全球引擎。" },
      ],
    },
  },
  "mbti-personality-types": {
    en: {
      keyword: "MBTI Personality Types Test",
      title: "Free MBTI Personality Types — AI Type Finder",
      headline: "MBTI made instant: one answer, one archetype",
      subhead: "E/I · S/N · T/F · J/P mapped from your native-language response.",
      metaDescription:
        "Free MBTI personality type test online. One answer, AI-powered type finder and chat. All 16 types framework.",
      keywords: [
        "MBTI test free",
        "MBTI personality types",
        "Myers Briggs test",
        "personality type finder",
        "Rubel Canvas",
      ],
      promptLabel: "When deciding, do you lead with logic or values?",
      promptPlaceholder: "e.g. I weigh how people feel before the spreadsheet…",
      submitLabel: "Find My MBTI Match →",
      trustLine: "Multi-region landing · liberty-canvas.vercel.app",
      schemaName: "MBTI Personality Type Quiz",
      schemaDescription: "Single-response MBTI-inspired type discovery.",
      faq: [
        {
          question: "Official Myers-Briggs?",
          answer: "MBTI-inspired rapid intake for self-discovery, not licensed MBTI®.",
        },
        {
          question: "Languages supported?",
          answer: "English, Japanese, Korean, and Chinese native intakes.",
        },
      ],
    },
    ja: {
      keyword: "MBTI 性格診断 無料",
      title: "無料MBTI性格タイプ診断 — AIタイプ判定",
      headline: "MBTIを即診断：1回答、1アーキタイプ",
      subhead: "E/I・S/N・T/F・J/P を母語回答からマッピング。",
      metaDescription:
        "無料MBTI性格タイプ診断。1回答でAIタイプ判定＆チャット。16タイプ框架。",
      keywords: [
        "MBTI 診断 無料",
        "MBTI 性格タイプ",
        "マイヤーズ・ブリッグス",
        "性格タイプ 診断",
        "Rubel Canvas",
      ],
      promptLabel: "決断するとき、論理と価値観どちらが先？",
      promptPlaceholder: "例：数字より、みんなが傷つかないか先に見る…",
      submitLabel: "MBTIマッチを見る →",
      trustLine: "多国LP · liberty-canvas.vercel.app",
      schemaName: "MBTI性格タイプクイズ",
      schemaDescription: "1回答型MBTI風タイプ診断。",
      faq: [
        {
          question: "公式MBTI？",
          answer: "MBTI風の高速インテークで、ライセンスMBTI®ではありません。",
        },
        { question: "対応言語は？", answer: "日英韓中のネイティブ入力に対応。" },
      ],
    },
    ko: {
      keyword: "MBTI 성격유형 검사",
      title: "무료 MBTI 성격유형 검사 — AI 유형 찾기",
      headline: "MBTI 즉시 진단: 한 답변, 한 아키타입",
      subhead: "E/I · S/N · T/F · J/P를 모국어 응답에서 매핑.",
      metaDescription:
        "무료 MBTI 성격유형 검사. 한 답변으로 AI 유형 찾기 및 채팅. 16유형 프레임워크.",
      keywords: [
        "MBTI 검사 무료",
        "MBTI 성격유형",
        "마이어스 브릭스",
        "성격 유형 찾기",
        "Rubel Canvas",
      ],
      promptLabel: "결정할 때 논리와 가치 중 무엇이 먼저?",
      promptPlaceholder: "예: 숫자보다 사람의 감정을 먼저 봐요…",
      submitLabel: "MBTI 매칭 보기 →",
      trustLine: "다국 LP · liberty-canvas.vercel.app",
      schemaName: "MBTI 성격유형 퀴즈",
      schemaDescription: "단일 응답 MBTI 스타일 유형 발견.",
      faq: [
        {
          question: "공식 MBTI?",
          answer: "MBTI 영감의 고속 인테이크, 라이선스 MBTI® 아님.",
        },
        { question: "지원 언어?", answer: "영어, 일본어, 한국어, 중국어." },
      ],
    },
    zh: {
      keyword: "MBTI 性格测试 免费",
      title: "免费 MBTI 性格类型测试 — AI 类型查找",
      headline: "MBTI 即时诊断：一次回答，一个原型",
      subhead: "E/I · S/N · T/F · J/P 从母语回答映射。",
      metaDescription:
        "免费 MBTI 性格类型测试。一次回答，AI 类型查找与聊天。16 型框架。",
      keywords: [
        "MBTI 测试 免费",
        "MBTI 性格类型",
        "迈尔斯布里格斯",
        "性格类型查找",
        "Rubel Canvas",
      ],
      promptLabel: "做决定时，逻辑还是价值观优先？",
      promptPlaceholder: "例如：比起数据，我先看大家会不会受伤…",
      submitLabel: "查看 MBTI 匹配 →",
      trustLine: "多区域落地页 · liberty-canvas.vercel.app",
      schemaName: "MBTI 性格类型测验",
      schemaDescription: "单次回答 MBTI 风格类型发现。",
      faq: [
        {
          question: "官方 MBTI？",
          answer: "MBTI 风格快速摄入，非授权 MBTI®。",
        },
        { question: "支持语言？", answer: "英日韩中母语输入。" },
      ],
    },
  },
  "introvert-personality": {
    en: {
      keyword: "Introvert Personality Test",
      title: "Introvert vs Extrovert Test — Free AI Diagnosis",
      headline: "How introverted are you, really?",
      subhead: "One honest sentence → spectrum placement + AI that gets you.",
      metaDescription:
        "Free introvert personality test. One answer reveals your introversion level with AI chat support.",
      keywords: [
        "introvert test",
        "introvert vs extrovert",
        "am I introverted",
        "personality test free",
        "Rubel Canvas",
      ],
      promptLabel: "What drains you fastest — people or silence?",
      promptPlaceholder: "e.g. Small talk at parties empties my battery in 20 minutes…",
      submitLabel: "Measure My Introvert Level →",
      trustLine: "Psychology hook · Instant engine inject",
      schemaName: "Introvert Level Personality Quiz",
      schemaDescription: "Single-response introversion spectrum assessment.",
      faq: [
        {
          question: "Is introversion a disorder?",
          answer: "No — this is a playful self-discovery tool, not a clinical diagnosis.",
        },
        {
          question: "Can extroverts use this?",
          answer: "Absolutely. The spectrum covers ambiverts too.",
        },
      ],
    },
    ja: {
      keyword: "内向型 性格診断",
      title: "内向型・外向型診断 — 無料AI性格テスト",
      headline: "あなたの内向性、本当はどのくらい？",
      subhead: "1文の本音 → スペクトラム判定 + 分かってくれるAI。",
      metaDescription:
        "無料内向型性格診断。1回答で内向レベル判定とAIチャット。",
      keywords: [
        "内向型 診断",
        "内向 外向 診断",
        "内向型 テスト 無料",
        "性格診断",
        "Rubel Canvas",
      ],
      promptLabel: "いちばんエネルギーを奪うのは人？静寂？",
      promptPlaceholder: "例：パーティーの雑談20分でバッテリー切れ…",
      submitLabel: "内向レベルを測定 →",
      trustLine: "心理フック · 即エンジン注入",
      schemaName: "内向性レベル性格クイズ",
      schemaDescription: "1回答型内向性スペクトラム診断。",
      faq: [
        {
          question: "内向性は病気？",
          answer: "いいえ — 自己理解のためのプレイフルなツールです。",
        },
        { question: "外向型も？", answer: "もちろん。中間タイプもカバーします。" },
      ],
    },
    ko: {
      keyword: "내향형 성격 검사",
      title: "내향형·외향형 검사 — 무료 AI 진단",
      headline: "당신의 내향성, 실제로는?",
      subhead: "한 문장 → 스펙트럼 배치 + 이해해 주는 AI.",
      metaDescription:
        "무료 내향형 성격 검사. 한 답변으로 내향 수준과 AI 채팅.",
      keywords: [
        "내향형 테스트",
        "내향 외향 검사",
        "내향인 테스트 무료",
        "성격검사",
        "Rubel Canvas",
      ],
      promptLabel: "사람과 침묵 중 무엇이 더 빨리 지치게 하나요?",
      promptPlaceholder: "예: 파티 잡담 20분이면 배터리 방전…",
      submitLabel: "내향 수준 측정 →",
      trustLine: "심리 훅 · 즉시 엔진 주입",
      schemaName: "내향성 수준 성격 퀴즈",
      schemaDescription: "단일 응답 내향성 스펙트럼 평가.",
      faq: [
        { question: "내향성은 질병?", answer: "아니요 — 자기 발견용 도구입니다." },
        { question: "외향형도?", answer: "물론. 중간형도 포함합니다." },
      ],
    },
    zh: {
      keyword: "内向型 性格测试",
      title: "内向 vs 外向测试 — 免费 AI 诊断",
      headline: "你的内向程度，究竟有多少？",
      subhead: "一句话 → 谱系定位 + 懂你的 AI。",
      metaDescription:
        "免费内向型性格测试。一次回答揭示内向程度与 AI 聊天。",
      keywords: [
        "内向型测试",
        "内向 外向 测试",
        "内向人格 免费",
        "性格测试",
        "Rubel Canvas",
      ],
      promptLabel: "人和沉默，哪个最快耗尽你？",
      promptPlaceholder: "例如：派对闲聊 20 分钟就没电…",
      submitLabel: "测量内向程度 →",
      trustLine: "心理钩子 · 即时引擎注入",
      schemaName: "内向程度性格测验",
      schemaDescription: "单次回答内向谱系评估。",
      faq: [
        { question: "内向是疾病吗？", answer: "不是 — 这是自我发现工具。" },
        { question: "外向者也能用？", answer: "当然，也涵盖中间型。" },
      ],
    },
  },
  "love-language-test": {
    en: {
      keyword: "Love Language Test Free",
      title: "Love Language Test — Free AI Relationship Diagnosis",
      headline: "Words, touch, time — what's your love language?",
      subhead: "One vulnerable answer unlocks your relational archetype + AI mirror.",
      metaDescription:
        "Free love language personality test. One answer, AI relationship archetype and affirming chat.",
      keywords: [
        "love language test",
        "5 love languages",
        "relationship personality test",
        "love language quiz free",
        "Rubel Canvas",
      ],
      promptLabel: "When you feel most loved, what happened?",
      promptPlaceholder: "e.g. They remembered a tiny detail I mentioned weeks ago…",
      submitLabel: "Reveal My Love Language →",
      trustLine: "Relationship SEO · Zero login",
      schemaName: "Love Language Personality Quiz",
      schemaDescription: "Single-response love language style discovery.",
      faq: [
        {
          question: "Based on Gary Chapman's model?",
          answer: "Inspired by the five love languages framework.",
        },
        {
          question: "For couples?",
          answer: "Great solo — share results on X or LINE after.",
        },
      ],
    },
    ja: {
      keyword: "ラブランゲージ 診断 無料",
      title: "ラブランゲージ診断 — 無料AI恋愛性格テスト",
      headline: "言葉・スキンシップ・時間 — あなたの愛情語は？",
      subhead: "1つの素直な回答で、関係性アーキタイプ＋AIミラー。",
      metaDescription:
        "無料ラブランゲージ性格診断。1回答で恋愛アーキタイプとAIチャット。",
      keywords: [
        "ラブランゲージ 診断",
        "5つの愛の言語",
        "恋愛 性格診断",
        "愛情表現 診断 無料",
        "Rubel Canvas",
      ],
      promptLabel: "いちばん「愛されている」と感じる瞬間は？",
      promptPlaceholder: "例：数週間前の小さな話を覚えていてくれた…",
      submitLabel: "ラブランゲージを見る →",
      trustLine: "恋愛SEO · ログイン不要",
      schemaName: "ラブランゲージ性格クイズ",
      schemaDescription: "1回答型ラブランゲージ診断。",
      faq: [
        {
          question: "チャップマン博士のモデル？",
          answer: "5つの愛の言語框架を参考にしています。",
        },
        { question: "カップル向け？", answer: "ソロでもOK — 結果をX/LINEでシェア。" },
      ],
    },
    ko: {
      keyword: "사랑의 언어 검사",
      title: "사랑의 언어 검사 — 무료 AI 연애 진단",
      headline: "말, 스킨십, 시간 — 당신의 사랑의 언어는?",
      subhead: "한 번의 솔직한 답변으로 관계 아키타입 + AI 미러.",
      metaDescription:
        "무료 사랑의 언어 성격 검사. 한 답변으로 연애 아키타입과 AI 채팅.",
      keywords: [
        "사랑의 언어 테스트",
        "5가지 사랑의 언어",
        "연애 성격검사",
        "사랑의 언어 무료",
        "Rubel Canvas",
      ],
      promptLabel: "가장 '사랑받는다'고 느낄 때는?",
      promptPlaceholder: "예: 몇 주 전 얘기한 작은 것을 기억해 줬을 때…",
      submitLabel: "사랑의 언어 보기 →",
      trustLine: "연애 SEO · 로그인 불필요",
      schemaName: "사랑의 언어 성격 퀴즈",
      schemaDescription: "단일 응답 사랑의 언어 스타일 발견.",
      faq: [
        { question: "채프먼 모델?", answer: "5가지 사랑의 언어 프레임워크 영감." },
        { question: "커플용?", answer: "솔로도 OK — X/LINE 공유." },
      ],
    },
    zh: {
      keyword: "爱的五种语言 测试",
      title: "爱的语言测试 — 免费 AI 恋爱诊断",
      headline: "言语、触碰、时间 — 你的爱的语言？",
      subhead: "一次真实回答，解锁关系原型 + AI 镜像。",
      metaDescription:
        "免费爱的语言性格测试。一次回答，恋爱原型与 AI 聊天。",
      keywords: [
        "爱的语言测试",
        "五种爱的语言",
        "恋爱 性格测试",
        "爱的语言 免费",
        "Rubel Canvas",
      ],
      promptLabel: "何时最感到「被爱」？",
      promptPlaceholder: "例如：记住了几周前我提过的细节…",
      submitLabel: "查看爱的语言 →",
      trustLine: "恋爱 SEO · 无需登录",
      schemaName: "爱的语言性格测验",
      schemaDescription: "单次回答爱的语言风格发现。",
      faq: [
        { question: "基于 Chapman 模型？", answer: "参考五种爱的语言框架。" },
        { question: "情侣适用？", answer: "单人也可 — 结果可分享至 X/LINE。" },
      ],
    },
  },
  "attachment-style": {
    en: {
      keyword: "Attachment Style Test",
      title: "Attachment Style Test — Secure, Anxious, Avoidant",
      headline: "Secure, anxious, or avoidant — know in one answer",
      subhead: "Relationship psychology made lightweight. Native text → global AI engine.",
      metaDescription:
        "Free attachment style test. Secure, anxious, avoidant, disorganized — one answer, AI insight.",
      keywords: [
        "attachment style test",
        "attachment theory quiz",
        "secure anxious avoidant",
        "relationship attachment test",
        "Rubel Canvas",
      ],
      promptLabel: "When someone you love goes quiet, you…",
      promptPlaceholder: "e.g. I spiral until they text back, even if I hide it…",
      submitLabel: "Map My Attachment Style →",
      trustLine: "Clinical-inspired · Not medical advice",
      schemaName: "Attachment Style Assessment",
      schemaDescription: "Single-response attachment style self-assessment.",
      faq: [
        {
          question: "Therapy replacement?",
          answer: "No — entertainment self-discovery only.",
        },
        {
          question: "Data stored?",
          answer: "Your answer routes session-only to the play engine.",
        },
      ],
    },
    ja: {
      keyword: "アタッチメント スタイル 診断",
      title: "アタッチメントスタイル診断 — 安定・不安・回避",
      headline: "安定・不安・回避 — 1回答でわかる",
      subhead: "関係心理学を超軽量に。母語テキスト → グローバルAI。",
      metaDescription:
        "無料アタッチメントスタイル診断。安定型・不安型・回避型 — 1回答でAI洞察。",
      keywords: [
        "アタッチメント 診断",
        "愛着スタイル テスト",
        "安定型 不安型 回避型",
        "恋愛 attachment",
        "Rubel Canvas",
      ],
      promptLabel: "大切な人が急に黙ったら、あなたは…",
      promptPlaceholder: "例：返事来るまで心配で仕方ない（表に出さないけど）…",
      submitLabel: "愛着スタイルを見る →",
      trustLine: "臨床 inspired · 医療アドバイスではありません",
      schemaName: "アタッチメントスタイル評価",
      schemaDescription: "1回答型愛着スタイル自己評価。",
      faq: [
        { question: "治療の代替？", answer: "いいえ — エンタメ自己理解のみ。" },
        { question: "データ保存？", answer: "回答はセッション内のみプレイエンジンへ。" },
      ],
    },
    ko: {
      keyword: "애착 유형 검사",
      title: "애착 유형 검사 — 안정·불안·회피",
      headline: "안정·불안·회피 — 한 답변으로",
      subhead: "관계 심리학을 초경량화. 모국어 → 글로벌 AI.",
      metaDescription:
        "무료 애착 유형 검사. 안정·불안·회피·혼란 — 한 답변 AI 인사이트.",
      keywords: [
        "애착 유형 테스트",
        "애착 이론 검사",
        "안정형 불안형 회피형",
        "관계 애착 검사",
        "Rubel Canvas",
      ],
      promptLabel: "사랑하는 사람이 갑자기 조용해지면?",
      promptPlaceholder: "예: 답장 올 때까지 불안해요(티 안 냄)…",
      submitLabel: "애착 유형 보기 →",
      trustLine: "임상 inspired · 의료 조언 아님",
      schemaName: "애착 유형 평가",
      schemaDescription: "단일 응답 애착 유형 자가 평가.",
      faq: [
        { question: "치료 대체?", answer: "아니요 — 엔터테인먼트 자기 발견." },
        { question: "데이터 저장?", answer: "세션 내에서만 플레이 엔진으로." },
      ],
    },
    zh: {
      keyword: "依恋类型 测试",
      title: "依恋类型测试 — 安全·焦虑·回避",
      headline: "安全、焦虑还是回避 — 一次回答",
      subhead: "关系心理学超轻量。母语文本 → 全球 AI。",
      metaDescription:
        "免费依恋类型测试。安全型、焦虑型、回避型 — 一次回答 AI 洞察。",
      keywords: [
        "依恋类型测试",
        "依恋理论 测验",
        "安全型 焦虑型 回避型",
        "关系依恋测试",
        "Rubel Canvas",
      ],
      promptLabel: "你爱的人突然沉默，你会…",
      promptPlaceholder: "例如：没回消息就焦虑（但不表现出来）…",
      submitLabel: "查看依恋类型 →",
      trustLine: "临床启发 · 非医疗建议",
      schemaName: "依恋类型评估",
      schemaDescription: "单次回答依恋类型自我评估。",
      faq: [
        { question: "替代治疗？", answer: "不是 — 仅供娱乐自我发现。" },
        { question: "数据存储？", answer: "回答仅会话内注入 play 引擎。" },
      ],
    },
  },
  "burnout-personality": {
    en: {
      keyword: "Burnout Personality Test",
      title: "Burnout Risk Personality Test — Free AI Scan",
      headline: "Is your personality burning out?",
      subhead: "One truth about your workload → burnout archetype + supportive AI.",
      metaDescription:
        "Free burnout personality test. One answer reveals burnout risk type and AI coaching chat.",
      keywords: [
        "burnout test",
        "burnout personality",
        "burnout quiz free",
        "work stress personality",
        "Rubel Canvas",
      ],
      promptLabel: "What does exhaustion feel like in your body?",
      promptPlaceholder: "e.g. My chest tightens Sunday night before Monday…",
      submitLabel: "Scan Burnout Risk →",
      trustLine: "Wellness SEO · HF AI support",
      schemaName: "Burnout Risk Personality Quiz",
      schemaDescription: "Single-response burnout personality screening.",
      faq: [
        {
          question: "Medical diagnosis?",
          answer: "No — wellness self-check only.",
        },
        {
          question: "Immediate help?",
          answer: "If in crisis, contact local emergency services.",
        },
      ],
    },
    ja: {
      keyword: "燃え尽き 性格診断",
      title: "燃え尽きリスク性格診断 — 無料AIスキャン",
      headline: "あなたの性格、燃え尽きてない？",
      subhead: "仕事の本音1つ → 燃え尽き原型 + 寄り添うAI。",
      metaDescription:
        "無料燃え尽き性格診断。1回答で燃え尽きリスクタイプとAIコーチング。",
      keywords: [
        "燃え尽き 診断",
        "バーンアウト テスト 無料",
        "燃え尽き 性格",
        "ストレス 性格診断",
        "Rubel Canvas",
      ],
      promptLabel: "「疲れ」は体のどこに来る？",
      promptPlaceholder: "例：日曜夜、月曜前に胸が締め付けられる…",
      submitLabel: "燃え尽きリスクをスキャン →",
      trustLine: "ウェルネスSEO · HF AI",
      schemaName: "燃え尽きリスク性格クイズ",
      schemaDescription: "1回答型燃え尽き性格スクリーニング。",
      faq: [
        { question: "医学診断？", answer: "いいえ — ウェルネス自己チェックのみ。" },
        { question: "緊急時は？", answer: "危機時は地域の緊急サービスへ。" },
      ],
    },
    ko: {
      keyword: "번아웃 성격 검사",
      title: "번아웃 위험 성격 검사 — 무료 AI 스캔",
      headline: "당신의 성격, 번아웃 중?",
      subhead: "업무에 대한 한 마디 → 번아웃 아키타입 + AI.",
      metaDescription:
        "무료 번아웃 성격 검사. 한 답변으로 번아웃 위험 유형과 AI 코칭.",
      keywords: [
        "번아웃 테스트",
        "번아웃 성격",
        "번아웃 검사 무료",
        "직장 스트레스 성격",
        "Rubel Canvas",
      ],
      promptLabel: "지침은 몸 어디에 느껴지나요?",
      promptPlaceholder: "예: 일요일 밤 월요일 전 가슴이 조여요…",
      submitLabel: "번아웃 위험 스캔 →",
      trustLine: "웰니스 SEO · HF AI",
      schemaName: "번아웃 위험 성격 퀴즈",
      schemaDescription: "단일 응답 번아웃 성격 스크리닝.",
      faq: [
        { question: "의학 진단?", answer: "아니요 — 웰니스 자가 점검." },
        { question: "위기 시?", answer: "지역 응급 서비스에 연락하세요." },
      ],
    },
    zh: {
      keyword: "burnout 性格测试",
      title: "burnout 风险性格测试 — 免费 AI 扫描",
      headline: "你的性格，正在 burnout 吗？",
      subhead: "一句工作真话 → burnout 原型 + 支持 AI。",
      metaDescription:
        "免费 burnout 性格测试。一次回答揭示 burnout 风险类型与 AI 教练。",
      keywords: [
        "burnout 测试",
        "职业倦怠 性格",
        "burnout 测验 免费",
        "工作压力 性格",
        "Rubel Canvas",
      ],
      promptLabel: "exhaustion 在身体哪里感受？",
      promptPlaceholder: "例如：周日晚上周一前胸口发紧…",
      submitLabel: "扫描 burnout 风险 →",
      trustLine: "wellness SEO · HF AI",
      schemaName: "burnout 风险性格测验",
      schemaDescription: "单次回答 burnout 性格筛查。",
      faq: [
        { question: "医学诊断？", answer: "不是 — 仅 wellness 自检。" },
        { question: "危机？", answer: "请联系当地紧急服务。" },
      ],
    },
  },
  "inner-child-healing": {
    en: {
      keyword: "Inner Child Healing Test",
      title: "Inner Child Healing Quiz — Free AI Reflection",
      headline: "What is your inner child trying to tell you?",
      subhead: "One memory, one sentence — gentle archetype + AI emotional mirror.",
      metaDescription:
        "Free inner child healing personality quiz. One answer, AI reflective chat for emotional patterns.",
      keywords: [
        "inner child test",
        "inner child healing quiz",
        "inner child work free",
        "emotional healing personality",
        "Rubel Canvas",
      ],
      promptLabel: "A childhood moment that still shapes you today…",
      promptPlaceholder: "e.g. Being praised only when I stayed quiet and helpful…",
      submitLabel: "Meet My Inner Child Type →",
      trustLine: "Empathy-first UX · No account",
      schemaName: "Inner Child Healing Quiz",
      schemaDescription: "Single-response inner child archetype reflection.",
      faq: [
        {
          question: "Replacement for therapy?",
          answer: "No — a reflective journaling-style experience.",
        },
        {
          question: "Is my text private?",
          answer: "Processed session-only for AI reply generation.",
        },
      ],
    },
    ja: {
      keyword: "インナーチャイルド 診断",
      title: "インナーチャイルド診断 — 無料AIリフレクション",
      headline: "インナーチャイルドが伝えたいことは？",
      subhead: "1つの記憶、1文 — やさしい原型 + 感情ミラーAI。",
      metaDescription:
        "無料インナーチャイルド性格診断。1回答で感情パターンのAIリフレクティブチャット。",
      keywords: [
        "インナーチャイルド 診断",
        "インナーチャイルド テスト 無料",
        "インナーチャイルド ワーク",
        "感情 癒し 診断",
        "Rubel Canvas",
      ],
      promptLabel: "今も影響する幼少期のひとコマ…",
      promptPlaceholder: "例：大人しく役に立つ時だけ褒められた…",
      submitLabel: "インナーチャイルドタイプ →",
      trustLine: "共感UX · アカウント不要",
      schemaName: "インナーチャイルドクイズ",
      schemaDescription: "1回答型インナーチャイルド原型リフレクション。",
      faq: [
        { question: "セラピー代替？", answer: "いいえ — ジャーナリング風体験。" },
        { question: "テキストは非公開？", answer: "セッション内のみAI生成に使用。" },
      ],
    },
    ko: {
      keyword: "내면아이 치유 검사",
      title: "내면아이 치유 퀴즈 — 무료 AI 성찰",
      headline: "내면아이가 전하려는 말은?",
      subhead: "한 기억, 한 문장 — 부드러운 아키타입 + AI 감정 미러.",
      metaDescription:
        "무료 내면아이 성격 퀴즈. 한 답변으로 감정 패턴 AI 성찰 채팅.",
      keywords: [
        "내면아이 테스트",
        "내면아이 치유 퀴즈",
        "내면아이 워크 무료",
        "감정 치유 성격",
        "Rubel Canvas",
      ],
      promptLabel: "오늘도 영향을 주는 어린 시절 한 장면…",
      promptPlaceholder: "예: 조용히 도울 때만 칭찬받았어요…",
      submitLabel: "내면아이 유형 보기 →",
      trustLine: "공감 UX · 계정 불필요",
      schemaName: "내면아이 치유 퀴즈",
      schemaDescription: "단일 응답 내면아이 아키타입 성찰.",
      faq: [
        { question: "치료 대체?", answer: "아니요 — 저널링형 경험." },
        { question: "텍스트 비공개?", answer: "세션 내 AI 생성에만 사용." },
      ],
    },
    zh: {
      keyword: "内在小孩 疗愈测试",
      title: "内在小孩疗愈测验 — 免费 AI 反思",
      headline: "你的内在小孩想说什么？",
      subhead: "一段记忆，一句话 — 温柔原型 + AI 情感镜像。",
      metaDescription:
        "免费内在小孩性格测验。一次回答，AI 反思聊天探索情感模式。",
      keywords: [
        "内在小孩测试",
        "内在小孩疗愈 测验",
        "内在小孩 免费",
        "情感疗愈 性格",
        "Rubel Canvas",
      ],
      promptLabel: "至今仍影响你的童年一幕…",
      promptPlaceholder: "例如：只有安静帮忙时才被表扬…",
      submitLabel: "查看内在小孩类型 →",
      trustLine: "共情 UX · 无需账号",
      schemaName: "内在小孩疗愈测验",
      schemaDescription: "单次回答内在小孩原型反思。",
      faq: [
        { question: "替代治疗？", answer: "不是 — 日记式体验。" },
        { question: "文字私密？", answer: "仅会话内用于 AI 生成。" },
      ],
    },
  },
  "shadow-self-archetype": {
    en: {
      keyword: "Shadow Self Archetype Test",
      title: "Shadow Self Test — Jungian Archetype AI",
      headline: "Face your shadow. One sentence is enough.",
      subhead: "Jungian-inspired shadow archetype mapped from your native confession.",
      metaDescription:
        "Free shadow self archetype test. Jungian psychology-inspired. One answer, AI shadow mirror chat.",
      keywords: [
        "shadow self test",
        "Jungian archetype quiz",
        "shadow work personality",
        "dark side personality test",
        "Rubel Canvas",
      ],
      promptLabel: "A trait you hide because you're ashamed of it…",
      promptPlaceholder: "e.g. I secretly crave recognition more than I admit…",
      submitLabel: "Reveal My Shadow Archetype →",
      trustLine: "Jungian hook · Global engine",
      schemaName: "Shadow Self Archetype Quiz",
      schemaDescription: "Single-response Jungian shadow archetype discovery.",
      faq: [
        {
          question: "Is shadow work dangerous?",
          answer: "This is light self-reflection entertainment, not depth therapy.",
        },
        {
          question: "Who built this?",
          answer: "Rubel Canvas — Lu + Bel = liberate beautiful souls.",
        },
      ],
    },
    ja: {
      keyword: "シャドウ 自己 診断",
      title: "シャドウセルフ診断 — ユング AI アーキタイプ",
      headline: "影に向き合う。1文で十分。",
      subhead: "ユング風シャドウ原型を、母語の告白からマッピング。",
      metaDescription:
        "無料シャドウセルフ性格診断。ユング心理学 inspired。1回答、AIシャドウミラー。",
      keywords: [
        "シャドウ 診断",
        "ユング アーキタイプ テスト",
        "シャドウワーク 性格",
        "裏性格 診断",
        "Rubel Canvas",
      ],
      promptLabel: "恥ずかしくて隠している性質…",
      promptPlaceholder: "例：認められたい欲が、自分でも強すぎる…",
      submitLabel: "シャドウ原型を見る →",
      trustLine: "ユングフック · グローバルエンジン",
      schemaName: "シャドウセルフアーキタイプクイズ",
      schemaDescription: "1回答型ユング風シャドウ原型診断。",
      faq: [
        { question: "シャドウワークは危険？", answer: "軽い自己反射エンタメです。" },
        {
          question: "誰が作った？",
          answer: "Rubel Canvas — Lu + Bel = 美しい魂を解放。",
        },
      ],
    },
    ko: {
      keyword: "그림자 자아 검사",
      title: "그림자 자아 테스트 — 융 AI 아키타입",
      headline: "그림자와 마주하세요. 한 문장이면 충분.",
      subhead: "융 영감 그림자 아키타입을 모국어 고백에서 매핑.",
      metaDescription:
        "무료 그림자 자아 성격 검사. 융 심리학 inspired. 한 답변, AI 그림자 미러.",
      keywords: [
        "그림자 자아 테스트",
        "융 아키타입 퀴즈",
        "섀도우 워크 성격",
        "어두운 면 성격검사",
        "Rubel Canvas",
      ],
      promptLabel: "부끄러워 숨기는 성격…",
      promptPlaceholder: "예: 인정받고 싶은 욕구가 생각보다 큼…",
      submitLabel: "그림자 아키타입 보기 →",
      trustLine: "융 훅 · 글로벌 엔진",
      schemaName: "그림자 자아 아키타입 퀴즈",
      schemaDescription: "단일 응답 융 스타일 그림자 아키타입 발견.",
      faq: [
        { question: "섀도우 워크 위험?", answer: "가벼운 자기 성찰 엔터테인먼트." },
        { question: "제작?", answer: "Rubel Canvas — Lu + Bel." },
      ],
    },
    zh: {
      keyword: "阴影自我 原型测试",
      title: "阴影自我测试 — 荣格 AI 原型",
      headline: "面对阴影。一句话就够。",
      subhead: "荣格风格阴影原型，从母语告白映射。",
      metaDescription:
        "免费阴影自我原型测试。荣格心理学 inspired。一次回答，AI 阴影镜像。",
      keywords: [
        "阴影自我测试",
        "荣格 原型 测验",
        "阴影工作 性格",
        "黑暗面 性格测试",
        "Rubel Canvas",
      ],
      promptLabel: "因羞耻而隐藏特质…",
      promptPlaceholder: "例如：渴望被认可比承认的更强…",
      submitLabel: "查看阴影原型 →",
      trustLine: "荣格钩子 · 全球引擎",
      schemaName: "阴影自我原型测验",
      schemaDescription: "单次回答荣格风格阴影原型发现。",
      faq: [
        { question: "阴影工作危险吗？", answer: "轻度自我反思娱乐。" },
        { question: "谁制作的？", answer: "Rubel Canvas — Lu + Bel。" },
      ],
    },
  },
};

export function getLandingCopy(
  slug: LandingTopicSlug,
  locale: LandingLocale,
): LandingPageCopy {
  if (isEuropeanDiscoverLocale(locale)) {
    return applySerpClickPack(slug, locale, getDiscoverCopyFrDe(slug, locale));
  }

  const copy =
    getLegalSafeLandingCopy(slug, locale) ?? LANDING_COPY[slug][locale as CoreLandingLocale];

  return applySerpClickPack(slug, locale, copy);
}
