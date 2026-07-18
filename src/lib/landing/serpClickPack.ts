import { BRAND_LANDING_SLUG } from "@/lib/landing/brandLandingSlug";
import type { LandingPageCopy } from "@/lib/landing/landingCopy";
import type { LandingLocale } from "@/lib/landing/landingLocales";
import type { LandingTopicSlug } from "@/lib/landing/landingTopics";
import { LANDING_DISCOVER_NAME } from "@/lib/landing/landingBrand";
import { PRODUCT_NAME, PRODUCT_NAME_JA } from "@/lib/brand/constants";

type SerpPatch = Pick<LandingPageCopy, "title" | "metaDescription" | "headline">;

const B = LANDING_DISCOVER_NAME;

function packEnJa(
  en: SerpPatch,
  ja: SerpPatch,
): Partial<Record<LandingLocale, SerpPatch>> {
  return {
    en: { ...en, title: `${en.title} | ${B}` },
    ja: { ...ja, title: `${ja.title} | ${B}` },
  };
}

function packAll(
  locales: Partial<Record<LandingLocale, Omit<SerpPatch, "title"> & { title: string }>>,
): Partial<Record<LandingLocale, SerpPatch>> {
  const out: Partial<Record<LandingLocale, SerpPatch>> = {};
  for (const [locale, patch] of Object.entries(locales) as Array<
    [LandingLocale, SerpPatch]
  >) {
    out[locale] = {
      ...patch,
      title: patch.title.includes(B) ? patch.title : `${patch.title} | ${B}`,
    };
  }
  return out;
}

/** Phase 7S — CTR-optimized overlays. Discover brand only (no Canvas suffix). */
const SERP_CLICK_PACK: Partial<
  Record<LandingTopicSlug, Partial<Record<LandingLocale, SerpPatch>>>
> = {
  [BRAND_LANDING_SLUG]: packAll({
    en: {
      title: `${PRODUCT_NAME} — Free AI Personality Test Hub`,
      headline: "LibertyCanvas: free AI quizzes, cosmic results, no signup",
      metaDescription:
        "Official LibertyCanvas hub. Free AI personality tests — Big Five, motivation spectrum, cosmic chat. Start in one answer.",
    },
    ja: {
      title: `${PRODUCT_NAME_JA}（libertycanvas）とは｜無料AI性格診断`,
      headline: "リバティ・キャンバスの使い方 — 1回答で宇宙キャラ診断",
      metaDescription:
        "libertycanvas（リバティ・キャンバス）公式。無料AI性格診断の紹介と使い方。登録不要・1回答から開始。",
    },
    ko: {
      title: `${PRODUCT_NAME} — 무료 AI 성격 검사 허브`,
      headline: "LibertyCanvas: 한 답변 AI 우주 캐릭터",
      metaDescription: "공식 LibertyCanvas. 무료 AI 성격 검사·코스믹 채팅. 가입 불필요.",
    },
    zh: {
      title: `${PRODUCT_NAME} — 免费 AI 性格测试中心`,
      headline: "LibertyCanvas：一次回答看见宇宙角色",
      metaDescription: "LibertyCanvas 官方入口。免费 AI 性格测试与全肯定聊天。无需注册。",
    },
    fr: {
      title: `${PRODUCT_NAME} — hub de tests IA gratuits`,
      headline: "LibertyCanvas : une réponse, clarté cosmique",
      metaDescription:
        "Hub officiel LibertyCanvas. Tests de personnalité IA gratuits. Sans inscription.",
    },
    de: {
      title: `${PRODUCT_NAME} — kostenlose KI-Persönlichkeitstests`,
      headline: "LibertyCanvas: Persönlichkeitstest mit einer Antwort",
      metaDescription:
        "Offizieller LibertyCanvas-Hub. Kostenlose KI-Persönlichkeitstests. Ohne Anmeldung.",
    },
  }),
  "enneagram-nine-types": packAll({
    en: {
      title: "9 Motivation Patterns — Free AI Test in 1 Answer",
      headline: "Which motivation pattern lives in you? Find out in one answer.",
      metaDescription:
        "Free motivation spectrum test. One honest answer → instant AI cosmic character + affirming chat. No login.",
    },
    ja: {
      title: "無料動機スペクトル診断｜1回答でAI宇宙キャラ判定",
      headline: "9つの動機パターン — 1つの本音で宇宙キャラがわかる",
      metaDescription:
        "無料の動機スペクトル性格診断。1回答→AI宇宙キャラ判定＆全肯定チャット。登録不要。",
    },
    ko: {
      title: "무료 동기 스펙트럼 검사｜한 답변 AI 우주 캐릭터",
      headline: "9가지 동기 패턴 — 한 답변으로 우주 캐릭터 발견",
      metaDescription:
        "무료 동기 스펙트럼 성격 검사. 한 답변→AI 우주 캐릭터 매칭·전격 긍정 채팅.",
    },
    zh: {
      title: "免费动机光谱测试｜一次回答 AI 宇宙角色",
      headline: "九种动机模式 — 一次回答看见宇宙角色",
      metaDescription: "免费动机光谱性格测试。一次回答→AI 宇宙角色匹配与全肯定聊天。",
    },
    fr: {
      title: "9 profils motivationnels — test IA gratuit en 1 réponse",
      headline: "Quel motif motivationnel vous habite ? Une réponse suffit.",
      metaDescription:
        "Test gratuit du spectre motivationnel. Une réponse → personnage cosmique IA + chat.",
    },
    de: {
      title: "9 Motivationsmuster — kostenloser KI-Test in 1 Antwort",
      headline: "Welches Motivationsmuster steckt in Ihnen? Eine Antwort genügt.",
      metaDescription:
        "Kostenloser Motivationsspektrum-Test. Eine Antwort → KI-Kosmoscharakter + Chat.",
    },
  }),
  "mbti-personality-types": packAll({
    en: {
      title: "Free Personality Test — AI Cosmic Result in 1 Answer",
      headline: "Academic trait axes → one answer → your cosmic character",
      metaDescription:
        "Free personality spectrum test online. One answer, instant AI cosmic match + chat.",
    },
    ja: {
      title: "無料性格タイプ診断｜1回答で宇宙キャラ即判定",
      headline: "学術5因子から1回答 — あなたの宇宙キャラへ",
      metaDescription:
        "無料性格スペクトル診断。1回答→AI宇宙キャラ判定＆チャット。登録不要。",
    },
    ko: {
      title: "무료 성격 유형 검사｜한 답변 우주 캐릭터",
      headline: "학술 5요인 — 한 답변으로 우주 캐릭터",
      metaDescription: "무료 성격 스펙트럼 검사. 한 답변→AI 우주 캐릭터·채팅.",
    },
    zh: {
      title: "免费性格类型测试｜一次回答 AI 宇宙角色",
      headline: "学术五因子 — 一次回答看见宇宙角色",
      metaDescription: "免费性格光谱测试。一次回答→AI 宇宙角色与聊天。",
    },
    fr: {
      title: "Test de personnalité gratuit — résultat IA en 1 réponse",
      headline: "Axes de traits académiques → une réponse → votre personnage cosmique",
      metaDescription:
        "Test gratuit du spectre de personnalité. Une réponse → match cosmique IA + chat.",
    },
    de: {
      title: "Kostenloser Persönlichkeitstest — KI-Ergebnis in 1 Antwort",
      headline: "Akademische Trait-Achsen → eine Antwort → Ihr Kosmoscharakter",
      metaDescription:
        "Kostenloser Persönlichkeitsspektrum-Test. Eine Antwort → KI-Match + Chat.",
    },
  }),
  "sixteen-personalities": packAll({
    en: {
      title: "Free 4-Axis Personality Test — Instant AI Match",
      headline: "Four trait axes. One answer. Instant cosmic character.",
      metaDescription:
        "Free four-axis personality spectrum test. One response → AI cosmic character + chat.",
    },
    ja: {
      title: "無料4軸性格診断｜1回答で宇宙キャラ判定",
      headline: "4つの性格軸 — 1回答で宇宙キャラがわかる",
      metaDescription:
        "無料4軸性格スペクトル診断。1回答→AI宇宙キャラ＆チャット。登録不要。",
    },
    ko: {
      title: "무료 4축 성격 검사｜한 답변 AI 우주 캐릭터",
      headline: "4가지 성격 축 — 한 답변으로 우주 캐릭터",
      metaDescription: "무료 4축 성격 스펙트럼. 한 응답→AI 우주 캐릭터·채팅.",
    },
    zh: {
      title: "免费四轴性格测试｜一次回答 AI 宇宙角色",
      headline: "四条性格轴 — 一次回答看见宇宙角色",
      metaDescription: "免费四轴性格光谱。一次回答→AI 宇宙角色与聊天。",
    },
    fr: {
      title: "Test 4 axes gratuit — match IA instantané",
      headline: "Quatre axes de traits. Une réponse. Personnage cosmique instantané.",
      metaDescription:
        "Test gratuit du spectre à 4 axes. Une réponse → personnage cosmique IA + chat.",
    },
    de: {
      title: "Kostenloser 4-Achsen-Test — sofortiger KI-Match",
      headline: "Vier Trait-Achsen. Eine Antwort. Sofortiger Kosmoscharakter.",
      metaDescription:
        "Kostenloser 4-Achsen-Spektrum-Test. Eine Antwort → KI-Kosmoscharakter + Chat.",
    },
  }),
  "big-five-ocean": packAll({
    en: {
      title: "Free Big Five (OCEAN) Test — AI Result in 1 Answer",
      headline: "Your OCEAN profile from one honest answer",
      metaDescription:
        "Free Big Five OCEAN personality test. One answer → instant AI trait map + chat.",
    },
    ja: {
      title: "無料ビッグファイブ(OCEAN)診断｜1回答でAI判定",
      headline: "1つの本音から OCEAN プロフィール",
      metaDescription:
        "無料ビッグファイブ OCEAN 性格診断。1回答→AI因子マップ＆チャット。登録不要。",
    },
    ko: {
      title: "무료 빅파이브(OCEAN) 검사｜한 답변 AI 결과",
      headline: "한 답변으로 OCEAN 프로필",
      metaDescription: "무료 Big Five OCEAN 성격 검사. 한 답변→AI 요인 맵·채팅.",
    },
    zh: {
      title: "免费大五(OCEAN)测试｜一次回答 AI 结果",
      headline: "一次真实回答，看见 OCEAN 画像",
      metaDescription: "免费大五 OCEAN 性格测试。一次回答→AI 因子图与聊天。",
    },
    fr: {
      title: "Test Big Five (OCEAN) gratuit — résultat IA en 1 réponse",
      headline: "Votre profil OCEAN en une réponse sincère",
      metaDescription:
        "Test OCEAN Big Five gratuit. Une réponse → carte de traits IA + chat.",
    },
    de: {
      title: "Kostenloser Big-Five (OCEAN) Test — KI in 1 Antwort",
      headline: "Ihr OCEAN-Profil aus einer ehrlichen Antwort",
      metaDescription:
        "Kostenloser Big-Five-OCEAN-Test. Eine Antwort → KI-Trait-Karte + Chat.",
    },
  }),
  "introvert-personality": packEnJa(
    {
      title: "Free Introvert Personality Test — Quiet Strength Types",
      headline: "How does your quiet energy show up in daily life?",
      metaDescription:
        "Free introvert spectrum quiz. One answer → cosmic character + affirming AI chat.",
    },
    {
      title: "無料・内向型性格診断 — 静かな強さタイプ",
      headline: "あなたの静かなエネルギーは、どう現れますか？",
      metaDescription: "無料の内向型スペクトル診断。1回答→宇宙キャラ＆全肯定AIチャット。",
    },
  ),
  "love-language-test": packEnJa(
    {
      title: "Free Love Language Style Quiz — Connection Types",
      headline: "How do you show care when words are hard?",
      metaDescription:
        "Free love-style personality quiz. One honest answer → AI insight. No login.",
    },
    {
      title: "無料・愛情表現スタイル診断",
      headline: "言葉にしにくいとき、あなたはどう伝えますか？",
      metaDescription: "無料の愛情表現スタイル診断。1回答→AIインサイト。登録不要。",
    },
  ),
  "attachment-style": packEnJa(
    {
      title: "Free Attachment Style Quiz — Bonding Patterns",
      headline: "What bonding pattern feels most like you?",
      metaDescription:
        "Free attachment-style personality quiz. One answer → affirming AI result.",
    },
    {
      title: "無料・愛着スタイル診断",
      headline: "いちばんしっくりくる絆のパターンは？",
      metaDescription: "無料の愛着スタイル診断。1回答→全肯定AI結果。登録不要。",
    },
  ),
  "burnout-personality": packEnJa(
    {
      title: "Free Burnout Personality Quiz — Recovery Types",
      headline: "How does stress reshape your daily rhythm?",
      metaDescription:
        "Free burnout-recovery personality quiz. One answer → AI cosmic insight.",
    },
    {
      title: "無料・燃え尽き傾向診断",
      headline: "ストレスは、あなたの日常リズムをどう変えますか？",
      metaDescription: "無料の燃え尽き傾向診断。1回答→AI宇宙インサイト。登録不要。",
    },
  ),
  "inner-child-healing": packEnJa(
    {
      title: "Free Inner Child Style Quiz — Soft Strength Types",
      headline: "Which gentle strength lives in your inner child?",
      metaDescription:
        "Free inner-child personality quiz. One answer → affirming AI companion.",
    },
    {
      title: "無料・インナーチャイルド診断",
      headline: "あなたの内なる子どもが持つ、やさしい強さは？",
      metaDescription: "無料のインナーチャイルド診断。1回答→全肯定AIコンパニオン。",
    },
  ),
  "shadow-self-archetype": packAll({
    en: {
      title: "Free Shadow Self Quiz — Jung-Inspired Archetypes",
      headline: "Which hidden pattern quietly shapes your choices?",
      metaDescription:
        "Free shadow self quiz online. Jung-inspired archetypes → cosmic AI insight. No login.",
    },
    ja: {
      title: "無料シャドウ診断｜ユング着想の影アーキタイプ",
      headline: "静かに選択を形づくる、あなたの「影」は？",
      metaDescription:
        "無料のシャドウ（影）自己診断。ユング心理学着想→宇宙AIインサイト。登録不要。",
    },
    ko: {
      title: "무료 섀도우 셀프 검사｜숨은 패턴",
      headline: "선택을 조용히 만드는 숨은 패턴은?",
      metaDescription: "무료 섀도우 아키타입 검사. 한 답변→코스믹 AI 인사이트.",
    },
    zh: {
      title: "免费阴影自我测试｜荣格启发原型",
      headline: "安静塑造选择的隐藏模式是？",
      metaDescription: "免费阴影自我测试。一次回答→宇宙 AI 洞察。无需注册。",
    },
    fr: {
      title: "Quiz Ombre de soi gratuit — archétypes inspirés de Jung",
      headline: "Quel motif caché façonne vos choix ?",
      metaDescription: "Quiz ombre de soi gratuit. Une réponse → insight cosmique IA.",
    },
    de: {
      title: "Kostenloser Schatten-Selbst-Test — Jung-Archetypen",
      headline: "Welches verborgene Muster prägt Ihre Entscheidungen?",
      metaDescription:
        "Kostenloser Shadow-Self-Persönlichkeitstest. Eine Antwort → kosmischer KI-Insight.",
    },
  }),
  "world-specialty-soul": packEnJa(
    {
      title: "Which Nation's Culinary Terroir Echoes Your Profile?",
      headline: "Which nation's culinary terroir echoes your implicit data profile?",
      metaDescription:
        "Free 9-country specialty soul quiz. 24 questions → craft archetypes + Plug deep-dive.",
    },
    {
      title: "あなたの内なるデータに響く国のテロワールは？",
      headline: "あなたの内なるデータに響く、どの国のテロワール？",
      metaDescription:
        "無料・世界9カ国名産ソウル診断。24問→職人アーキタイプ＆Plug深掘り。",
    },
  ),
  "jp-sakamai-craft": packEnJa(
    {
      title: "Japan Koji Craft Soul Quiz — Fermentation Types",
      headline: "What kind of koji craft soul lives in you?",
      metaDescription: "Free Japan specialty deep-dive. 12 questions → artisan subtypes.",
    },
    {
      title: "麹魂タイプ診断 — 日本の発酵職人性格",
      headline: "あなたの「麹魂」はどの職人タイプ？",
      metaDescription: "無料・麹魂タイプ診断。日本ものづくり性格を細分化。",
    },
  ),
  "fr-terroir-poet": packEnJa(
    {
      title: "France Terroir Poet Quiz — Craft Personality",
      headline: "Does terroir poetry describe how you create?",
      metaDescription:
        "Free France specialty deep-dive. Land, craft, and aesthetic temperament.",
    },
    {
      title: "テロワール詩人診断 — フランス土地の美学",
      headline: "土地の個性を守る「詩人」タイプ、あなたに近い？",
      metaDescription: "無料・テロワール詩人診断。フランス名産文化の深掘り。",
    },
  ),
  "uk-maturation-highlander": packEnJa(
    {
      title: "UK Highland Craft Quiz — Long-Horizon Personality",
      headline: "Is your spirit shaped by patient highland craft?",
      metaDescription:
        "Free UK specialty deep-dive. Discipline, tradition, long-horizon craft.",
    },
    {
      title: "熟成の高地人診断 — イギリス・熟成文化",
      headline: "時間を味方にする「高地人」魂、あなたに近い？",
      metaDescription: "無料・熟成の高地人診断。規律と伝統の職人魂タイプ。",
    },
  ),
  "us-corn-frontier": packEnJa(
    {
      title: "US Frontier Seeder — Start with World Specialty Quiz",
      headline: "Do you carry the frontier seeder spirit?",
      metaDescription:
        "US deep-dive launching soon — start with the 9-country world quiz.",
    },
    {
      title: "フロンティア・シーダー — 世界診断から始める",
      headline: "広い地平を見据える開拓型、あなたに近い？",
      metaDescription: "深掘り版準備中。まず世界名産ソウル診断からお試しください。",
    },
  ),
  "ca-maple-resilience": packEnJa(
    {
      title: "Canada Maple Resilience — Start with World Specialty",
      headline: "Do you harvest strength after long winters?",
      metaDescription:
        "Canada deep-dive launching soon — begin with the world specialty quiz.",
    },
    {
      title: "春告げハーベスター — 世界診断から始める",
      headline: "長い冬のあと、どう立ち直りますか？",
      metaDescription: "深掘り版準備中。まず世界名産ソウル診断からお試しください。",
    },
  ),
  "br-terra-roxa-spirit": packEnJa(
    {
      title: "Brazil Terra Roxa Spirit — Start with World Specialty",
      headline: "Does rich soil energy describe how you create?",
      metaDescription:
        "Brazil deep-dive launching soon — begin with the world specialty quiz.",
    },
    {
      title: "テラ・ロッサ開拓者 — 世界診断から始める",
      headline: "豊かな土壌で多様性を育てる情熱、あなたに近い？",
      metaDescription: "深掘り版準備中。まず世界名産ソウル診断からお試しください。",
    },
  ),
  "cl-andes-dualcraft": packEnJa(
    {
      title: "Chile Andes Dualcraft — Start with World Specialty",
      headline: "Do you balance resources and creative craft?",
      metaDescription:
        "Chile deep-dive launching soon — begin with the world specialty quiz.",
    },
    {
      title: "アンデス二刀流 — 世界診断から始める",
      headline: "資源と創造の二刀流、あなたに近い？",
      metaDescription: "深掘り版準備中。まず世界名産ソウル診断からお試しください。",
    },
  ),
  "md-cellar-guardian": packEnJa(
    {
      title: "Moldova Cellar Guardian — Start with World Specialty",
      headline: "Do you guard value that matures underground?",
      metaDescription:
        "Moldova deep-dive launching soon — begin with the world specialty quiz.",
    },
    {
      title: "地下セラー守り人 — 世界診断から始める",
      headline: "見えない価値を守り抜く継承型、あなたに近い？",
      metaDescription: "深掘り版準備中。まず世界名産ソウル診断からお試しください。",
    },
  ),
  "pk-fragrant-earth": packEnJa(
    {
      title: "Pakistan Fragrant Earth — Start with World Specialty",
      headline: "Does hospitality craft describe your pride?",
      metaDescription:
        "Pakistan deep-dive launching soon — begin with the world specialty quiz.",
    },
    {
      title: "香りのプリンス — 世界診断から始める",
      headline: "大地の恵みをもてなすタイプ、あなたに近い？",
      metaDescription: "深掘り版準備中。まず世界名産ソウル診断からお試しください。",
    },
  ),
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
