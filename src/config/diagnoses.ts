import { LEGAL_TRAIT_KEYS } from "@/lib/diagnosis/academicTraitVector";
import {
  buildGenzQuestionBank,
  buildOshikatsuQuestionBank,
  buildRomanceQuestionBank,
} from "@/config/diagnosisQuestionBanks";
import {
  buildAcademicSpectrumQuestionBank,
  buildMotivationSpectrumQuestionBank,
  buildPersonalitySpectrumQuestionBank,
} from "@/config/academicQuestionBanks";
import type {
  DiagnosisElement,
  PlugDiagnosisDefinition,
  TraitWeightMap,
} from "@/types/diagnosisCompiler";

const t = (weights: TraitWeightMap): TraitWeightMap => weights;

export const PLUG_DIAGNOSIS_IDS = {
  oshikatsu: "oshikatsu-fandom",
  romance: "romance-compatibility",
  genz: "genz-social-identity",
  academicSpectrum: "lc-academic-spectrum",
  motivationSpectrum: "lc-motivation-spectrum",
  personalitySpectrum: "lc-personality-spectrum",
} as const;

function buildOshikatsuElements(): DiagnosisElement[] {
  return [
    {
      kind: "SEO_TUNING_BLOCK",
      id: "seo-oshikatsu",
      targetDemographics: ["10代", "20代", "推し活女子", "ファン文化"],
      desireTags: ["推し活", "ファンタイプ", "推しへの愛し方", "推し活スタイル"],
      landingPath: "/diagnosis/play/oshikatsu",
      titleTemplate: "推し活スタイル診断 — あなたの応援タイプ | Rubel Canvas",
      descriptionTemplate:
        "推し活の愛し方を24問で診断。LibertyCanvas 独自の性格アーキタイプで、あなたらしい推し活スタイルがわかる無料診断。",
    },
    ...buildOshikatsuQuestionBank(),
    {
      kind: "RESULT_TEMPLATE_BLOCK",
      id: "result-oshikatsu",
      layout: "character_archetype_card",
      results: [
        {
          id: "lc-oshi-master",
          title: "推し活マスター",
          subtitle: "推しの魅力を広げる、LibertyCanvas 認定エナジャイザー",
          analysis:
            "あなたは推しへの想いを行動に変える力が強く、周囲にも良い刺激を届けやすいタイプです。",
          themeColor: "#8B5CF6",
          traitProfile: t({
            trait_openness: 0.8,
            trait_extraversion: 0.7,
            trait_agreeableness: 0.6,
            trait_conscientiousness: 0.4,
            trait_empathy: 0.5,
            trait_neuroticism: 0.2,
          }),
          affirmationLine: "あなたの推し活は、推しにとっても心強い光です。",
        },
        {
          id: "lc-oshi-deep",
          title: "余韻ディープタイプ",
          subtitle: "推しへの愛を静かに深める、蓄積型ファン",
          analysis:
            "あなたは派手さよりも、確かな愛情を丁寧に育てるスタイル。時間とともに推し活が美しく成熟します。",
          themeColor: "#6366F1",
          traitProfile: t({
            trait_conscientiousness: 0.8,
            trait_empathy: 0.7,
            trait_openness: 0.5,
            trait_agreeableness: 0.5,
            trait_extraversion: 0.2,
            trait_neuroticism: 0.3,
          }),
          affirmationLine: "あなたの余韻のある推し活は、かけがえのない宝物です。",
        },
        {
          id: "lc-oshi-cheer",
          title: "全肯定応援団長",
          subtitle: "推しを称える、温かい応援リーダー",
          analysis:
            "あなたは推しへの応援を通じて、人とのつながりも大切にするタイプ。コミュニティの空気を明るくする存在です。",
          themeColor: "#EC4899",
          traitProfile: t({
            trait_extraversion: 0.8,
            trait_agreeableness: 0.8,
            trait_empathy: 0.6,
            trait_openness: 0.4,
            trait_conscientiousness: 0.3,
            trait_neuroticism: 0.2,
          }),
          affirmationLine: "あなたの応援が、誰かの「推し始め」のきっかけになります。",
        },
      ],
    },
    {
      kind: "VIRAL_SHARE_BLOCK",
      id: "viral-oshikatsu",
      presets: [
        {
          id: "x-oshikatsu",
          kind: "x_twitter_card",
          label: "Xでシェア",
          hashtag: "#推し活診断",
          cardTitle: "推し活スタイル診断結果",
          cardDescription: "LibertyCanvas 独自診断、やってみて！",
        },
        {
          id: "img-oshikatsu",
          kind: "image_download",
          label: "結果画像を保存",
          hashtag: "#推し活診断",
          cardTitle: "推し活スタイル",
          cardDescription: "Rubel Canvas 推し活診断",
        },
      ],
    },
  ];
}

function buildRomanceElements(): DiagnosisElement[] {
  return [
    {
      kind: "SEO_TUNING_BLOCK",
      id: "seo-romance",
      targetDemographics: ["10代", "20代", "30代", "恋愛に関心がある方"],
      desireTags: ["恋愛", "恋愛タイプ", "コミュニケーション", "パートナーシップ"],
      landingPath: "/diagnosis/play/romance",
      titleTemplate: "恋愛コミュニケーション診断 — 無料 | Rubel Canvas",
      descriptionTemplate:
        "恋愛のコミュニケーションスタイルを24問で診断。LibertyCanvas 独自アーキタイプで、あなたの恋愛プロフィールがわかります。",
    },
    ...buildRomanceQuestionBank(),
    {
      kind: "RESULT_TEMPLATE_BLOCK",
      id: "result-romance",
      layout: "compatibility_radar",
      results: [
        {
          id: "lc-love-healing",
          title: "全肯定癒やしタイプ",
          subtitle: "LibertyCanvas 認定・やさしさで関係を育むパートナー",
          analysis:
            "あなたは温かさと共感力を軸に、相手が安心できる関係を築きやすいタイプです。",
          themeColor: "#F472B6",
          traitProfile: t({
            trait_agreeableness: 0.8,
            trait_empathy: 0.8,
            trait_conscientiousness: 0.5,
            trait_neuroticism: 0.2,
            trait_openness: 0.4,
            trait_extraversion: 0.3,
          }),
          compatibilityHint: "対話型・安定型との相性が良好です。",
        },
        {
          id: "lc-love-bridge",
          title: "言葉の橋渡しタイプ",
          subtitle: "理解と会話で距離を縮めるコミュニケーター",
          analysis:
            "あなたは言葉と理解を通じて関係を深める力が強く、すれ違いを減らしやすいスタイルです。",
          themeColor: "#FB7185",
          traitProfile: t({
            trait_openness: 0.7,
            trait_extraversion: 0.6,
            trait_agreeableness: 0.6,
            trait_empathy: 0.5,
            trait_conscientiousness: 0.4,
            trait_neuroticism: 0.3,
          }),
          compatibilityHint: "感情共有型・自由型とのバランスが取りやすいです。",
        },
        {
          id: "lc-love-free",
          title: "凛とした自由恋愛型",
          subtitle: "自立と信頼でつながる、LibertyCanvas 独自プロフィール",
          analysis:
            "あなたはお互いのペースを尊重し、束縛より信頼を選ぶ恋愛スタイルを大切にします。",
          themeColor: "#A78BFA",
          traitProfile: t({
            trait_openness: 0.8,
            trait_conscientiousness: 0.5,
            trait_extraversion: 0.3,
            trait_agreeableness: 0.4,
            trait_empathy: 0.3,
            trait_neuroticism: 0.1,
          }),
          compatibilityHint: "安定型・対話型との緩やかな距離感が合います。",
        },
      ],
    },
    {
      kind: "VIRAL_SHARE_BLOCK",
      id: "viral-romance",
      presets: [
        {
          id: "x-romance",
          kind: "x_twitter_card",
          label: "Xでシェア",
          hashtag: "#恋愛診断",
          cardTitle: "恋愛コミュニケーション診断結果",
          cardDescription: "24問・LibertyCanvas 独自診断、やってみて！",
        },
        {
          id: "native-romance",
          kind: "native_share",
          label: "友達にシェア",
          hashtag: "#恋愛タイプ",
          cardTitle: "恋愛診断",
          cardDescription: "あなたの恋愛スタイルをチェック",
        },
      ],
    },
  ];
}

function buildGenZElements(): DiagnosisElement[] {
  return [
    {
      kind: "SEO_TUNING_BLOCK",
      id: "seo-genz",
      targetDemographics: ["高校生", "10代", "学生", "若者"],
      desireTags: ["高校生向け", "短時間", "友達関係", "SNS", "コミュ力"],
      landingPath: "/diagnosis/play/genz",
      titleTemplate: "高校生向け・ソーシャルタイプ診断 | Rubel Canvas",
      descriptionTemplate:
        "高校生向けソーシャル診断24問。LibertyCanvas 独自アーキタイプで、友達関係スタイルと5因子プロフィールがわかります。",
    },
    ...buildGenzQuestionBank(),
    {
      kind: "RESULT_TEMPLATE_BLOCK",
      id: "result-genz",
      layout: "full_affirmation_chart",
      results: [
        {
          id: "lc-genz-sun",
          title: "教室サンシャイン型",
          subtitle: "LibertyCanvas 認定・場をあたたかくする存在",
          analysis:
            "あなたは人との距離を自然に縮め、短時間でも仲良くなれる明るさを持っています。",
          themeColor: "#FBBF24",
          traitProfile: t({
            trait_extraversion: 0.8,
            trait_agreeableness: 0.7,
            trait_openness: 0.5,
            trait_empathy: 0.4,
            trait_conscientiousness: 0.3,
            trait_neuroticism: 0.2,
          }),
          affirmationLine: "あなたの明るさは、誰かの一日を救っています。",
        },
        {
          id: "lc-genz-digital",
          title: "デジタルネイティブ・コネクター",
          subtitle: "オンラインとリアルをつなぐ、現代型ソーシャルタイプ",
          analysis:
            "あなたは新しいつながり方に強い適応力があり、デジタルと対面の両方で関係を育てられます。",
          themeColor: "#38BDF8",
          traitProfile: t({
            trait_openness: 0.8,
            trait_extraversion: 0.6,
            trait_agreeableness: 0.5,
            trait_empathy: 0.4,
            trait_conscientiousness: 0.3,
            trait_neuroticism: 0.2,
          }),
          affirmationLine: "あなたのつなぎ方は、今の時代の強みです。",
        },
        {
          id: "lc-genz-shelter",
          title: "誠実シェルター型",
          subtitle: "本音で深くつながる、LibertyCanvas 独自の少数派タイプ",
          analysis:
            "あなたは量より質を大切にし、誠実さで長く続く友情を築きやすいプロフィールです。",
          themeColor: "#34D399",
          traitProfile: t({
            trait_conscientiousness: 0.7,
            trait_empathy: 0.8,
            trait_agreeableness: 0.6,
            trait_extraversion: 0.2,
            trait_openness: 0.4,
            trait_neuroticism: 0.3,
          }),
          affirmationLine: "あなたの誠実さは、長く続く友情の土台になります。",
        },
      ],
    },
    {
      kind: "VIRAL_SHARE_BLOCK",
      id: "viral-genz",
      presets: [
        {
          id: "x-genz",
          kind: "x_twitter_card",
          label: "Xで結果をシェア",
          hashtag: "#高校生診断",
          cardTitle: "ソーシャルタイプ診断",
          cardDescription: "24問・友達と一緒にやってみて",
        },
        {
          id: "copy-genz",
          kind: "copy_link",
          label: "リンクをコピー",
          hashtag: "#短時間診断",
          cardTitle: "高校生向け診断",
          cardDescription: "Rubel Canvas",
        },
      ],
    },
  ];
}

function buildAcademicSpectrumElements(): DiagnosisElement[] {
  return [
    {
      kind: "SEO_TUNING_BLOCK",
      id: "seo-academic",
      targetDemographics: ["10代", "20代", "30代", "40代", "自己理解に関心がある方"],
      desireTags: ["性格診断", "学術特性", "5因子", "自己分析", "無料診断"],
      landingPath: "/diagnosis/play/big-five",
      titleTemplate: "学術5因子性格診断 — LibertyCanvas 独自 | Rubel Canvas",
      descriptionTemplate:
        "開放性・誠実性・外向性・協調性・感情変動性の24問診断。LibertyCanvas 独自アーキタイプで、あなたの学術特性プロフィールがわかります。",
    },
    ...buildAcademicSpectrumQuestionBank(),
    {
      kind: "RESULT_TEMPLATE_BLOCK",
      id: "result-academic",
      layout: "full_affirmation_chart",
      results: [
        {
          id: "lc-acad-open",
          title: "好奇心クリエイター",
          subtitle: "LibertyCanvas 認定・開放性が際立つ探究タイプ",
          analysis: "あなたは新しい視点と発想を大切にし、変化の中でも学びを見出しやすいタイプです。",
          themeColor: "#6366F1",
          traitProfile: t({
            trait_openness: 0.9,
            trait_extraversion: 0.5,
            trait_conscientiousness: 0.4,
            trait_agreeableness: 0.5,
            trait_neuroticism: 0.3,
            trait_empathy: 0.5,
          }),
          affirmationLine: "あなたの好奇心は、世界をより豊かに見せてくれます。",
        },
        {
          id: "lc-acad-steady",
          title: "丁寧積み上げ型",
          subtitle: "LibertyCanvas 認定・誠実性が光る安定タイプ",
          analysis: "あなたは計画性と継続力を武器に、信頼される成果を積み上げやすいタイプです。",
          themeColor: "#0D9488",
          traitProfile: t({
            trait_conscientiousness: 0.9,
            trait_agreeableness: 0.6,
            trait_extraversion: 0.3,
            trait_openness: 0.4,
            trait_neuroticism: 0.2,
            trait_empathy: 0.4,
          }),
          affirmationLine: "あなたの丁寧さは、長い時間をかけて力になります。",
        },
        {
          id: "lc-acad-social",
          title: "社交エナジー型",
          subtitle: "LibertyCanvas 認定・外向性が際立つつながりタイプ",
          analysis: "あなたは人との交流からエネルギーを得て、場を明るくする力を持っています。",
          themeColor: "#F59E0B",
          traitProfile: t({
            trait_extraversion: 0.9,
            trait_agreeableness: 0.6,
            trait_openness: 0.5,
            trait_conscientiousness: 0.4,
            trait_empathy: 0.5,
            trait_neuroticism: 0.2,
          }),
          affirmationLine: "あなたの明るさは、周囲に自然な安心感を届けます。",
        },
        {
          id: "lc-acad-healing",
          title: "全肯定癒やしタイプ",
          subtitle: "LibertyCanvas 認定・協調性と共感力の高いタイプ",
          analysis: "あなたは相手の気持ちに寄り添い、やさしい関係性を育てやすいプロフィールです。",
          themeColor: "#F472B6",
          traitProfile: t({
            trait_agreeableness: 0.9,
            trait_empathy: 0.8,
            trait_extraversion: 0.4,
            trait_openness: 0.5,
            trait_conscientiousness: 0.4,
            trait_neuroticism: 0.3,
          }),
          affirmationLine: "あなたのやさしさは、誰かの心を静かに癒しています。",
        },
        {
          id: "lc-acad-deep",
          title: "繊細共感ディープ型",
          subtitle: "LibertyCanvas 認定・感受性が豊かな内省タイプ",
          analysis: "あなたは感情の機微に気づく力が強く、深い理解と洞察につながりやすいタイプです。",
          themeColor: "#8B5CF6",
          traitProfile: t({
            trait_neuroticism: 0.7,
            trait_empathy: 0.8,
            trait_openness: 0.6,
            trait_agreeableness: 0.5,
            trait_conscientiousness: 0.4,
            trait_extraversion: 0.2,
          }),
          affirmationLine: "あなたの繊細さは、深い共感と創造性の源です。",
        },
      ],
    },
    {
      kind: "VIRAL_SHARE_BLOCK",
      id: "viral-academic",
      presets: [
        {
          id: "x-academic",
          kind: "x_twitter_card",
          label: "Xでシェア",
          hashtag: "#性格診断",
          cardTitle: "学術5因子診断結果",
          cardDescription: "24問・LibertyCanvas 独自診断、やってみて！",
        },
        {
          id: "copy-academic",
          kind: "copy_link",
          label: "リンクをコピー",
          hashtag: "#自己分析",
          cardTitle: "学術特性診断",
          cardDescription: "Rubel Canvas",
        },
      ],
    },
  ];
}

function buildMotivationSpectrumElements(): DiagnosisElement[] {
  return [
    {
      kind: "SEO_TUNING_BLOCK",
      id: "seo-motivation",
      targetDemographics: ["10代", "20代", "30代", "動機づけに関心がある方"],
      desireTags: ["動機タイプ", "性格診断", "自己理解", "モチベーション", "無料診断"],
      landingPath: "/diagnosis/play/motivation-spectrum",
      titleTemplate: "動機スペクトラム診断 — LibertyCanvas 独自 | Rubel Canvas",
      descriptionTemplate:
        "内発的動機を24問で診断。LibertyCanvas 独自の9アーキタイプで、あなたの行動スタイルがわかる無料診断。",
    },
    ...buildMotivationSpectrumQuestionBank(),
    {
      kind: "RESULT_TEMPLATE_BLOCK",
      id: "result-motivation",
      layout: "character_archetype_card",
      results: [
        {
          id: "lc-motif-ideal",
          title: "理想整備タイプ",
          subtitle: "LibertyCanvas 認定・改善と整える力のあるタイプ",
          analysis: "あなたは物事をより良い状態へ整える志向が強く、丁寧な積み上げが得意です。",
          themeColor: "#64748B",
          traitProfile: t({
            trait_conscientiousness: 0.8,
            trait_agreeableness: 0.5,
            trait_openness: 0.4,
            trait_empathy: 0.4,
            trait_extraversion: 0.3,
            trait_neuroticism: 0.3,
          }),
          affirmationLine: "あなたの整える力は、周囲に確かな安心感を届けます。",
        },
        {
          id: "lc-motif-warmth",
          title: "ぬくもり支援タイプ",
          subtitle: "LibertyCanvas 認定・思いやりでつながるタイプ",
          analysis: "あなたは他者への配慮を自然に行い、温かい関係を育てやすいプロフィールです。",
          themeColor: "#FB7185",
          traitProfile: t({
            trait_empathy: 0.9,
            trait_agreeableness: 0.8,
            trait_extraversion: 0.4,
            trait_openness: 0.4,
            trait_conscientiousness: 0.3,
            trait_neuroticism: 0.2,
          }),
          affirmationLine: "あなたのぬくもりは、誰かの一日をやさしく照らします。",
        },
        {
          id: "lc-motif-drive",
          title: "成果加速タイプ",
          subtitle: "LibertyCanvas 認定・前進エネルギーが強いタイプ",
          analysis: "あなたは目標に向かう推進力が高く、結果を出すプロセスに喜びを感じやすいタイプです。",
          themeColor: "#F59E0B",
          traitProfile: t({
            trait_extraversion: 0.7,
            trait_conscientiousness: 0.7,
            trait_openness: 0.5,
            trait_agreeableness: 0.4,
            trait_empathy: 0.3,
            trait_neuroticism: 0.2,
          }),
          affirmationLine: "あなたの前進力は、チーム全体を動かす原動力になります。",
        },
        {
          id: "lc-motif-solo",
          title: "独自感性タイプ",
          subtitle: "LibertyCanvas 認定・深い感受性と独自性のタイプ",
          analysis: "あなたは自分らしい感性を大切にし、表面的ではない深い表現を好みます。",
          themeColor: "#A78BFA",
          traitProfile: t({
            trait_openness: 0.8,
            trait_empathy: 0.7,
            trait_neuroticism: 0.5,
            trait_agreeableness: 0.4,
            trait_conscientiousness: 0.3,
            trait_extraversion: 0.2,
          }),
          affirmationLine: "あなたの独自性は、世界に新しい色を加えています。",
        },
        {
          id: "lc-motif-observe",
          title: "静観分析タイプ",
          subtitle: "LibertyCanvas 認定・観察と理解を深めるタイプ",
          analysis: "あなたは距離を保ちながら本質を見抜く力があり、深い洞察につながりやすいタイプです。",
          themeColor: "#38BDF8",
          traitProfile: t({
            trait_openness: 0.8,
            trait_conscientiousness: 0.6,
            trait_extraversion: 0.1,
            trait_agreeableness: 0.4,
            trait_empathy: 0.4,
            trait_neuroticism: 0.3,
          }),
          affirmationLine: "あなたの静かな洞察は、重要な気づきを生み出します。",
        },
        {
          id: "lc-motif-trust",
          title: "信頼安心タイプ",
          subtitle: "LibertyCanvas 認定・安定と信頼を築くタイプ",
          analysis: "あなたは安心感を大切にし、長く続く信頼関係を育てやすいプロフィールです。",
          themeColor: "#34D399",
          traitProfile: t({
            trait_agreeableness: 0.7,
            trait_conscientiousness: 0.7,
            trait_empathy: 0.5,
            trait_neuroticism: 0.1,
            trait_openness: 0.4,
            trait_extraversion: 0.3,
          }),
          affirmationLine: "あなたの信頼感は、人の心の拠り所になります。",
        },
        {
          id: "lc-motif-joy",
          title: "自由探索タイプ",
          subtitle: "LibertyCanvas 認定・可能性を追いかけるタイプ",
          analysis: "あなたは新しい体験と自由を愛し、楽しさの中に学びを見出すタイプです。",
          themeColor: "#FBBF24",
          traitProfile: t({
            trait_openness: 0.8,
            trait_extraversion: 0.7,
            trait_neuroticism: 0.1,
            trait_agreeableness: 0.4,
            trait_conscientiousness: 0.3,
            trait_empathy: 0.3,
          }),
          affirmationLine: "あなたの自由さは、周囲にも前向きな刺激を届けます。",
        },
        {
          id: "lc-motif-bold",
          title: "決断先導タイプ",
          subtitle: "LibertyCanvas 認定・率直に道を切り開くタイプ",
          analysis: "あなたは決断力と推進力を持ち、必要なときに先頭に立てるタイプです。",
          themeColor: "#EF4444",
          traitProfile: t({
            trait_extraversion: 0.8,
            trait_conscientiousness: 0.6,
            trait_openness: 0.5,
            trait_agreeableness: 0.2,
            trait_empathy: 0.2,
            trait_neuroticism: 0.2,
          }),
          affirmationLine: "あなたの決断力は、迷いの中に道を示します。",
        },
        {
          id: "lc-motif-peace",
          title: "調和調整タイプ",
          subtitle: "LibertyCanvas 認定・穏やかに場をまとめるタイプ",
          analysis: "あなたは争いより調和を選び、人と人の間をやわらかくつなぐ力があります。",
          themeColor: "#6EE7B7",
          traitProfile: t({
            trait_agreeableness: 0.8,
            trait_empathy: 0.6,
            trait_neuroticism: 0.1,
            trait_extraversion: 0.4,
            trait_openness: 0.4,
            trait_conscientiousness: 0.4,
          }),
          affirmationLine: "あなたの穏やかさは、関係をやさしく守り続けます。",
        },
      ],
    },
    {
      kind: "VIRAL_SHARE_BLOCK",
      id: "viral-motivation",
      presets: [
        {
          id: "x-motivation",
          kind: "x_twitter_card",
          label: "Xでシェア",
          hashtag: "#動機診断",
          cardTitle: "動機スペクトラム診断結果",
          cardDescription: "LibertyCanvas 独自診断を試してみて！",
        },
        {
          id: "native-motivation",
          kind: "native_share",
          label: "友達にシェア",
          hashtag: "#自己理解",
          cardTitle: "動機タイプ診断",
          cardDescription: "あなたの動機タイプをチェック",
        },
      ],
    },
  ];
}

function buildPersonalitySpectrumElements(): DiagnosisElement[] {
  return [
    {
      kind: "SEO_TUNING_BLOCK",
      id: "seo-personality",
      targetDemographics: ["10代", "20代", "30代", "性格診断に関心がある方"],
      desireTags: ["性格診断", "24問診断", "自己理解", "パーソナリティ", "無料診断"],
      landingPath: "/diagnosis/play/personality-spectrum",
      titleTemplate: "24問パーソナリティスペクトラム診断 | Rubel Canvas",
      descriptionTemplate:
        "24問の性格診断で学術特性ベクトルを解析。LibertyCanvas 独自アーキタイプで、あなたのパーソナリティがわかります。",
    },
    ...buildPersonalitySpectrumQuestionBank(),
    {
      kind: "RESULT_TEMPLATE_BLOCK",
      id: "result-personality",
      layout: "compatibility_radar",
      results: [
        {
          id: "lc-spec-introvert-creator",
          title: "内省クリエイター",
          subtitle: "LibertyCanvas 認定・静かな探究心を持つタイプ",
          analysis: "あなたは内側で考えを深め、独自の視点からアイデアを生み出しやすいタイプです。",
          themeColor: "#6366F1",
          traitProfile: t({
            trait_openness: 0.8,
            trait_extraversion: 0.2,
            trait_conscientiousness: 0.5,
            trait_empathy: 0.5,
            trait_agreeableness: 0.5,
            trait_neuroticism: 0.3,
          }),
          compatibilityHint: "実行リーダー型との補完関係が生まれやすいです。",
        },
        {
          id: "lc-spec-action-leader",
          title: "実行リーダー",
          subtitle: "LibertyCanvas 認定・推進力と計画性のタイプ",
          analysis: "あなたは計画を行動に移す力が強く、チームを前に進めやすいプロフィールです。",
          themeColor: "#0D9488",
          traitProfile: t({
            trait_conscientiousness: 0.8,
            trait_extraversion: 0.7,
            trait_openness: 0.4,
            trait_agreeableness: 0.4,
            trait_empathy: 0.3,
            trait_neuroticism: 0.2,
          }),
          compatibilityHint: "共感サポーター型との協働が安定しやすいです。",
        },
        {
          id: "lc-spec-empathy",
          title: "共感サポーター",
          subtitle: "LibertyCanvas 認定・やさしさで支えるタイプ",
          analysis: "あなたは人への配慮を大切にし、関係の温度を保ちやすいタイプです。",
          themeColor: "#F472B6",
          traitProfile: t({
            trait_empathy: 0.9,
            trait_agreeableness: 0.8,
            trait_extraversion: 0.4,
            trait_openness: 0.5,
            trait_conscientiousness: 0.4,
            trait_neuroticism: 0.3,
          }),
          compatibilityHint: "探究ストラテジスト型との対話が深まりやすいです。",
        },
        {
          id: "lc-spec-strategist",
          title: "探究ストラテジスト",
          subtitle: "LibertyCanvas 認定・発想と構想を両立するタイプ",
          analysis: "あなたは新しい視点と計画性を組み合わせ、戦略的に物事を進めやすいタイプです。",
          themeColor: "#F59E0B",
          traitProfile: t({
            trait_openness: 0.8,
            trait_conscientiousness: 0.7,
            trait_extraversion: 0.4,
            trait_agreeableness: 0.4,
            trait_empathy: 0.4,
            trait_neuroticism: 0.2,
          }),
          compatibilityHint: "内省クリエイター型との組み合わせで発想が広がります。",
        },
      ],
    },
    {
      kind: "VIRAL_SHARE_BLOCK",
      id: "viral-personality",
      presets: [
        {
          id: "x-personality",
          kind: "x_twitter_card",
          label: "Xでシェア",
          hashtag: "#性格診断",
          cardTitle: "パーソナリティスペクトラム結果",
          cardDescription: "8問・LibertyCanvas 独自診断！",
        },
        {
          id: "img-personality",
          kind: "image_download",
          label: "結果を保存",
          hashtag: "#自己理解",
          cardTitle: "パーソナリティ診断",
          cardDescription: "Rubel Canvas",
        },
      ],
    },
  ];
}

export const PLUG_DIAGNOSIS_CATALOG: readonly PlugDiagnosisDefinition[] = [
  {
    id: PLUG_DIAGNOSIS_IDS.oshikatsu,
    slug: "oshikatsu",
    eyebrow: "推し活診断",
    title: "推し活スタイル診断",
    subtitle: "LibertyCanvas 独自アーキタイプで、あなたの推し活タイプを見つける",
    estimatedMinutes: 12,
    themeColor: "#8B5CF6",
    traitIds: LEGAL_TRAIT_KEYS,
    elements: buildOshikatsuElements(),
  },
  {
    id: PLUG_DIAGNOSIS_IDS.romance,
    slug: "romance",
    eyebrow: "恋愛診断",
    title: "恋愛コミュニケーション診断",
    subtitle: "24問で読み解く、LibertyCanvas 独自の恋愛プロフィール",
    estimatedMinutes: 12,
    themeColor: "#F472B6",
    traitIds: LEGAL_TRAIT_KEYS,
    elements: buildRomanceElements(),
  },
  {
    id: PLUG_DIAGNOSIS_IDS.genz,
    slug: "genz",
    eyebrow: "高校生向け",
    title: "ソーシャルタイプ診断",
    subtitle: "24問でわかる、LibertyCanvas 独自の友達関係スタイル",
    estimatedMinutes: 12,
    themeColor: "#FBBF24",
    traitIds: LEGAL_TRAIT_KEYS,
    elements: buildGenZElements(),
  },
  {
    id: PLUG_DIAGNOSIS_IDS.academicSpectrum,
    slug: "big-five",
    eyebrow: "学術5因子診断",
    title: "学術5因子性格診断",
    subtitle: "24問で読み解く、LibertyCanvas 独自の学術特性プロフィール",
    estimatedMinutes: 12,
    themeColor: "#6366F1",
    traitIds: LEGAL_TRAIT_KEYS,
    elements: buildAcademicSpectrumElements(),
  },
  {
    id: PLUG_DIAGNOSIS_IDS.motivationSpectrum,
    slug: "motivation-spectrum",
    eyebrow: "動機スペクトラム",
    title: "動機スペクトラム診断",
    subtitle: "24問でわかる、LibertyCanvas 独自の行動動機タイプ",
    estimatedMinutes: 12,
    themeColor: "#34D399",
    traitIds: LEGAL_TRAIT_KEYS,
    elements: buildMotivationSpectrumElements(),
  },
  {
    id: PLUG_DIAGNOSIS_IDS.personalitySpectrum,
    slug: "personality-spectrum",
    eyebrow: "24問診断",
    title: "パーソナリティスペクトラム診断",
    subtitle: "24問でわかる、LibertyCanvas 独自のパーソナリティタイプ",
    estimatedMinutes: 12,
    themeColor: "#0D9488",
    traitIds: LEGAL_TRAIT_KEYS,
    elements: buildPersonalitySpectrumElements(),
  },
] as const;

export function getPlugDiagnosisBySlug(
  slug: string,
): PlugDiagnosisDefinition | null {
  return PLUG_DIAGNOSIS_CATALOG.find((entry) => entry.slug === slug) ?? null;
}

export function getPlugDiagnosisById(
  id: string,
): PlugDiagnosisDefinition | null {
  return PLUG_DIAGNOSIS_CATALOG.find((entry) => entry.id === id) ?? null;
}

export function listPlugDiagnosisSlugs(): readonly string[] {
  return PLUG_DIAGNOSIS_CATALOG.map((entry) => entry.slug);
}
