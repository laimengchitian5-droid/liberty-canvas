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

export function buildOshikatsuQuestionBank(): QuestionBlock[] {
  return [
    mcq("q-oshi-1", "推しの新ジャンル作品が発表されたとき、あなたの反応に近いのは？", [
      {
        id: "q-oshi-1-a",
        label: "世界観や設定を調べて、まず全体像をつかみたい",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-oshi-1-b",
        label: "すぐに仲間に共有して、一緒に盛り上がりたい",
        traitWeights: { trait_extraversion: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-oshi-1-c",
        label: "推しの過去作と比べて、変化の意味を考える",
        traitWeights: { trait_openness: 0.4, trait_empathy: 0.3, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-oshi-1-d",
        label: "発表を見て感情が先に動き、しばらく言葉が出ない",
        traitWeights: { trait_empathy: 0.5, trait_neuroticism: 0.3 },
      },
    ]),
    mcq("q-oshi-2", "推し活で、これから試してみたいことに近いのは？", [
      {
        id: "q-oshi-2-a",
        label: "現地イベントや遠征など、体験の幅を広げる",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.3 },
      },
      {
        id: "q-oshi-2-b",
        label: "グッズ整理や記録を整えて、推し活を体系化する",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.2 },
      },
      {
        id: "q-oshi-2-c",
        label: "創作や応援アートなど、自分ならではの形で関わる",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-oshi-2-d",
        label: "今の楽しみ方を続けて、無理なく続ける",
        traitWeights: { trait_agreeableness: 0.3, trait_neuroticism: -0.4 },
      },
    ]),
    mcq("q-oshi-3", "推しの世界観や設定について、どう関わりたいですか？", [
      {
        id: "q-oshi-3-a",
        label: "細部まで掘り下げて、自分なりの解釈をまとめる",
        traitWeights: { trait_openness: 0.6, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-oshi-3-b",
        label: "ファンの考察を読んで、みんなの視点を楽しむ",
        traitWeights: { trait_agreeableness: 0.4, trait_empathy: 0.3, trait_openness: 0.2 },
      },
      {
        id: "q-oshi-3-c",
        label: "現場の空気やパフォーマンスで感じ取るのが好き",
        traitWeights: { trait_extraversion: 0.4, trait_empathy: 0.4 },
      },
      {
        id: "q-oshi-3-d",
        label: "深追いしすぎず、心地よい距離感で楽しむ",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-oshi-4", "推し活アカウントの運用スタイルで、いちばんしっくりくるのは？", [
      {
        id: "q-oshi-4-a",
        label: "独自の切り口や編集で、表現を試していく",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-oshi-4-b",
        label: "丁寧な記録やまとめで、後から見返せるようにする",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-oshi-4-c",
        label: "交流やリプを大切にして、輪を広げていく",
        traitWeights: { trait_extraversion: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-oshi-4-d",
        label: "公開は控えめにして、自分のための記録に留める",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-oshi-5", "推しの活動に新しい企画が加わったとき、あなたは？", [
      {
        id: "q-oshi-5-a",
        label: "まず内容を試して、可能性を探ってみる",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-oshi-5-b",
        label: "スケジュールや参加条件を確認してから動く",
        traitWeights: { trait_conscientiousness: 0.5, trait_agreeableness: 0.2 },
      },
      {
        id: "q-oshi-5-c",
        label: "推しの挑戦を応援したくて、すぐ声を届けたい",
        traitWeights: { trait_empathy: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-oshi-5-d",
        label: "様子を見て、無理のない範囲で関わる",
        traitWeights: { trait_neuroticism: -0.4, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-oshi-6", "ライブ参戦の準備で、いちばん丁寧にやるのは？", [
      {
        id: "q-oshi-6-a",
        label: "交通・宿泊・持ち物リストを事前に組み立てる",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.2 },
      },
      {
        id: "q-oshi-6-b",
        label: "現地の楽しみ方や食事スポットまで調べる",
        traitWeights: { trait_openness: 0.4, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-oshi-6-c",
        label: "同行者との段取りや集合時間をしっかり決める",
        traitWeights: { trait_conscientiousness: 0.4, trait_agreeableness: 0.4 },
      },
      {
        id: "q-oshi-6-d",
        label: "当日の気分で動けるよう、大枠だけ決めておく",
        traitWeights: { trait_extraversion: 0.3, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-oshi-7", "推し関連のグッズ管理で、あなたに近いのは？", [
      {
        id: "q-oshi-7-a",
        label: "種類・購入日・保管場所まで記録している",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.2 },
      },
      {
        id: "q-oshi-7-b",
        label: "お気に入りだけ丁寧に飾り、大切に使う",
        traitWeights: { trait_empathy: 0.4, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-oshi-7-c",
        label: "交換や譲渡の機会を活かして、循環させる",
        traitWeights: { trait_agreeableness: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-oshi-7-d",
        label: "増えすぎても気にせず、今の気分で楽しむ",
        traitWeights: { trait_openness: 0.3, trait_neuroticism: -0.4 },
      },
    ]),
    mcq("q-oshi-8", "推しカレンダーの予定、どう管理していますか？", [
      {
        id: "q-oshi-8-a",
        label: "アプリや手帳に全部入れて、漏れなく確認する",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-oshi-8-b",
        label: "重要な日だけ登録して、優先度をつける",
        traitWeights: { trait_conscientiousness: 0.4, trait_agreeableness: 0.2 },
      },
      {
        id: "q-oshi-8-c",
        label: "仲間と共有して、一緒に予定を組む",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-oshi-8-d",
        label: "直前まで様子を見て、柔軟に動く",
        traitWeights: { trait_openness: 0.4, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-oshi-9", "ファンクラブ特典や会員更新、あなたのスタイルは？", [
      {
        id: "q-oshi-9-a",
        label: "期限をメモして、必ず期限内に手続きする",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-oshi-9-b",
        label: "特典内容を比較して、価値のあるものだけ選ぶ",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-oshi-9-c",
        label: "推しを支えたい気持ちを優先して、継続する",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-oshi-9-d",
        label: "負担にならない範囲で、気楽に続ける",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
    ]),
    mcq("q-oshi-10", "推し活の支出管理について、あなたに近いのは？", [
      {
        id: "q-oshi-10-a",
        label: "月ごとの上限を決めて、きちんと守っている",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-oshi-10-b",
        label: "大切なイベントだけ優先して、計画的に使う",
        traitWeights: { trait_conscientiousness: 0.4, trait_empathy: 0.3 },
      },
      {
        id: "q-oshi-10-c",
        label: "気分と余裕に合わせて、柔軟に楽しむ",
        traitWeights: { trait_openness: 0.4, trait_extraversion: 0.2 },
      },
      {
        id: "q-oshi-10-d",
        label: "後悔しそうなときは、一度立ち止まって考える",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-oshi-11", "ライブ会場で、自然にやってしまう行動は？", [
      {
        id: "q-oshi-11-a",
        label: "周りのファンと声を合わせて、一体感を楽しむ",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-oshi-11-b",
        label: "推しの目線を意識して、応援のタイミングを合わせる",
        traitWeights: { trait_empathy: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-oshi-11-c",
        label: "自分なりのコールや演出で、存在感を出す",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-oshi-11-d",
        label: "静かに集中して、ステージをじっくり味わう",
        traitWeights: { trait_openness: 0.3, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-oshi-12", "推しトークができる場面なら、どれがいちばん楽しいですか？", [
      {
        id: "q-oshi-12-a",
        label: "友達と対面で、熱く語り合う時間",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-oshi-12-b",
        label: "オンラインのファンコミュニティで意見交換する",
        traitWeights: { trait_extraversion: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-oshi-12-c",
        label: "少人数の同担さんと、深い話をする",
        traitWeights: { trait_empathy: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-oshi-12-d",
        label: "一人で振り返りながら、自分の言葉でまとめる",
        traitWeights: { trait_conscientiousness: 0.3, trait_openness: 0.3 },
      },
    ]),
    mcq("q-oshi-13", "推しの現地イベントで、気分が上がるのは？", [
      {
        id: "q-oshi-13-a",
        label: "会場の歓声や一体感に包まれた瞬間",
        traitWeights: { trait_extraversion: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-oshi-13-b",
        label: "推しと目が合った、あの一瞬",
        traitWeights: { trait_empathy: 0.5, trait_neuroticism: 0.3 },
      },
      {
        id: "q-oshi-13-c",
        label: "初めての場所・初めての体験に挑戦できたとき",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-oshi-13-d",
        label: "無事に終わって、達成感が残ったとき",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-oshi-14", "応援の仕方で、いちばん自分らしいのは？", [
      {
        id: "q-oshi-14-a",
        label: "声やペンライトで、現場の熱量を上げる",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-oshi-14-b",
        label: "作品購入や配信視聴で、静かに支える",
        traitWeights: { trait_conscientiousness: 0.4, trait_empathy: 0.3 },
      },
      {
        id: "q-oshi-14-c",
        label: "創作やファン活動で、推しの世界を広げる",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
      {
        id: "q-oshi-14-d",
        label: "長く見守り続ける、落ち着いた応援",
        traitWeights: { trait_agreeableness: 0.4, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-oshi-15", "推し活仲間との過ごし方で、理想に近いのは？", [
      {
        id: "q-oshi-15-a",
        label: "遠征やイベントを一緒に回って、思い出を増やす",
        traitWeights: { trait_extraversion: 0.6, trait_openness: 0.2 },
      },
      {
        id: "q-oshi-15-b",
        label: "情報交換や相談ができて、助け合える関係",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-oshi-15-c",
        label: "たまに深い話ができる、信頼できる数人",
        traitWeights: { trait_empathy: 0.4, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-oshi-15-d",
        label: "一人の時間も大切にしながら、適度に関わる",
        traitWeights: { trait_neuroticism: -0.3, trait_openness: 0.3 },
      },
    ]),
    mcq("q-oshi-16", "推しの活動で不便やトラブルが起きたとき、どう動きますか？", [
      {
        id: "q-oshi-16-a",
        label: "まず事実を確認して、冷静に対処する",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-oshi-16-b",
        label: "周りの人に配慮して、場の空気を乱さないよう動く",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-oshi-16-c",
        label: "推しやスタッフの気持ちを想像して、言動を選ぶ",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-oshi-16-d",
        label: "改善案を出して、前向きに解決を探る",
        traitWeights: { trait_openness: 0.4, trait_extraversion: 0.3 },
      },
    ]),
    mcq("q-oshi-17", "同期・同担さんとの関係で、大切にしたいのは？", [
      {
        id: "q-oshi-17-a",
        label: "互いの境界を尊重して、長く穏やかに付き合う",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-oshi-17-b",
        label: "喜びも悩みも分かち合える、信頼関係",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-oshi-17-c",
        label: "楽しく盛り上がれる、気軽な仲間関係",
        traitWeights: { trait_extraversion: 0.5, trait_agreeableness: 0.2 },
      },
      {
        id: "q-oshi-17-d",
        label: "推しへの想いは同じでも、距離感は自分で整える",
        traitWeights: { trait_conscientiousness: 0.3, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-oshi-18", "マナー違反を目にしたとき、あなたの行動は？", [
      {
        id: "q-oshi-18-a",
        label: "穏やかに注意して、場を落ち着かせたい",
        traitWeights: { trait_agreeableness: 0.5, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-oshi-18-b",
        label: "スタッフや係の人に任せて、自分は静観する",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-oshi-18-c",
        label: "周りの人が困らないよう、さりげなくフォローする",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-oshi-18-d",
        label: "ルールを共有して、正しい行動を広めたい",
        traitWeights: { trait_conscientiousness: 0.4, trait_extraversion: 0.3 },
      },
    ]),
    mcq("q-oshi-19", "新規ファンに推しを紹介するとき、どうしますか？", [
      {
        id: "q-oshi-19-a",
        label: "入門しやすい作品から、無理のない順番で案内する",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-oshi-19-b",
        label: "魅力を自分の言葉で語って、興味を引き出す",
        traitWeights: { trait_extraversion: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-oshi-19-c",
        label: "推しの良さを押しつけず、相手のペースを尊重する",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-oshi-19-d",
        label: "資料やリンクを整理して、後から見返せるようにする",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.2 },
      },
    ]),
    mcq("q-oshi-20", "推しの炎上やネガティブな話題が出たとき、あなたは？", [
      {
        id: "q-oshi-20-a",
        label: "情報を確かめて、感情的に拡散しない",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-oshi-20-b",
        label: "推しや関係者の気持ちを考えて、言動を控える",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-oshi-20-c",
        label: "落ち着いて見守り、落ち着くまで待つ",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
      {
        id: "q-oshi-20-d",
        label: "心配はするが、信じて応援し続ける",
        traitWeights: { trait_empathy: 0.4, trait_neuroticism: 0.3 },
      },
    ]),
    mcq("q-oshi-21", "チケット取りの結果発表を待つ時間、あなたは？", [
      {
        id: "q-oshi-21-a",
        label: "何度も確認して、気になって落ち着かない",
        traitWeights: { trait_neuroticism: 0.6, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-oshi-21-b",
        label: "当落は運だと割り切って、気持ちを切り替える",
        traitWeights: { trait_neuroticism: -0.5, trait_openness: 0.2 },
      },
      {
        id: "q-oshi-21-c",
        label: "仲間と話して、不安を少し和らげる",
        traitWeights: { trait_extraversion: 0.3, trait_neuroticism: 0.3 },
      },
      {
        id: "q-oshi-21-d",
        label: "当たらなくても次があると考えて、備えをする",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-oshi-22", "推しの活動スケジュールが急に変更されたとき？", [
      {
        id: "q-oshi-22-a",
        label: "ショックを受けるが、すぐ予定を組み直す",
        traitWeights: { trait_neuroticism: 0.4, trait_conscientiousness: 0.4 },
      },
      {
        id: "q-oshi-22-b",
        label: "推しの事情を考えて、無理に悲しみを広げない",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-oshi-22-c",
        label: "変更も含めて推しの歩みだと受け止める",
        traitWeights: { trait_neuroticism: -0.4, trait_openness: 0.3 },
      },
      {
        id: "q-oshi-22-d",
        label: "仲間と情報を共有して、落ち着いて対応する",
        traitWeights: { trait_extraversion: 0.3, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-oshi-23", "推しの健康や体調を心配する気持ちは？", [
      {
        id: "q-oshi-23-a",
        label: "つい過剰に気になり、休んでほしいと思う",
        traitWeights: { trait_neuroticism: 0.5, trait_empathy: 0.4 },
      },
      {
        id: "q-oshi-23-b",
        label: "心配はするが、信頼して見守れる",
        traitWeights: { trait_neuroticism: -0.4, trait_empathy: 0.3 },
      },
      {
        id: "q-oshi-23-c",
        label: "無理のない範囲で、温かい声援を送る",
        traitWeights: { trait_agreeableness: 0.4, trait_neuroticism: -0.2 },
      },
      {
        id: "q-oshi-23-d",
        label: "公式情報を確認して、冷静に状況を把握する",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-oshi-24", "推しの作品やステージで感情が動いたとき？", [
      {
        id: "q-oshi-24-a",
        label: "涙や鳥肌が止まらず、しばらく余韻に浸る",
        traitWeights: { trait_empathy: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-oshi-24-b",
        label: "感動を言葉にして、誰かに伝えたくなる",
        traitWeights: { trait_extraversion: 0.4, trait_empathy: 0.4 },
      },
      {
        id: "q-oshi-24-c",
        label: "心の中で大切にしまって、自分だけの宝物にする",
        traitWeights: { trait_openness: 0.3, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-oshi-24-d",
        label: "落ち着いて味わい、前向きな気持ちに変える",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
    ]),
  ];
}

export function buildRomanceQuestionBank(): QuestionBlock[] {
  return [
    mcq("q-love-1", "初デートの場所選びで、いちばん惹かれるのは？", [
      {
        id: "q-love-1-a",
        label: "初めて行くお店やエリアで、新しい発見を楽しむ",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-love-1-b",
        label: "落ち着いて話せる、静かなカフェや公園",
        traitWeights: { trait_agreeableness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-love-1-c",
        label: "相手の好みを聞いて、喜んでもらえる場所を選ぶ",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-1-d",
        label: "予約や移動まで計画して、スムーズに過ごす",
        traitWeights: { trait_conscientiousness: 0.5, trait_extraversion: 0.2 },
      },
    ]),
    mcq("q-love-2", "気になる相手との会話で、自然にしたくなるのは？", [
      {
        id: "q-love-2-a",
        label: "相手の価値観や夢について、深く聞いてみる",
        traitWeights: { trait_openness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-love-2-b",
        label: "共通の話題を見つけて、軽やかに盛り上がる",
        traitWeights: { trait_extraversion: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-2-c",
        label: "相手のペースに合わせて、無理なく距離を縮める",
        traitWeights: { trait_agreeableness: 0.4, trait_empathy: 0.4 },
      },
      {
        id: "q-love-2-d",
        label: "言葉数より、表情や雰囲気を丁寧に読む",
        traitWeights: { trait_empathy: 0.5, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-love-3", "恋愛で「新しい自分」に出会えたと感じるのは？", [
      {
        id: "q-love-3-a",
        label: "今まで試さなかった行動や趣味に挑戦したとき",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-love-3-b",
        label: "感情を素直に伝えられるようになったとき",
        traitWeights: { trait_empathy: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-love-3-c",
        label: "相手を大切にする気持ちが、より深まったとき",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-love-3-d",
        label: "自分の軸を保ちながら、関係を育てられたとき",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-love-4", "理想のデートの過ごし方に近いのは？", [
      {
        id: "q-love-4-a",
        label: "予定外の出来事も楽しみながら、自由に過ごす",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-love-4-b",
        label: "ふたりでゆっくり話して、心の距離を縮める",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-4-c",
        label: "お互いの好きな場所を巡る、計画型デート",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-love-4-d",
        label: "にぎやかな場所で、一緒に笑い合う時間",
        traitWeights: { trait_extraversion: 0.5, trait_agreeableness: 0.2 },
      },
    ]),
    mcq("q-love-5", "相手との価値観の違いに気づいたとき、あなたは？", [
      {
        id: "q-love-5-a",
        label: "違いを面白がって、新しい視点として受け入れる",
        traitWeights: { trait_openness: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-love-5-b",
        label: "相手の背景を想像して、理解しようとする",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-5-c",
        label: "大切な線だけ確認して、冷静に話し合う",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.2 },
      },
      {
        id: "q-love-5-d",
        label: "不安になるが、関係を壊さないよう慎重に動く",
        traitWeights: { trait_neuroticism: 0.4, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-love-6", "恋人との約束や記念日、あなたのスタイルは？", [
      {
        id: "q-love-6-a",
        label: "カレンダーに入れて、忘れないよう管理している",
        traitWeights: { trait_conscientiousness: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-love-6-b",
        label: "相手が喜ぶサプライズを、事前に準備する",
        traitWeights: { trait_conscientiousness: 0.4, trait_empathy: 0.4 },
      },
      {
        id: "q-love-6-c",
        label: "大切な日は覚えているが、形式にはこだわらない",
        traitWeights: { trait_openness: 0.3, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-6-d",
        label: "その日の気分で、素直な気持ちを伝える",
        traitWeights: { trait_extraversion: 0.3, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-love-7", "連絡の頻度や返信について、あなたに近いのは？", [
      {
        id: "q-love-7-a",
        label: "決まった時間に、こまめにやり取りしたい",
        traitWeights: { trait_conscientiousness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-love-7-b",
        label: "相手の都合を考えて、負担にならない量にする",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-7-c",
        label: "用事があるとき以外は、自然な流れに任せる",
        traitWeights: { trait_neuroticism: -0.4, trait_openness: 0.2 },
      },
      {
        id: "q-love-7-d",
        label: "返信が遅いと、つい気になってしまう",
        traitWeights: { trait_neuroticism: 0.5, trait_empathy: 0.2 },
      },
    ]),
    mcq("q-love-8", "恋人との将来の話が出たとき、あなたは？", [
      {
        id: "q-love-8-a",
        label: "具体的な段取りや目標を一緒に考える",
        traitWeights: { trait_conscientiousness: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-love-8-b",
        label: "まず相手の気持ちを確かめてから話を進める",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-8-c",
        label: "夢や理想を自由に語り合って、ワクワクする",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-love-8-d",
        label: "急がず、今の関係を大切にしながら見守る",
        traitWeights: { trait_neuroticism: -0.3, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-love-9", "喧嘩やすれ違いのあと、いちばんしっくりくるのは？", [
      {
        id: "q-love-9-a",
        label: "落ち着いてから、事実と気持ちを整理して話す",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
      {
        id: "q-love-9-b",
        label: "相手の気持ちを優先して、まず謝罪や労いを伝える",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.4 },
      },
      {
        id: "q-love-9-c",
        label: "一人で考え込み、言葉が出るまで時間をかける",
        traitWeights: { trait_neuroticism: 0.4, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-love-9-d",
        label: "軽い冗談や話題転換で、空気を柔らかくする",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-love-10", "恋愛における「誠実さ」とは、あなたにとって？", [
      {
        id: "q-love-10-a",
        label: "約束を守り、言ったことをきちんと実行する",
        traitWeights: { trait_conscientiousness: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-love-10-b",
        label: "相手の気持ちを傷つけないよう、言葉を選ぶ",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-10-c",
        label: "本音を隠さず、正直に伝えること",
        traitWeights: { trait_openness: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-love-10-d",
        label: "困ったときも、関係を諦めずに向き合うこと",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-love-11", "恋人との時間の過ごし方で、いちばん充実するのは？", [
      {
        id: "q-love-11-a",
        label: "友人も交えて、にぎやかに過ごす",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-love-11-b",
        label: "ふたりきりで、深い話をじっくりする",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.2 },
      },
      {
        id: "q-love-11-c",
        label: "一緒に新しい場所へ出かけて、体験を共有する",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-love-11-d",
        label: "同じ空間で穏やかに過ごす、静かな時間",
        traitWeights: { trait_neuroticism: -0.3, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-love-12", "気になる相手の前だと、自然に出てしまうのは？", [
      {
        id: "q-love-12-a",
        label: "話題を次々に振って、会話を盛り上げる",
        traitWeights: { trait_extraversion: 0.6, trait_openness: 0.2 },
      },
      {
        id: "q-love-12-b",
        label: "相手の話を引き出して、よく聞く",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-12-c",
        label: "緊張するが、笑顔や態度で気持ちを伝える",
        traitWeights: { trait_neuroticism: 0.3, trait_empathy: 0.4 },
      },
      {
        id: "q-love-12-d",
        label: "普段どおりの自分で、無理に変えない",
        traitWeights: { trait_conscientiousness: 0.3, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-love-13", "恋愛で「好き」と実感する瞬間は？", [
      {
        id: "q-love-13-a",
        label: "一緒にいて、自然と笑顔がこぼれるとき",
        traitWeights: { trait_extraversion: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-love-13-b",
        label: "相手の小さな変化に気づいて、心配になるとき",
        traitWeights: { trait_empathy: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-love-13-c",
        label: "将来のことを一緒に想像して、ワクワクするとき",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
      {
        id: "q-love-13-d",
        label: "困難があっても、支えたいと思えるとき",
        traitWeights: { trait_agreeableness: 0.5, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-love-14", "恋人との意見の食い違い、どう向き合いますか？", [
      {
        id: "q-love-14-a",
        label: "自分の考えをはっきり伝えて、議論する",
        traitWeights: { trait_extraversion: 0.4, trait_openness: 0.4 },
      },
      {
        id: "q-love-14-b",
        label: "相手の立場を想像して、歩み寄る",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.4 },
      },
      {
        id: "q-love-14-c",
        label: "一旦保留にして、冷静になってから話す",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-love-14-d",
        label: "譲れる点は譲って、関係を優先する",
        traitWeights: { trait_agreeableness: 0.5, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-love-15", "恋愛の悩みを誰かに相談するとき、あなたは？", [
      {
        id: "q-love-15-a",
        label: "信頼できる友人に、率直に話す",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-love-15-b",
        label: "一人で整理してから、必要な人にだけ伝える",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.2 },
      },
      {
        id: "q-love-15-c",
        label: "相手の気持ちを考えて、あまり外に出さない",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-15-d",
        label: "日記やメモに書いて、自分の中で消化する",
        traitWeights: { trait_openness: 0.3, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-love-16", "相手の友人関係について、あなたの態度は？", [
      {
        id: "q-love-16-a",
        label: "相手の大切な人を尊重して、距離感を大切にする",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-love-16-b",
        label: "できる範囲で仲良くなり、関係を広げたい",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-16-c",
        label: "相手の気持ちを優先して、干渉しすぎない",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-16-d",
        label: "恋愛と友情は別と考え、自分の交友関係も保つ",
        traitWeights: { trait_conscientiousness: 0.3, trait_openness: 0.3 },
      },
    ]),
    mcq("q-love-17", "相手が落ち込んでいるとき、最初にすることは？", [
      {
        id: "q-love-17-a",
        label: "そっと寄り添って、話を聞く",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-love-17-b",
        label: "気分転換になる提案をして、元気づける",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-17-c",
        label: "必要なら一人の時間を与えて、待つ",
        traitWeights: { trait_empathy: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-love-17-d",
        label: "具体的な助け方を考えて、行動に移す",
        traitWeights: { trait_conscientiousness: 0.4, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-love-18", "恋人のプライバシーや個人の時間について、あなたは？", [
      {
        id: "q-love-18-a",
        label: "尊重して、踏み込みすぎないよう意識する",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-love-18-b",
        label: "共有は大切だが、束縛にはしたくない",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
      {
        id: "q-love-18-c",
        label: "不安になることもあるが、信頼を選ぶ",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-love-18-d",
        label: "お互いの様子は気にかけつつ、適度な距離を保つ",
        traitWeights: { trait_empathy: 0.4, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-love-19", "恋愛で譲れない一線があるとしたら、どれに近いですか？", [
      {
        id: "q-love-19-a",
        label: "嘘やごまかしのない、誠実な関係",
        traitWeights: { trait_conscientiousness: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-19-b",
        label: "お互いを尊重し、言葉や態度で傷つけないこと",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-love-19-c",
        label: "自分らしさを失わず、対等であること",
        traitWeights: { trait_openness: 0.4, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-love-19-d",
        label: "不安を一方的に押し付け合わないこと",
        traitWeights: { trait_neuroticism: -0.3, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-love-20", "別れや距離が必要な状況になったとき、あなたは？", [
      {
        id: "q-love-20-a",
        label: "相手の気持ちを考えて、丁寧に言葉を選ぶ",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.4 },
      },
      {
        id: "q-love-20-b",
        label: "事実と自分の気持ちを整理して、誠実に伝える",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.2 },
      },
      {
        id: "q-love-20-c",
        label: "ショックを受けるが、長期的に見て決断する",
        traitWeights: { trait_neuroticism: 0.4, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-love-20-d",
        label: "一度落ち着いてから、冷静に話し合う",
        traitWeights: { trait_neuroticism: -0.3, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-love-21", "恋人の行動が気になり、不安になるとき、あなたは？", [
      {
        id: "q-love-21-a",
        label: "つい何度も確認して、心が落ち着かない",
        traitWeights: { trait_neuroticism: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-love-21-b",
        label: "信頼を選び、必要なときだけ率直に聞く",
        traitWeights: { trait_neuroticism: -0.4, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-love-21-c",
        label: "相手の立場を想像して、言い方を工夫する",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-21-d",
        label: "一人で考えすぎず、友人に相談して整理する",
        traitWeights: { trait_extraversion: 0.3, trait_openness: 0.3 },
      },
    ]),
    mcq("q-love-22", "恋愛の行き詰まりを感じたとき、あなたは？", [
      {
        id: "q-love-22-a",
        label: "原因を探って、二人で話し合う",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-love-22-b",
        label: "焦らず、時間をかけて関係を見直す",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
      {
        id: "q-love-22-c",
        label: "相手の気持ちを確かめてから、次の一歩を決める",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-22-d",
        label: "不安が強くなり、つい考え込んでしまう",
        traitWeights: { trait_neuroticism: 0.5, trait_empathy: 0.2 },
      },
    ]),
    mcq("q-love-23", "恋人の成功や幸せな報告を聞いたとき？", [
      {
        id: "q-love-23-a",
        label: "心から喜んで、一緒に盛り上がる",
        traitWeights: { trait_empathy: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-love-23-b",
        label: "素直に祝福して、穏やかに応援する",
        traitWeights: { trait_agreeableness: 0.5, trait_neuroticism: -0.3 },
      },
      {
        id: "q-love-23-c",
        label: "自分との比較が頭をよぎり、少し複雑になる",
        traitWeights: { trait_neuroticism: 0.4, trait_empathy: 0.2 },
      },
      {
        id: "q-love-23-d",
        label: "相手の努力を認めて、具体的に褒める",
        traitWeights: { trait_conscientiousness: 0.3, trait_empathy: 0.4 },
      },
    ]),
    mcq("q-love-24", "恋愛を通じて、いちばん大切にしたい気持ちは？", [
      {
        id: "q-love-24-a",
        label: "相手への思いやりと、安心できる関係",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-love-24-b",
        label: "互いを尊重し、成長し合える関係",
        traitWeights: { trait_openness: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-love-24-c",
        label: "楽しさと心の通じ合い、自然体でいられる関係",
        traitWeights: { trait_extraversion: 0.3, trait_neuroticism: -0.3 },
      },
      {
        id: "q-love-24-d",
        label: "約束と誠実さに支えられた、信頼できる関係",
        traitWeights: { trait_conscientiousness: 0.5, trait_agreeableness: 0.2 },
      },
    ]),
  ];
}

export function buildGenzQuestionBank(): QuestionBlock[] {
  return [
    mcq("q-genz-1", "放課後の過ごし方で、いちばんしっくりくるのは？", [
      {
        id: "q-genz-1-a",
        label: "まだ行ったことのない場所へ出かけてみる",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-genz-1-b",
        label: "部活や習い事に集中して、自分を高める",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.2 },
      },
      {
        id: "q-genz-1-c",
        label: "友達と集まって、話したり遊んだりする",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-genz-1-d",
        label: "一人で音楽や動画を楽しみ、気持ちを整える",
        traitWeights: { trait_empathy: 0.3, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-genz-2", "新しい趣味や流行に出会ったとき、あなたは？", [
      {
        id: "q-genz-2-a",
        label: "すぐに試して、自分に合うか確かめる",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-genz-2-b",
        label: "友達の感想を聞いてから、始めるか決める",
        traitWeights: { trait_agreeableness: 0.4, trait_empathy: 0.3 },
      },
      {
        id: "q-genz-2-c",
        label: "情報を集めて、じっくり検討してから挑戦する",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-genz-2-d",
        label: "興味はあるが、今の生活を崩したくない",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-genz-3", "将来の進路や夢について、いまの考えに近いのは？", [
      {
        id: "q-genz-3-a",
        label: "まだ幅広く見て、いろいろな可能性を探りたい",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-genz-3-b",
        label: "目標を決めて、計画的に準備を進めたい",
        traitWeights: { trait_conscientiousness: 0.6, trait_openness: 0.2 },
      },
      {
        id: "q-genz-3-c",
        label: "周りの期待より、自分の気持ちを優先したい",
        traitWeights: { trait_empathy: 0.3, trait_openness: 0.4 },
      },
      {
        id: "q-genz-3-d",
        label: "不安はあるが、一歩ずつ前に進みたい",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-genz-4", "授業で初めて取り組むテーマに惹かれるのは？", [
      {
        id: "q-genz-4-a",
        label: "常識を問い直すような、自由な発想が必要な課題",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-genz-4-b",
        label: "調べてまとめる、丁寧な作業が求められる課題",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.2 },
      },
      {
        id: "q-genz-4-c",
        label: "グループで意見を出し合う、協力型の課題",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.4 },
      },
      {
        id: "q-genz-4-d",
        label: "人の気持ちや社会の問題に触れる課題",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
    ]),
    mcq("q-genz-5", "学校行事の企画で、あなたが得意な役割は？", [
      {
        id: "q-genz-5-a",
        label: "斬新なアイデアを出して、企画の方向性を広げる",
        traitWeights: { trait_openness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-genz-5-b",
        label: "段取りや資料づくりを任され、着実に進める",
        traitWeights: { trait_conscientiousness: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-genz-5-c",
        label: "メンバーの意見をまとめて、空気を和らげる",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-genz-5-d",
        label: "司会や広報など、人前に出る役割",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.2 },
      },
    ]),
    mcq("q-genz-6", "テスト前の勉強スタイルで、いちばん近いのは？", [
      {
        id: "q-genz-6-a",
        label: "計画表を作って、科目ごとに時間を配分する",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: 0.2 },
      },
      {
        id: "q-genz-6-b",
        label: "苦手分野を重点的に、効率よく攻略する",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.2 },
      },
      {
        id: "q-genz-6-c",
        label: "友達と教え合いながら、一緒に頑張る",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-genz-6-d",
        label: "直前に集中するが、普段から少しずつ触れる",
        traitWeights: { trait_openness: 0.3, trait_neuroticism: -0.2 },
      },
    ]),
    mcq("q-genz-7", "宿題や課題の提出について、あなたのスタイルは？", [
      {
        id: "q-genz-7-a",
        label: "期限より早めに終えて、余裕を持ちたい",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-genz-7-b",
        label: "質を重視して、見直しの時間を必ず取る",
        traitWeights: { trait_conscientiousness: 0.5, trait_openness: 0.2 },
      },
      {
        id: "q-genz-7-c",
        label: "ギリギリになりがちだが、なんとか仕上げる",
        traitWeights: { trait_neuroticism: 0.3, trait_extraversion: 0.2 },
      },
      {
        id: "q-genz-7-d",
        label: "グループ課題では、自分の役割を確実に果たす",
        traitWeights: { trait_conscientiousness: 0.4, trait_agreeableness: 0.4 },
      },
    ]),
    mcq("q-genz-8", "部活・委員会の活動で、大切にしているのは？", [
      {
        id: "q-genz-8-a",
        label: "練習や準備を欠かさず、成果を出すこと",
        traitWeights: { trait_conscientiousness: 0.6, trait_extraversion: 0.2 },
      },
      {
        id: "q-genz-8-b",
        label: "メンバー全員が楽しめる雰囲気づくり",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-genz-8-c",
        label: "新しいやり方に挑戦して、活動を活性化すること",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
      {
        id: "q-genz-8-d",
        label: "無理なく続けられる、自分のペース",
        traitWeights: { trait_neuroticism: -0.4, trait_agreeableness: 0.2 },
      },
    ]),
    mcq("q-genz-9", "持ち物や教室の席の整理、あなたに近いのは？", [
      {
        id: "q-genz-9-a",
        label: "いつも整えていて、すぐ必要なものが見つかる",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-genz-9-b",
        label: "大切なものだけ決まった場所に置いている",
        traitWeights: { trait_conscientiousness: 0.4, trait_openness: 0.2 },
      },
      {
        id: "q-genz-9-c",
        label: "散らかりがちだが、必要なときは見つけられる",
        traitWeights: { trait_openness: 0.3, trait_extraversion: 0.2 },
      },
      {
        id: "q-genz-9-d",
        label: "友達と荷物を分け合ったり、助け合ったりする",
        traitWeights: { trait_agreeableness: 0.4, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-genz-10", "目標に向けた努力で、いちばん続けやすいのは？", [
      {
        id: "q-genz-10-a",
        label: "毎日の小さな習慣を積み重ねるタイプ",
        traitWeights: { trait_conscientiousness: 0.6, trait_neuroticism: -0.2 },
      },
      {
        id: "q-genz-10-b",
        label: "仲間と励まし合いながら、一緒に頑張るタイプ",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-genz-10-c",
        label: "興味が湧いたときに、一気に集中するタイプ",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
      {
        id: "q-genz-10-d",
        label: "結果が出るまで、気持ちを保つのが難しいタイプ",
        traitWeights: { trait_neuroticism: 0.4, trait_empathy: 0.2 },
      },
    ]),
    mcq("q-genz-11", "休み時間の教室や廊下で、自然としていることは？", [
      {
        id: "q-genz-11-a",
        label: "いろいろなグループを行き来して、話しかける",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-genz-11-b",
        label: "親しい友達と深い話をする",
        traitWeights: { trait_empathy: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-genz-11-c",
        label: "新しい話題やネタを探して、場を盛り上げる",
        traitWeights: { trait_extraversion: 0.5, trait_openness: 0.3 },
      },
      {
        id: "q-genz-11-d",
        label: "本やスマホで一人の時間を楽しむ",
        traitWeights: { trait_openness: 0.3, trait_neuroticism: -0.3 },
      },
    ]),
    mcq("q-genz-12", "文化祭や体育祭など、全校行事でワクワクするのは？", [
      {
        id: "q-genz-12-a",
        label: "会場の盛り上がりや、みんなの一体感",
        traitWeights: { trait_extraversion: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-genz-12-b",
        label: "自分のクラスやチームが目標を達成する瞬間",
        traitWeights: { trait_conscientiousness: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-genz-12-c",
        label: "普段と違う役割や衣装で、新しい自分を出すこと",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.3 },
      },
      {
        id: "q-genz-12-d",
        label: "友達や後輩を支えて、うまくいくよう助けること",
        traitWeights: { trait_agreeableness: 0.5, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-genz-13", "初対面のクラスメイトに話しかけるとき、あなたは？", [
      {
        id: "q-genz-13-a",
        label: "自分から声をかけて、会話を始める",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-genz-13-b",
        label: "相手の様子を見て、タイミングを待つ",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-genz-13-c",
        label: "共通の話題を探して、自然に距離を縮める",
        traitWeights: { trait_openness: 0.4, trait_extraversion: 0.3 },
      },
      {
        id: "q-genz-13-d",
        label: "緊張するが、必要なときは勇気を出す",
        traitWeights: { trait_neuroticism: 0.3, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-genz-14", "グループチャットでの自分のスタイルは？", [
      {
        id: "q-genz-14-a",
        label: "積極的に返信して、会話を続ける",
        traitWeights: { trait_extraversion: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-genz-14-b",
        label: "必要なときだけ、要点を伝える",
        traitWeights: { trait_conscientiousness: 0.3, trait_neuroticism: -0.2 },
      },
      {
        id: "q-genz-14-c",
        label: "相手の話に共感して、気持ちに寄り添う",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-genz-14-d",
        label: "スタンプや画像で、軽やかに雰囲気を出す",
        traitWeights: { trait_openness: 0.4, trait_extraversion: 0.3 },
      },
    ]),
    mcq("q-genz-15", "友達の輪に新しい人が入ってきたとき、あなたは？", [
      {
        id: "q-genz-15-a",
        label: "歓迎して、話題に加えようとする",
        traitWeights: { trait_extraversion: 0.5, trait_agreeableness: 0.4 },
      },
      {
        id: "q-genz-15-b",
        label: "相手が馴染めるよう、さりげなくフォローする",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-genz-15-c",
        label: "様子を見ながら、無理に距離を詰めない",
        traitWeights: { trait_neuroticism: -0.3, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-genz-15-d",
        label: "自分の交友関係はそのまま、別の軸で関わる",
        traitWeights: { trait_openness: 0.3, trait_conscientiousness: 0.3 },
      },
    ]),
    mcq("q-genz-16", "クラスで意見が割れたとき、あなたの役割は？", [
      {
        id: "q-genz-16-a",
        label: "双方の気持ちを聞いて、落としどころを探す",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-genz-16-b",
        label: "自分の考えをはっきり伝えて、議論を進める",
        traitWeights: { trait_extraversion: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-genz-16-c",
        label: "争いを広げないよう、空気を和らげる",
        traitWeights: { trait_agreeableness: 0.5, trait_neuroticism: -0.2 },
      },
      {
        id: "q-genz-16-d",
        label: "事実を整理して、冷静な判断を促す",
        traitWeights: { trait_conscientiousness: 0.4, trait_empathy: 0.2 },
      },
    ]),
    mcq("q-genz-17", "友達が悩みを打ち明けてきたとき、最初の反応は？", [
      {
        id: "q-genz-17-a",
        label: "まず話を最後まで聞いて、気持ちを受け止める",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-genz-17-b",
        label: "一緒に解決策を考えて、前向きに動く",
        traitWeights: { trait_conscientiousness: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-genz-17-c",
        label: "気分転換になる提案をして、元気づける",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-genz-17-d",
        label: "深刻になりすぎず、適度な距離で支える",
        traitWeights: { trait_neuroticism: -0.3, trait_empathy: 0.3 },
      },
    ]),
    mcq("q-genz-18", "クラスメイトとの小さな摩擦が起きたとき、あなたは？", [
      {
        id: "q-genz-18-a",
        label: "相手の立場を考えて、歩み寄る",
        traitWeights: { trait_agreeableness: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-genz-18-b",
        label: "自分の気持ちも伝えて、誤解を解く",
        traitWeights: { trait_extraversion: 0.3, trait_openness: 0.3 },
      },
      {
        id: "q-genz-18-c",
        label: "時間をおいて、落ち着いてから話す",
        traitWeights: { trait_conscientiousness: 0.3, trait_neuroticism: -0.3 },
      },
      {
        id: "q-genz-18-d",
        label: "気になって、つい考え込んでしまう",
        traitWeights: { trait_neuroticism: 0.4, trait_empathy: 0.2 },
      },
    ]),
    mcq("q-genz-19", "いじめや排除の兆候を感じたとき、あなたは？", [
      {
        id: "q-genz-19-a",
        label: "困っている人に寄り添い、声をかける",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-genz-19-b",
        label: "先生や信頼できる人に、相談する",
        traitWeights: { trait_conscientiousness: 0.4, trait_agreeableness: 0.3 },
      },
      {
        id: "q-genz-19-c",
        label: "場の空気を変えようと、自然にフォローする",
        traitWeights: { trait_extraversion: 0.3, trait_agreeableness: 0.4 },
      },
      {
        id: "q-genz-19-d",
        label: "怖さもあるが、見て見ぬふりはしたくない",
        traitWeights: { trait_neuroticism: 0.3, trait_empathy: 0.4 },
      },
    ]),
    mcq("q-genz-20", "先生や大人に意見を伝える必要があるとき、あなたは？", [
      {
        id: "q-genz-20-a",
        label: "礼儀を守りつつ、自分の考えを丁寧に伝える",
        traitWeights: { trait_agreeableness: 0.5, trait_conscientiousness: 0.3 },
      },
      {
        id: "q-genz-20-b",
        label: "勇気を出して、はっきり意見を述べる",
        traitWeights: { trait_extraversion: 0.4, trait_openness: 0.3 },
      },
      {
        id: "q-genz-20-c",
        label: "内容を整理してから、落ち着いて話す",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
      {
        id: "q-genz-20-d",
        label: "相手の反応が気になり、言い方を工夫する",
        traitWeights: { trait_empathy: 0.4, trait_neuroticism: 0.2 },
      },
    ]),
    mcq("q-genz-21", "テストの結果が思わしくなかったとき、あなたは？", [
      {
        id: "q-genz-21-a",
        label: "ショックを受けて、しばらく落ち込む",
        traitWeights: { trait_neuroticism: 0.6, trait_empathy: 0.2 },
      },
      {
        id: "q-genz-21-b",
        label: "原因を分析して、次の対策を立てる",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
      {
        id: "q-genz-21-c",
        label: "友達に話して、気持ちを軽くする",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.2 },
      },
      {
        id: "q-genz-21-d",
        label: "一度切り替えて、前を向いて再挑戦する",
        traitWeights: { trait_neuroticism: -0.4, trait_openness: 0.2 },
      },
    ]),
    mcq("q-genz-22", "進路や将来の話題が出ると、気分はどうなりますか？", [
      {
        id: "q-genz-22-a",
        label: "不安が強くなり、つい考え込んでしまう",
        traitWeights: { trait_neuroticism: 0.6, trait_conscientiousness: 0.2 },
      },
      {
        id: "q-genz-22-b",
        label: "ワクワクもあるが、決めきれないこともある",
        traitWeights: { trait_openness: 0.4, trait_neuroticism: 0.2 },
      },
      {
        id: "q-genz-22-c",
        label: "計画を立てれば大丈夫と、自分を励ます",
        traitWeights: { trait_conscientiousness: 0.4, trait_neuroticism: -0.3 },
      },
      {
        id: "q-genz-22-d",
        label: "親しい人に相談して、気持ちを整理する",
        traitWeights: { trait_empathy: 0.3, trait_extraversion: 0.3 },
      },
    ]),
    mcq("q-genz-23", "友達関係の変化や距離を感じたとき、あなたは？", [
      {
        id: "q-genz-23-a",
        label: "つい心配になり、何度も考えてしまう",
        traitWeights: { trait_neuroticism: 0.5, trait_empathy: 0.3 },
      },
      {
        id: "q-genz-23-b",
        label: "相手の事情を想像して、待つことを選ぶ",
        traitWeights: { trait_empathy: 0.5, trait_agreeableness: 0.3 },
      },
      {
        id: "q-genz-23-c",
        label: "自然な変化だと受け止め、新しい関係も楽しむ",
        traitWeights: { trait_neuroticism: -0.4, trait_openness: 0.3 },
      },
      {
        id: "q-genz-23-d",
        label: "率直に聞いて、誤解を解こうとする",
        traitWeights: { trait_extraversion: 0.4, trait_conscientiousness: 0.2 },
      },
    ]),
    mcq("q-genz-24", "高校生活を振り返るとき、いちばん誇りたいのは？", [
      {
        id: "q-genz-24-a",
        label: "困っている人に寄り添えたこと",
        traitWeights: { trait_empathy: 0.6, trait_agreeableness: 0.2 },
      },
      {
        id: "q-genz-24-b",
        label: "目標に向かって、最後まで努力したこと",
        traitWeights: { trait_conscientiousness: 0.5, trait_neuroticism: -0.2 },
      },
      {
        id: "q-genz-24-c",
        label: "新しいことに挑戦して、自分を広げたこと",
        traitWeights: { trait_openness: 0.5, trait_extraversion: 0.2 },
      },
      {
        id: "q-genz-24-d",
        label: "友達とたくさん笑い合えた、あの時間",
        traitWeights: { trait_extraversion: 0.4, trait_agreeableness: 0.3 },
      },
    ]),
  ];
}
