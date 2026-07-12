import type { QuestionBlock, TraitWeightMap } from "@/types/diagnosisCompiler";

const t = (weights: TraitWeightMap): TraitWeightMap => weights;

interface McqOptionInput {
  id: string;
  label: string;
  traitWeights: TraitWeightMap;
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

export function buildAcademicSpectrumQuestionBank(): QuestionBlock[] {
  return [
    mcq("q-acad-1", "新しい学問分野の本を手に取ったとき、あなたの反応に近いのは？", [
      {
        id: "q-acad-1-a",
        label: "目次を眺めて、全体の構造を先に把握したい",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-acad-1-b",
        label: "気になる章から読み始めて、直感で進めたい",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
      {
        id: "q-acad-1-c",
        label: "難しそうでも、じっくり理解する価値がありそうだと感じる",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-acad-1-d",
        label: "まずは概要を調べて、自分に合うか確かめたい",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-acad-2", "レポートや論文のテーマ選びで、いちばん惹かれるのは？", [
      {
        id: "q-acad-2-a",
        label: "まだ十分に研究されていない、新しい切り口",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-acad-2-b",
        label: "データや文献が揃っていて、着実に進められるテーマ",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.2 },
      },
      {
        id: "q-acad-2-c",
        label: "社会や人の暮らしに寄り添う、実感のあるテーマ",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-acad-2-d",
        label: "興味はあるが、負担にならない範囲で選びたい",
        traitWeights: { trait_neuroticism: -0.4, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-acad-3", "授業で異なる意見が出たとき、あなたの関わり方は？", [
      {
        id: "q-acad-3-a",
        label: "複数の視点を比較して、自分なりの見解をまとめる",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-acad-3-b",
        label: "積極的に発言して、議論を深めたい",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-acad-3-c",
        label: "相手の考えを尊重しながら、穏やかに意見を交わす",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-acad-3-d",
        label: "まずは聞き役に徹して、全体像を把握する",
        traitWeights: { trait_empathy: 0.4, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-acad-4", "学習計画を立てるとき、あなたに近いスタイルは？", [
      {
        id: "q-acad-4-a",
        label: "週ごとの目標とチェックリストを細かく作る",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-acad-4-b",
        label: "大きな目標だけ決めて、日々柔軟に調整する",
        traitWeights: { trait_openness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-acad-4-c",
        label: "仲間と共有して、互いに励まし合いながら進める",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-acad-4-d",
        label: "興味の湧いた分野から優先して、無理なく続ける",
        traitWeights: { trait_openness: 0.4, trait_empathy: 0.2 },
      },
    ]),
    mcq("q-acad-5", "図書館や自習スペースでの過ごし方、いちばんしっくりくるのは？", [
      {
        id: "q-acad-5-a",
        label: "静かな個室で、集中して深く取り組む",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
      {
        id: "q-acad-5-b",
        label: "開放的な空間で、周りの気配を感じながら学ぶ",
        traitWeights: { trait_extraversion: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-acad-5-c",
        label: "仲間と並んで座り、たまに声をかけ合う",
        traitWeights: { trait_extraversion: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-acad-5-d",
        label: "環境より内容を優先し、場所は気にしない",
        traitWeights: { trait_openness: 0.4, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-acad-6", "試験前の不安が強くなったとき、あなたは？", [
      {
        id: "q-acad-6-a",
        label: "復習計画を見直して、手応えを積み重ねる",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
      {
        id: "q-acad-6-b",
        label: "信頼できる人に話して、気持ちを整理する",
        traitWeights: { trait_extraversion: 0.3, trait_empathy: 0.4 },
      },
      {
        id: "q-acad-6-c",
        label: "不安を感じつつも、できる範囲で準備を続ける",
        traitWeights: { trait_neuroticism: 0.4, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-acad-6-d",
        label: "深呼吸して、今できることだけに集中する",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
    ]),
    mcq("q-acad-7", "グループ研究で、自然と担いやすい役割は？", [
      {
        id: "q-acad-7-a",
        label: "資料収集や進捗管理を任されるリーダー的役割",
        traitWeights: { trait_conscientiousness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-acad-7-b",
        label: "アイデア出しや視点の提案をするクリエイティブ役",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-acad-7-c",
        label: "メンバーの意見をまとめ、調整する調整役",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-acad-7-d",
        label: "発表資料の仕上げや推敲を担当する編集役",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.3 },
      },
    ]),
    mcq("q-acad-8", "未知の概念に出会ったとき、理解の進め方は？", [
      {
        id: "q-acad-8-a",
        label: "関連分野まで広げて、背景から理解する",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-acad-8-b",
        label: "具体例や比喩を探して、イメージしやすくする",
        traitWeights: { trait_openness: 0.4, trait_empathy: 0.3 },
      },
      {
        id: "q-acad-8-c",
        label: "誰かに説明してもらい、対話で確認する",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-acad-8-d",
        label: "一度立ち止まり、わからない点をメモして整理する",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: 0.2 },
      },
    ]),
    mcq("q-acad-9", "学術的な議論を読んだとき、心が動くのは？", [
      {
        id: "q-acad-9-a",
        label: "常識を覆すような、大胆な仮説や視点",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-acad-9-b",
        label: "丁寧な検証と根拠が積み重ねられた論考",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.2 },
      },
      {
        id: "q-acad-9-c",
        label: "人々の暮らしや感情に寄り添う記述",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-acad-9-d",
        label: "読みやすく整理されていて、理解しやすい構成",
        traitWeights: { trait_conscientiousness: 0.3, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-acad-10", "プレゼンテーションの準備で、いちばん丁寧にやるのは？", [
      {
        id: "q-acad-10-a",
        label: "スライドの流れと話す順番を何度も確認する",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-acad-10-b",
        label: "聴衆の反応を想像しながら、伝え方を工夫する",
        traitWeights: { trait_empathy: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-acad-10-c",
        label: "視覚的な工夫や例えを加えて、印象に残るようにする",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
      {
        id: "q-acad-10-d",
        label: "本番さえ乗り切れればよいと、大枠だけ固める",
        traitWeights: { trait_neuroticism: -0.3, trait_openness: 0.3 },
      },
    ]),
    mcq("q-acad-11", "開放性（新しい経験への関心）について、自分に近いのは？", [
      {
        id: "q-acad-11-a",
        label: "未知の分野に触れると、自然と好奇心が湧く",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-acad-11-b",
        label: "興味はあるが、深く掘り下げる前に様子を見る",
        traitWeights: { trait_openness: 0.3, trait_neuroticism: -0.2 },
      },
      {
        id: "q-acad-11-c",
        label: "定番の方法を大切にしつつ、必要なときだけ試す",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-acad-11-d",
        label: "人の話や体験を通じて、間接的に広げていく",
        traitWeights: { trait_empathy: 0.4, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-acad-12", "誠実性（計画性・責任感）について、あなたの傾向は？", [
      {
        id: "q-acad-12-a",
        label: "約束や期限を守ることを、とても大切にしている",
        traitWeights: { trait_conscientiousness: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-acad-12-b",
        label: "目標はあるが、状況に合わせて柔軟に変える",
        traitWeights: { trait_openness: 0.4, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-acad-12-c",
        label: "締切が近づくと、集中力が一気に高まる",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-acad-12-d",
        label: "完璧より、無理なく続けられることを優先する",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
    ]),
    mcq("q-acad-13", "外向性（活動性・社交性）について、学習場面では？", [
      {
        id: "q-acad-13-a",
        label: "ディスカッションや発表で、エネルギーが湧いてくる",
        traitWeights: { trait_extraversion: 0.6, trait_openness: 0.2 },
      },
      {
        id: "q-acad-13-b",
        label: "少人数での対話が、いちばん理解を深めてくれる",
        traitWeights: { trait_extraversion: 0.3, trait_empathy: 0.4 },
      },
      {
        id: "q-acad-13-c",
        label: "一人で黙々と取り組む時間が、必要不可欠",
        traitWeights: { trait_conscientiousness: 0.3, trait_neuroticism: -0.3 },
      },
      {
        id: "q-acad-13-d",
        label: "場の雰囲気次第で、積極的にも控えめにもなる",
        traitWeights: { trait_agreeableness: 0.4, trait_openness: 0.2 },
      },
    ]),
    mcq("q-acad-14", "協調性（思いやり・協力）について、グループ学習では？", [
      {
        id: "q-acad-14-a",
        label: "メンバーの負担を減らすよう、自然と気を配る",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-acad-14-b",
        label: "自分の意見も大切にしつつ、歩み寄りを探す",
        traitWeights: { trait_agreeableness: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-acad-14-c",
        label: "役割分担を明確にして、公平に進めたい",
        traitWeights: { trait_conscientiousness: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-acad-14-d",
        label: "対立は避け、穏やかな空気を保ちたい",
        traitWeights: { trait_agreeableness: 0.5, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-acad-15", "神経症傾向（感情の揺れやすさ）について、学業では？", [
      {
        id: "q-acad-15-a",
        label: "成績や評価が気になり、つい考え込んでしまう",
        traitWeights: { trait_neuroticism: 0.6, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-acad-15-b",
        label: "プレッシャーはあるが、信頼できる人に頼れる",
        traitWeights: { trait_neuroticism: 0.3, trait_empathy: 0.3 },
      },
      {
        id: "q-acad-15-c",
        label: "失敗しても、切り替えて次に活かせる",
        traitWeights: { trait_neuroticism: -0.5, trait_openness: 0.2 },
      },
      {
        id: "q-acad-15-d",
        label: "計画を立てることで、不安を和らげている",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-acad-16", "共感力について、学習や研究の場では？", [
      {
        id: "q-acad-16-a",
        label: "相手の理解度を感じ取り、説明の仕方を変える",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-acad-16-b",
        label: "研究対象の人々の立場を、常に想像している",
        traitWeights: { trait_empathy: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-acad-16-c",
        label: "論理やデータを優先し、感情は後から考える",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-acad-16-d",
        label: "仲間の悩みに寄り添い、支えになる存在でいたい",
        traitWeights: { trait_empathy: 0.4, trait_agreeableness: 0.4 },
      },
    ]),
    mcq("q-acad-17", "フィードバックをもらったとき、あなたの受け止め方は？", [
      {
        id: "q-acad-17-a",
        label: "具体的な改善点をメモして、次に活かす",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-acad-17-b",
        label: "まず感謝を伝え、前向きに受け止める",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-acad-17-c",
        label: "ショックもあるが、時間をおいて冷静に検討する",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-acad-17-d",
        label: "厳しい指摘ほど、成長のチャンスだと捉える",
        traitWeights: { trait_neuroticism: -0.3, trait_openness: 0.4 },
      },
    ]),
    mcq("q-acad-18", "学問的な好奇心を満たすとき、いちばん充実するのは？", [
      {
        id: "q-acad-18-a",
        label: "専門書や論文を読み、知識の幅を広げる",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-acad-18-b",
        label: "セミナーや勉強会で、専門家と対話する",
        traitWeights: { trait_extraversion: 0.4, trait_openness: 0.4 },
      },
      {
        id: "q-acad-18-c",
        label: "日常の疑問を、自分なりに調べて解決する",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-acad-18-d",
        label: "誰かに教えることで、理解が深まると感じる",
        traitWeights: { trait_empathy: 0.4, trait_extraversion: 0.3 },
      },
    ]),
    mcq("q-acad-19", "締切直前の夜、あなたの過ごし方に近いのは？", [
      {
        id: "q-acad-19-a",
        label: "最終チェックを丁寧に行い、提出まで集中する",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-acad-19-b",
        label: "焦りはあるが、できるところまで仕上げる",
        traitWeights: { trait_neuroticism: 0.4, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-acad-19-c",
        label: "一度休憩を挟み、気持ちを整えてから再開する",
        traitWeights: { trait_neuroticism: -0.3, trait_agreeableness: 0.2 },
      },
      {
        id: "q-acad-19-d",
        label: "仲間と励まし合いながら、最後の仕上げをする",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-acad-20", "学術的な失敗やミスをしたとき、あなたは？", [
      {
        id: "q-acad-20-a",
        label: "原因を分析し、再発防止の手順を考える",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
      {
        id: "q-acad-20-b",
        label: "落ち込むが、信頼できる人に相談して立ち直る",
        traitWeights: { trait_neuroticism: 0.4, trait_empathy: 0.3 },
      },
      {
        id: "q-acad-20-c",
        label: "失敗から学べることがあると、前向きに捉える",
        traitWeights: { trait_openness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-acad-20-d",
        label: "謝罪や説明を丁寧に行い、関係を大切にする",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-acad-21", "長期の研究や学習プロジェクトで、モチベーションを保つには？", [
      {
        id: "q-acad-21-a",
        label: "小さなマイルストーンを設定し、達成感を積む",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
      {
        id: "q-acad-21-b",
        label: "仲間と進捗を共有し、励まし合う",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-acad-21-c",
        label: "新しい視点や手法を試し、飽きないようにする",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
      {
        id: "q-acad-21-d",
        label: "目的や意義を思い出し、意味を再確認する",
        traitWeights: { trait_empathy: 0.4, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-acad-22", "学術的な討論で意見が対立したとき、あなたは？", [
      {
        id: "q-acad-22-a",
        label: "根拠を示しながら、自分の立場を明確に伝える",
        traitWeights: { trait_extraversion: 0.4, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-acad-22-b",
        label: "相手の論点を理解してから、反論や補足をする",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-acad-22-c",
        label: "対立を建設的な議論に変えようと努める",
        traitWeights: { trait_openness: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-acad-22-d",
        label: "争いを避け、落ち着くまで様子を見る",
        traitWeights: { trait_neuroticism: -0.3, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-acad-23", "学びの成果を振り返るとき、いちばん誇りに思うのは？", [
      {
        id: "q-acad-23-a",
        label: "難しい課題を最後までやり遂げたこと",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-acad-23-b",
        label: "新しい視点や発見を得られたこと",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-acad-23-c",
        label: "仲間と協力して、良い成果を出せたこと",
        traitWeights: { trait_agreeableness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-acad-23-d",
        label: "誰かの理解や成長に役立てられたこと",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
    ]),
    mcq("q-acad-24", "学術的な探究を通じて、いちばん大切にしたいのは？", [
      {
        id: "q-acad-24-a",
        label: "真理や知識への誠実な向き合い方",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-acad-24-b",
        label: "未知への好奇心と、挑戦する勇気",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-acad-24-c",
        label: "他者との協力と、知識の共有",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-acad-24-d",
        label: "失敗を恐れず、成長し続ける姿勢",
        traitWeights: { trait_neuroticism: -0.4, trait_openness: 0.3 },
      },
    ]),
  ];
}

export function buildMotivationSpectrumQuestionBank(): QuestionBlock[] {
  return [
    mcq("q-motif-1", "朝起きたとき、一日を前向きに始めるきっかけに近いのは？", [
      {
        id: "q-motif-1-a",
        label: "今日やりたいことや小さな目標を思い浮かべる",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-motif-1-b",
        label: "誰かに会える・話せる予定があると、自然と気分が上がる",
        traitWeights: { trait_extraversion: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-motif-1-c",
        label: "ゆっくり身支度をして、心に余裕を持たせる",
        traitWeights: { trait_neuroticism: -0.4, trait_empathy: 0.2 },
      },
      {
        id: "q-motif-1-d",
        label: "新しい発見や体験が待っていると、ワクワクする",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-motif-2", "仕事や勉強で、いちばんやる気が出るのは？", [
      {
        id: "q-motif-2-a",
        label: "目的や意味がはっきりしているとき",
        traitWeights: { trait_conscientiousness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-motif-2-b",
        label: "誰かの役に立てそうだと感じたとき",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-motif-2-c",
        label: "新しい挑戦や変化があるとき",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-motif-2-d",
        label: "仲間と一緒に取り組めるとき",
        traitWeights: { trait_extraversion: 0.5, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-motif-3", "目標達成への道のりで、あなたが大切にするのは？", [
      {
        id: "q-motif-3-a",
        label: "計画を立て、一歩ずつ確実に進めること",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-motif-3-b",
        label: "過程そのものを楽しみ、柔軟に調整すること",
        traitWeights: { trait_openness: 0.5, trait_neuroticism: -0.3 },
      },
      {
        id: "q-motif-3-c",
        label: "周りの支えを受けながら、無理なく続けること",
        traitWeights: { trait_agreeableness: 0.4, trait_empathy: 0.3 },
      },
      {
        id: "q-motif-3-d",
        label: "困難があっても、最後まで諦めないこと",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-motif-4", "ご褒美や休息の取り方で、いちばんしっくりくるのは？", [
      {
        id: "q-motif-4-a",
        label: "目標達成後に、ちゃんと自分を労わる",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-motif-4-b",
        label: "好きなことに没頭して、気分転換する",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
      {
        id: "q-motif-4-c",
        label: "大切な人と過ごして、心を満たす",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-motif-4-d",
        label: "その日の気分で、無理なく選ぶ",
        traitWeights: { trait_neuroticism: -0.4, trait_openness: 0.2 },
      },
    ]),
    mcq("q-motif-5", "モチベーションが下がったとき、最初にすることは？", [
      {
        id: "q-motif-5-a",
        label: "原因を考え、小さな一歩から再開する",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
      {
        id: "q-motif-5-b",
        label: "信頼できる人に話して、気持ちを整理する",
        traitWeights: { trait_extraversion: 0.4, trait_empathy: 0.4 },
      },
      {
        id: "q-motif-5-c",
        label: "一旦休息を取り、エネルギーを回復する",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
      {
        id: "q-motif-5-d",
        label: "落ち込むが、時間をおいて自然に戻るのを待つ",
        traitWeights: { trait_neuroticism: 0.4, trait_empathy: 0.2 },
      },
    ]),
    mcq("q-motif-6", "内発的動機（自分自身のためのやる気）について、近いのは？", [
      {
        id: "q-motif-6-a",
        label: "好奇心や興味が、いちばんの原動力",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-motif-6-b",
        label: "成長や上達の実感が、続ける力になる",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.2 },
      },
      {
        id: "q-motif-6-c",
        label: "自分らしさを表現できることが、やる気につながる",
        traitWeights: { trait_openness: 0.4, trait_empathy: 0.3 },
      },
      {
        id: "q-motif-6-d",
        label: "心の平安や充実感を、大切にしている",
        traitWeights: { trait_neuroticism: -0.4, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-motif-7", "外発的動機（評価や報酬へのやる気）について、近いのは？", [
      {
        id: "q-motif-7-a",
        label: "認められることや成果が、励みになる",
        traitWeights: { trait_conscientiousness: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-motif-7-b",
        label: "周囲の期待に応えたい気持ちが、背中を押す",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-motif-7-c",
        label: "評価より、自分の納得感を優先したい",
        traitWeights: { trait_openness: 0.4, trait_neuroticism: -0.2 },
      },
      {
        id: "q-motif-7-d",
        label: "プレッシャーはあるが、乗り越えたいと思う",
        traitWeights: { trait_neuroticism: 0.4, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-motif-8", "長期的な目標に向かうとき、あなたのスタイルは？", [
      {
        id: "q-motif-8-a",
        label: "ロードマップを描き、定期的に見直す",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.2 },
      },
      {
        id: "q-motif-8-b",
        label: "大きなビジョンを持ちつつ、日々柔軟に動く",
        traitWeights: { trait_openness: 0.5, trait_neuroticism: -0.2 },
      },
      {
        id: "q-motif-8-c",
        label: "仲間やメンターと共有し、支え合いながら進む",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-motif-8-d",
        label: "焦らず、今できることに集中する",
        traitWeights: { trait_neuroticism: -0.4, trait_empathy: 0.2 },
      },
    ]),
    mcq("q-motif-9", "競争や比較の場面で、あなたの気持ちは？", [
      {
        id: "q-motif-9-a",
        label: "負けず嫌いが湧き、いっそう頑張りたくなる",
        traitWeights: { trait_extraversion: 0.4, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-motif-9-b",
        label: "相手の成功を素直に喜び、刺激をもらう",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-motif-9-c",
        label: "自分のペースを大切にし、比較は控えめにしたい",
        traitWeights: { trait_neuroticism: -0.4, trait_openness: 0.2 },
      },
      {
        id: "q-motif-9-d",
        label: "劣っていると感じ、不安になることもある",
        traitWeights: { trait_neuroticism: 0.5, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-motif-10", "習慣づくりで、いちばん続けやすいのは？", [
      {
        id: "q-motif-10-a",
        label: "毎日同じ時間に、決まったことをする",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-motif-10-b",
        label: "週に数回、無理のない頻度で続ける",
        traitWeights: { trait_neuroticism: -0.3, trait_agreeableness: 0.2 },
      },
      {
        id: "q-motif-10-c",
        label: "仲間と一緒に、互いに声をかけ合う",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.4 },
      },
      {
        id: "q-motif-10-d",
        label: "興味が湧いたときに、まとめて取り組む",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-motif-11", "失敗や挫折のあと、立ち直るために大切にするのは？", [
      {
        id: "q-motif-11-a",
        label: "学びを次に活かし、再挑戦する",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-motif-11-b",
        label: "信頼できる人に支えてもらい、気持ちを整える",
        traitWeights: { trait_empathy: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-motif-11-c",
        label: "落ち込む時間を許し、自然に回復を待つ",
        traitWeights: { trait_neuroticism: 0.3, trait_empathy: 0.3 },
      },
      {
        id: "q-motif-11-d",
        label: "切り替えて、前を向くことを意識する",
        traitWeights: { trait_neuroticism: -0.5, trait_agreeableness: 0.2 },
      },
    ]),
    mcq("q-motif-12", "やる気の源となる「意味」について、いちばん近いのは？", [
      {
        id: "q-motif-12-a",
        label: "誰かの幸せや役立ちにつながること",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-motif-12-b",
        label: "自分自身の成長や発見につながること",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-motif-12-c",
        label: "大切な人との関係や絆を深めること",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-motif-12-d",
        label: "心の充実感や、自分らしさを表現できること",
        traitWeights: { trait_openness: 0.4, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-motif-13", "締切や期限があるとき、あなたのやる気は？", [
      {
        id: "q-motif-13-a",
        label: "期限が近づくほど、集中力が高まる",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.5 },
      },
      {
        id: "q-motif-13-b",
        label: "早めに着手して、余裕を持って仕上げたい",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-motif-13-c",
        label: "プレッシャーは苦手だが、なんとか乗り切る",
        traitWeights: { trait_neuroticism: 0.4, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-motif-13-d",
        label: "期限より品質や内容を、優先したい",
        traitWeights: { trait_openness: 0.4, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-motif-14", "新しいプロジェクトを始めるとき、最初の一歩は？", [
      {
        id: "q-motif-14-a",
        label: "全体像を描き、最初のタスクを決める",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-motif-14-b",
        label: "とにかく手を動かし、試しながら進める",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-motif-14-c",
        label: "仲間や先輩に相談し、アドバイスをもらう",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-motif-14-d",
        label: "不安はあるが、小さく始めて様子を見る",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-motif-15", "承認や称賛をもらったとき、あなたの反応は？", [
      {
        id: "q-motif-15-a",
        label: "嬉しく、さらに頑張りたくなる",
        traitWeights: { trait_extraversion: 0.4, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-motif-15-b",
        label: "素直に喜び、感謝の気持ちを伝える",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-motif-15-c",
        label: "照れるが、内心では励みになる",
        traitWeights: { trait_neuroticism: 0.2, trait_empathy: 0.3 },
      },
      {
        id: "q-motif-15-d",
        label: "評価より、自分の納得感を大切にする",
        traitWeights: { trait_openness: 0.4, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-motif-16", "退屈や停滞を感じたとき、あなたは？", [
      {
        id: "q-motif-16-a",
        label: "新しいことに挑戦し、変化を求める",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-motif-16-b",
        label: "目標や方法を見直し、工夫する",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-motif-16-c",
        label: "誰かと話して、気分転換する",
        traitWeights: { trait_extraversion: 0.5, trait_agreeableness: 0.2 },
      },
      {
        id: "q-motif-16-d",
        label: "休息を取り、エネルギーが戻るのを待つ",
        traitWeights: { trait_neuroticism: -0.4, trait_empathy: 0.2 },
      },
    ]),
    mcq("q-motif-17", "困難な課題に直面したとき、やる気の保ち方は？", [
      {
        id: "q-motif-17-a",
        label: "小さく分解し、一つずつクリアしていく",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-motif-17-b",
        label: "仲間と協力し、支え合いながら進む",
        traitWeights: { trait_agreeableness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-motif-17-c",
        label: "別の角度からアプローチし、突破口を探す",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-motif-17-d",
        label: "しばらく離れて、気持ちを整えてから再挑戦する",
        traitWeights: { trait_neuroticism: -0.3, trait_empathy: 0.2 },
      },
    ]),
    mcq("q-motif-18", "自分へのご褒美で、いちばんモチベーションが上がるのは？", [
      {
        id: "q-motif-18-a",
        label: "欲しかったものを買う、特別な体験をする",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
      {
        id: "q-motif-18-b",
        label: "好きな場所でゆっくり過ごす、休息の時間",
        traitWeights: { trait_neuroticism: -0.4, trait_empathy: 0.2 },
      },
      {
        id: "q-motif-18-c",
        label: "大切な人と一緒に、楽しい時間を過ごす",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.4 },
      },
      {
        id: "q-motif-18-d",
        label: "次の目標を設定し、前向きな気持ちになる",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.2 },
      },
    ]),
    mcq("q-motif-19", "他人の成功を見たとき、あなたの気持ちは？", [
      {
        id: "q-motif-19-a",
        label: "素直に喜び、自分も頑張ろうと思う",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-motif-19-b",
        label: "刺激を受け、新しい目標を考える",
        traitWeights: { trait_openness: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-motif-19-c",
        label: "自分と比べて、複雑な気持ちになることもある",
        traitWeights: { trait_neuroticism: 0.4, trait_empathy: 0.2 },
      },
      {
        id: "q-motif-19-d",
        label: "自分のペースを大切にし、焦らない",
        traitWeights: { trait_neuroticism: -0.4, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-motif-20", "やる気の波について、あなたに近いのは？", [
      {
        id: "q-motif-20-a",
        label: "高いときと低いときの差が、比較的大きい",
        traitWeights: { trait_neuroticism: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-motif-20-b",
        label: "一定のリズムを保ち、安定して続けられる",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.3 },
      },
      {
        id: "q-motif-20-c",
        label: "周りの雰囲気や人によって、変わりやすい",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-motif-20-d",
        label: "興味のあることには、集中して取り組める",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-motif-21", "目標を諦めそうになったとき、あなたは？", [
      {
        id: "q-motif-21-a",
        label: "一度立ち止まり、本当に大切か見直す",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-motif-21-b",
        label: "信頼できる人に相談し、決断の手助けをもらう",
        traitWeights: { trait_empathy: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-motif-21-c",
        label: "無理をせず、別の道を探す",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
      {
        id: "q-motif-21-d",
        label: "悔しさがあり、もう一度挑戦したくなる",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.4 },
      },
    ]),
    mcq("q-motif-22", "自律性（自分で決めて進める力）について、近いのは？", [
      {
        id: "q-motif-22-a",
        label: "自分で計画を立て、責任を持って進めたい",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.2 },
      },
      {
        id: "q-motif-22-b",
        label: "方針は自分で決めつつ、相談は大切にする",
        traitWeights: { trait_openness: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-motif-22-c",
        label: "誰かの導きや枠組みがあると、動きやすい",
        traitWeights: { trait_agreeableness: 0.4, trait_empathy: 0.3 },
      },
      {
        id: "q-motif-22-d",
        label: "自由すぎると迷うが、自分のペースは守りたい",
        traitWeights: { trait_neuroticism: 0.2, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-motif-23", "達成感を感じる瞬間、いちばん近いのは？", [
      {
        id: "q-motif-23-a",
        label: "難しい目標を達成し、努力が報われたとき",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-motif-23-b",
        label: "誰かの役に立てたと実感したとき",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-motif-23-c",
        label: "新しいことに挑戦し、乗り越えられたとき",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-motif-23-d",
        label: "仲間と一緒に成果を出せたとき",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.4 },
      },
    ]),
    mcq("q-motif-24", "モチベーションを保つうえで、いちばん大切にしたいのは？", [
      {
        id: "q-motif-24-a",
        label: "自分らしいペースと、無理のない続け方",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
      {
        id: "q-motif-24-b",
        label: "意味や目的へのつながり",
        traitWeights: { trait_empathy: 0.5, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-motif-24-c",
        label: "成長の実感と、新しい挑戦",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-motif-24-d",
        label: "大切な人との支え合い",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.4 },
      },
    ]),
  ];
}

export function buildPersonalitySpectrumQuestionBank(): QuestionBlock[] {
  return [
    mcq("q-persona-1", "週末の過ごし方で、いちばん心が満たされるのは？", [
      {
        id: "q-persona-1-a",
        label: "まだ行ったことのない場所へ出かけて、新しい発見をする",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-persona-1-b",
        label: "家でゆっくり過ごし、好きなことに没頭する",
        traitWeights: { trait_neuroticism: -0.4, trait_openness: 0.3 },
      },
      {
        id: "q-persona-1-c",
        label: "大切な人と会って、ゆっくり話す時間",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-persona-1-d",
        label: "やり残したことを片付け、来週に備える",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-persona-2", "初対面の人と話すとき、自然なスタイルは？", [
      {
        id: "q-persona-2-a",
        label: "自分から話題を振り、会話を広げていく",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-persona-2-b",
        label: "相手の話を聞き、質問で引き出す",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-persona-2-c",
        label: "共通点を探し、自然に距離を縮める",
        traitWeights: { trait_openness: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-persona-2-d",
        label: "緊張するが、必要なときは勇気を出して話す",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-persona-3", "ストレスを感じたとき、いちばん効く対処法は？", [
      {
        id: "q-persona-3-a",
        label: "信頼できる人に話して、気持ちを吐き出す",
        traitWeights: { trait_extraversion: 0.4, trait_empathy: 0.4 },
      },
      {
        id: "q-persona-3-b",
        label: "一人の時間を取り、静かに整える",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-persona-3-c",
        label: "散歩や運動で、体を動かして発散する",
        traitWeights: { trait_extraversion: 0.3, trait_openness: 0.3 },
      },
      {
        id: "q-persona-3-d",
        label: "原因を整理し、できることから手をつける",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-persona-4", "意見が対立したとき、あなたの傾向は？", [
      {
        id: "q-persona-4-a",
        label: "自分の考えをはっきり伝え、議論する",
        traitWeights: { trait_extraversion: 0.4, trait_openness: 0.4 },
      },
      {
        id: "q-persona-4-b",
        label: "相手の立場を想像し、歩み寄りを探す",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.4 },
      },
      {
        id: "q-persona-4-c",
        label: "一旦保留にし、冷静になってから話す",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-persona-4-d",
        label: "争いを避け、穏やかな解決を優先する",
        traitWeights: { trait_agreeableness: 0.6, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-persona-5", "計画を立てることについて、あなたに近いのは？", [
      {
        id: "q-persona-5-a",
        label: "細かく計画し、予定通りに進めたい",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-persona-5-b",
        label: "大枠だけ決めて、その日の気分で動く",
        traitWeights: { trait_openness: 0.5, trait_neuroticism: -0.3 },
      },
      {
        id: "q-persona-5-c",
        label: "誰かと相談しながら、柔軟に調整する",
        traitWeights: { trait_agreeableness: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-persona-5-d",
        label: "計画より、その場の流れを大切にする",
        traitWeights: { trait_openness: 0.4, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-persona-6", "新しい環境に馴染むまで、あなたは？", [
      {
        id: "q-persona-6-a",
        label: "積極的に話しかけ、早く輪に入りたい",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-persona-6-b",
        label: "様子を見ながら、無理なく関係を築く",
        traitWeights: { trait_agreeableness: 0.4, trait_neuroticism: -0.2 },
      },
      {
        id: "q-persona-6-c",
        label: "緊張するが、時間をかけて慣れていく",
        traitWeights: { trait_neuroticism: 0.3, trait_empathy: 0.3 },
      },
      {
        id: "q-persona-6-d",
        label: "興味のあることから入り、自然に馴染む",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-persona-7", "誰かが困っているのを見たとき、最初の反応は？", [
      {
        id: "q-persona-7-a",
        label: "すぐに声をかけ、何かできることがないか尋ねる",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-persona-7-b",
        label: "様子を見て、求められたら手を差し伸べる",
        traitWeights: { trait_empathy: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-persona-7-c",
        label: "具体的な助け方を考え、行動に移す",
        traitWeights: { trait_conscientiousness: 0.4, trait_empathy: 0.4 },
      },
      {
        id: "q-persona-7-d",
        label: "寄り添い、話を聞くことから始める",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-persona-8", "一人の時間について、あなたに近いのは？", [
      {
        id: "q-persona-8-a",
        label: "定期的に必要で、心を整える大切な時間",
        traitWeights: { trait_neuroticism: -0.3, trait_openness: 0.3 },
      },
      {
        id: "q-persona-8-b",
        label: "好きだが、長く続くと寂しくなることもある",
        traitWeights: { trait_extraversion: 0.3, trait_empathy: 0.2 },
      },
      {
        id: "q-persona-8-c",
        label: "創作や思考に没頭する、充実した時間",
        traitWeights: { trait_openness: 0.5, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-persona-8-d",
        label: "状況次第で、必要なら取る程度",
        traitWeights: { trait_agreeableness: 0.3, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-persona-9", "物事の決断をするとき、いちばん頼りにするのは？", [
      {
        id: "q-persona-9-a",
        label: "論理的に整理した情報と、自分の判断基準",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-persona-9-b",
        label: "直感や、そのときの気持ち",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-persona-9-c",
        label: "信頼できる人の意見や、アドバイス",
        traitWeights: { trait_agreeableness: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-persona-9-d",
        label: "決めきれず、時間をかけて考える",
        traitWeights: { trait_neuroticism: 0.4, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-persona-10", "変化や予定外の出来事に対して、あなたは？", [
      {
        id: "q-persona-10-a",
        label: "柔軟に対応し、新しい可能性を楽しむ",
        traitWeights: { trait_openness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-persona-10-b",
        label: "動揺するが、すぐに立て直して対処する",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-persona-10-c",
        label: "周りに配慮しながら、落ち着いて対応する",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-persona-10-d",
        label: "計画通りを好むが、やむを得ないときは受け入れる",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-persona-11", "感情を表に出すことについて、近いのは？", [
      {
        id: "q-persona-11-a",
        label: "嬉しいときも悲しいときも、素直に伝える",
        traitWeights: { trait_extraversion: 0.4, trait_empathy: 0.4 },
      },
      {
        id: "q-persona-11-b",
        label: "大切な人の前では、自然に表れる",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-persona-11-c",
        label: "あまり表に出さず、内に留めることが多い",
        traitWeights: { trait_conscientiousness: 0.3, trait_neuroticism: -0.2 },
      },
      {
        id: "q-persona-11-d",
        label: "場や相手によって、出し方を変える",
        traitWeights: { trait_agreeableness: 0.4, trait_openness: 0.2 },
      },
    ]),
    mcq("q-persona-12", "ルールや約束について、あなたの姿勢は？", [
      {
        id: "q-persona-12-a",
        label: "守ることを大切にし、自分も他者もそう望む",
        traitWeights: { trait_conscientiousness: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-persona-12-b",
        label: "状況に応じて、柔軟に解釈することもある",
        traitWeights: { trait_openness: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-persona-12-c",
        label: "破られると、つい気になってしまう",
        traitWeights: { trait_neuroticism: 0.4, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-persona-12-d",
        label: "相手の事情を考え、厳しくしすぎない",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-persona-13", "人生の選択で、いちばん大切にするのは？", [
      {
        id: "q-persona-13-a",
        label: "自分らしさと、心の納得感",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-persona-13-b",
        label: "大切な人との関係や、周囲への配慮",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-persona-13-c",
        label: "将来の安定と、計画的な準備",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-persona-13-d",
        label: "新しい体験と、成長の機会",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-persona-14", "批判や否定的なフィードバックを受けたとき？", [
      {
        id: "q-persona-14-a",
        label: "ショックを受けるが、時間をおいて冷静に検討する",
        traitWeights: { trait_neuroticism: 0.4, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-persona-14-b",
        label: "建設的な部分を取り入れ、成長に活かす",
        traitWeights: { trait_openness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-persona-14-c",
        label: "相手の意図を想像し、前向きに受け止める",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-persona-14-d",
        label: "傷つくが、信頼できる人に話して整理する",
        traitWeights: { trait_neuroticism: 0.3, trait_extraversion: 0.3 },
      },
    ]),
    mcq("q-persona-15", "社交的な集まりでの、あなたの過ごし方は？", [
      {
        id: "q-persona-15-a",
        label: "いろいろな人と話し、場を盛り上げたい",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-persona-15-b",
        label: "親しい人と深い話をする、少人数の時間",
        traitWeights: { trait_empathy: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-persona-15-c",
        label: "早めに帰りたくなるが、必要なら参加する",
        traitWeights: { trait_neuroticism: -0.2, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-persona-15-d",
        label: "新しい人との出会いを、楽しみにしている",
        traitWeights: { trait_openness: 0.4, trait_extraversion: 0.4 },
      },
    ]),
    mcq("q-persona-16", "完璧主義について、あなたに近いのは？", [
      {
        id: "q-persona-16-a",
        label: "高い基準を持ち、細部まで気を配る",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-persona-16-b",
        label: "完璧を目指すが、できないときは割り切る",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-persona-16-c",
        label: "できればよいが、無理はしたくない",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
      {
        id: "q-persona-16-d",
        label: "相手の期待に応えようと、つい頑張りすぎる",
        traitWeights: { trait_agreeableness: 0.4, trait_neuroticism: 0.3 },
      },
    ]),
    mcq("q-persona-17", "将来について考えるとき、いちばん心が動くのは？", [
      {
        id: "q-persona-17-a",
        label: "まだ見ぬ可能性や、新しい挑戦のイメージ",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-persona-17-b",
        label: "大切な人との関係や、支え合いの未来",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-persona-17-c",
        label: "具体的な目標と、実現への道筋",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.2 },
      },
      {
        id: "q-persona-17-d",
        label: "不安もあるが、一歩ずつ進んでいけばと思う",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-persona-18", "自分の弱みや課題について、あなたは？", [
      {
        id: "q-persona-18-a",
        label: "認識しており、改善に向けて努力している",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-persona-18-b",
        label: "あまり気にせず、長所を活かすことを優先する",
        traitWeights: { trait_neuroticism: -0.4, trait_openness: 0.2 },
      },
      {
        id: "q-persona-18-c",
        label: "信頼できる人に相談し、客観的に見てもらう",
        traitWeights: { trait_empathy: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-persona-18-d",
        label: "弱みを意識しすぎて、落ち込むことがある",
        traitWeights: { trait_neuroticism: 0.5, trait_empathy: 0.2 },
      },
    ]),
    mcq("q-persona-19", "日常の小さな幸せを感じる瞬間は？", [
      {
        id: "q-persona-19-a",
        label: "好きな飲み物や景色など、五感で味わうとき",
        traitWeights: { trait_openness: 0.5, trait_neuroticism: -0.3 },
      },
      {
        id: "q-persona-19-b",
        label: "誰かの優しさや、温かい言葉を受け取ったとき",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-persona-19-c",
        label: "予定通りに物事が進み、安心できたとき",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-persona-19-d",
        label: "友人や家族と笑い合えた、何気ない時間",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-persona-20", "プライバシーや個人の境界について、あなたは？", [
      {
        id: "q-persona-20-a",
        label: "自分の領域を大切にし、踏み込まれすぎるのは苦手",
        traitWeights: { trait_conscientiousness: 0.3, trait_neuroticism: -0.2 },
      },
      {
        id: "q-persona-20-b",
        label: "信頼関係があれば、心を開いていける",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-persona-20-c",
        label: "相手の境界も尊重し、距離感を守りたい",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-persona-20-d",
        label: "共有は好きだが、一人の時間も必要",
        traitWeights: { trait_extraversion: 0.3, trait_openness: 0.2 },
      },
    ]),
    mcq("q-persona-21", "不安や心配が強くなったとき、あなたは？", [
      {
        id: "q-persona-21-a",
        label: "つい考え込み、頭から離れにくい",
        traitWeights: { trait_neuroticism: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-persona-21-b",
        label: "信頼できる人に話して、気持ちを軽くする",
        traitWeights: { trait_extraversion: 0.3, trait_empathy: 0.4 },
      },
      {
        id: "q-persona-21-c",
        label: "深呼吸や休息で、落ち着くのを待つ",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
      {
        id: "q-persona-21-d",
        label: "できる対策を考え、行動に移して安心する",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-persona-22", "リーダーシップや主導権について、近いのは？", [
      {
        id: "q-persona-22-a",
        label: "必要なときは、率先して引っ張っていきたい",
        traitWeights: { trait_extraversion: 0.5, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-persona-22-b",
        label: "みんなの意見をまとめ、調整する役が得意",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-persona-22-c",
        label: "主導より、支援や裏方に回ることが多い",
        traitWeights: { trait_agreeableness: 0.4, trait_empathy: 0.3 },
      },
      {
        id: "q-persona-22-d",
        label: "目立つより、自分の役割を確実に果たしたい",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-persona-23", "人生を振り返るとき、いちばん誇りに思うのは？", [
      {
        id: "q-persona-23-a",
        label: "困っている人に寄り添えたこと",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-persona-23-b",
        label: "新しいことに挑戦し、自分を広げたこと",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
      {
        id: "q-persona-23-c",
        label: "約束を守り、誠実に向き合ってきたこと",
        traitWeights: { trait_conscientiousness: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-persona-23-d",
        label: "大切な人との思い出や、絆を育てたこと",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-persona-24", "これからの自分に、いちばん願うことは？", [
      {
        id: "q-persona-24-a",
        label: "心の平安と、無理のない自分らしさ",
        traitWeights: { trait_neuroticism: -0.4, trait_empathy: 0.3 },
      },
      {
        id: "q-persona-24-b",
        label: "新しい体験と、成長し続ける姿勢",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-persona-24-c",
        label: "大切な人との温かい関係",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-persona-24-d",
        label: "目標に向かって、着実に歩み続けること",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
    ]),
  ];
}
