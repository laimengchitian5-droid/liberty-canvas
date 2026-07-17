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

/**
 * Cross-cultural production-philosophy prompts.
 * Trait weights only — country mapping is delegated to archetype distance scoring.
 */
export function buildWorldSpecialtyQuestionBank(): readonly QuestionBlock[] {
  return [
    mcq("q-ws-1", "新しい挑戦を始めるとき、あなたに近いのは？", [
      {
        id: "q-ws-1-a",
        label: "素材と環境を観察してから、最適な手順を組み立てる",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.3 },
      },
      {
        id: "q-ws-1-b",
        label: "まず動いて、広い選択肢を試しながら前進する",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.4 },
      },
      {
        id: "q-ws-1-c",
        label: "関係者と相談し、みんなが続けやすい形に整える",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-ws-1-d",
        label: "過去の成功法をベースに、小さく確実に始める",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-ws-2", "品質を高めるうえで、いちばん大切にしたいのは？", [
      {
        id: "q-ws-2-a",
        label: "時間をかけた熟成と安定した再現性",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
      {
        id: "q-ws-2-b",
        label: "土地や環境ごとの個性を引き出すこと",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "q-ws-2-c",
        label: "多くの人に届く規模と効率",
        traitWeights: { trait_extraversion: 0.5, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-ws-2-d",
        label: "受け取る人の気持ちに寄り添う体験",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
    ]),
    mcq("q-ws-3", "長期プロジェクトで、あなたの強みは？", [
      {
        id: "q-ws-3-a",
        label: "淡々と積み上げ、最後まで品質を守る",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
      {
        id: "q-ws-3-b",
        label: "変化を楽しみ、新しい手法を取り入れる",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "q-ws-3-c",
        label: "チームの空気を整え、協力を促す",
        traitWeights: { trait_agreeableness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "q-ws-3-d",
        label: "相手の感情の変化に気づき、調整する",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-ws-4", "自然のリズム（季節・気候）への向き合い方は？", [
      {
        id: "q-ws-4-a",
        label: "季節に合わせて計画を組み、無理をしない",
        traitWeights: { trait_conscientiousness: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-ws-4-b",
        label: "変化をチャンスと捉え、柔軟に切り替える",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-ws-4-c",
        label: "厳しい時期ほど、支え合いを大切にする",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.4 },
      },
      {
        id: "q-ws-4-d",
        label: "条件が整うまで待つ忍耐を重んじる",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-ws-5", "伝統と革新のバランスで、近いのは？", [
      {
        id: "q-ws-5-a",
        label: "伝統を守りつつ、現代に翻訳する",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.4 },
      },
      {
        id: "q-ws-5-b",
        label: "新しい組み合わせを積極的に試す",
        traitWeights: { trait_openness: 0.7, trait_extraversion: 0.3 },
      },
      {
        id: "q-ws-5-c",
        label: "現場の実用性を最優先にする",
        traitWeights: { trait_conscientiousness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-ws-5-d",
        label: "人の記憶に残る物語性を重視する",
        traitWeights: { trait_empathy: 0.5, trait_openness: 0.4 },
      },
    ]),
    mcq("q-ws-6", "チームで成果を出すとき、あなたの役割は？", [
      {
        id: "q-ws-6-a",
        label: "品質基準を整え、工程を安定させる",
        traitWeights: { trait_conscientiousness: 0.7, trait_agreeableness: 0.2 },
      },
      {
        id: "q-ws-6-b",
        label: "前に出て、方向性を示す",
        traitWeights: { trait_extraversion: 0.7, trait_openness: 0.2 },
      },
      {
        id: "q-ws-6-c",
        label: "対立を和らげ、合意を作る",
        traitWeights: { trait_agreeableness: 0.7, trait_empathy: 0.3 },
      },
      {
        id: "q-ws-6-d",
        label: "独自視点を加え、発想を広げる",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-ws-7", "失敗や遅れが起きたとき、最初にすることは？", [
      {
        id: "q-ws-7-a",
        label: "原因を分解し、再発防止の手順を作る",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-ws-7-b",
        label: "関係者の気持ちを確認し、安心できる場を作る",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "q-ws-7-c",
        label: "別ルートを素早く試し、前に進める",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.4 },
      },
      {
        id: "q-ws-7-d",
        label: "一度立ち止まり、長期影響を見極める",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
    ]),
    mcq("q-ws-8", "「豊かさ」と聞いて、思い浮かぶのは？", [
      {
        id: "q-ws-8-a",
        label: "長く続く信頼と安定した品質",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-ws-8-b",
        label: "多様な人・文化が混ざる活気",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.4 },
      },
      {
        id: "q-ws-8-c",
        label: "土地や素材の個性が輝く瞬間",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-ws-8-d",
        label: "誰かを喜ばせるもてなしの体験",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
    ]),
    mcq("q-ws-9", "作業環境の好みに近いのは？", [
      {
        id: "q-ws-9-a",
        label: "静かで、集中できる職人空間",
        traitWeights: { trait_conscientiousness: 0.5, trait_extraversion: -0.3 },
      },
      {
        id: "q-ws-9-b",
        label: "情報が交差する開放的な現場",
        traitWeights: { trait_extraversion: 0.6, trait_openness: 0.3 },
      },
      {
        id: "q-ws-9-c",
        label: "人との会話が自然に生まれる場",
        traitWeights: { trait_agreeableness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-ws-9-d",
        label: "記録と保管に適した落ち着いた空間",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-ws-10", "リスクに対するあなたの基本姿勢は？", [
      {
        id: "q-ws-10-a",
        label: "想定外を織り込み、備えを厚くする",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-ws-10-b",
        label: "試して学ぶことを優先する",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "q-ws-10-c",
        label: "周囲と共有し、分担して乗り越える",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-ws-10-d",
        label: "大きな変化は避け、確実な道を選ぶ",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.4 },
      },
    ]),
    mcq("q-ws-11", "学び方として、いちばんしっくりくるのは？", [
      {
        id: "q-ws-11-a",
        label: "師匠や先輩の手順を丁寧に継承する",
        traitWeights: { trait_conscientiousness: 0.6, trait_agreeableness: 0.3 },
      },
      {
        id: "q-ws-11-b",
        label: "現場で試行錯誤し、体感で覚える",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.4 },
      },
      {
        id: "q-ws-11-c",
        label: "背景の物語や文化を読み解きながら学ぶ",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.5 },
      },
      {
        id: "q-ws-11-d",
        label: "データと記録を比較して法則を掴む",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
    ]),
    mcq("q-ws-12", "成果を評価するとき、重視するのは？", [
      {
        id: "q-ws-12-a",
        label: "再現できる品質と安定性",
        traitWeights: { trait_conscientiousness: 0.7 },
      },
      {
        id: "q-ws-12-b",
        label: "独自性と記憶に残る体験",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "q-ws-12-c",
        label: "影響範囲と届いた人数",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-ws-12-d",
        label: "関係性が深まったかどうか",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
    ]),
    mcq("q-ws-13", "忙しい時期のあなたのペース配分は？", [
      {
        id: "q-ws-13-a",
        label: "工程表を守り、品質を落とさない",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
      {
        id: "q-ws-13-b",
        label: "優先順位を切り替え、機会を逃さない",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-ws-13-c",
        label: "周囲の負荷を見て、支援を先に回す",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "q-ws-13-d",
        label: "無理をせず、持続可能な速度を保つ",
        traitWeights: { trait_neuroticism: -0.4, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-ws-14", "「土地の個性」をどう捉えますか？", [
      {
        id: "q-ws-14-a",
        label: "守るべき資産として丁寧に記録する",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.3 },
      },
      {
        id: "q-ws-14-b",
        label: "表現の源泉として創作に活かす",
        traitWeights: { trait_openness: 0.7, trait_empathy: 0.3 },
      },
      {
        id: "q-ws-14-c",
        label: "共有することで価値が増すと考える",
        traitWeights: { trait_agreeableness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-ws-14-d",
        label: "環境変化に合わせて更新していく",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-ws-15", "コミュニティでのあなたの立ち位置は？", [
      {
        id: "q-ws-15-a",
        label: "節目の儀式やルールを支える存在",
        traitWeights: { trait_conscientiousness: 0.5, trait_agreeableness: 0.4 },
      },
      {
        id: "q-ws-15-b",
        label: "場を盛り上げ、つながりを広げる存在",
        traitWeights: { trait_extraversion: 0.7, trait_agreeableness: 0.3 },
      },
      {
        id: "q-ws-15-c",
        label: "相手の気持ちを受け止める相談役",
        traitWeights: { trait_empathy: 0.7, trait_agreeableness: 0.3 },
      },
      {
        id: "q-ws-15-d",
        label: "新しい視点を持ち込む提案者",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-ws-16", "資源や素材を選ぶ基準は？", [
      {
        id: "q-ws-16-a",
        label: "長期的に信頼できる供給と一貫性",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-ws-16-b",
        label: "個性が強く、物語性があるもの",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "q-ws-16-c",
        label: "多くの用途に展開できる汎用性",
        traitWeights: { trait_extraversion: 0.4, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-ws-16-d",
        label: "受け手の体験価値が高いもの",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.4 },
      },
    ]),
    mcq("q-ws-17", "プレッシャーの強い局面で、あなたは？", [
      {
        id: "q-ws-17-a",
        label: "手順を守り、品質を最後まで維持する",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
      {
        id: "q-ws-17-b",
        label: "前に出て、チームの士気を上げる",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.3 },
      },
      {
        id: "q-ws-17-c",
        label: "冷静に状況を読み、別案を提示する",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-ws-17-d",
        label: "周囲の不安を和らげ、支え合う",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
    ]),
    mcq("q-ws-18", "仕事のやりがいを感じる瞬間は？", [
      {
        id: "q-ws-18-a",
        label: "長期の努力が形になり、信頼されるとき",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-ws-18-b",
        label: "新しい領域を切り開いたとき",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.4 },
      },
      {
        id: "q-ws-18-c",
        label: "誰かの役に立てたと実感したとき",
        traitWeights: { trait_empathy: 0.7, trait_agreeableness: 0.3 },
      },
      {
        id: "q-ws-18-d",
        label: "美しい仕上がりに感動したとき",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.4 },
      },
    ]),
    mcq("q-ws-19", "変化の速い環境への適応方法は？", [
      {
        id: "q-ws-19-a",
        label: "基本原則を守りつつ、部分だけ更新する",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-ws-19-b",
        label: "積極的に新しい手法を取り入れる",
        traitWeights: { trait_openness: 0.7, trait_extraversion: 0.2 },
      },
      {
        id: "q-ws-19-c",
        label: "人との連携を強め、情報を共有する",
        traitWeights: { trait_agreeableness: 0.5, trait_extraversion: 0.4 },
      },
      {
        id: "q-ws-19-d",
        label: "負荷を調整し、燃え尽きない運用にする",
        traitWeights: { trait_neuroticism: -0.4, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-ws-20", "「職人らしさ」とは何だと思いますか？", [
      {
        id: "q-ws-20-a",
        label: "同じ品質を何度でも再現する規律",
        traitWeights: { trait_conscientiousness: 0.7 },
      },
      {
        id: "q-ws-20-b",
        label: "素材の声を聞き、個性を引き出す感性",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "q-ws-20-c",
        label: "人を巻き込み、文化を広げる力",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.3 },
      },
      {
        id: "q-ws-20-d",
        label: "長い時間を味方につける忍耐",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-ws-21", "記録やデータの扱いで近いのは？", [
      {
        id: "q-ws-21-a",
        label: "細かく残し、次回の品質向上に使う",
        traitWeights: { trait_conscientiousness: 0.7, trait_openness: 0.2 },
      },
      {
        id: "q-ws-21-b",
        label: "物語として残し、人に伝える",
        traitWeights: { trait_empathy: 0.5, trait_openness: 0.4 },
      },
      {
        id: "q-ws-21-c",
        label: "必要最小限にして、行動速度を優先する",
        traitWeights: { trait_extraversion: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-ws-21-d",
        label: "チームで共有し、合意形成に使う",
        traitWeights: { trait_agreeableness: 0.5, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-ws-22", "異文化の知識に触れたとき、あなたは？", [
      {
        id: "q-ws-22-a",
        label: "背景を調べ、文脈を理解してから使う",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-ws-22-b",
        label: "すぐに対話し、体感で学ぶ",
        traitWeights: { trait_extraversion: 0.6, trait_empathy: 0.3 },
      },
      {
        id: "q-ws-22-c",
        label: "敬意を持って取り入れ、混ぜ方を考える",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-ws-22-d",
        label: "自分の文化と比較し、新しい表現を試す",
        traitWeights: { trait_openness: 0.7, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-ws-23", "理想の成果の届け方は？", [
      {
        id: "q-ws-23-a",
        label: "丁寧な工程を経て、安定して届ける",
        traitWeights: { trait_conscientiousness: 0.7, trait_agreeableness: 0.2 },
      },
      {
        id: "q-ws-23-b",
        label: "大きな舞台で一気に広げる",
        traitWeights: { trait_extraversion: 0.7, trait_openness: 0.2 },
      },
      {
        id: "q-ws-23-c",
        label: "少人数に深く届け、関係を育てる",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.4 },
      },
      {
        id: "q-ws-23-d",
        label: "個性を際立たせ、記憶に残る形で届ける",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-ws-24", "10年後に残したいものは？", [
      {
        id: "q-ws-24-a",
        label: "信頼される品質と継承された技術",
        traitWeights: { trait_conscientiousness: 0.7, trait_neuroticism: -0.2 },
      },
      {
        id: "q-ws-24-b",
        label: "新しい市場や文化を開いた実績",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.5 },
      },
      {
        id: "q-ws-24-c",
        label: "人のつながりと支え合いの記憶",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.5 },
      },
      {
        id: "q-ws-24-d",
        label: "土地と素材の物語が息づく作品",
        traitWeights: { trait_openness: 0.6, trait_empathy: 0.4 },
      },
    ]),
  ];
}

export const WORLD_SPECIALTY_QUESTION_COUNT = 24 as const;
