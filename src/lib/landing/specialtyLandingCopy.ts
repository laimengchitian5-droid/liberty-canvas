import type { LandingPageCopy } from "@/lib/landing/landingCopy";
import type { CoreLandingLocale } from "@/lib/landing/landingLocales";
import {
  LANDING_BRAND_NARRATIVE_EN,
  LANDING_BRAND_NARRATIVE_JA,
  LANDING_DISCOVER_NAME,
} from "@/lib/landing/landingBrand";
import {
  getSpecialtyCountry,
  WORLD_SPECIALTY_PLAY_PATH,
  WORLD_SPECIALTY_SOUL_ID,
} from "@/lib/specialty/globalSpecialtyTaxonomy";
import type { LandingTopicSlug } from "@/lib/landing/landingTopics";
import type { SpecialtyCountryId } from "@/lib/specialty/types";

interface SpecialtyLandingSeed {
  readonly slug: LandingTopicSlug;
  readonly countryId?: SpecialtyCountryId;
  readonly plugPlayPath: string;
  readonly playDiagnosisId: string;
  readonly searchTags: readonly string[];
  readonly en: Pick<
    LandingPageCopy,
    | "keyword"
    | "title"
    | "headline"
    | "subhead"
    | "metaDescription"
    | "keywords"
    | "promptLabel"
    | "promptPlaceholder"
    | "submitLabel"
    | "schemaName"
    | "schemaDescription"
  >;
  readonly ja: Pick<
    LandingPageCopy,
    | "keyword"
    | "title"
    | "headline"
    | "subhead"
    | "metaDescription"
    | "keywords"
    | "promptLabel"
    | "promptPlaceholder"
    | "submitLabel"
    | "schemaName"
    | "schemaDescription"
  >;
}

const TRUST_EN = "Academic trait mapping · 24 questions · No signup";
const TRUST_JA = "学術因子マッピング · 24問 · 登録不要";
const TRUST_KO = "학술 특성 매핑 · 24문항 · 가입 불필요";
const TRUST_ZH = "学术特质映射 · 24题 · 无需注册";

function licensedFaqEn(): LandingPageCopy["faq"] {
  return [
    {
      question: "Is this a clinical personality test?",
      answer:
        "This is a Liberty Discover intake mapped to Liberty Canvas craft archetypes for self-insight and entertainment.",
    },
    {
      question: "Do I need an account?",
      answer: "No. One answer routes you into the full plug diagnosis instantly.",
    },
  ];
}

function licensedFaqJa(): LandingPageCopy["faq"] {
  return [
    {
      question: "臨床診断ですか？",
      answer:
        "Liberty Canvas 独自の名産文化アーキタイプにマッピングする自己理解ツールです。",
    },
    {
      question: "登録は必要ですか？",
      answer: "不要です。1つの回答から本編診断へそのまま進めます。",
    },
  ];
}

function buildLocaleCopy(
  seed: SpecialtyLandingSeed,
  locale: CoreLandingLocale,
): LandingPageCopy {
  const source = locale === "ja" ? seed.ja : seed.en;
  const trustLine =
    locale === "ja"
      ? TRUST_JA
      : locale === "ko"
        ? TRUST_KO
        : locale === "zh"
          ? TRUST_ZH
          : TRUST_EN;
  const faq = locale === "ja" ? licensedFaqJa() : licensedFaqEn();

  return {
    ...source,
    trustLine,
    faq,
  };
}

function resolveSpecialtyLandingRoute(seed: SpecialtyLandingSeed): {
  plugPlayPath: string;
  playDiagnosisId: string;
  routesToWorldEntry: boolean;
} {
  if (!seed.countryId) {
    return {
      plugPlayPath: seed.plugPlayPath,
      playDiagnosisId: seed.playDiagnosisId,
      routesToWorldEntry: false,
    };
  }

  const country = getSpecialtyCountry(seed.countryId);

  if (country.releasePhase === "live") {
    return {
      plugPlayPath: `/diagnosis/play/${country.cSlug}`,
      playDiagnosisId: `lc-specialty-country-${country.id}`,
      routesToWorldEntry: false,
    };
  }

  return {
    plugPlayPath: WORLD_SPECIALTY_PLAY_PATH,
    playDiagnosisId: WORLD_SPECIALTY_SOUL_ID,
    routesToWorldEntry: true,
  };
}

function applyWorldEntryCopyOverrides(
  copy: LandingPageCopy,
  locale: CoreLandingLocale,
): LandingPageCopy {
  if (locale === "ja") {
    return {
      ...copy,
      subhead: `${copy.subhead} 深掘り版は準備中のため、まず世界9カ国診断からお試しください。`,
      submitLabel: "世界名産ソウル診断から始める →",
    };
  }

  return {
    ...copy,
    subhead: `${copy.subhead} Deep-dive launching soon — start with the 9-country world quiz.`,
    submitLabel: "Start with World Specialty Quiz →",
  };
}

const SPECIALTY_LANDING_SEEDS: readonly SpecialtyLandingSeed[] = [
  {
    slug: "world-specialty-soul",
    plugPlayPath: "/diagnosis/play/world-specialty-soul",
    playDiagnosisId: "lc-world-specialty-soul",
    searchTags: [
      "world specialty",
      "culture quiz",
      "craft personality",
      "世界名産",
      "性格診断",
    ],
    en: {
      keyword: "World Specialty Soul Personality Test",
      title: "Free World Specialty Soul Quiz — 9 Country Craft Types",
      headline: "Which nation's culinary terroir echoes your implicit data profile?",
      subhead:
        "24 questions map you to one of nine country specialty archetypes — actionable cultural intelligence beyond viral food quizzes.",
      metaDescription:
        "Free world specialty soul personality quiz. 24 questions, nine country craft archetypes, instant shareable results on Liberty Plug.",
      keywords: [
        "world specialty quiz",
        "culture personality test",
        "craft archetype",
        "Liberty Discover",
      ],
      promptLabel: "What kind of work rhythm feels most like you?",
      promptPlaceholder: "e.g. I prefer slow, careful refinement over rushing to scale…",
      submitLabel: "Reveal My Specialty Soul →",
      schemaName: "World Specialty Soul Quiz",
      schemaDescription:
        "Nine-country craft philosophy personality mapping on Liberty Discover.",
    },
    ja: {
      keyword: "世界の名産ソウル診断",
      title: "無料・世界の名産ソウル診断 — 9カ国の職人魂タイプ",
      headline: "あなたの内なるデータに響く、どの国のテロワール？",
      subhead:
        "24問で9カ国の名産文化アーキタイプを判定。バズ系フード診断を超える、行動につながる文化知性です。",
      metaDescription:
        "無料の世界名産ソウル性格診断。24問・9カ国タイプ・シェア可能な結果を Liberty Plug で即表示。",
      keywords: ["世界名産診断", "国別性格診断", "職人魂", "Liberty Discover"],
      promptLabel: "いちばん自分らしい仕事のリズムは？",
      promptPlaceholder: "例：急がず、丁寧に仕上げるペースが落ち着く…",
      submitLabel: "名産ソウルタイプを見る →",
      schemaName: "世界名産ソウルクイズ",
      schemaDescription: "9カ国の名産文化と性格を照合する Liberty Discover 診断。",
    },
  },
  {
    slug: "jp-sakamai-craft",
    countryId: "jp",
    plugPlayPath: "/diagnosis/play/jp-sakamai-craft",
    playDiagnosisId: "lc-specialty-country-jp",
    searchTags: ["japan craft", "koji personality", "sakamai", "日本 職人", "麹"],
    en: {
      keyword: "Japan Koji Craft Personality Test",
      title: "Japan Koji Soul Quiz — Fermentation Rice Craft Types",
      headline: "What kind of koji craft soul lives in you?",
      subhead:
        "Deep-dive into Japan's fermentation craft philosophy with 12 focused questions.",
      metaDescription:
        "Free Japan koji craft personality quiz. Discover your artisan subtype — koji master, water sensor, and more.",
      keywords: [
        "Japan craft quiz",
        "koji personality",
        "artisan archetype",
        "Liberty Discover",
      ],
      promptLabel: "How do you approach careful, seasonal work?",
      promptPlaceholder: "e.g. I track small environmental changes before acting…",
      submitLabel: "Reveal My Koji Type →",
      schemaName: "Japan Koji Craft Quiz",
      schemaDescription: "Japan specialty deep-dive craft personality quiz.",
    },
    ja: {
      keyword: "麹魂タイプ診断",
      title: "麹魂タイプ診断 — 日本の発酵職人性格",
      headline: "あなたの「麹魂」はどの職人タイプ？",
      subhead: "発酵米・麹・水の文化から読み解く、日本版ディープダイブ診断（12問）。",
      metaDescription:
        "無料・麹魂タイプ診断。麹仕込み職人・水質センサーなど、日本のものづくり性格を細分化。",
      keywords: ["麹魂診断", "日本 職人 性格", "発酵 性格診断", "Liberty Discover"],
      promptLabel: "丁寧な季節仕事への向き合い方は？",
      promptPlaceholder: "例：環境の微差を記録してから動く…",
      submitLabel: "麹魂タイプを見る →",
      schemaName: "麹魂タイプクイズ",
      schemaDescription: "日本の名産文化に基づく深掘り性格診断。",
    },
  },
  {
    slug: "us-corn-frontier",
    countryId: "us",
    plugPlayPath: "/diagnosis/play/us-corn-frontier",
    playDiagnosisId: "lc-specialty-country-us",
    searchTags: ["US frontier", "corn belt", "アメリカ 開拓", "性格診断"],
    en: {
      keyword: "US Frontier Seeder Personality Test",
      title: "US Frontier Soul Quiz — Corn Belt Craft Types",
      headline: "Do you carry the frontier seeder spirit?",
      subhead:
        "Scale, practicality, and expansion — mapped through American agricultural craft metaphors.",
      metaDescription:
        "Free US frontier craft personality quiz. Discover your expansion-minded artisan archetype.",
      keywords: ["US personality quiz", "frontier archetype", "craft culture test"],
      promptLabel: "When facing a wide open opportunity, you…",
      promptPlaceholder: "e.g. I move fast and build scalable systems…",
      submitLabel: "Reveal My Frontier Type →",
      schemaName: "US Frontier Craft Quiz",
      schemaDescription: "United States specialty craft personality deep-dive.",
    },
    ja: {
      keyword: "フロンティア・シーダー診断",
      title: "フロンティア・シーダー診断 — アメリカ開拓農業タイプ",
      headline: "あなたに近いのは、開拓型のシーダー魂？",
      subhead: "スケールと実用性を重んじる、アメリカ農業文化のメタファー診断。",
      metaDescription:
        "無料・フロンティア診断。拡大と実用性を象徴するアメリカ名産ソウルタイプを判定。",
      keywords: ["アメリカ 性格診断", "フロンティア", "開拓 タイプ"],
      promptLabel: "広いチャンスが開いたとき、あなたは？",
      promptPlaceholder: "例：素早く動いて仕組みを広げる…",
      submitLabel: "フロンティアタイプを見る →",
      schemaName: "フロンティア・シーダークイズ",
      schemaDescription: "アメリカ名産文化の深掘り性格診断。",
    },
  },
  {
    slug: "ca-maple-resilience",
    countryId: "ca",
    plugPlayPath: "/diagnosis/play/ca-maple-resilience",
    playDiagnosisId: "lc-specialty-country-ca",
    searchTags: ["Canada maple", "spring harvest", "カナダ 性格", "回復力"],
    en: {
      keyword: "Canada Maple Resilience Personality Test",
      title: "Canada Maple Soul Quiz — Spring Harvest Types",
      headline: "Does your soul rhythm match maple spring harvest?",
      subhead: "Patience, sharing, and renewal through Canada's maple craft culture.",
      metaDescription:
        "Free Canada maple resilience personality quiz. Artisan archetypes rooted in spring harvest culture.",
      keywords: ["Canada personality quiz", "maple archetype", "resilience test"],
      promptLabel: "How do you recover after a harsh season?",
      promptPlaceholder: "e.g. I wait for the right timing and share wins…",
      submitLabel: "Reveal My Maple Type →",
      schemaName: "Canada Maple Craft Quiz",
      schemaDescription: "Canada specialty craft personality deep-dive.",
    },
    ja: {
      keyword: "春告げハーベスター診断",
      title: "春告げハーベスター診断 — カナダ・樹液文化タイプ",
      headline: "厳冬を越える「春告げ」の魂、あなたに近い？",
      subhead: "自然の周期と分かち合いを大切にする、カナダ名産文化の深掘り診断。",
      metaDescription:
        "無料・カナダ樹液文化診断。回復と共有を象徴する名産ソウルタイプを判定。",
      keywords: ["カナダ 性格診断", "メープル 文化", "回復力 タイプ"],
      promptLabel: "厳しい季節のあと、どう立ち直りますか？",
      promptPlaceholder: "例：タイミングを待って、成果を分かち合う…",
      submitLabel: "春告げタイプを見る →",
      schemaName: "春告げハーベスタークイズ",
      schemaDescription: "カナダ名産文化の深掘り性格診断。",
    },
  },
  {
    slug: "br-terra-roxa-spirit",
    countryId: "br",
    plugPlayPath: "/diagnosis/play/br-terra-roxa-spirit",
    playDiagnosisId: "lc-specialty-country-br",
    searchTags: ["Brazil coffee", "terra roxa", "ブラジル 性格", "農園"],
    en: {
      keyword: "Brazil Terra Roxa Spirit Personality Test",
      title: "Brazil Terra Roxa Soul Quiz — Estate Craft Types",
      headline: "Does your energy match Terra Roxa frontier spirit?",
      subhead:
        "Passion, diversity, and fertile soil metaphors from Brazilian estate culture.",
      metaDescription:
        "Free Brazil Terra Roxa personality quiz. Vibrant craft archetypes from agricultural heritage.",
      keywords: [
        "Brazil personality quiz",
        "terra roxa archetype",
        "estate culture test",
      ],
      promptLabel: "What energizes you in a lively team?",
      promptPlaceholder: "e.g. Mixing cultures and building momentum together…",
      submitLabel: "Reveal My Terra Roxa Type →",
      schemaName: "Brazil Terra Roxa Quiz",
      schemaDescription: "Brazil specialty craft personality deep-dive.",
    },
    ja: {
      keyword: "テラ・ロッサ開拓者診断",
      title: "テラ・ロッサ開拓者診断 — ブラジル農園文化タイプ",
      headline: "豊かな土壌に近い、あなたの開拓者魂は？",
      subhead: "多文化と情熱を象徴する、ブラジル農園文化の深掘り診断。",
      metaDescription:
        "無料・テラ・ロッサ診断。豊穣と多様性を体現する名産ソウルタイプを判定。",
      keywords: ["ブラジル 性格診断", "農園 文化", "テラ・ロッサ"],
      promptLabel: "活気あるチームで、あなたが輝くのは？",
      promptPlaceholder: "例：文化を混ぜて勢いを作るとき…",
      submitLabel: "テラ・ロッサタイプを見る →",
      schemaName: "テラ・ロッサ開拓者クイズ",
      schemaDescription: "ブラジル名産文化の深掘り性格診断。",
    },
  },
  {
    slug: "fr-terroir-poet",
    countryId: "fr",
    plugPlayPath: "/diagnosis/play/fr-terroir-poet",
    playDiagnosisId: "lc-specialty-country-fr",
    searchTags: ["France terroir", "land craft", "フランス 性格", "テロワール"],
    en: {
      keyword: "France Terroir Poet Personality Test",
      title: "France Terroir Soul Quiz — Land Craft Types",
      headline: "Are you a terroir poet at heart?",
      subhead:
        "Aesthetic precision and protected local character through France's terroir philosophy.",
      metaDescription:
        "Free France terroir personality quiz. Artisan archetypes rooted in land and craft heritage.",
      keywords: ["France personality quiz", "terroir archetype", "land craft test"],
      promptLabel: "What makes a place unforgettable to you?",
      promptPlaceholder: "e.g. Subtle details that cannot be copied elsewhere…",
      submitLabel: "Reveal My Terroir Type →",
      schemaName: "France Terroir Craft Quiz",
      schemaDescription: "France specialty craft personality deep-dive.",
    },
    ja: {
      keyword: "テロワール詩人診断",
      title: "テロワール詩人診断 — フランス・土地の美学タイプ",
      headline: "土地の個性を詩にする「テロワール詩人」タイプ？",
      subhead: "保護と洗練を重んじる、フランスの土地文化メタファー診断。",
      metaDescription:
        "無料・テロワール診断。土地の美学を体現する名産ソウルタイプを判定。",
      keywords: ["フランス 性格診断", "テロワール", "土地 文化"],
      promptLabel: "場所の魅力は、何で決まると思いますか？",
      promptPlaceholder: "例：他では再現できない繊細な個性…",
      submitLabel: "テロワールタイプを見る →",
      schemaName: "テロワール詩人クイズ",
      schemaDescription: "フランス名産文化の深掘り性格診断。",
    },
  },
  {
    slug: "cl-andes-dualcraft",
    countryId: "cl",
    plugPlayPath: "/diagnosis/play/cl-andes-dualcraft",
    playDiagnosisId: "lc-specialty-country-cl",
    searchTags: ["Chile andes", "dual craft", "チリ 性格", "資源"],
    en: {
      keyword: "Chile Andes Dual Craft Personality Test",
      title: "Chile Andes Soul Quiz — Dual Craft Types",
      headline: "Do you balance resource power with unique craft?",
      subhead:
        "Strategic duality inspired by Chile's mineral wealth and isolated creative terroir.",
      metaDescription:
        "Free Chile Andes dual craft personality quiz. Archetypes of stability and originality.",
      keywords: ["Chile personality quiz", "andes archetype", "dual craft test"],
      promptLabel: "When you hold two strengths, you…",
      promptPlaceholder: "e.g. Switch between practical and creative modes…",
      submitLabel: "Reveal My Andes Type →",
      schemaName: "Chile Andes Craft Quiz",
      schemaDescription: "Chile specialty craft personality deep-dive.",
    },
    ja: {
      keyword: "アンデス二刀流診断",
      title: "アンデス二刀流診断 — チリ・資源と個性タイプ",
      headline: "資源の力と独自性を両立する「二刀流」魂？",
      subhead: "安定と創造のバランスを象徴する、チリ名産文化の深掘り診断。",
      metaDescription:
        "無料・アンデス二刀流診断。資源と個性の二面性を体現するタイプを判定。",
      keywords: ["チリ 性格診断", "アンデス", "二刀流 タイプ"],
      promptLabel: "二つの強みを持つとき、あなたは？",
      promptPlaceholder: "例：実務と創造を行き来する…",
      submitLabel: "二刀流タイプを見る →",
      schemaName: "アンデス二刀流クイズ",
      schemaDescription: "チリ名産文化の深掘り性格診断。",
    },
  },
  {
    slug: "md-cellar-guardian",
    countryId: "md",
    plugPlayPath: "/diagnosis/play/md-cellar-guardian",
    playDiagnosisId: "lc-specialty-country-md",
    searchTags: ["Moldova cellar", "heritage craft", "モルドバ 性格"],
    en: {
      keyword: "Moldova Cellar Guardian Personality Test",
      title: "Moldova Cellar Soul Quiz — Heritage Guard Types",
      headline: "Are you a cellar guardian of quiet legacy?",
      subhead:
        "Long memory, resilience, and cultural preservation through Moldovan heritage craft.",
      metaDescription:
        "Free Moldova cellar guardian personality quiz. Archetypes of endurance and cultural pride.",
      keywords: ["Moldova personality quiz", "cellar archetype", "heritage craft test"],
      promptLabel: "What do you protect when times are uncertain?",
      promptPlaceholder: "e.g. Quiet traditions that others might overlook…",
      submitLabel: "Reveal My Cellar Type →",
      schemaName: "Moldova Cellar Craft Quiz",
      schemaDescription: "Moldova specialty craft personality deep-dive.",
    },
    ja: {
      keyword: "地下セラー守り人診断",
      title: "地下セラー守り人診断 — モルドバ・熟成文化タイプ",
      headline: "歴史を静かに守る「セラー守り人」魂？",
      subhead: "蓄積と抵抗を象徴する、モルドバ名産文化の深掘り診断。",
      metaDescription: "無料・地下セラー診断。時間を味方にする継承型タイプを判定。",
      keywords: ["モルドバ 性格診断", "熟成 文化", "継承 タイプ"],
      promptLabel: "不安定な時代に、あなたが守るのは？",
      promptPlaceholder: "例：見えない価値や静かな伝統…",
      submitLabel: "セラー守り人タイプを見る →",
      schemaName: "地下セラー守り人クイズ",
      schemaDescription: "モルドバ名産文化の深掘り性格診断。",
    },
  },
  {
    slug: "pk-fragrant-earth",
    countryId: "pk",
    plugPlayPath: "/diagnosis/play/pk-fragrant-earth",
    playDiagnosisId: "lc-specialty-country-pk",
    searchTags: ["Pakistan basmati", "himalayan salt", "パキスタン 性格"],
    en: {
      keyword: "Pakistan Fragrant Earth Personality Test",
      title: "Pakistan Fragrant Prince Soul Quiz — Earth Gift Types",
      headline: "Do you carry the fragrant prince of hospitality?",
      subhead:
        "Aroma, generosity, and earth memory through Pakistan's culinary heritage craft.",
      metaDescription:
        "Free Pakistan fragrant earth personality quiz. Hospitality and pride archetypes.",
      keywords: ["Pakistan personality quiz", "fragrant archetype", "earth gift test"],
      promptLabel: "How do you welcome someone important?",
      promptPlaceholder: "e.g. With careful quality and warm presence…",
      submitLabel: "Reveal My Fragrant Type →",
      schemaName: "Pakistan Fragrant Earth Quiz",
      schemaDescription: "Pakistan specialty craft personality deep-dive.",
    },
    ja: {
      keyword: "香りのプリンス診断",
      title: "香りのプリンス診断 — パキスタン・大地の恵みタイプ",
      headline: "香りとおもてなしの「プリンス」魂、あなたに近い？",
      subhead: "大地の記憶ともてなしを象徴する、パキスタン名産文化の深掘り診断。",
      metaDescription:
        "無料・香りのプリンス診断。誇りとおもてなしを体現するタイプを判定。",
      keywords: ["パキスタン 性格診断", "バスマティ 文化", "おもてなし タイプ"],
      promptLabel: "大切な人を迎えるとき、あなたは？",
      promptPlaceholder: "例：品質と温かさで誇りを伝える…",
      submitLabel: "香りのプリンスタイプを見る →",
      schemaName: "香りのプリンスクイズ",
      schemaDescription: "パキスタン名産文化の深掘り性格診断。",
    },
  },
  {
    slug: "uk-maturation-highlander",
    countryId: "uk",
    plugPlayPath: "/diagnosis/play/uk-maturation-highlander",
    playDiagnosisId: "lc-specialty-country-uk",
    searchTags: ["UK maturation", "highland craft", "イギリス 性格", "熟成"],
    en: {
      keyword: "UK Maturation Highlander Personality Test",
      title: "UK Highland Maturation Soul Quiz — Craft Types",
      headline: "Is your spirit shaped by patient maturation?",
      subhead:
        "Discipline, tradition, and long horizons through Britain's highland craft culture.",
      metaDescription:
        "Free UK highland craft personality quiz. Endurance and tradition archetypes.",
      keywords: [
        "UK personality quiz",
        "highland craft archetype",
        "long-horizon craft test",
      ],
      promptLabel: "What does long-term quality mean to you?",
      promptPlaceholder: "e.g. Keeping standards when shortcuts tempt everyone…",
      submitLabel: "Reveal My Highlander Type →",
      schemaName: "UK Maturation Craft Quiz",
      schemaDescription: "United Kingdom specialty craft personality deep-dive.",
    },
    ja: {
      keyword: "熟成の高地人診断",
      title: "熟成の高地人診断 — イギリス・熟成文化タイプ",
      headline: "時間を味方にする「高地人」魂、あなたに近い？",
      subhead: "規律と伝統を象徴する、イギリス熟成文化の深掘り診断。",
      metaDescription: "無料・熟成の高地人診断。不屈の職人魂タイプを判定。",
      keywords: ["イギリス 性格診断", "熟成 文化", "高地人 タイプ"],
      promptLabel: "長期品質とは、あなたにとって？",
      promptPlaceholder: "例：近道があっても基準を守ること…",
      submitLabel: "高地人タイプを見る →",
      schemaName: "熟成の高地人クイズ",
      schemaDescription: "イギリス名産文化の深掘り性格診断。",
    },
  },
] as const;

export const SPECIALTY_LANDING_TOPIC_SLUGS = SPECIALTY_LANDING_SEEDS.map(
  (seed) => seed.slug,
);

export type SpecialtyLandingTopicSlug = (typeof SPECIALTY_LANDING_TOPIC_SLUGS)[number];

export function buildSpecialtyLandingCopyMatrix(): Record<
  SpecialtyLandingTopicSlug,
  Record<CoreLandingLocale, LandingPageCopy>
> {
  const matrix = {} as Record<
    SpecialtyLandingTopicSlug,
    Record<CoreLandingLocale, LandingPageCopy>
  >;

  for (const seed of SPECIALTY_LANDING_SEEDS) {
    const route = resolveSpecialtyLandingRoute(seed);

    const buildLocalized = (locale: CoreLandingLocale): LandingPageCopy => {
      const base = buildLocaleCopy(seed, locale);
      return route.routesToWorldEntry ? applyWorldEntryCopyOverrides(base, locale) : base;
    };

    matrix[seed.slug] = {
      en: buildLocalized("en"),
      ja: buildLocalized("ja"),
      ko: buildLocalized("en"),
      zh: buildLocalized("en"),
    };

    matrix[seed.slug]!.ko = {
      ...matrix[seed.slug]!.ko,
      trustLine: TRUST_KO,
      submitLabel: matrix[seed.slug]!.en.submitLabel,
      headline: matrix[seed.slug]!.en.headline,
      subhead: `${LANDING_DISCOVER_NAME} — ${matrix[seed.slug]!.en.subhead}`,
    };
    matrix[seed.slug]!.zh = {
      ...matrix[seed.slug]!.zh,
      trustLine: TRUST_ZH,
      submitLabel: matrix[seed.slug]!.en.submitLabel,
      headline: matrix[seed.slug]!.en.headline,
      subhead: `${LANDING_DISCOVER_NAME} — ${matrix[seed.slug]!.en.subhead}`,
    };
  }

  return matrix;
}

export function buildSpecialtyLandingTopics() {
  return SPECIALTY_LANDING_SEEDS.map((seed) => {
    const route = resolveSpecialtyLandingRoute(seed);

    return {
      slug: seed.slug,
      playDiagnosisId: route.playDiagnosisId,
      plugPlayPath: route.plugPlayPath,
      psychDiagnosisPath: route.plugPlayPath,
      schemaType: "Quiz" as const,
      searchIntent: "transactional" as const,
      searchTags: seed.searchTags,
    };
  });
}

export function buildSpecialtyDiscoverCopyFrDe(): Record<
  SpecialtyLandingTopicSlug,
  Record<"fr" | "de", LandingPageCopy>
> {
  const matrix = {} as Record<
    SpecialtyLandingTopicSlug,
    Record<"fr" | "de", LandingPageCopy>
  >;

  for (const seed of SPECIALTY_LANDING_SEEDS) {
    matrix[seed.slug] = {
      fr: {
        ...buildLocaleCopy(seed, "en"),
        trustLine: "Science des traits · 24 questions · Sans inscription",
        submitLabel: "Révéler mon archétype →",
        faq: [
          {
            question: "Test clinique ?",
            answer:
              "Quiz de découverte Liberty Canvas — archétypes artisanaux originaux, pas d'instrument sous licence.",
          },
          {
            question: "Compte requis ?",
            answer: "Non. Une réponse mène au diagnostic complet.",
          },
        ],
      },
      de: {
        ...buildLocaleCopy(seed, "en"),
        trustLine: "Trait-Wissenschaft · 24 Fragen · Ohne Anmeldung",
        submitLabel: "Meinen Archetyp anzeigen →",
        faq: [
          {
            question: "Klinischer Test?",
            answer:
              "Liberty Canvas Entdeckungs-Quiz — originale Handwerks-Archetypen, kein lizenzierter Test.",
          },
          {
            question: "Konto nötig?",
            answer: "Nein. Eine Antwort startet die vollständige Diagnose.",
          },
        ],
      },
    };
  }

  return matrix;
}

export const SPECIALTY_LANDING_FAQ_BRAND_EN = LANDING_BRAND_NARRATIVE_EN;
export const SPECIALTY_LANDING_FAQ_BRAND_JA = LANDING_BRAND_NARRATIVE_JA;
