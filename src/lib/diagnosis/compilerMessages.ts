/** 診断コンパイラ・Zustand ストア向けの日本語メッセージ集 */

export const COMPILER_ERROR_MESSAGES = {
  missingDefinition: "診断定義が読み込まれていません。ページを再読み込みしてください。",
  invalidAnswerTarget: "回答対象の質問が見つかりませんでした。",
  transitionBlocked: "画面切り替え中のため、操作を受け付けられません。",
  missingResultArchetype: "結果テンプレートに少なくとも1つのアーキタイプが必要です。",
  incompleteAnswers: "未回答の設問があります。すべての質問にお答えください。",
} as const;

export const COMPILER_UI_MESSAGES = {
  introStart: "診断をはじめる",
  introDuration: (minutes: number) => `約${minutes}分`,
  progressLabel: "診断の進捗",
  nextQuestion: "次の質問へ",
  feedbackBadge: "あなたへのメッセージ",
  resultBadge: "診断結果",
  restart: "もう一度診断する",
  shareLead: "結果をシェア",
  copied: "コピー済",
  radarSectionTitle: "5因子プロフィール",
  radarSectionLead: "あなたの回答から算出された、5つの性格次元です。",
  analysisSectionTitle: "詳しい行動傾向の分析",
  analysisSectionLead:
    "LibertyCanvas 独自のアルゴリズムが、学術的5因子モデルに基づいて読み解いた結果です。",
  archetypeSectionTitle: "あなたのオリジナル・アーキタイプ",
  compatibilitySectionTitle: "相性のヒント",
  shareXLabel: "X（旧Twitter）でシェア",
  shareCopyLabel: "結果文面をコピー",
  shareLinkLabel: "リンクをコピー",
  shareSaveLabel: "結果を保存",
} as const;

export function buildDefaultAffirmation(choiceLabel: string): string {
  return `「${choiceLabel}」— 素敵な選択ですね。あなたらしさがしっかり伝わってきます。`;
}

export function buildAffirmationFromTemplate(
  template: string,
  choiceLabel: string,
): string {
  return template.replaceAll("{choice}", choiceLabel);
}

export const AI_PROMPT_CONTEXT_JA = {
  systemContext:
    "あなたはLibertyCanvasの診断アドバイザーです。温かく、丁寧な日本語（です・ます調）で、ユーザーの診断結果に寄り添ったアドバイスを提供してください。商標性のある性格診断名称（MBTI、エニアグラム等）は使用しないでください。",
  temperatureHint: "共感を最優先し、断定しすぎない表現を心がけてください。",
  responseFormat: "見出しは短く、本文は2〜4段落、箇条書きは最大3項目まで。",
} as const;
