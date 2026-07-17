import type { LandingLocale } from "@/lib/landing/landingLocales";
import type { LandingTopicSlug } from "@/lib/landing/landingTopics";
import type { LandingPageCopy } from "@/lib/landing/landingCopy";

const LEGAL_DISCLAIMER: Record<LandingLocale, string> = {
  en: "Liberty Canvas uses academic Big Five trait science and original Liberty archetypes — not licensed proprietary type instruments.",
  ja: "Liberty Canvas は学術的なビッグファイブ因子とオリジナルの Liberty アーキタイプを用います。商用ライセンス診断ではありません。",
  ko: "Liberty Canvas는 학술적 Big Five 요인과 오리지널 Liberty 아키타입을 사용합니다. 라이선스 성격검사가 아닙니다.",
  zh: "Liberty Canvas 使用学术大五因子与原创 Liberty 原型，非授权商用性格测验。",
  fr: "Liberty Canvas utilise la science académique du Big Five et des archétypes Liberty originaux — pas d'instruments propriétaires sous licence.",
  de: "Liberty Canvas nutzt akademische Big-Five-Trait-Wissenschaft und originale Liberty-Archetypen — keine lizenzierten proprietären Typinstrumente.",
};

type LegalOverrideMatrix = Partial<
  Record<LandingTopicSlug, Partial<Record<LandingLocale, LandingPageCopy>>>
>;

/** Public-facing copy overrides — URLs/slugs unchanged (Phase 6A). */
export const LEGAL_SAFE_LANDING_OVERRIDES: LegalOverrideMatrix = {
  "enneagram-nine-types": {
    en: {
      keyword: "Motivation Spectrum Personality Test",
      title: "Free Motivation Spectrum Test — AI Cosmic Match | Liberty Canvas",
      headline: "Which of the 9 motivation patterns lives in you?",
      subhead:
        "One honest answer maps to Liberty Canvas motivation archetypes and affirming AI chat. Academic trait science — no signup.",
      metaDescription:
        "Free motivation spectrum personality test. One answer, instant AI cosmic character match and chat. Nine drive patterns — no login.",
      keywords: [
        "motivation spectrum test",
        "personality drive patterns",
        "free personality test",
        "Big Five traits",
        "Liberty Canvas",
      ],
      promptLabel: "What fear or desire drives you most?",
      promptPlaceholder: "e.g. I need to grow without losing who I am…",
      submitLabel: "Reveal My Motivation Pattern →",
      trustLine: "Academic trait mapping · Instant routing · No signup",
      schemaName: "Motivation Spectrum Personality Quiz",
      schemaDescription:
        "Single-response motivation pattern discovery with affirming AI companion on Liberty Canvas.",
      faq: [
        {
          question: "Does this cover nine motivation patterns?",
          answer:
            "Yes — your answer maps to the closest Liberty Canvas motivation archetype in our academic matrix.",
        },
        {
          question: "Is this a licensed type instrument?",
          answer: LEGAL_DISCLAIMER.en,
        },
      ],
    },
    ja: {
      keyword: "動機スペクトル 性格診断",
      title: "無料動機スペクトル診断 — AI宇宙キャラ判定 | Liberty Canvas",
      headline: "9つの動機パターン、あなたの核はどれ？",
      subhead:
        "1つの本音回答で、Liberty Canvas の動機アーキタイプと全肯定AIチャットへ。学術5因子ベース・登録不要。",
      metaDescription:
        "無料の動機スペクトル性格診断。1回答でAI宇宙キャラ判定＆チャット。9つの動機パターン、ログイン不要。",
      keywords: [
        "動機スペクトル 診断",
        "性格診断 無料",
        "ビッグファイブ 動機",
        "宇宙キャラ 診断",
        "Liberty Canvas",
      ],
      promptLabel: "いちばん強い「恐れ」か「欲求」は？",
      promptPlaceholder: "例：嫌われたくなくて、誰かの役に立ちたい…",
      submitLabel: "動機パターンを見る →",
      trustLine: "学術因子マッピング · 即ルーティング · 登録不要",
      schemaName: "動機スペクトル性格クイズ",
      schemaDescription:
        "1回答型の動機パターン診断と全肯定AIコンパニオン（Liberty Canvas）。",
      faq: [
        {
          question: "9パターンすべて対応？",
          answer:
            "はい。回答は最も近い Liberty Canvas 動機アーキタイプにマッピングされます。",
        },
        {
          question: "商用ライセンス診断ですか？",
          answer: LEGAL_DISCLAIMER.ja,
        },
      ],
    },
    ko: {
      keyword: "동기 스펙트럼 성격 검사",
      title: "무료 동기 스펙트럼 검사 — AI 우주 캐릭터 | Liberty Canvas",
      headline: "9가지 동기 패턴 중 당신의 핵심은?",
      subhead:
        "한 번의 솔직한 답변으로 Liberty Canvas 동기 아키타입과 전격 긍정 AI 채팅. 학술 Big Five 기반.",
      metaDescription:
        "무료 동기 스펙트럼 성격 검사. 한 답변으로 AI 우주 캐릭터 매칭 및 채팅. 9가지 동기 패턴.",
      keywords: [
        "동기 스펙트럼 검사",
        "성격검사 무료",
        "Big Five",
        "우주 캐릭터 진단",
        "Liberty Canvas",
      ],
      promptLabel: "가장 강한 '두려움' 또는 '욕구'는?",
      promptPlaceholder: "예: 거절당할까 봐 누군가에게 도움이 되고 싶어요…",
      submitLabel: "동기 패턴 보기 →",
      trustLine: "학술 요인 매핑 · 즉시 라우팅 · 가입 불필요",
      schemaName: "동기 스펙트럼 성격 퀴즈",
      schemaDescription: "단일 응답 동기 패턴 발견 및 Liberty Canvas AI 동반 채팅.",
      faq: [
        {
          question: "9가지 패턴을 모두 지원하나요?",
          answer: "네. 답변은 가장 가까운 Liberty Canvas 동기 아키타입에 매핑됩니다.",
        },
        {
          question: "라이선스 성격검사인가요?",
          answer: LEGAL_DISCLAIMER.ko,
        },
      ],
    },
    zh: {
      keyword: "动机光谱 性格测试",
      title: "免费动机光谱测试 — AI 宇宙角色 | Liberty Canvas",
      headline: "九种动机模式，哪一种活在你心里？",
      subhead:
        "一次真实回答，映射 Liberty Canvas 动机原型与全肯定 AI 聊天。学术大五因子基础。",
      metaDescription:
        "免费动机光谱性格测试。一次回答，AI 宇宙角色匹配与聊天。九种动机模式，无需登录。",
      keywords: [
        "动机光谱测试",
        "免费性格测试",
        "大五人格",
        "宇宙角色诊断",
        "Liberty Canvas",
      ],
      promptLabel: "最强的「恐惧」或「欲望」是什么？",
      promptPlaceholder: "例如：害怕被拒绝，又很想帮助身边的人…",
      submitLabel: "查看动机模式 →",
      trustLine: "学术因子映射 · 即时路由 · 无需注册",
      schemaName: "动机光谱性格测验",
      schemaDescription: "单次回答动机模式发现与 Liberty Canvas AI 陪伴聊天。",
      faq: [
        {
          question: "涵盖全部九种模式吗？",
          answer: "是的，回答会映射到最接近的 Liberty Canvas 动机原型。",
        },
        {
          question: "这是授权商用测验吗？",
          answer: LEGAL_DISCLAIMER.zh,
        },
      ],
    },
  },
  "sixteen-personalities": {
    en: {
      keyword: "Four-Axis Personality Spectrum Test",
      title: "Free Personality Spectrum Test — Liberty Canvas",
      headline: "Four trait axes. One honest answer. One cosmic character.",
      subhead:
        "Openness, empathy, drive, and stability — mapped to Liberty Canvas archetypes and affirming AI chat.",
      metaDescription:
        "Free four-axis personality spectrum test. One response, instant AI cosmic character and chat. Academic Big Five science — no login.",
      keywords: [
        "personality spectrum test",
        "four axis personality",
        "free personality test",
        "Big Five OCEAN",
        "Liberty Canvas",
      ],
      promptLabel: "Describe how you recharge after a hard week.",
      promptPlaceholder: "e.g. Solo creative time restores me more than big crowds…",
      submitLabel: "Reveal My Spectrum →",
      trustLine: "Academic trait radar · Sub-second routing",
      schemaName: "Personality Spectrum Quiz",
      schemaDescription:
        "Single-answer four-axis personality spectrum with affirming AI chat on Liberty Canvas.",
      faq: [
        {
          question: "How is this scored?",
          answer:
            "We use academic Big Five trait vectors and Liberty Canvas original cosmic archetypes — not proprietary four-letter type codes.",
        },
        {
          question: "How fast is the result?",
          answer: "Instant — your text routes to the Plug diagnosis engine immediately.",
        },
      ],
    },
    ja: {
      keyword: "4軸 性格スペクトル 診断",
      title: "無料性格スペクトル診断 — 宇宙キャラ判定 | Liberty Canvas",
      headline: "4つの性格軸。1つの本音。1つの宇宙キャラ。",
      subhead:
        "開放性・共感・推進力・安定性を Liberty Canvas の宇宙アーキタイプと全肯定AIチャットへ。",
      metaDescription:
        "無料4軸性格スペクトル診断。1回答でAI宇宙キャラ判定＆チャット。学術ビッグファイブベース。",
      keywords: [
        "性格スペクトル 診断",
        "4軸 性格診断 無料",
        "ビッグファイブ",
        "宇宙キャラ 診断",
        "Liberty Canvas",
      ],
      promptLabel: "しんどい1週間の後、どう recharge する？",
      promptPlaceholder: "例：大人数より、一人で創作する方が100倍回復する…",
      submitLabel: "スペクトルを見る →",
      trustLine: "学術因子レーダー · サブ秒ルーティング",
      schemaName: "性格スペクトルクイズ",
      schemaDescription: "1回答型4軸性格スペクトル診断（Liberty Canvas）。",
      faq: [
        {
          question: "採点方式は？",
          answer:
            "学術的ビッグファイブ因子と Liberty Canvas オリジナルの宇宙アーキタイプで判定します。4文字タイプコードは使いません。",
        },
        {
          question: "結果はどれくらい早い？",
          answer: "即座 — テキストが Plug 診断エンジンへ注入されます。",
        },
      ],
    },
    ko: {
      keyword: "4축 성격 스펙트럼 검사",
      title: "무료 성격 스펙트럼 검사 — Liberty Canvas",
      headline: "4가지 성격 축. 한 답변. 하나의 우주 캐릭터.",
      subhead:
        "개방성·공감·추진력·안정성을 Liberty Canvas 우주 아키타입과 AI 채팅으로 매핑.",
      metaDescription:
        "무료 4축 성격 스펙트럼 검사. 한 응답으로 AI 우주 캐릭터 및 채팅. Big Five 학술 기반.",
      keywords: ["성격 스펙트럼 검사", "4축 성격검사", "Big Five", "Liberty Canvas"],
      promptLabel: "힘든 한 주 후, 어떻게 재충전하나요?",
      promptPlaceholder: "예: 큰 모임보다 혼자 창작할 때 훨씬 회복돼요…",
      submitLabel: "스펙트럼 보기 →",
      trustLine: "학술 요인 레이더 · 서브초 라우팅",
      schemaName: "성격 스펙트럼 퀴즈",
      schemaDescription: "단일 응답 4축 성격 스펙트럼 (Liberty Canvas).",
      faq: [
        {
          question: "채점 방식은?",
          answer:
            "학술 Big Five 요인과 Liberty Canvas 우주 아키타입을 사용합니다. 4글자 유형 코드는 사용하지 않습니다.",
        },
        { question: "결과 속도는?", answer: "즉시 — Plug 진단 엔진으로 전달됩니다." },
      ],
    },
    zh: {
      keyword: "四轴性格光谱测试",
      title: "免费性格光谱测试 — Liberty Canvas",
      headline: "四条性格轴。一次回答。一个宇宙角色。",
      subhead:
        "开放性·共情·驱动力·稳定性映射到 Liberty Canvas 宇宙原型与全肯定 AI 聊天。",
      metaDescription:
        "免费四轴性格光谱测试。一次回答，AI 宇宙角色与聊天。学术大五因子基础。",
      keywords: ["性格光谱测试", "四轴性格", "大五人格", "Liberty Canvas"],
      promptLabel: "辛苦一周后，你如何恢复精力？",
      promptPlaceholder: "例如：比起大型聚会，独自创作更能让我恢复…",
      submitLabel: "查看光谱 →",
      trustLine: "学术因子雷达 · 亚秒级路由",
      schemaName: "性格光谱测验",
      schemaDescription: "单次回答四轴性格光谱（Liberty Canvas）。",
      faq: [
        {
          question: "如何计分？",
          answer:
            "使用学术大五因子与 Liberty Canvas 原创宇宙原型，不使用四字母类型代码。",
        },
        { question: "结果多快？", answer: "即时 — 文本直接注入 Plug 诊断引擎。" },
      ],
    },
  },
  "mbti-personality-types": {
    en: {
      keyword: "Personality Type Spectrum Test",
      title: "Free Personality Type Spectrum — AI Finder | Liberty Canvas",
      headline: "Academic trait axes — one answer, one cosmic match",
      subhead:
        "Extraversion, openness, empathy, conscientiousness, and calm — mapped without proprietary type codes.",
      metaDescription:
        "Free personality type spectrum test online. One answer, AI cosmic character finder and chat. Big Five academic science.",
      keywords: [
        "personality type spectrum",
        "free personality test",
        "Big Five traits",
        "cosmic character diagnosis",
        "Liberty Canvas",
      ],
      promptLabel: "When deciding, do you lead with logic or values?",
      promptPlaceholder: "e.g. I weigh how people feel before the spreadsheet…",
      submitLabel: "Find My Cosmic Match →",
      trustLine: "Multi-region landing · liberty-canvas.vercel.app",
      schemaName: "Personality Type Spectrum Quiz",
      schemaDescription:
        "Single-response academic trait spectrum discovery on Liberty Canvas.",
      faq: [
        {
          question: "Is this an official licensed type test?",
          answer: LEGAL_DISCLAIMER.en,
        },
        {
          question: "Languages supported?",
          answer: "English, Japanese, Korean, and Chinese native intakes.",
        },
      ],
    },
    ja: {
      keyword: "性格タイプスペクトル 診断",
      title: "無料性格タイプスペクトル診断 — AI宇宙キャラ | Liberty Canvas",
      headline: "学術5因子から、1回答で宇宙キャラへ",
      subhead:
        "外向性・開放性・共感・誠実性・感情安定性を Liberty Canvas 宇宙アーキタイプにマッピング。",
      metaDescription:
        "無料性格タイプスペクトル診断。1回答でAI宇宙キャラ判定＆チャット。学術ビッグファイブ科学。",
      keywords: [
        "性格タイプ 診断 無料",
        "性格スペクトル",
        "ビッグファイブ",
        "宇宙キャラ 診断",
        "Liberty Canvas",
      ],
      promptLabel: "決断するとき、論理と価値観どちらが先？",
      promptPlaceholder: "例：数字より、みんなが傷つかないか先に見る…",
      submitLabel: "宇宙キャラを見る →",
      trustLine: "多国LP · liberty-canvas.vercel.app",
      schemaName: "性格タイプスペクトルクイズ",
      schemaDescription: "1回答型学術因子スペクトル診断（Liberty Canvas）。",
      faq: [
        {
          question: "公式ライセンス診断ですか？",
          answer: LEGAL_DISCLAIMER.ja,
        },
        { question: "対応言語は？", answer: "日英韓中のネイティブ入力に対応。" },
      ],
    },
    ko: {
      keyword: "성격 유형 스펙트럼 검사",
      title: "무료 성격 유형 스펙트럼 — AI 우주 캐릭터 | Liberty Canvas",
      headline: "학술 5요인에서 한 답변, 우주 캐릭터까지",
      subhead:
        "외향성·개방성·공감·성실성·정서 안정성을 Liberty Canvas 우주 아키타입으로 매핑.",
      metaDescription:
        "무료 성격 유형 스펙트럼 검사. 한 답변으로 AI 우주 캐릭터 찾기 및 채팅.",
      keywords: ["성격 유형 검사", "성격 스펙트럼", "Big Five", "Liberty Canvas"],
      promptLabel: "결정할 때 논리와 가치 중 무엇이 먼저?",
      promptPlaceholder: "예: 숫자보다 사람의 감정을 먼저 봐요…",
      submitLabel: "우주 캐릭터 보기 →",
      trustLine: "다국 LP · liberty-canvas.vercel.app",
      schemaName: "성격 유형 스펙트럼 퀴즈",
      schemaDescription: "단일 응답 학술 요인 스펙트럼 (Liberty Canvas).",
      faq: [
        {
          question: "공식 라이선스 검사인가요?",
          answer: LEGAL_DISCLAIMER.ko,
        },
        { question: "지원 언어?", answer: "영어, 일본어, 한국어, 중국어." },
      ],
    },
    zh: {
      keyword: "性格类型光谱测试",
      title: "免费性格类型光谱 — AI 宇宙角色 | Liberty Canvas",
      headline: "学术五因子，一次回答，一个宇宙角色",
      subhead: "外向性·开放性·共情·尽责性·情绪稳定映射到 Liberty Canvas 宇宙原型。",
      metaDescription:
        "免费性格类型光谱测试。一次回答，AI 宇宙角色查找与聊天。学术大五科学。",
      keywords: ["性格类型测试", "性格光谱", "大五人格", "Liberty Canvas"],
      promptLabel: "做决定时，逻辑还是价值观优先？",
      promptPlaceholder: "例如：比起数据，我先看大家会不会受伤…",
      submitLabel: "查看宇宙角色 →",
      trustLine: "多区域落地页 · liberty-canvas.vercel.app",
      schemaName: "性格类型光谱测验",
      schemaDescription: "单次回答学术因子光谱（Liberty Canvas）。",
      faq: [
        {
          question: "官方授权测验吗？",
          answer: LEGAL_DISCLAIMER.zh,
        },
        { question: "支持语言？", answer: "英日韩中母语输入。" },
      ],
    },
  },
};

export function getLegalSafeLandingCopy(
  slug: LandingTopicSlug,
  locale: LandingLocale,
): LandingPageCopy | null {
  return LEGAL_SAFE_LANDING_OVERRIDES[slug]?.[locale] ?? null;
}
