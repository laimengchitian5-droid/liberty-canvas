import {
  PRODUCT_NAME,
  PRODUCT_NAME_JA,
  PRODUCT_NAME_SLUG,
  PRODUCT_TAGLINE_EN,
  PRODUCT_TAGLINE_JA,
} from "@/lib/brand/constants";
import type { LandingPageCopy } from "@/lib/landing/landingCopy";
import {
  LANDING_DISCOVER_NAME,
  LANDING_PARENT_NAME,
} from "@/lib/landing/landingBrand";
import {
  BRAND_LANDING_SLUG,
  type BrandLandingSlug,
} from "@/lib/landing/brandLandingSlug";
import type { CoreLandingLocale, EuropeanDiscoverLocale } from "@/lib/landing/landingLocales";

export { BRAND_LANDING_SLUG, isBrandLandingSlug } from "@/lib/landing/brandLandingSlug";
export type { BrandLandingSlug } from "@/lib/landing/brandLandingSlug";

const TRUST_EN = "Free AI personality tests · One answer · No signup";
const TRUST_JA = "無料AI性格診断 · 1回答 · 登録不要";
const TRUST_KO = "무료 AI 성격 검사 · 한 답변 · 가입 불필요";
const TRUST_ZH = "免费 AI 性格测试 · 一次回答 · 无需注册";
const TRUST_FR = "Tests IA gratuits · Une réponse · Sans inscription";
const TRUST_DE = "Kostenlose KI-Tests · Eine Antwort · Ohne Anmeldung";

function brandFaqEn(): LandingPageCopy["faq"] {
  return [
    {
      question: `What is ${PRODUCT_NAME}?`,
      answer: `${PRODUCT_TAGLINE_EN} ${LANDING_DISCOVER_NAME} landings route into Liberty Plug diagnoses.`,
    },
    {
      question: "Is LibertyCanvas free?",
      answer: "Yes. Core personality quizzes need no account. One honest answer starts the flow.",
    },
    {
      question: "Which tests can I take?",
      answer:
        "Big Five (OCEAN), motivation spectrum, personality spectrum, romance, Gen-Z cosmic, and specialty craft quizzes.",
    },
    {
      question: "Who made this?",
      answer: `${LANDING_PARENT_NAME} — Lu + Bel. Liberate beautiful souls.`,
    },
  ];
}

function brandFaqJa(): LandingPageCopy["faq"] {
  return [
    {
      question: `${PRODUCT_NAME_JA}（${PRODUCT_NAME_SLUG}）とは？`,
      answer: `${PRODUCT_TAGLINE_JA} Discover ランディングから Liberty Plug 本編へ進めます。`,
    },
    {
      question: "本当に無料ですか？",
      answer: "はい。主要な性格診断は登録不要です。1つの本音からすぐに始められます。",
    },
    {
      question: "どんな診断がありますか？",
      answer:
        "ビッグファイブ（OCEAN）、動機スペクトル、性格スペクトル、恋愛、Gen-Z 宇宙キャラ、名産クラフト診断などです。",
    },
    {
      question: "使い方の最短ルートは？",
      answer:
        "下の回答欄に一言書くか、「診断をはじめる」からカタログへ。気になるテーマを1つ選ぶだけです。",
    },
  ];
}

function brandFaqKo(): LandingPageCopy["faq"] {
  return [
    {
      question: `${PRODUCT_NAME}란?`,
      answer: "무료 AI 성격 검사. 한 답변으로 우주 캐릭터 결과와 전격 긍정 채팅.",
    },
    {
      question: "가입이 필요한가요?",
      answer: "아니요. 핵심 검사는 계정 없이 바로 시작할 수 있습니다.",
    },
  ];
}

function brandFaqZh(): LandingPageCopy["faq"] {
  return [
    {
      question: `${PRODUCT_NAME} 是什么？`,
      answer: "免费 AI 性格测试。一次回答即可获得宇宙角色结果与全肯定聊天。",
    },
    {
      question: "需要注册吗？",
      answer: "不需要。核心测试无需账号即可开始。",
    },
  ];
}

function buildCore(
  locale: CoreLandingLocale,
  fields: Omit<LandingPageCopy, "trustLine" | "faq">,
  faq: LandingPageCopy["faq"],
): LandingPageCopy {
  const trustLine =
    locale === "ja"
      ? TRUST_JA
      : locale === "ko"
        ? TRUST_KO
        : locale === "zh"
          ? TRUST_ZH
          : TRUST_EN;

  return { ...fields, trustLine, faq };
}

export function buildBrandLandingCopyMatrix(): Record<
  BrandLandingSlug,
  Record<CoreLandingLocale, LandingPageCopy>
> {
  return {
    [BRAND_LANDING_SLUG]: {
      en: buildCore(
        "en",
        {
          keyword: "LibertyCanvas",
          title: `${PRODUCT_NAME} — Free AI Personality Tests`,
          headline: `Meet ${PRODUCT_NAME}: one answer, cosmic clarity`,
          subhead: PRODUCT_TAGLINE_EN,
          metaDescription: `${PRODUCT_NAME} (${PRODUCT_NAME_SLUG}) — free AI personality tests. Big Five, motivation spectrum, cosmic results. No signup.`,
          keywords: [
            "libertycanvas",
            "liberty canvas",
            "free AI personality test",
            "LibertyCanvas how to use",
            PRODUCT_NAME,
          ],
          promptLabel: "What brought you to LibertyCanvas today?",
          promptPlaceholder: "e.g. I want a free personality check before bed…",
          submitLabel: "Start with LibertyCanvas →",
          schemaName: `${PRODUCT_NAME} — AI Personality Platform`,
          schemaDescription: PRODUCT_TAGLINE_EN,
        },
        brandFaqEn(),
      ),
      ja: buildCore(
        "ja",
        {
          keyword: "libertycanvas",
          title: `${PRODUCT_NAME_JA}（LibertyCanvas）とは｜使い方と無料診断`,
          headline: `${PRODUCT_NAME_JA}へようこそ — 1回答で宇宙キャラ診断`,
          subhead: `${PRODUCT_TAGLINE_JA} ビッグファイブ・動機スペクトル・シャドウ系テーマまで、無料で試せます。`,
          metaDescription: `${PRODUCT_NAME_JA}（libertycanvas）の紹介と使い方。無料AI性格診断、1回答で結果と全肯定チャット。登録不要。`,
          keywords: [
            "libertycanvas",
            "リバティキャンバス",
            "リバティ・キャンバス",
            "無料 性格診断",
            "AI 性格診断 使い方",
            PRODUCT_NAME_JA,
          ],
          promptLabel: "いま、どんな気持ちで訪れましたか？",
          promptPlaceholder: "例：寝る前に気軽に性格診断してみたい…",
          submitLabel: "無料診断をはじめる →",
          schemaName: `${PRODUCT_NAME_JA} — AI性格診断プラットフォーム`,
          schemaDescription: PRODUCT_TAGLINE_JA,
        },
        brandFaqJa(),
      ),
      ko: buildCore(
        "ko",
        {
          keyword: "LibertyCanvas",
          title: `${PRODUCT_NAME} — 무료 AI 성격 검사`,
          headline: `${PRODUCT_NAME}: 한 답변으로 우주 캐릭터`,
          subhead: "빅파이브·동기 스펙트럼·코스믹 결과. 가입 없이 시작.",
          metaDescription: `${PRODUCT_NAME} (libertycanvas) 무료 AI 성격 검사 소개. 한 답변·전격 긍정 채팅.`,
          keywords: ["libertycanvas", "liberty canvas", "무료 성격 검사", "AI 성격 테스트"],
          promptLabel: "오늘 LibertyCanvas에 오신 이유는?",
          promptPlaceholder: "예: 잠들기 전 가벼운 성격 검사가 하고 싶어요…",
          submitLabel: "무료 검사 시작 →",
          schemaName: `${PRODUCT_NAME} — AI 성격 플랫폼`,
          schemaDescription: "무료 AI 성격 검사. 한 답변으로 결과와 채팅.",
        },
        brandFaqKo(),
      ),
      zh: buildCore(
        "zh",
        {
          keyword: "LibertyCanvas",
          title: `${PRODUCT_NAME} — 免费 AI 性格测试`,
          headline: `${PRODUCT_NAME}：一次回答，看见宇宙角色`,
          subhead: "大五、动机光谱、宇宙结果。无需注册。",
          metaDescription: `${PRODUCT_NAME}（libertycanvas）免费 AI 性格测试介绍。一次回答与全肯定聊天。`,
          keywords: ["libertycanvas", "liberty canvas", "免费性格测试", "AI 性格测试"],
          promptLabel: "今天为什么来到 LibertyCanvas？",
          promptPlaceholder: "例如：睡前想轻松测一下性格…",
          submitLabel: "开始免费测试 →",
          schemaName: `${PRODUCT_NAME} — AI 性格平台`,
          schemaDescription: "免费 AI 性格测试。一次回答即可获得结果与聊天。",
        },
        brandFaqZh(),
      ),
    },
  };
}

export function buildBrandDiscoverCopyFrDe(): Record<
  BrandLandingSlug,
  Record<EuropeanDiscoverLocale, LandingPageCopy>
> {
  return {
    [BRAND_LANDING_SLUG]: {
      fr: {
        keyword: "LibertyCanvas",
        title: `${PRODUCT_NAME} — tests de personnalité IA gratuits`,
        headline: `Découvrez ${PRODUCT_NAME} : une réponse, clarté cosmique`,
        subhead: "Big Five, spectre motivationnel, résultats cosmiques. Sans inscription.",
        metaDescription: `${PRODUCT_NAME} (libertycanvas) — tests IA gratuits. Une réponse suffit.`,
        keywords: ["libertycanvas", "test personnalité gratuit", "IA personnalité"],
        promptLabel: "Pourquoi venez-vous sur LibertyCanvas ?",
        promptPlaceholder: "ex. Je veux un test rapide avant de dormir…",
        submitLabel: "Commencer →",
        trustLine: TRUST_FR,
        schemaName: `${PRODUCT_NAME} — plateforme IA`,
        schemaDescription: "Tests de personnalité IA gratuits. Une réponse.",
        faq: [
          {
            question: `Qu'est-ce que ${PRODUCT_NAME} ?`,
            answer: "Plateforme de tests de personnalité IA gratuits, sans compte.",
          },
          {
            question: "Faut-il un compte ?",
            answer: "Non. Une réponse lance le parcours Liberty Plug.",
          },
        ],
      },
      de: {
        keyword: "LibertyCanvas",
        title: `${PRODUCT_NAME} — kostenlose KI-Persönlichkeitstests`,
        headline: `Willkommen bei ${PRODUCT_NAME}: eine Antwort, kosmische Klarheit`,
        subhead: "Big Five, Motivationsspektrum, kosmische Ergebnisse. Ohne Anmeldung.",
        metaDescription: `${PRODUCT_NAME} (libertycanvas) — kostenlose KI-Persönlichkeitstests. Eine Antwort genügt.`,
        keywords: [
          "libertycanvas",
          "persönlichkeitstest kostenlos",
          "KI persönlichkeitstest",
        ],
        promptLabel: "Was führt Sie heute zu LibertyCanvas?",
        promptPlaceholder: "z. B. Ich möchte vor dem Schlafen kurz testen…",
        submitLabel: "Kostenlos starten →",
        trustLine: TRUST_DE,
        schemaName: `${PRODUCT_NAME} — KI-Plattform`,
        schemaDescription: "Kostenlose KI-Persönlichkeitstests. Eine Antwort.",
        faq: [
          {
            question: `Was ist ${PRODUCT_NAME}?`,
            answer: "Kostenlose KI-Persönlichkeitstests — ohne Konto.",
          },
          {
            question: "Brauche ich ein Konto?",
            answer: "Nein. Eine Antwort startet den Liberty-Plug-Flow.",
          },
        ],
      },
    },
  };
}
