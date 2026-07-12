import type { LandingPageCopy } from "@/lib/landing/landingCopy";
import type { LandingLocale } from "@/lib/landing/landingLocales";
import type { LandingTopicSlug } from "@/lib/landing/landingTopics";

type SerpPatch = Pick<LandingPageCopy, "title" | "metaDescription" | "headline">;

/** Phase 7S — CTR-optimized title/description/headline overlays (GSC top slugs). */
const SERP_CLICK_PACK: Partial<
  Record<LandingTopicSlug, Partial<Record<LandingLocale, SerpPatch>>>
> = {
  "enneagram-nine-types": {
    en: {
      title: "9 Motivation Patterns — Free AI Test in 1 Answer | LibertyCanvas",
      headline: "Which motivation pattern lives in you? Find out in one answer.",
      metaDescription:
        "Free motivation spectrum test. One honest answer → instant AI cosmic character + affirming chat. No login. Academic Big Five science.",
    },
    ja: {
      title: "無料動機スペクトル診断｜1回答でAI宇宙キャラ判定 | LibertyCanvas",
      headline: "9つの動機パターン — 1つの本音で宇宙キャラがわかる",
      metaDescription:
        "無料の動機スペクトル性格診断。1回答→AI宇宙キャラ判定＆全肯定チャット。登録不要。学術ビッグファイブベース。",
    },
    ko: {
      title: "무료 동기 스펙트럼 검사｜한 답변 AI 우주 캐릭터 | LibertyCanvas",
      headline: "9가지 동기 패턴 — 한 답변으로 우주 캐릭터 발견",
      metaDescription:
        "무료 동기 스펙트럼 성격 검사. 한 답변→AI 우주 캐릭터 매칭·전격 긍정 채팅. 가입 불필요.",
    },
    zh: {
      title: "免费动机光谱测试｜一次回答 AI 宇宙角色 | LibertyCanvas",
      headline: "九种动机模式 — 一次回答看见宇宙角色",
      metaDescription:
        "免费动机光谱性格测试。一次回答→AI 宇宙角色匹配与全肯定聊天。无需登录。",
    },
    fr: {
      title: "9 profils motivationnels — test IA gratuit en 1 réponse | LibertyCanvas",
      headline: "Quel motif motivationnel vous habite ? Une réponse suffit.",
      metaDescription:
        "Test gratuit du spectre motivationnel. Une réponse → personnage cosmique IA + chat bienveillant. Sans inscription.",
    },
    de: {
      title: "9 Motivationsmuster — kostenloser KI-Test in 1 Antwort | LibertyCanvas",
      headline: "Welches Motivationsmuster steckt in Ihnen? Eine Antwort genügt.",
      metaDescription:
        "Kostenloser Motivationsspektrum-Test. Eine Antwort → KI-Kosmoscharakter + bestärkender Chat. Ohne Anmeldung.",
    },
  },
  "mbti-personality-types": {
    en: {
      title: "Free Personality Test — AI Cosmic Result in 1 Answer | LibertyCanvas",
      headline: "Academic trait axes → one answer → your cosmic character",
      metaDescription:
        "Free personality spectrum test online. One answer, instant AI cosmic match + chat. Big Five science — no login.",
    },
    ja: {
      title: "無料性格タイプ診断｜1回答で宇宙キャラ即判定 | LibertyCanvas",
      headline: "学術5因子から1回答 — あなたの宇宙キャラへ",
      metaDescription:
        "無料性格スペクトル診断。1回答→AI宇宙キャラ判定＆チャット。登録不要。",
    },
    ko: {
      title: "무료 성격 유형 검사｜한 답변 우주 캐릭터 | LibertyCanvas",
      headline: "학술 5요인 — 한 답변으로 우주 캐릭터",
      metaDescription:
        "무료 성격 스펙트럼 검사. 한 답변→AI 우주 캐릭터·채팅. 가입 불필요.",
    },
    zh: {
      title: "免费性格类型测试｜一次回答 AI 宇宙角色 | LibertyCanvas",
      headline: "学术五因子 — 一次回答看见宇宙角色",
      metaDescription:
        "免费性格光谱测试。一次回答→AI 宇宙角色与聊天。无需登录。",
    },
    fr: {
      title: "Test de personnalité gratuit — résultat IA en 1 réponse | LibertyCanvas",
      headline: "Axes de traits académiques → une réponse → votre personnage cosmique",
      metaDescription:
        "Test gratuit du spectre de personnalité. Une réponse → match cosmique IA + chat. Sans inscription.",
    },
    de: {
      title: "Kostenloser Persönlichkeitstest — KI-Ergebnis in 1 Antwort | LibertyCanvas",
      headline: "Akademische Trait-Achsen → eine Antwort → Ihr Kosmoscharakter",
      metaDescription:
        "Kostenloser Persönlichkeitsspektrum-Test. Eine Antwort → KI-Match + Chat. Ohne Anmeldung.",
    },
  },
  "sixteen-personalities": {
    en: {
      title: "Free 4-Axis Personality Test — Instant AI Match | LibertyCanvas",
      headline: "Four trait axes. One answer. Instant cosmic character.",
      metaDescription:
        "Free four-axis personality spectrum test. One response → AI cosmic character + chat. No login.",
    },
    ja: {
      title: "無料4軸性格診断｜1回答で宇宙キャラ判定 | LibertyCanvas",
      headline: "4つの性格軸 — 1回答で宇宙キャラがわかる",
      metaDescription:
        "無料4軸性格スペクトル診断。1回答→AI宇宙キャラ＆チャット。登録不要。",
    },
    ko: {
      title: "무료 4축 성격 검사｜한 답변 AI 우주 캐릭터 | LibertyCanvas",
      headline: "4가지 성격 축 — 한 답변으로 우주 캐릭터",
      metaDescription:
        "무료 4축 성격 스펙트럼. 한 응답→AI 우주 캐릭터·채팅.",
    },
    zh: {
      title: "免费四轴性格测试｜一次回答 AI 宇宙角色 | LibertyCanvas",
      headline: "四条性格轴 — 一次回答看见宇宙角色",
      metaDescription:
        "免费四轴性格光谱。一次回答→AI 宇宙角色与聊天。",
    },
    fr: {
      title: "Test 4 axes gratuit — match IA instantané | LibertyCanvas",
      headline: "Quatre axes de traits. Une réponse. Personnage cosmique instantané.",
      metaDescription:
        "Test gratuit du spectre à 4 axes. Une réponse → personnage cosmique IA + chat.",
    },
    de: {
      title: "Kostenloser 4-Achsen-Test — sofortiger KI-Match | LibertyCanvas",
      headline: "Vier Trait-Achsen. Eine Antwort. Sofortiger Kosmoscharakter.",
      metaDescription:
        "Kostenloser 4-Achsen-Spektrum-Test. Eine Antwort → KI-Kosmoscharakter + Chat.",
    },
  },
  "big-five-ocean": {
    en: {
      title: "Free Big Five (OCEAN) Test — AI Result in 1 Answer | LibertyCanvas",
      headline: "Your OCEAN profile from one honest answer",
      metaDescription:
        "Free Big Five OCEAN personality test. One answer → instant AI trait map + chat. No signup.",
    },
    ja: {
      title: "無料ビッグファイブ(OCEAN)診断｜1回答でAI判定 | LibertyCanvas",
      headline: "1つの本音から OCEAN プロフィール",
      metaDescription:
        "無料ビッグファイブ OCEAN 性格診断。1回答→AI因子マップ＆チャット。登録不要。",
    },
    ko: {
      title: "무료 빅파이브(OCEAN) 검사｜한 답변 AI 결과 | LibertyCanvas",
      headline: "한 답변으로 OCEAN 프로필",
      metaDescription:
        "무료 Big Five OCEAN 성격 검사. 한 답변→AI 요인 맵·채팅.",
    },
    zh: {
      title: "免费大五(OCEAN)测试｜一次回答 AI 结果 | LibertyCanvas",
      headline: "一次真实回答，看见 OCEAN 画像",
      metaDescription:
        "免费大五 OCEAN 性格测试。一次回答→AI 因子图与聊天。",
    },
    fr: {
      title: "Test Big Five (OCEAN) gratuit — résultat IA en 1 réponse | LibertyCanvas",
      headline: "Votre profil OCEAN en une réponse sincère",
      metaDescription:
        "Test OCEAN Big Five gratuit. Une réponse → carte de traits IA + chat. Sans inscription.",
    },
    de: {
      title: "Kostenloser Big-Five (OCEAN) Test — KI in 1 Antwort | LibertyCanvas",
      headline: "Ihr OCEAN-Profil aus einer ehrlichen Antwort",
      metaDescription:
        "Kostenloser Big-Five-OCEAN-Test. Eine Antwort → KI-Trait-Karte + Chat.",
    },
  },
};

export function applySerpClickPack(
  slug: LandingTopicSlug,
  locale: LandingLocale,
  copy: LandingPageCopy,
): LandingPageCopy {
  const patch = SERP_CLICK_PACK[slug]?.[locale];

  if (!patch) {
    return copy;
  }

  return { ...copy, ...patch };
}
