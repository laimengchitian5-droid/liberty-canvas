import {
  assertDistinctTraitProfiles,
  defineTraitProfile,
} from "@/lib/specialty/traitProfile";
import { REMAINING_COUNTRY_C_ARCHETYPES } from "@/lib/specialty/countryCArchetypeSeeds";
import {
  SPECIALTY_COUNTRY_IDS,
  type SpecialtyCountryId,
  type SpecialtyCountryRecord,
} from "@/lib/specialty/types";

const tp = defineTraitProfile;

export const WORLD_SPECIALTY_SOUL_SLUG = "world-specialty-soul" as const;
export const WORLD_SPECIALTY_SOUL_ID = "lc-world-specialty-soul" as const;
export const WORLD_SPECIALTY_PLAY_PATH =
  `/diagnosis/play/${WORLD_SPECIALTY_SOUL_SLUG}` as const;

export const GLOBAL_SPECIALTY_TAXONOMY: readonly SpecialtyCountryRecord[] = [
  {
    id: "jp",
    flagEmoji: "🇯🇵",
    countryNameJa: "日本",
    countryNameEn: "Japan",
    specialtyLabelJa: "麹・発酵米・水のものづくり",
    specialtyLabelEn: "Koji, fermentation rice & water craft",
    history: [
      "稲作の伝来とともに、日本では発酵文化が育まれました。",
      "奈良・平安期には祭祀向けに発酵技術が体系化され、江戸期には冬仕込みと杜氏制度が確立しました。",
    ],
    context: [
      "豊富な軟硬水と、麹菌による並行複発酵が品質の基盤です。",
      "発酵米の芯（しんぱく）を活かす品種改良が、地域ごとの個性を生み出しています。",
    ],
    significance: [
      "共同体と儀式をつなぐ文化的媒質として、祝祭や結婚式などで今も大切にされています。",
      "職人の忍耐と季節への敬意を象徴する、日本のものづくり哲学です。",
    ],
    cSlug: "jp-sakamai-craft",
    cTitleJa: "麹魂タイプ診断",
    cEyebrowJa: "日本・発酵職人",
    releasePhase: "live",
    bArchetype: {
      id: "lc-specialty-jp-winter-brewer",
      title: "冬仕込みの職人魂",
      subtitle: "季節と水を読み、丁寧に仕上げる蓄積型タイプ",
      analysis:
        "あなたは急がず、環境と素材の声を聞きながら質を高めるスタイル。共同体の儀式や長期プロジェクトで力を発揮しやすいタイプです。",
      themeColor: "#6366F1",
      affirmationLine: "あなたの丁寧さが、静かに周囲の基準を上げています。",
      traitProfile: tp({
        trait_conscientiousness: 0.85,
        trait_empathy: 0.65,
        trait_agreeableness: 0.6,
        trait_openness: 0.5,
        trait_extraversion: 0.3,
        trait_neuroticism: 0.2,
      }),
    },
    cArchetypes: [
      {
        id: "lc-jp-koji-master",
        title: "麹仕込み職人",
        subtitle: "発酵の微差を読み取る、精密な職人タイプ",
        analysis: "細部の変化に敏感で、品質管理と継承を大切にするスタイルです。",
        themeColor: "#4F46E5",
        affirmationLine: "あなたの手仕事は、次の世代への信頼を育てます。",
        traitProfile: tp({
          trait_conscientiousness: 0.9,
          trait_openness: 0.5,
          trait_empathy: 0.5,
          trait_agreeableness: 0.5,
          trait_extraversion: 0.2,
          trait_neuroticism: 0.2,
        }),
      },
      {
        id: "lc-jp-water-sensor",
        title: "水質センサー",
        subtitle: "環境条件を読み、最適解を選ぶ調律型",
        analysis: "素材と環境の相性を見極め、バランスを整える力が強いタイプです。",
        themeColor: "#0EA5E9",
        affirmationLine: "あなたの感覚が、仕上がりの透明感を支えています。",
        traitProfile: tp({
          trait_openness: 0.7,
          trait_conscientiousness: 0.7,
          trait_empathy: 0.6,
          trait_agreeableness: 0.5,
          trait_extraversion: 0.3,
          trait_neuroticism: 0.2,
        }),
      },
      {
        id: "lc-jp-grain-reader",
        title: "米の芯読み",
        subtitle: "原料の個性を引き出す、観察型クリエイター",
        analysis: "素材の持ち味を尊重し、静かに可能性を広げるスタイルです。",
        themeColor: "#8B5CF6",
        affirmationLine: "あなたの視点が、いつもの素材を特別な体験に変えます。",
        traitProfile: tp({
          trait_openness: 0.75,
          trait_empathy: 0.7,
          trait_conscientiousness: 0.6,
          trait_agreeableness: 0.5,
          trait_extraversion: 0.3,
          trait_neuroticism: 0.25,
        }),
      },
      {
        id: "lc-jp-ritual-keeper",
        title: "儀式の継承者",
        subtitle: "共同体の節目を支える、調和型リーダー",
        analysis: "人と人をつなぐ場を大切にし、伝統を現代的に翻訳する力があります。",
        themeColor: "#EC4899",
        affirmationLine: "あなたの存在が、場の記憶と温かさをつないでいます。",
        traitProfile: tp({
          trait_agreeableness: 0.8,
          trait_empathy: 0.75,
          trait_conscientiousness: 0.6,
          trait_extraversion: 0.5,
          trait_openness: 0.4,
          trait_neuroticism: 0.2,
        }),
      },
    ],
  },
  {
    id: "us",
    flagEmoji: "🇺🇸",
    countryNameJa: "アメリカ",
    countryNameEn: "United States",
    specialtyLabelJa: "トウモロコシとフロンティア農業",
    specialtyLabelEn: "Corn & frontier agriculture",
    history: [
      "トウモロコシは先住民族によって長い年月をかけて栽培・保存されてきました。",
      "植民期の飢饉を乗り越えた後、西進と産業化の基盤食料として発展しました。",
    ],
    context: [
      "ミッドウェスト・コーンベルトの広大な肥沃地が大規模生産を可能にしています。",
      "ハイブリッド種や近代農業技術により、世界市場を左右する穀物資源へ成長しました。",
    ],
    significance: [
      "フロンティア精神と大量生産の象徴として、食料・エネルギー・産業の基盤を担います。",
      "スケールと実用性を重視する価値観を体現する名産です。",
    ],
    cSlug: "us-corn-frontier",
    cTitleJa: "フロンティア・シーダー診断",
    cEyebrowJa: "アメリカ・開拓農業",
    releasePhase: "upcoming",
    bArchetype: {
      id: "lc-specialty-us-frontier-seeder",
      title: "フロンティア・シーダー",
      subtitle: "広い地平を見据え、スケールで価値を生む開拓型",
      analysis:
        "あなたは可能性を広げる決断が速く、実用性と効率を重視するタイプ。新しい領域に最初の一歩を踏み出す力があります。",
      themeColor: "#F59E0B",
      affirmationLine: "あなたの行動力が、チームの射程を一気に伸ばします。",
      traitProfile: tp({
        trait_extraversion: 0.75,
        trait_openness: 0.75,
        trait_conscientiousness: 0.6,
        trait_agreeableness: 0.4,
        trait_empathy: 0.35,
        trait_neuroticism: 0.2,
      }),
    },
    cArchetypes: REMAINING_COUNTRY_C_ARCHETYPES.us,
  },
  {
    id: "ca",
    flagEmoji: "🇨🇦",
    countryNameJa: "カナダ",
    countryNameEn: "Canada",
    specialtyLabelJa: "メープルシロップと春の樹液",
    specialtyLabelEn: "Maple syrup & spring harvest",
    history: [
      "先住民族は凍結濃縮や加熱により、カエデの樹液から糖を取り出す技術を確立しました。",
      "入植者の鉄釜導入により、冬の保存食と交易資源として発展しました。",
    ],
    context: [
      "ケベックを中心に、シュガーメープルが密集する森林が広がっています。",
      "寒暖差の大きい早春が、樹液の分泌を促す独特の気候条件を作ります。",
    ],
    significance: [
      "厳冬を越えて春を迎える象徴として、共有と回復の文化を表します。",
      "原生林と先住民知識の交差点を示すカナダの自然資産です。",
    ],
    cSlug: "ca-maple-resilience",
    cTitleJa: "春告げハーベスター診断",
    cEyebrowJa: "カナダ・樹液文化",
    releasePhase: "upcoming",
    bArchetype: {
      id: "lc-specialty-ca-spring-harvester",
      title: "春告げの樹液ハーベスター",
      subtitle: "自然の周期に合わせ、分かち合う回復型",
      analysis:
        "あなたは環境のリズムを読み、無理のないペースで成果を積み上げるタイプ。人との温かい共有を大切にします。",
      themeColor: "#D97706",
      affirmationLine: "あなたの優しさが、チームに春のような再生力を届けます。",
      traitProfile: tp({
        trait_agreeableness: 0.8,
        trait_empathy: 0.75,
        trait_conscientiousness: 0.6,
        trait_openness: 0.5,
        trait_extraversion: 0.35,
        trait_neuroticism: 0.2,
      }),
    },
    cArchetypes: REMAINING_COUNTRY_C_ARCHETYPES.ca,
  },
  {
    id: "br",
    flagEmoji: "🇧🇷",
    countryNameJa: "ブラジル",
    countryNameEn: "Brazil",
    specialtyLabelJa: "テラ・ロッサとキャッサバ農芸",
    specialtyLabelEn: "Terra Roxa soil & artisanal cassava craft",
    history: [
      "先住民のキャッサバ加工と、後のコーヒー農園拡大が農業経済を形作りました。",
      "ブラジルは世界有数の農産輸出国として、近代経済の柱となりました。",
    ],
    context: [
      "火山性のテラ・ロッサ土壌が、多様な作物に適した化学環境を提供します。",
      "多文化移民の流入が、地域社会と産業構造を大きく変えました。",
    ],
    significance: [
      "近代化と農業経済の象徴として、多様性と情熱を同時に体現します。",
      "土地を読み、豊かさを分かち合うエクスポート文化の代表です。",
    ],
    cSlug: "br-terra-roxa-spirit",
    cTitleJa: "テラ・ロッサ開拓者診断",
    cEyebrowJa: "ブラジル・農園文化",
    releasePhase: "upcoming",
    bArchetype: {
      id: "lc-specialty-br-terra-roxa",
      title: "テラ・ロッサの開拓者",
      subtitle: "豊かな土壌で多様性を育てる情熱型",
      analysis:
        "あなたは人と文化をつなぎ、活気ある現場で成果を出すタイプ。新しい組み合わせから価値を生む力があります。",
      themeColor: "#059669",
      affirmationLine: "あなたのエネルギーが、場に豊かなリズムを生み出します。",
      traitProfile: tp({
        trait_extraversion: 0.75,
        trait_openness: 0.7,
        trait_empathy: 0.6,
        trait_agreeableness: 0.55,
        trait_conscientiousness: 0.4,
        trait_neuroticism: 0.3,
      }),
    },
    cArchetypes: REMAINING_COUNTRY_C_ARCHETYPES.br,
  },
  {
    id: "fr",
    flagEmoji: "🇫🇷",
    countryNameJa: "フランス",
    countryNameEn: "France",
    specialtyLabelJa: "テロワールと葡萄文化",
    specialtyLabelEn: "Terroir & viticulture craft",
    history: [
      "古代ギリシャ殖民都市マッセイアを起点に、ブドウ栽培が北上しました。",
      "中世の修道院で栽培・醸造技術が体系化され、保護制度が近代化しました。",
    ],
    context: [
      "テロワール思想により、気候・土壌・地形・職人技が一体の価値となります。",
      "AOC制度が品質と地域性を厳格に保護しています。",
    ],
    significance: [
      "美しい暮らしと食文化の頂点として、保護と洗練の象徴です。",
      "再現困難な地域個性を国家文化資産として育てるモデルです。",
    ],
    cSlug: "fr-terroir-poet",
    cTitleJa: "テロワール詩人診断",
    cEyebrowJa: "フランス・土地の美学",
    releasePhase: "live",
    bArchetype: {
      id: "lc-specialty-fr-terroir-poet",
      title: "テロワールの詩人",
      subtitle: "土地の個性を言語化し、美を守る審美型",
      analysis:
        "あなたは繊細な観察眼で文脈を読み、品質と物語を両立させるタイプ。長期の熟成と保護に価値を置きます。",
      themeColor: "#7C3AED",
      affirmationLine: "あなたの感性が、日常を特別な体験へ昇華させます。",
      traitProfile: tp({
        trait_openness: 0.85,
        trait_conscientiousness: 0.75,
        trait_empathy: 0.55,
        trait_agreeableness: 0.5,
        trait_extraversion: 0.3,
        trait_neuroticism: 0.2,
      }),
    },
    cArchetypes: [
      {
        id: "lc-fr-terroir-guardian",
        title: "テロワールの守護者",
        subtitle: "土地の個性を守り、品質を言語化する保護型",
        analysis:
          "あなたは地域の文脈を深く理解し、再現性より個性の保護を優先するタイプです。",
        themeColor: "#6D28D9",
        affirmationLine: "あなたの守りが、土地の物語を未来へ届けます。",
        traitProfile: tp({
          trait_conscientiousness: 0.85,
          trait_openness: 0.7,
          trait_empathy: 0.5,
          trait_agreeableness: 0.5,
          trait_extraversion: 0.25,
          trait_neuroticism: 0.2,
        }),
      },
      {
        id: "lc-fr-sensory-poet",
        title: "感官の詩人",
        subtitle: "微差を詩に変える、繊細な審美型",
        analysis: "あなたは感覚の変化を言葉にし、体験全体を美しく整える力があります。",
        themeColor: "#8B5CF6",
        affirmationLine: "あなたの表現が、いつもの風景を特別な記憶に変えます。",
        traitProfile: tp({
          trait_openness: 0.9,
          trait_empathy: 0.65,
          trait_conscientiousness: 0.55,
          trait_agreeableness: 0.45,
          trait_extraversion: 0.35,
          trait_neuroticism: 0.25,
        }),
      },
      {
        id: "lc-fr-origin-archivist",
        title: "原産記録の守り手",
        subtitle: "系譜とルールを整え、価値を継承する記録型",
        analysis: "あなたは標準と歴史を大切にし、品質の境界を明確に保つタイプです。",
        themeColor: "#5B21B6",
        affirmationLine: "あなたの記録が、次の世代の基準になります。",
        traitProfile: tp({
          trait_conscientiousness: 0.9,
          trait_openness: 0.5,
          trait_agreeableness: 0.45,
          trait_empathy: 0.4,
          trait_extraversion: 0.2,
          trait_neuroticism: 0.15,
        }),
      },
      {
        id: "lc-fr-vineyard-curator",
        title: "畑のキュレーター",
        subtitle: "地形と気候を読み、最適な表現を選ぶ調律型",
        analysis: "あなたは環境と素材の相性を見極め、バランスの良い仕上がりを導きます。",
        themeColor: "#7C3AED",
        affirmationLine: "あなたの視点が、土地の個性をいちばん美しく引き出します。",
        traitProfile: tp({
          trait_openness: 0.75,
          trait_empathy: 0.6,
          trait_conscientiousness: 0.65,
          trait_agreeableness: 0.55,
          trait_extraversion: 0.3,
          trait_neuroticism: 0.2,
        }),
      },
    ],
  },
  {
    id: "cl",
    flagEmoji: "🇨🇱",
    countryNameJa: "チリ",
    countryNameEn: "Chile",
    specialtyLabelJa: "銅鉱とアンデス・テロワール農芸",
    specialtyLabelEn: "Copper mining & Andean terroir agriculture",
    history: [
      "銅採掘は古代から行われ、20世紀に工業規模へ拡大しました。",
      "隔離地形での果樹・穀物栽培が、病害を避けた独自の農業圏を形成しました。",
    ],
    context: [
      "アンデス山脈に世界最大級の銅資源が存在します。",
      "砂漠・山脈・海洋に囲まれた地形が、病害から守られた栽培環境を作りました。",
    ],
    significance: [
      "銅は国家財政の基盤、テロワール農芸は高付加価値輸出の顔として機能します。",
      "資源と創造の二刀流を象徴する国です。",
    ],
    cSlug: "cl-andes-dualcraft",
    cTitleJa: "アンデス二刀流診断",
    cEyebrowJa: "チリ・資源と個性",
    releasePhase: "upcoming",
    bArchetype: {
      id: "lc-specialty-cl-andes-dual",
      title: "アンデスの二刀流",
      subtitle: "資源の力と独自性を両立する戦略型",
      analysis:
        "あなたは実務と創造を行き来し、環境の制約を強みに変えるタイプ。安定と挑戦のバランス感覚に優れます。",
      themeColor: "#DC2626",
      affirmationLine: "あなたの二面性が、長期戦で大きな価値を生みます。",
      traitProfile: tp({
        trait_conscientiousness: 0.75,
        trait_openness: 0.7,
        trait_extraversion: 0.5,
        trait_agreeableness: 0.45,
        trait_empathy: 0.4,
        trait_neuroticism: 0.2,
      }),
    },
    cArchetypes: REMAINING_COUNTRY_C_ARCHETYPES.cl,
  },
  {
    id: "md",
    flagEmoji: "🇲🇩",
    countryNameJa: "モルドバ",
    countryNameEn: "Moldova",
    specialtyLabelJa: "葡萄等級と地下セラー熟成",
    specialtyLabelEn: "Grape classification & underground cellar craft",
    history: [
      "モルドバには古代からの葡萄栽培文化があり、15世紀には王侯文化として栄えました。",
      "ソ連時代は大規模供給基地となり、独立後はテロワール重視の高付加価値路線へ転換しました。",
    ],
    context: [
      "黒土（チェルノゼム）と丘陵地形が栽培に適しています。",
      "世界最大級の地下セラー網が、長期熟成と等級管理のインフラを支えています。",
    ],
    significance: [
      "歴史的圧力の中でも文化を守り続ける、主権と誇りの象徴です。",
      "時間と等級を味方につける蓄積型の価値観を体現します。",
    ],
    cSlug: "md-cellar-guardian",
    cTitleJa: "地下セラー守り人診断",
    cEyebrowJa: "モルドバ・熟成文化",
    releasePhase: "upcoming",
    bArchetype: {
      id: "lc-specialty-md-cellar-guardian",
      title: "地下セラーの守り人",
      subtitle: "歴史を蓄積し、静かに守り抜く継承型",
      analysis:
        "あなたは目に見えない価値を大切にし、長期視点で文化と資産を守るタイプ。困難な局面ほど粘り強さを発揮します。",
      themeColor: "#9333EA",
      affirmationLine: "あなたの静かな信念が、未来への道筋を照らしています。",
      traitProfile: tp({
        trait_conscientiousness: 0.8,
        trait_empathy: 0.7,
        trait_openness: 0.6,
        trait_agreeableness: 0.6,
        trait_extraversion: 0.3,
        trait_neuroticism: 0.3,
      }),
    },
    cArchetypes: REMAINING_COUNTRY_C_ARCHETYPES.md,
  },
  {
    id: "pk",
    flagEmoji: "🇵🇰",
    countryNameJa: "パキスタン",
    countryNameEn: "Pakistan",
    specialtyLabelJa: "バスマティ・ヨーグルト・発酵パン",
    specialtyLabelEn: "Basmati, yogurt & leavened artisanal bread",
    history: [
      "インダス平原でバスマティは長く栽培され、もてなしの食卓を支えました。",
      "ヨーグルトと発酵パンの家庭技法が、非アルコールの発酵文化として継承されています。",
    ],
    context: [
      "氷河由来の水と肥沃な沖積土が、香り高い長粒米を育てます。",
      "乳酸発酵とパン種起こしが、日常のもてなしと共同体の味覚を支えます。",
    ],
    significance: [
      "香りともてなしの文化を象徴し、大地の記憶を現代へ接続します。",
      "自然資源と食文化の誇りを同時に表す名産です。",
    ],
    cSlug: "pk-fragrant-earth",
    cTitleJa: "香りのプリンス診断",
    cEyebrowJa: "パキスタン・大地の恵み",
    releasePhase: "upcoming",
    bArchetype: {
      id: "lc-specialty-pk-fragrant-prince",
      title: "香りのプリンス",
      subtitle: "大地の恵みを丁寧に届けるもてなし型",
      analysis:
        "あなたは繊細な感性で品質を見極め、相手に誇りと安心を届けるタイプ。文化を言葉にして伝える力があります。",
      themeColor: "#EA580C",
      affirmationLine: "あなたのおもてなしが、人の心に深い香りを残します。",
      traitProfile: tp({
        trait_empathy: 0.8,
        trait_agreeableness: 0.75,
        trait_openness: 0.6,
        trait_conscientiousness: 0.6,
        trait_extraversion: 0.4,
        trait_neuroticism: 0.2,
      }),
    },
    cArchetypes: REMAINING_COUNTRY_C_ARCHETYPES.pk,
  },
  {
    id: "uk",
    flagEmoji: "🇬🇧",
    countryNameJa: "イギリス",
    countryNameEn: "United Kingdom",
    specialtyLabelJa: "高地気候と長期熟成の職人技",
    specialtyLabelEn: "Highland climate & long-horizon craft",
    history: [
      "15世紀には修道院文化のなかで、長期保存と品質管理の技法が体系化されました。",
      "厳しい気候と法制度の影響を受けながら、時間をかける職人工程が洗練されました。",
    ],
    context: [
      "湿潤で冷涼な気候が、長期熟成の化学変化を穏やかに進めます。",
      "乾燥と保管の伝統、および法制度が、品質基準を厳格に保っています。",
    ],
    significance: [
      "伝統を守りながら革新する、熟成と規律の象徴です。",
      "時間を資産に変える職人文化を体現します。",
    ],
    cSlug: "uk-maturation-highlander",
    cTitleJa: "熟成の高地人診断",
    cEyebrowJa: "イギリス・熟成文化",
    releasePhase: "live",
    bArchetype: {
      id: "lc-specialty-uk-highlander",
      title: "熟成の高地人",
      subtitle: "時間を味方にし、伝統を守る不屈型",
      analysis:
        "あなたは短期成果より長期品質を選び、規律と忍耐で信頼を積み上げるタイプ。困難に動じない芯の強さがあります。",
      themeColor: "#1D4ED8",
      affirmationLine: "あなたの粘り強さが、最後にいちばん大きな価値を生みます。",
      traitProfile: tp({
        trait_conscientiousness: 0.85,
        trait_openness: 0.5,
        trait_extraversion: 0.25,
        trait_agreeableness: 0.45,
        trait_empathy: 0.4,
        trait_neuroticism: 0.1,
      }),
    },
    cArchetypes: [
      {
        id: "lc-uk-cask-keeper",
        title: "保管庫の番人",
        subtitle: "時間と環境を読み、熟成を守る規律型",
        analysis: "あなたは長期プロセスを丁寧に管理し、品質の一貫性を守る力があります。",
        themeColor: "#1E40AF",
        affirmationLine: "あなたの規律が、価値を静かに高め続けます。",
        traitProfile: tp({
          trait_conscientiousness: 0.9,
          trait_openness: 0.45,
          trait_extraversion: 0.2,
          trait_agreeableness: 0.4,
          trait_empathy: 0.35,
          trait_neuroticism: 0.1,
        }),
      },
      {
        id: "lc-uk-malt-patient",
        title: "素材の忍耐者",
        subtitle: "急がず、素材の変化を見守る熟成型",
        analysis: "あなたは短期成果より過程を重視し、安定した手仕事で信頼を築きます。",
        themeColor: "#2563EB",
        affirmationLine: "あなたの忍耐が、仕上がりに深みを与えます。",
        traitProfile: tp({
          trait_conscientiousness: 0.8,
          trait_empathy: 0.5,
          trait_openness: 0.45,
          trait_agreeableness: 0.5,
          trait_extraversion: 0.25,
          trait_neuroticism: 0.15,
        }),
      },
      {
        id: "lc-uk-highland-stoic",
        title: "高地のストイック",
        subtitle: "困難な環境でも芯を曲げない、不屈型",
        analysis:
          "あなたはプレッシャー下でも冷静さを保ち、長期戦で力を発揮するタイプです。",
        themeColor: "#1D4ED8",
        affirmationLine: "あなたの静かな強さが、周囲の基準を支えます。",
        traitProfile: tp({
          trait_conscientiousness: 0.85,
          trait_neuroticism: 0.05,
          trait_openness: 0.4,
          trait_extraversion: 0.2,
          trait_agreeableness: 0.4,
          trait_empathy: 0.35,
        }),
      },
      {
        id: "lc-uk-tradition-forge",
        title: "伝統の鍛冶屋",
        subtitle: "古い技法を現代に鍛え直す、継承革新型",
        analysis: "あなたは伝統を守りながら改良点を見つけ、持続可能な進化を実現します。",
        themeColor: "#3B82F6",
        affirmationLine: "あなたの手仕事が、伝統を未来へつないでいます。",
        traitProfile: tp({
          trait_conscientiousness: 0.75,
          trait_openness: 0.6,
          trait_agreeableness: 0.45,
          trait_empathy: 0.4,
          trait_extraversion: 0.3,
          trait_neuroticism: 0.15,
        }),
      },
    ],
  },
] as const;

const TAXONOMY_BY_ID: Readonly<Record<SpecialtyCountryId, SpecialtyCountryRecord>> =
  Object.freeze(
    GLOBAL_SPECIALTY_TAXONOMY.reduce(
      (accumulator, entry) => {
        accumulator[entry.id] = entry;
        return accumulator;
      },
      {} as Record<SpecialtyCountryId, SpecialtyCountryRecord>,
    ),
  );

const ARCHETYPE_ID_TO_COUNTRY: Readonly<Record<string, SpecialtyCountryId>> =
  Object.freeze(
    GLOBAL_SPECIALTY_TAXONOMY.reduce(
      (accumulator, entry) => {
        accumulator[entry.bArchetype.id] = entry.id;
        return accumulator;
      },
      {} as Record<string, SpecialtyCountryId>,
    ),
  );

const C_SLUG_TO_COUNTRY: Readonly<Record<string, SpecialtyCountryId>> = Object.freeze(
  GLOBAL_SPECIALTY_TAXONOMY.reduce(
    (accumulator, entry) => {
      accumulator[entry.cSlug] = entry.id;
      return accumulator;
    },
    {} as Record<string, SpecialtyCountryId>,
  ),
);

export const SPECIALTY_COUNTRY_C_SLUGS: ReadonlySet<string> = new Set(
  GLOBAL_SPECIALTY_TAXONOMY.map((entry) => entry.cSlug),
);

const MIN_LIVE_C_ARCHETYPES = 3;

function assertTaxonomyIntegrity(records: readonly SpecialtyCountryRecord[]): void {
  if (records.length !== SPECIALTY_COUNTRY_IDS.length) {
    throw new Error(
      `Taxonomy must contain exactly ${SPECIALTY_COUNTRY_IDS.length} countries, received ${records.length}`,
    );
  }

  const seenIds = new Set<SpecialtyCountryId>();
  const seenBArchetypeIds = new Set<string>();
  const seenCSlugs = new Set<string>();

  for (const record of records) {
    if (seenIds.has(record.id)) {
      throw new Error(`Duplicate country id: ${record.id}`);
    }
    seenIds.add(record.id);

    if (seenBArchetypeIds.has(record.bArchetype.id)) {
      throw new Error(`Duplicate B archetype id: ${record.bArchetype.id}`);
    }
    seenBArchetypeIds.add(record.bArchetype.id);

    if (seenCSlugs.has(record.cSlug)) {
      throw new Error(`Duplicate C slug: ${record.cSlug}`);
    }
    seenCSlugs.add(record.cSlug);

    assertDistinctTraitProfiles(
      [record.bArchetype.traitProfile],
      `country ${record.id} B archetype`,
    );

    if (record.cArchetypes.length > 0) {
      assertDistinctTraitProfiles(
        record.cArchetypes.map((archetype) => archetype.traitProfile),
        `country ${record.id} C archetypes`,
      );
    }

    if (
      record.releasePhase === "live" &&
      record.cArchetypes.length < MIN_LIVE_C_ARCHETYPES
    ) {
      throw new Error(
        `Live country ${record.id} requires at least ${MIN_LIVE_C_ARCHETYPES} C archetypes (native review barrier)`,
      );
    }

    if (
      record.releasePhase === "upcoming" &&
      record.cArchetypes.length > 0 &&
      record.cArchetypes.length < MIN_LIVE_C_ARCHETYPES
    ) {
      throw new Error(
        `Upcoming country ${record.id} scaffold incomplete: need ${MIN_LIVE_C_ARCHETYPES}+ C archetypes before live promotion`,
      );
    }
  }

  for (const countryId of SPECIALTY_COUNTRY_IDS) {
    if (!seenIds.has(countryId)) {
      throw new Error(`Missing taxonomy entry for country id: ${countryId}`);
    }
  }

  assertDistinctTraitProfiles(
    records.map((record) => record.bArchetype.traitProfile),
    "world specialty B archetypes",
  );
}

assertTaxonomyIntegrity(GLOBAL_SPECIALTY_TAXONOMY);

export function getSpecialtyCountry(id: SpecialtyCountryId): SpecialtyCountryRecord {
  const record = TAXONOMY_BY_ID[id];
  if (!record) {
    throw new Error(`Unknown specialty country id: ${id}`);
  }
  return record;
}

export function listSpecialtyCountries(): readonly SpecialtyCountryRecord[] {
  return GLOBAL_SPECIALTY_TAXONOMY;
}

export function getSpecialtyCountryByBArchetypeId(
  archetypeId: string,
): SpecialtyCountryRecord | null {
  const countryId = ARCHETYPE_ID_TO_COUNTRY[archetypeId];
  if (!countryId) {
    return null;
  }
  return getSpecialtyCountry(countryId);
}

export function getSpecialtyCountryByCSlug(cSlug: string): SpecialtyCountryRecord | null {
  const countryId = C_SLUG_TO_COUNTRY[cSlug];
  if (!countryId) {
    return null;
  }
  return getSpecialtyCountry(countryId);
}

export function buildCountryPlayPath(slug: string): string {
  return `/diagnosis/play/${slug}`;
}
