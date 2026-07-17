import type { QuestionBlock, TraitWeightMap } from "@/types/diagnosisCompiler";

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

/** JP deep-dive (Phase C) — registered when releasePhase flips to live. */
export function buildJpSakamaiQuestionBank(): readonly QuestionBlock[] {
  return [
    mcq("q-jp-1", "仕込みの準備で、いちばん丁寧にするのは？", [
      {
        id: "q-jp-1-a",
        label: "米の洗浄と浸漬の時間を記録する",
        traitWeights: { trait_conscientiousness: 0.7, trait_openness: 0.2 },
      },
      {
        id: "q-jp-1-b",
        label: "水の温度と手感覚を確かめる",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-jp-1-c",
        label: "チームの役割分担を整える",
        traitWeights: { trait_agreeableness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-jp-1-d",
        label: "無理のない工程に組み直す",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-jp-2", "麹の状態を見るとき、重視するのは？", [
      {
        id: "q-jp-2-a",
        label: "匂い・手触り・色の微差",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-jp-2-b",
        label: "数値ログと過去データとの比較",
        traitWeights: { trait_conscientiousness: 0.7, trait_openness: 0.2 },
      },
      {
        id: "q-jp-2-c",
        label: "先輩の感覚を聞き、感覚を合わせる",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-jp-2-d",
        label: "直感で判断し、すぐ微調整する",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.3 },
      },
    ]),
    mcq("q-jp-3", "冬仕込みの長い工程で、あなたの強みは？", [
      {
        id: "q-jp-3-a",
        label: "同じ品質を最後まで守る粘り強さ",
        traitWeights: { trait_conscientiousness: 0.8, trait_neuroticism: -0.2 },
      },
      {
        id: "q-jp-3-b",
        label: "環境変化に合わせた柔軟な調整",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "q-jp-3-c",
        label: "仲間のモチベーションを支える",
        traitWeights: { trait_agreeableness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "q-jp-3-d",
        label: "静かに観察し、最適タイミングを見極める",
        traitWeights: { trait_empathy: 0.5, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-jp-4", "水質の違いに対して、あなたの姿勢は？", [
      {
        id: "q-jp-4-a",
        label: "軟水・硬水ごとに最適解を研究する",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.5 },
      },
      {
        id: "q-jp-4-b",
        label: "現場感覚で配合を微調整する",
        traitWeights: { trait_empathy: 0.5, trait_openness: 0.4 },
      },
      {
        id: "q-jp-4-c",
        label: "地域の特性を物語として伝える",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.3 },
      },
      {
        id: "q-jp-4-d",
        label: "標準手順を守り、再現性を優先する",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-jp-5", "発酵米の選定で近いのは？", [
      {
        id: "q-jp-5-a",
        label: "芯の大きさと品種特性を読み解く",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-jp-5-b",
        label: "生産者との対話から最適米を決める",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "q-jp-5-c",
        label: "安定供給とコスト効率を重視する",
        traitWeights: { trait_conscientiousness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-jp-5-d",
        label: "その年の気候に合わせて柔軟に変更する",
        traitWeights: { trait_openness: 0.5, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-jp-6", "共同体の儀式や節目の場で、あなたは？", [
      {
        id: "q-jp-6-a",
        label: "準備と段取りを整える係りを担う",
        traitWeights: { trait_conscientiousness: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "q-jp-6-b",
        label: "参加者の気持ちをほぐす",
        traitWeights: { trait_empathy: 0.7, trait_agreeableness: 0.3 },
      },
      {
        id: "q-jp-6-c",
        label: "場の雰囲気を明るくする",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.3 },
      },
      {
        id: "q-jp-6-d",
        label: "意味や由来を丁寧に説明する",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-jp-7", "失敗した仕込みから学ぶとき、まずするのは？", [
      {
        id: "q-jp-7-a",
        label: "工程ログを見直し、原因を特定する",
        traitWeights: { trait_conscientiousness: 0.7, trait_openness: 0.2 },
      },
      {
        id: "q-jp-7-b",
        label: "チームで振り返り、再発防止を話し合う",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-jp-7-c",
        label: "別アプローチを小規模で試す",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-jp-7-d",
        label: "一度休息を取り、判断を急がない",
        traitWeights: { trait_neuroticism: -0.4, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-jp-8", "技術継承で大切にしたいのは？", [
      {
        id: "q-jp-8-a",
        label: "手順の正確な再現",
        traitWeights: { trait_conscientiousness: 0.8 },
      },
      {
        id: "q-jp-8-b",
        label: "感覚の言語化と共有",
        traitWeights: { trait_empathy: 0.6, trait_openness: 0.4 },
      },
      {
        id: "q-jp-8-c",
        label: "後輩の挑戦を歓迎する文化",
        traitWeights: { trait_agreeableness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "q-jp-8-d",
        label: "時代に合わせた改良の余地",
        traitWeights: { trait_openness: 0.7, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-jp-9", "仕事のペース配分で近いのは？", [
      {
        id: "q-jp-9-a",
        label: "朝昼夜のリズムを一定に保つ",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
      {
        id: "q-jp-9-b",
        label: "素材の反応を見て、その日の最適解を選ぶ",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "q-jp-9-c",
        label: "チームの状態に合わせて調整する",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-jp-9-d",
        label: "重要局面に集中し、他は最小限にする",
        traitWeights: { trait_conscientiousness: 0.5, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-jp-10", "あなたが誇りに思う瞬間は？", [
      {
        id: "q-jp-10-a",
        label: "仕上がりの透明感が理想通りだったとき",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.4 },
      },
      {
        id: "q-jp-10-b",
        label: "体験してくれた方全体が喜んでくれたとき",
        traitWeights: { trait_empathy: 0.7, trait_agreeableness: 0.3 },
      },
      {
        id: "q-jp-10-c",
        label: "新しい表現を安全に試せたとき",
        traitWeights: { trait_openness: 0.7, trait_extraversion: 0.2 },
      },
      {
        id: "q-jp-10-d",
        label: "長期プロジェクトを完遂したとき",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-jp-11", "道具や設備の扱いで、あなたに近いのは？", [
      {
        id: "q-jp-11-a",
        label: "毎回の手入れを欠かさない",
        traitWeights: { trait_conscientiousness: 0.8, trait_neuroticism: -0.1 },
      },
      {
        id: "q-jp-11-b",
        label: "使い心地を感じ取り、微調整する",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-jp-11-c",
        label: "共有ルールを整え、全員で守る",
        traitWeights: { trait_agreeableness: 0.6, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-jp-11-d",
        label: "新しい道具の導入を積極的に試す",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.3 },
      },
    ]),
    mcq("q-jp-12", "10年後に残したいものは？", [
      {
        id: "q-jp-12-a",
        label: "再現できる技術と記録",
        traitWeights: { trait_conscientiousness: 0.8 },
      },
      {
        id: "q-jp-12-b",
        label: "地域と共同体の物語",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "q-jp-12-c",
        label: "次世代へ渡る挑戦の文化",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "q-jp-12-d",
        label: "静かな信頼と継続する品質",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.3 },
      },
    ]),
  ];
}

/** FR deep-dive — terroir & land craft metaphors. */
export function buildFrTerroirQuestionBank(): readonly QuestionBlock[] {
  return [
    mcq("q-fr-1", "土地の個性を伝えるとき、あなたが重視するのは？", [
      {
        id: "q-fr-1-a",
        label: "再現できない微差を言葉にすること",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "q-fr-1-b",
        label: "系譜と基準を正確に記録すること",
        traitWeights: { trait_conscientiousness: 0.7, trait_openness: 0.2 },
      },
      {
        id: "q-fr-1-c",
        label: "体験全体を美しく整えること",
        traitWeights: { trait_openness: 0.5, trait_agreeableness: 0.4 },
      },
      {
        id: "q-fr-1-d",
        label: "無理のない範囲で守ること",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-fr-2", "品質の境界を守るうえで、あなたに近いのは？", [
      {
        id: "q-fr-2-a",
        label: "ルールを明確にし、例外を最小化する",
        traitWeights: { trait_conscientiousness: 0.8 },
      },
      {
        id: "q-fr-2-b",
        label: "現場感覚で微調整する",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-fr-2-c",
        label: "関係者と合意形成する",
        traitWeights: { trait_agreeableness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "q-fr-2-d",
        label: "長期的な保護を優先する",
        traitWeights: { trait_conscientiousness: 0.6, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-fr-3", "地形や気候の違いに対して、あなたの姿勢は？", [
      {
        id: "q-fr-3-a",
        label: "個性として歓迎し、表現に活かす",
        traitWeights: { trait_openness: 0.7, trait_empathy: 0.3 },
      },
      {
        id: "q-fr-3-b",
        label: "データで比較し、最適化する",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.3 },
      },
      {
        id: "q-fr-3-c",
        label: "伝統的な解釈を尊重する",
        traitWeights: { trait_conscientiousness: 0.5, trait_agreeableness: 0.4 },
      },
      {
        id: "q-fr-3-d",
        label: "変化を小さく試す",
        traitWeights: { trait_openness: 0.5, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-fr-4", "長期熟成のプロジェクトで、あなたの強みは？", [
      {
        id: "q-fr-4-a",
        label: "記録と再現性を守る",
        traitWeights: { trait_conscientiousness: 0.8, trait_neuroticism: -0.1 },
      },
      {
        id: "q-fr-4-b",
        label: "物語性を高める",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.4 },
      },
      {
        id: "q-fr-4-c",
        label: "チームの温度を保つ",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "q-fr-4-d",
        label: "環境変化に合わせて調律する",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-fr-5", "美しさを評価する基準で、いちばん近いのは？", [
      {
        id: "q-fr-5-a",
        label: "繊細なバランスと余韻",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.4 },
      },
      {
        id: "q-fr-5-b",
        label: "一貫した品質基準",
        traitWeights: { trait_conscientiousness: 0.7 },
      },
      {
        id: "q-fr-5-c",
        label: "土地らしさの強さ",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-fr-5-d",
        label: "受け手の感動",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
    ]),
    mcq("q-fr-6", "新しい技法を取り入れるとき、あなたは？", [
      {
        id: "q-fr-6-a",
        label: "伝統との整合を先に確認する",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.3 },
      },
      {
        id: "q-fr-6-b",
        label: "小さく試して感覚を確かめる",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-fr-6-c",
        label: "関係者の理解を得てから導入する",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "q-fr-6-d",
        label: "様子を見て慎重に判断する",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-fr-7", "現場での役割として、しっくりくるのは？", [
      {
        id: "q-fr-7-a",
        label: "品質基準を言語化する人",
        traitWeights: { trait_conscientiousness: 0.7, trait_openness: 0.3 },
      },
      {
        id: "q-fr-7-b",
        label: "体験を詩的に伝える人",
        traitWeights: { trait_openness: 0.7, trait_empathy: 0.4 },
      },
      {
        id: "q-fr-7-c",
        label: "環境と素材を調律する人",
        traitWeights: { trait_empathy: 0.5, trait_openness: 0.4 },
      },
      {
        id: "q-fr-7-d",
        label: "記録と継承を担う人",
        traitWeights: { trait_conscientiousness: 0.8, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-fr-8", "失敗から学ぶとき、最初にすることは？", [
      {
        id: "q-fr-8-a",
        label: "条件ログを見直す",
        traitWeights: { trait_conscientiousness: 0.7 },
      },
      {
        id: "q-fr-8-b",
        label: "感覚のズレを言語化する",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-fr-8-c",
        label: "チームで原因を共有する",
        traitWeights: { trait_agreeableness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-fr-8-d",
        label: "一度距離を取って判断する",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-fr-9", "仕事のペースで近いのは？", [
      {
        id: "q-fr-9-a",
        label: "丁寧に、急がず仕上げる",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
      {
        id: "q-fr-9-b",
        label: "インスピレーションの波に乗る",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "q-fr-9-c",
        label: "相手の反応を見ながら調整する",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.3 },
      },
      {
        id: "q-fr-9-d",
        label: "計画を守りつつ微修正する",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.3 },
      },
    ]),
    mcq("q-fr-10", "誇りに思う瞬間は？", [
      {
        id: "q-fr-10-a",
        label: "土地の個性が際立ったとき",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-fr-10-b",
        label: "基準を守り抜けたとき",
        traitWeights: { trait_conscientiousness: 0.8 },
      },
      {
        id: "q-fr-10-c",
        label: "誰かの記憶に残ったとき",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "q-fr-10-d",
        label: "新しい表現に成功したとき",
        traitWeights: { trait_openness: 0.7, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-fr-11", "道具や記録の扱いで、あなたに近いのは？", [
      {
        id: "q-fr-11-a",
        label: "系譜付きで整理する",
        traitWeights: { trait_conscientiousness: 0.8 },
      },
      {
        id: "q-fr-11-b",
        label: "感覚メモを残す",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-fr-11-c",
        label: "共有ルールを整える",
        traitWeights: { trait_agreeableness: 0.5, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-fr-11-d",
        label: "必要最小限に保つ",
        traitWeights: { trait_neuroticism: -0.2, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-fr-12", "10年後に残したいものは？", [
      {
        id: "q-fr-12-a",
        label: "守られた土地の物語",
        traitWeights: { trait_conscientiousness: 0.6, trait_empathy: 0.4 },
      },
      {
        id: "q-fr-12-b",
        label: "美しい体験の記憶",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.5 },
      },
      {
        id: "q-fr-12-c",
        label: "明確な品質基準",
        traitWeights: { trait_conscientiousness: 0.8 },
      },
      {
        id: "q-fr-12-d",
        label: "次世代への技法継承",
        traitWeights: { trait_conscientiousness: 0.5, trait_agreeableness: 0.4 },
      },
    ]),
  ];
}

/** UK deep-dive — maturation & tradition craft metaphors. */
export function buildUkMaturationQuestionBank(): readonly QuestionBlock[] {
  return [
    mcq("q-uk-1", "長期熟成の仕事で、いちばん得意なのは？", [
      {
        id: "q-uk-1-a",
        label: "環境条件を安定させる",
        traitWeights: { trait_conscientiousness: 0.8, trait_neuroticism: -0.2 },
      },
      {
        id: "q-uk-1-b",
        label: "変化の兆候を早く読む",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-uk-1-c",
        label: "チームの士気を保つ",
        traitWeights: { trait_agreeableness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-uk-1-d",
        label: "無理のない運用に整える",
        traitWeights: { trait_neuroticism: -0.4, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-uk-2", "伝統技法への向き合い方は？", [
      {
        id: "q-uk-2-a",
        label: "原則を守り、例外を記録する",
        traitWeights: { trait_conscientiousness: 0.8 },
      },
      {
        id: "q-uk-2-b",
        label: "現代向けに鍛え直す",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-uk-2-c",
        label: "師匠の手順を継承する",
        traitWeights: { trait_conscientiousness: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "q-uk-2-d",
        label: "必要な部分だけ更新する",
        traitWeights: { trait_openness: 0.4, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-uk-3", "プレッシャー下でのあなたの反応は？", [
      {
        id: "q-uk-3-a",
        label: "手順を守って品質を維持する",
        traitWeights: { trait_conscientiousness: 0.8, trait_neuroticism: -0.1 },
      },
      {
        id: "q-uk-3-b",
        label: "冷静に優先順位を切る",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.3 },
      },
      {
        id: "q-uk-3-c",
        label: "周囲を支えて安定させる",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "q-uk-3-d",
        label: "一度立ち止まって再判断する",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-uk-4", "素材工程で重視するのは？", [
      {
        id: "q-uk-4-a",
        label: "再現できる温度管理",
        traitWeights: { trait_conscientiousness: 0.8 },
      },
      {
        id: "q-uk-4-b",
        label: "素材の反応を感じ取る",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-uk-4-c",
        label: "記録と比較",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.3 },
      },
      {
        id: "q-uk-4-d",
        label: "チームでの確認作業",
        traitWeights: { trait_agreeableness: 0.5, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-uk-5", "長期保管の管理で近いのは？", [
      {
        id: "q-uk-5-a",
        label: "定期チェックを欠かさない",
        traitWeights: { trait_conscientiousness: 0.85 },
      },
      {
        id: "q-uk-5-b",
        label: "香りの変化を言語化する",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-uk-5-c",
        label: "長期計画に組み込む",
        traitWeights: { trait_conscientiousness: 0.7, trait_openness: 0.2 },
      },
      {
        id: "q-uk-5-d",
        label: "無理のない保管環境を優先する",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.5 },
      },
    ]),
    mcq("q-uk-6", "高地の厳しい環境で力を発揮するのは？", [
      {
        id: "q-uk-6-a",
        label: "忍耐と規律",
        traitWeights: { trait_conscientiousness: 0.8, trait_neuroticism: -0.2 },
      },
      {
        id: "q-uk-6-b",
        label: "柔軟な適応",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-uk-6-c",
        label: "仲間との連携",
        traitWeights: { trait_agreeableness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "q-uk-6-d",
        label: "冷静な判断",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-uk-7", "品質基準を守るために、あなたは？", [
      {
        id: "q-uk-7-a",
        label: "チェックリストを徹底する",
        traitWeights: { trait_conscientiousness: 0.85 },
      },
      {
        id: "q-uk-7-b",
        label: "例外を記録して学ぶ",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.4 },
      },
      {
        id: "q-uk-7-c",
        label: "先輩の基準を尊重する",
        traitWeights: { trait_agreeableness: 0.5, trait_conscientiousness: 0.5 },
      },
      {
        id: "q-uk-7-d",
        label: "現場感覚で微調整する",
        traitWeights: { trait_openness: 0.4, trait_empathy: 0.4 },
      },
    ]),
    mcq("q-uk-8", "学び方として近いのは？", [
      {
        id: "q-uk-8-a",
        label: "長期の付き添いで身につける",
        traitWeights: { trait_conscientiousness: 0.7, trait_empathy: 0.3 },
      },
      {
        id: "q-uk-8-b",
        label: "記録を比較して法則を掴む",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.3 },
      },
      {
        id: "q-uk-8-c",
        label: "試行錯誤で体感する",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-uk-8-d",
        label: "伝統手順を反復する",
        traitWeights: { trait_conscientiousness: 0.8, trait_extraversion: 0.1 },
      },
    ]),
    mcq("q-uk-9", "仕事のやりがいを感じるのは？", [
      {
        id: "q-uk-9-a",
        label: "長期熟成が実を結んだとき",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
      {
        id: "q-uk-9-b",
        label: "伝統を現代に活かせたとき",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-uk-9-c",
        label: "信頼を積み上げられたとき",
        traitWeights: { trait_agreeableness: 0.5, trait_conscientiousness: 0.5 },
      },
      {
        id: "q-uk-9-d",
        label: "困難を乗り越えたとき",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.5 },
      },
    ]),
    mcq("q-uk-10", "チームでの立ち位置は？", [
      {
        id: "q-uk-10-a",
        label: "品質の最終責任者",
        traitWeights: { trait_conscientiousness: 0.8, trait_extraversion: 0.2 },
      },
      {
        id: "q-uk-10-b",
        label: "静かな技術継承者",
        traitWeights: { trait_conscientiousness: 0.7, trait_extraversion: 0.15 },
      },
      {
        id: "q-uk-10-c",
        label: "改善提案者",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "q-uk-10-d",
        label: "現場の調整役",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.5 },
      },
    ]),
    mcq("q-uk-11", "短期成果と長期品質が衝突したら？", [
      {
        id: "q-uk-11-a",
        label: "長期品質を選ぶ",
        traitWeights: { trait_conscientiousness: 0.8, trait_neuroticism: -0.1 },
      },
      {
        id: "q-uk-11-b",
        label: "段階的に両立させる",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.4 },
      },
      {
        id: "q-uk-11-c",
        label: "関係者と合意して決める",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "q-uk-11-d",
        label: "リスクを最小化する案を選ぶ",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.5 },
      },
    ]),
    mcq("q-uk-12", "10年後に残したいものは？", [
      {
        id: "q-uk-12-a",
        label: "再現できる熟成技術",
        traitWeights: { trait_conscientiousness: 0.85 },
      },
      {
        id: "q-uk-12-b",
        label: "守り抜いた伝統",
        traitWeights: { trait_conscientiousness: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "q-uk-12-c",
        label: "革新と継承の両立",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.5 },
      },
      {
        id: "q-uk-12-d",
        label: "静かな信頼の蓄積",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
    ]),
  ];
}
