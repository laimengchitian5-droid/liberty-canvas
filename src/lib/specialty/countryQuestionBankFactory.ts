import type { QuestionBlock, TraitWeightMap } from "@/types/diagnosisCompiler";
import type { SpecialtyCountryId } from "@/lib/specialty/types";
import {
  buildFrTerroirQuestionBank,
  buildJpSakamaiQuestionBank,
  buildUkMaturationQuestionBank,
} from "@/lib/specialty/countrySpecialtyQuestionBanks";
const t = (weights: TraitWeightMap): TraitWeightMap => weights;

interface McqOptionInput {
  readonly id: string;
  readonly label: string;
  readonly traitWeights: TraitWeightMap;
}

function mcq(
  id: string,
  prompt: string,
  options: readonly McqOptionInput[],
): QuestionBlock {
  return {
    kind: "QUESTION_BLOCK",
    id,
    prompt,
    inputType: "multiple_choice",
    options: options.map((option) => ({
      id: option.id,
      label: option.label,
      traitWeights: t(option.traitWeights),
    })),
  };
}

function buildScaleQuestionBank(
  prefix: string,
  theme: "frontier" | "maple" | "estate" | "andes" | "cellar" | "fragrant",
): readonly QuestionBlock[] {
  const prompts: Record<typeof theme, readonly string[]> = {
    frontier: [
      "広いチャンスが開いたとき、あなたは？",
      "スケールを広げる局面で重視するのは？",
      "新しい土地で最初に整えるのは？",
      "収穫量と品質が衝突したら？",
      "チームを拡大するときの役割は？",
      "不確実な市場であなたの判断は？",
      "効率化の提案が出たとき？",
      "長期計画でいちばん得意なのは？",
      "失敗から学ぶときの第一歩は？",
      "成果の届け方で近いのは？",
      "仕事のペースでしっくりくるのは？",
      "10年後に残したいものは？",
    ],
    maple: [
      "厳しい季節のあと、どう立ち直りますか？",
      "自然の周期に合わせるときの姿勢は？",
      "共同体で成果を分かち合う場面では？",
      "寒暖差の変化にどう反応しますか？",
      "無理のない収穫計画で重視するのは？",
      "春の訪れをどう捉えますか？",
      "周囲の疲れに気づいたら？",
      "準備と実行のバランスは？",
      "環境変化への対応で近いのは？",
      "長い冬のプロジェクトで強みは？",
      "信頼関係を育てる方法は？",
      "10年後に残したいものは？",
    ],
    estate: [
      "豊かな現場でいちばん輝くのは？",
      "多文化チームでのあなたの役割は？",
      "土壌の個性をどう活かしますか？",
      "収穫祭のような節目であなたは？",
      "新しい仲間を迎えるとき？",
      "リズムの速い現場での判断は？",
      "品質とスピードのバランスは？",
      "創意工夫の提案が通ったら？",
      "困難な天候が続くとき？",
      "成果を共有する場面では？",
      "学び方として近いのは？",
      "10年後に残したいものは？",
    ],
    andes: [
      "資源と創造の二面性をどう扱いますか？",
      "安定と挑戦が衝突したら？",
      "独自性を守るために重視するのは？",
      "長期戦略であなたの強みは？",
      "輸出向けに価値を翻訳するとき？",
      "制約が強い環境での判断は？",
      "実務と発想の切り替えは？",
      "チームの役割分担で近いのは？",
      "失敗後の立て直しで最初にするのは？",
      "差別化を維持する方法は？",
      "成果評価で重視するのは？",
      "10年後に残したいものは？",
    ],
    cellar: [
      "長期保管の品質を守るうえで重視するのは？",
      "歴史を未来へ渡す方法で近いのは？",
      "困難な局面であなたの芯は？",
      "地下空間のような環境をどう活かしますか？",
      "記録と継承で得意なのは？",
      "文化を守る仕事で大切にするのは？",
      "時間を味方にする戦略は？",
      "共同体の記憶をどう扱いますか？",
      "変化の速い時代での姿勢は？",
      "品質基準を維持する方法は？",
      "学び方として近いのは？",
      "10年後に残したいものは？",
    ],
    fragrant: [
      "おもてなしで最優先するのは？",
      "香りや質感の微差をどう扱いますか？",
      "大地の恵みを伝えるときの姿勢は？",
      "品質の誇りをどう表現しますか？",
      "客人の不安に気づいたら？",
      "一粒・一品の個性をどう見ますか？",
      "伝統を現代に翻訳するとき？",
      "チームでの役割で近いのは？",
      "失敗から学ぶ第一歩は？",
      "成果を届ける場面では？",
      "仕事のペースでしっくりくるのは？",
      "10年後に残したいものは？",
    ],
  };

  const options = [
    [
      {
        id: "a",
        label: "計画を組み立ててから動く",
        traitWeights: { trait_conscientiousness: 0.7, trait_openness: 0.2 },
      },
      {
        id: "b",
        label: "まず試して学ぶ",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.5 },
      },
      {
        id: "c",
        label: "周囲と相談して決める",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "d",
        label: "様子を見て慎重に進む",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.4 },
      },
    ],
    [
      { id: "a", label: "再現性と安定", traitWeights: { trait_conscientiousness: 0.8 } },
      {
        id: "b",
        label: "独自性と記憶",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "c",
        label: "届いた人数と影響",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "d",
        label: "関係が深まったか",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
    ],
    [
      {
        id: "a",
        label: "基準と手順",
        traitWeights: { trait_conscientiousness: 0.7, trait_agreeableness: 0.2 },
      },
      {
        id: "b",
        label: "現場の空気",
        traitWeights: { trait_extraversion: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "c",
        label: "記録と振り返り",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
      {
        id: "d",
        label: "無理のない分担",
        traitWeights: { trait_agreeableness: 0.5, trait_neuroticism: -0.2 },
      },
    ],
    [
      {
        id: "a",
        label: "品質を優先する",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.1 },
      },
      {
        id: "b",
        label: "別ルートを試す",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "c",
        label: "関係者と合意する",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "d",
        label: "ペースを落として調整",
        traitWeights: { trait_neuroticism: -0.3, trait_empathy: 0.3 },
      },
    ],
    [
      {
        id: "a",
        label: "設計と監督",
        traitWeights: { trait_conscientiousness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "b",
        label: "現場で牽引",
        traitWeights: { trait_extraversion: 0.7, trait_openness: 0.2 },
      },
      {
        id: "c",
        label: "調整と支援",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "d",
        label: "新しい視点の提案",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.2 },
      },
    ],
    [
      {
        id: "a",
        label: "リスクを織り込む",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: 0.1 },
      },
      {
        id: "b",
        label: "小さく素早く試す",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "c",
        label: "情報を共有して判断",
        traitWeights: { trait_agreeableness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "d",
        label: "確実な道を選ぶ",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.3 },
      },
    ],
    [
      {
        id: "a",
        label: "導入条件を厳密に確認",
        traitWeights: { trait_conscientiousness: 0.7 },
      },
      {
        id: "b",
        label: "体感で効果を確かめる",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "c",
        label: "チーム合意を取る",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "d",
        label: "段階的に導入する",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
    ],
    [
      {
        id: "a",
        label: "長期品質の設計",
        traitWeights: { trait_conscientiousness: 0.8, trait_neuroticism: -0.1 },
      },
      {
        id: "b",
        label: "新市場の開拓",
        traitWeights: { trait_openness: 0.7, trait_extraversion: 0.3 },
      },
      {
        id: "c",
        label: "関係資産の蓄積",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "d",
        label: "環境適応の仕組み",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.4 },
      },
    ],
    [
      { id: "a", label: "ログを見直す", traitWeights: { trait_conscientiousness: 0.7 } },
      {
        id: "b",
        label: "感覚を言語化する",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "c",
        label: "チームで振り返る",
        traitWeights: { trait_agreeableness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "d",
        label: "一度休息して再判断",
        traitWeights: { trait_neuroticism: -0.3, trait_empathy: 0.3 },
      },
    ],
    [
      {
        id: "a",
        label: "丁寧な工程で届ける",
        traitWeights: { trait_conscientiousness: 0.7, trait_agreeableness: 0.2 },
      },
      {
        id: "b",
        label: "大きな舞台で届ける",
        traitWeights: { trait_extraversion: 0.7, trait_openness: 0.2 },
      },
      {
        id: "c",
        label: "少人数に深く届ける",
        traitWeights: { trait_empathy: 0.7, trait_agreeableness: 0.3 },
      },
      {
        id: "d",
        label: "個性を際立たせて届ける",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.3 },
      },
    ],
    [
      {
        id: "a",
        label: "一定のリズムを守る",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
      {
        id: "b",
        label: "インスピレーションに乗る",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "c",
        label: "周囲に合わせて調整",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.3 },
      },
      {
        id: "d",
        label: "重要局面に集中",
        traitWeights: { trait_conscientiousness: 0.5, trait_extraversion: 0.2 },
      },
    ],
    [
      {
        id: "a",
        label: "再現できる技術と記録",
        traitWeights: { trait_conscientiousness: 0.8 },
      },
      {
        id: "b",
        label: "新しい市場と挑戦",
        traitWeights: { trait_openness: 0.7, trait_extraversion: 0.3 },
      },
      {
        id: "c",
        label: "人とのつながりの記憶",
        traitWeights: { trait_empathy: 0.7, trait_agreeableness: 0.4 },
      },
      {
        id: "d",
        label: "守り続けた個性",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.5 },
      },
    ],
  ] as const;

  return prompts[theme].map((prompt, index) =>
    mcq(
      `${prefix}-${index + 1}`,
      prompt,
      options[index]!.map((option, optionIndex) => ({
        id: `${prefix}-${index + 1}-${option.id}`,
        label: option.label,
        traitWeights: option.traitWeights,
      })),
    ),
  );
}

export function buildUsCornFrontierQuestionBank(): readonly QuestionBlock[] {
  return buildScaleQuestionBank("q-us", "frontier");
}

export function buildCaMapleResilienceQuestionBank(): readonly QuestionBlock[] {
  return buildScaleQuestionBank("q-ca", "maple");
}

export function buildBrTerraRoxaQuestionBank(): readonly QuestionBlock[] {
  return buildScaleQuestionBank("q-br", "estate");
}

export function buildClAndesDualcraftQuestionBank(): readonly QuestionBlock[] {
  return buildScaleQuestionBank("q-cl", "andes");
}

export function buildMdCellarGuardianQuestionBank(): readonly QuestionBlock[] {
  return buildScaleQuestionBank("q-md", "cellar");
}

export function buildPkFragrantEarthQuestionBank(): readonly QuestionBlock[] {
  return buildScaleQuestionBank("q-pk", "fragrant");
}

type CountryQuestionBankBuilder = () => readonly QuestionBlock[];

const COUNTRY_QUESTION_BANK_BUILDERS: Record<
  SpecialtyCountryId,
  CountryQuestionBankBuilder
> = {
  jp: buildJpSakamaiQuestionBank,
  fr: buildFrTerroirQuestionBank,
  uk: buildUkMaturationQuestionBank,
  us: buildUsCornFrontierQuestionBank,
  ca: buildCaMapleResilienceQuestionBank,
  br: buildBrTerraRoxaQuestionBank,
  cl: buildClAndesDualcraftQuestionBank,
  md: buildMdCellarGuardianQuestionBank,
  pk: buildPkFragrantEarthQuestionBank,
};

export function resolveCountryQuestionBank(
  countryId: SpecialtyCountryId,
): readonly QuestionBlock[] {
  return COUNTRY_QUESTION_BANK_BUILDERS[countryId]();
}
