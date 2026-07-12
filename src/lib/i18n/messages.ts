import type { Locale } from "@/lib/i18n/config";

export interface LikertMessages {
  stronglyDisagree: string;
  disagree: string;
  slightlyDisagree: string;
  neutral: string;
  slightlyAgree: string;
  agree: string;
  stronglyAgree: string;
  anchorLow: string;
  anchorHigh: string;
  instructions: string;
}

export interface CommonMessages {
  localeLabel: string;
  send: string;
  sending: string;
}

export interface NavMessages {
  hub: string;
  hubShort: string;
  assessment: string;
  assessmentShort: string;
  diagnosis: string;
  diagnosisShort: string;
  create: string;
  createShort: string;
}

export interface RubelPlayMessages {
  brandTitle: string;
  hub: string;
  typing: string;
  send: string;
  sendAria: string;
  customPromptLabel: string;
  customPromptPlaceholder: string;
  chatPlaceholder: string;
  questionOf: string;
  optionA: string;
  optionB: string;
  revealTitle: string;
  resultLabel: string;
  brandStoryHeading: string;
  trendingLabel: string;
  canvasNotFound: string;
  canvasNotFoundHint: string;
  backToHub: string;
  loading: string;
  retake: string;
  tabAll: string;
  tabAnimal: string;
  tabCareer: string;
  tabEntertainment: string;
  introChat: (name: string, summary: string) => string;
}

export interface FeedMessages {
  play: string;
  questionSingular: string;
  questionPlural: string;
  personaSingular: string;
  personaPlural: string;
  trending: (plays: string) => string;
}

export interface HeaderMessages {
  brandTitle: string;
  create: string;
  displayLanguage: string;
}

export interface GdprMessages {
  title: string;
  description: string;
  essentialOnly: string;
  acceptAll: string;
  essentialAria: string;
  acceptAllAria: string;
  consentFlag: string;
}

export interface CreatorTraitLabels {
  openness: string;
  empathy_need: string;
  ego: string;
}

export interface CreatorMessages {
  pageSubtitle: string;
  badge: string;
  title: string;
  lead: string;
  stepBasics: string;
  stepQuestions: string;
  stepResults: string;
  stepPublish: string;
  diagnosisTitleLabel: string;
  diagnosisTitlePlaceholder: string;
  creatorLanguageLabel: string;
  questionLabel: (index: number) => string;
  questionPlaceholder: string;
  optionPlaceholder: (index: number) => string;
  advancedScoringTitle: string;
  advancedScoringSubtitle: string;
  addQuestion: string;
  unnamed: string;
  resultNameLabel: string;
  aiToneLabel: string;
  therapyModeLabel: string;
  advancedBaselineTitle: string;
  advancedBaselineSubtitle: string;
  readyToPublish: string;
  summaryTitle: string;
  summaryQuestions: string;
  summaryResults: string;
  publishing: string;
  publishButton: string;
  publishSuccess: (id: string) => string;
  publishLocal: (id: string) => string;
  playNow: string;
  back: string;
  continue: string;
  errorNoTitle: string;
  errorIncompleteQuestions: string;
  errorIncompleteResults: string;
  errorPublishFailed: string;
  toneGal: string;
  toneMentor: string;
  toneTsundere: string;
  tonePrincess: string;
  therapyPraise: string;
  therapyCoaching: string;
  therapyMirror: string;
  traits: CreatorTraitLabels;
}

export interface PlugBridgeMessages {
  ariaLabel: string;
  eyebrow: string;
  title: string;
  lead: string;
  cta: string;
}


export interface DiscoverFunnelMessages {
  skipToQuiz: string;
  handoffEyebrow: string;
  handoffTitle: string;
  handoffLead: string;
  yourAnswerLabel: string;
  localeBadge: string;
}

export interface CompilerIntroMessages {
  startLabel: (minutes: number) => string;
  tagsGroupAria: string;
}

export interface LocaleMessages {
  likert: LikertMessages;
  common: CommonMessages;
  nav: NavMessages;
  rubelPlay: RubelPlayMessages;
  plugBridge: PlugBridgeMessages;
  discoverFunnel: DiscoverFunnelMessages;
  compilerIntro: CompilerIntroMessages;
  feed: FeedMessages;
  header: HeaderMessages;
  gdpr: GdprMessages;
  creator: CreatorMessages;
}

const NAV_EN: NavMessages = {
  hub: "Discover",
  hubShort: "Hub",
  assessment: "Cosmic AI Diagnosis",
  assessmentShort: "Cosmic",
  diagnosis: "Catalog",
  diagnosisShort: "Catalog",
  create: "Create",
  createShort: "Create",
};

const NAV_JA: NavMessages = {
  hub: "ホーム",
  hubShort: "Home",
  assessment: "宇宙AI診断",
  assessmentShort: "宇宙",
  diagnosis: "カタログ",
  diagnosisShort: "一覧",
  create: "作る",
  createShort: "作る",
};

const PLUG_BRIDGE_EN: PlugBridgeMessages = {
  ariaLabel: "Deep cosmic diagnosis recommendation",
  eyebrow: "LibertyCanvas · Freedom",
  title: "Discover your cosmic character",
  lead: "Take a full Plug diagnosis — cosmic planet results, AI advice, and share cards await.",
  cta: "Try the cosmic diagnosis →",
};

const DISCOVER_FUNNEL_EN: DiscoverFunnelMessages = {
  skipToQuiz: "Start the full quiz without writing →",
  handoffEyebrow: "LibertyCanvas · Discover",
  handoffTitle: "Your answer is ready for the cosmic diagnosis",
  handoffLead: "We kept your words and language — tap below to begin.",
  yourAnswerLabel: "Your answer",
  localeBadge: "Language",
};

const COMPILER_INTRO_EN: CompilerIntroMessages = {
  startLabel: (minutes) => `Start diagnosis (~${minutes} min)`,
  tagsGroupAria: "Diagnosis tags",
};

const PLUG_BRIDGE_JA: PlugBridgeMessages = {
  ariaLabel: "本格宇宙診断へのおすすめ",
  eyebrow: "LibertyCanvas · 自由",
  title: "あなたの宇宙キャラクターを見つけよう",
  lead: "会話型Plug診断なら、宇宙キャラ結果・AIアドバイス・シェアカードが楽しめます。",
  cta: "宇宙診断をはじめる →",
};

const DISCOVER_FUNNEL_JA: DiscoverFunnelMessages = {
  skipToQuiz: "入力せずに診断をはじめる →",
  handoffEyebrow: "LibertyCanvas · Discover",
  handoffTitle: "あなたの回答を宇宙診断へ引き継ぎました",
  handoffLead: "言語と回答を保持したまま — 下のボタンで診断開始。",
  yourAnswerLabel: "あなたの回答",
  localeBadge: "表示言語",
};

const COMPILER_INTRO_JA: CompilerIntroMessages = {
  startLabel: (minutes) => `診断をはじめる（約${minutes}分）`,
  tagsGroupAria: "診断タグ",
};

const NAV_KO: NavMessages = {
  hub: "홈",
  hubShort: "Home",
  assessment: "우주 AI 진단",
  assessmentShort: "우주",
  diagnosis: "카탈로그",
  diagnosisShort: "목록",
  create: "만들기",
  createShort: "만들기",
};

const NAV_ZH: NavMessages = {
  hub: "首页",
  hubShort: "Home",
  assessment: "宇宙 AI 诊断",
  assessmentShort: "宇宙",
  diagnosis: "目录",
  diagnosisShort: "目录",
  create: "创建",
  createShort: "创建",
};

const PLUG_BRIDGE_KO: PlugBridgeMessages = {
  ariaLabel: "본격 우주 진단 추천",
  eyebrow: "LibertyCanvas · 자유",
  title: "당신의 우주 캐릭터를 찾아보세요",
  lead: "Plug 진단으로 우주 캐릭터 결과, AI 조언, 공유 카드를 즐길 수 있어요.",
  cta: "우주 진단 시작 →",
};

const DISCOVER_FUNNEL_KO: DiscoverFunnelMessages = {
  skipToQuiz: "입력 없이 전체 검사 시작 →",
  handoffEyebrow: "LibertyCanvas · Discover",
  handoffTitle: "답변이 우주 진단으로 이어집니다",
  handoffLead: "언어와 답변을 유지했습니다 — 아래에서 시작하세요.",
  yourAnswerLabel: "내 답변",
  localeBadge: "표시 언어",
};

const COMPILER_INTRO_KO: CompilerIntroMessages = {
  startLabel: (minutes) => `진단 시작 (~${minutes}분)`,
  tagsGroupAria: "진단 태그",
};

const PLUG_BRIDGE_ZH: PlugBridgeMessages = {
  ariaLabel: "深度宇宙诊断推荐",
  eyebrow: "LibertyCanvas · 自由",
  title: "发现你的宇宙角色",
  lead: "Plug 对话型诊断 — 宇宙角色结果、AI 建议与分享卡片。",
  cta: "开始宇宙诊断 →",
};

const DISCOVER_FUNNEL_ZH: DiscoverFunnelMessages = {
  skipToQuiz: "不写回答，直接开始完整测验 →",
  handoffEyebrow: "LibertyCanvas · Discover",
  handoffTitle: "你的回答已接入宇宙诊断",
  handoffLead: "已保留语言与回答 — 点击下方开始。",
  yourAnswerLabel: "你的回答",
  localeBadge: "显示语言",
};

const COMPILER_INTRO_ZH: CompilerIntroMessages = {
  startLabel: (minutes) => `开始诊断（约 ${minutes} 分钟）`,
  tagsGroupAria: "诊断标签",
};

const PLAY_EN: RubelPlayMessages = {
  brandTitle: "LibertyCanvas",
  hub: "Hub",
  typing: "Typing…",
  send: "Send",
  sendAria: "Send message",
  customPromptLabel: "🎨 Paint Your Own Persona (Custom prompt for the AI)",
  customPromptPlaceholder:
    'e.g. "Act like an anime ninja" or "Talk like a supportive mother"',
  chatPlaceholder: "Message your Rubel Canvas companion…",
  questionOf: "Question",
  optionA: "Option A",
  optionB: "Option B",
  revealTitle: "Analyzing your soul…",
  resultLabel: "Your Rubel Canvas Type",
  brandStoryHeading: "Brand Story · E-E-A-T",
  trendingLabel: "Trending on liberty-canvas",
  canvasNotFound: "Diagnosis not found",
  canvasNotFoundHint:
    "This quiz may have been removed or is only available on the device where it was created.",
  backToHub: "Back to Discovery Hub",
  loading: "Loading diagnosis…",
  retake: "Retake quiz",
  tabAll: "All trends",
  tabAnimal: "Animals",
  tabCareer: "Career",
  tabEntertainment: "Fandom",
  introChat: (name, summary) =>
    `You're "${name}" — ${summary} Let's talk on Rubel Canvas.`,
};

const PLAY_JA: RubelPlayMessages = {
  brandTitle: "ルベルキャンバス",
  hub: "Hub",
  typing: "入力中…",
  send: "送信",
  sendAria: "メッセージを送信",
  customPromptLabel: "🎨 Paint Your Own Persona（AIへのカスタムプロンプト）",
  customPromptPlaceholder:
    "例：「アニメの忍者みたいに話して」「寄り添うお母さんトーンで」",
  chatPlaceholder: "ルベルキャンバス AI にメッセージ…",
  questionOf: "質問",
  optionA: "選択肢 A",
  optionB: "選択肢 B",
  revealTitle: "あなたの魂を解析中…",
  resultLabel: "あなたの Rubel Canvas タイプ",
  brandStoryHeading: "ブランドストーリー · E-E-A-T",
  trendingLabel: "liberty-canvas で急上昇",
  canvasNotFound: "診断が見つかりません",
  canvasNotFoundHint:
    "この診断は削除されたか、作成した端末でのみ利用可能です。",
  backToHub: "診断一覧に戻る",
  loading: "診断を読み込み中…",
  retake: "もう一度診断する",
  tabAll: "全体トレンド",
  tabAnimal: "動物系",
  tabCareer: "職業・ガチ診断",
  tabEntertainment: "推し活・エンタメ",
  introChat: (name, summary) =>
    `結果は「${name}」！${summary} ルベルキャンバスで語り合お？`,
};

const PLAY_KO: RubelPlayMessages = {
  ...PLAY_EN,
  brandTitle: "LibertyCanvas",
  hub: "허브",
  revealTitle: "결과 분석 중…",
  customPromptPlaceholder: "캐릭터 톤 (예: 츤데레)",
  chatPlaceholder: "메시지 입력…",
  backToHub: "허브로",
  retake: "다시 하기",
};

const PLAY_ZH: RubelPlayMessages = {
  ...PLAY_EN,
  brandTitle: "LibertyCanvas",
  hub: "首页",
  revealTitle: "正在解析结果…",
  customPromptPlaceholder: "角色语气（例：傲娇）",
  chatPlaceholder: "输入消息…",
  backToHub: "返回首页",
  retake: "重新测试",
};

const FEED_EN: FeedMessages = {
  play: "Play",
  questionSingular: "question",
  questionPlural: "questions",
  personaSingular: "persona",
  personaPlural: "personas",
  trending: (plays) => `Trending · ${plays} plays`,
};

const FEED_JA: FeedMessages = {
  play: "プレイ",
  questionSingular: "問",
  questionPlural: "問",
  personaSingular: "タイプ",
  personaPlural: "タイプ",
  trending: (plays) => `急上昇 · ${plays}回プレイ`,
};

const HEADER_EN: HeaderMessages = {
  brandTitle: "Rubel Canvas",
  create: "Create",
  displayLanguage: "Display language",
};

const HEADER_JA: HeaderMessages = {
  brandTitle: "ルベルキャンバス",
  create: "作成",
  displayLanguage: "表示言語",
};

const GDPR_EN: GdprMessages = {
  title: "Privacy & Cookie Settings",
  description:
    "Essential storage always runs for quiz progress. Analytics cookies are optional and help us improve quality. Core features work with essential-only.",
  essentialOnly: "Essential Only",
  acceptAll: "Accept All",
  essentialAria: "Accept essential cookies only",
  acceptAllAria: "Accept essential and analytics cookies",
  consentFlag: "Current consent flag",
};

const GDPR_JA: GdprMessages = {
  title: "プライバシーと Cookie の設定",
  description:
    "診断の進行に必要な保存は常に利用します。分析 Cookie は品質改善のために任意で利用します。必須のみを選んでも、すべてのコア機能は利用できます。",
  essentialOnly: "必須のみ",
  acceptAll: "すべて許可",
  essentialAria: "必須 Cookie のみ許可",
  acceptAllAria: "必須 Cookie と分析 Cookie を許可",
  consentFlag: "現在の同意フラグ",
};

const CREATOR_EN: CreatorMessages = {
  pageSubtitle: "Create diagnosis",
  badge: "Creator Wizard",
  title: "Build a Diagnosis",
  lead: "One screen, one task. Advanced tuning stays tucked away.",
  stepBasics: "Basics",
  stepQuestions: "Questions",
  stepResults: "Results",
  stepPublish: "Publish",
  diagnosisTitleLabel: "Diagnosis title",
  diagnosisTitlePlaceholder: "What Level of Introvert Are You?",
  creatorLanguageLabel: "Creator language",
  questionLabel: (index) => `Question ${index}`,
  questionPlaceholder: "How do you spend your weekends?",
  optionPlaceholder: (index) => `Option ${index}`,
  advancedScoringTitle: "Advanced scoring multipliers",
  advancedScoringSubtitle: "Hidden trait weights per option",
  addQuestion: "Add another question",
  unnamed: "Unnamed",
  resultNameLabel: "Result name",
  aiToneLabel: "AI tone",
  therapyModeLabel: "Therapy mode",
  advancedBaselineTitle: "Advanced baseline profile",
  advancedBaselineSubtitle: "Fine-tune trait matching targets",
  readyToPublish: "Ready to publish",
  summaryTitle: "Title",
  summaryQuestions: "Questions",
  summaryResults: "Results",
  publishing: "Publishing…",
  publishButton: "Publish to Global Canvas",
  publishSuccess: (id) => `Published · ${id}`,
  publishLocal: (id) => `Saved locally · ${id}`,
  playNow: "Play now →",
  back: "Back",
  continue: "Continue",
  errorNoTitle: "Give your diagnosis a title.",
  errorIncompleteQuestions: "Fill in every question and both options.",
  errorIncompleteResults: "Name every result type.",
  errorPublishFailed: "Publish failed",
  toneGal: "Gal",
  toneMentor: "Mentor",
  toneTsundere: "Tsundere",
  tonePrincess: "Princess",
  therapyPraise: "Unconditional Praise",
  therapyCoaching: "Strict Coaching",
  therapyMirror: "Emotional Mirror",
  traits: {
    openness: "Openness",
    empathy_need: "Empathy Need",
    ego: "Ego",
  },
};

const CREATOR_JA: CreatorMessages = {
  pageSubtitle: "診断を作成",
  badge: "クリエイターウィザード",
  title: "オリジナル診断を作る",
  lead: "1画面1タスク。高度な設定は折りたたみ式。",
  stepBasics: "基本",
  stepQuestions: "質問",
  stepResults: "結果",
  stepPublish: "公開",
  diagnosisTitleLabel: "診断タイトル",
  diagnosisTitlePlaceholder: "あなたの内向性レベルは？",
  creatorLanguageLabel: "診断の言語",
  questionLabel: (index) => `質問 ${index}`,
  questionPlaceholder: "週末はどう過ごしますか？",
  optionPlaceholder: (index) => `選択肢 ${index}`,
  advancedScoringTitle: "高度なスコア倍率",
  advancedScoringSubtitle: "選択肢ごとの特性ウェイト（非表示）",
  addQuestion: "質問を追加",
  unnamed: "未命名",
  resultNameLabel: "結果タイプ名",
  aiToneLabel: "AI の話し方",
  therapyModeLabel: "セラピーモード",
  advancedBaselineTitle: "高度なベースライン",
  advancedBaselineSubtitle: "タイプ判定の特性ターゲットを調整",
  readyToPublish: "公開の準備完了",
  summaryTitle: "タイトル",
  summaryQuestions: "質問数",
  summaryResults: "結果タイプ数",
  publishing: "公開中…",
  publishButton: "グローバルキャンバスに公開",
  publishSuccess: (id) => `公開しました · ${id}`,
  publishLocal: (id) => `端末に保存しました · ${id}`,
  playNow: "今すぐプレイ →",
  back: "戻る",
  continue: "次へ",
  errorNoTitle: "診断タイトルを入力してください。",
  errorIncompleteQuestions: "すべての質問と選択肢を入力してください。",
  errorIncompleteResults: "すべての結果タイプ名を入力してください。",
  errorPublishFailed: "公開に失敗しました",
  toneGal: "ギャル",
  toneMentor: "メンター",
  toneTsundere: "ツンデレ",
  tonePrincess: "お姫様",
  therapyPraise: "無条件ほめ",
  therapyCoaching: "厳しめコーチ",
  therapyMirror: "感情ミラー",
  traits: {
    openness: "開放性",
    empathy_need: "共感欲求",
    ego: "自我",
  },
};

const PLAY_FR: RubelPlayMessages = {
  ...PLAY_EN,
  brandTitle: "Rubel Canvas",
  typing: "Saisie…",
  send: "Envoyer",
  sendAria: "Envoyer le message",
  customPromptLabel: "🎨 Personnalisez votre persona (prompt IA)",
  chatPlaceholder: "Message à votre companion Rubel Canvas…",
  questionOf: "Question",
  optionA: "Option A",
  optionB: "Option B",
  revealTitle: "Analyse de l'âme…",
  resultLabel: "Votre type Rubel Canvas",
  brandStoryHeading: "Histoire de marque · E-E-A-T",
  trendingLabel: "Tendances sur liberty-canvas",
  canvasNotFound: "Diagnostic introuvable",
  canvasNotFoundHint: "Ce quiz a peut-être été supprimé.",
  backToHub: "Retour au hub",
  loading: "Chargement…",
  retake: "Refaire le quiz",
  tabAll: "Tendances",
  tabAnimal: "Animaux",
  tabCareer: "Carrière",
  tabEntertainment: "Fandom",
  introChat: (name, summary) =>
    `Résultat : « ${name} » — ${summary} Discutons sur Rubel Canvas.`,
};

const MESSAGES: Record<Locale, LocaleMessages> = {
  en: {
    likert: {
      stronglyDisagree: "Strongly Disagree",
      disagree: "Disagree",
      slightlyDisagree: "Slightly Disagree",
      neutral: "Neutral",
      slightlyAgree: "Slightly Agree",
      agree: "Agree",
      stronglyAgree: "Strongly Agree",
      anchorLow: "− Less aligned",
      anchorHigh: "+ More aligned",
      instructions:
        "Seven-point scale from minus three to plus three. Colors are decorative; rely on numbers and plus/minus symbols. Use arrow keys and Enter or Space to select.",
    },
    common: {
      localeLabel: "Language",
      send: "Send",
      sending: "Sending...",
    },
    nav: NAV_EN,
    rubelPlay: PLAY_EN,
    plugBridge: PLUG_BRIDGE_EN,
    discoverFunnel: DISCOVER_FUNNEL_EN,
    compilerIntro: COMPILER_INTRO_EN,
    feed: FEED_EN,
    header: HEADER_EN,
    gdpr: GDPR_EN,
    creator: CREATOR_EN,
  },
  ja: {
    likert: {
      stronglyDisagree: "強くそう思わない",
      disagree: "そう思わない",
      slightlyDisagree: "ややそう思わない",
      neutral: "どちらでもない",
      slightlyAgree: "ややそう思う",
      agree: "そう思う",
      stronglyAgree: "強くそう思う",
      anchorLow: "− 低い一致",
      anchorHigh: "+ 高い一致",
      instructions:
        "−3 から +3 までの7段階です。色は補助情報です。数字と +/− 記号を参照してください。矢印キーと Enter または Space で選択します。",
    },
    common: {
      localeLabel: "言語",
      send: "送信",
      sending: "送信中...",
    },
    nav: NAV_JA,
    rubelPlay: PLAY_JA,
    plugBridge: PLUG_BRIDGE_JA,
    discoverFunnel: DISCOVER_FUNNEL_JA,
    compilerIntro: COMPILER_INTRO_JA,
    feed: FEED_JA,
    header: HEADER_JA,
    gdpr: GDPR_JA,
    creator: CREATOR_JA,
  },
  ko: {
    likert: {
      stronglyDisagree: "전혀 그렇지 않다",
      disagree: "그렇지 않다",
      slightlyDisagree: "약간 그렇지 않다",
      neutral: "보통",
      slightlyAgree: "약간 그렇다",
      agree: "그렇다",
      stronglyAgree: "매우 그렇다",
      anchorLow: "− 낮은 일치",
      anchorHigh: "+ 높은 일치",
      instructions:
        "−3에서 +3까지 7단계 척도입니다. 색상은 보조 정보이며 숫자와 +/− 기호를 참고하세요.",
    },
    common: { localeLabel: "언어", send: "보내기", sending: "전송 중..." },
    nav: NAV_KO,
    rubelPlay: PLAY_KO,
    plugBridge: PLUG_BRIDGE_KO,
    discoverFunnel: DISCOVER_FUNNEL_KO,
    compilerIntro: COMPILER_INTRO_KO,
    feed: FEED_EN,
    header: { ...HEADER_EN, brandTitle: "LibertyCanvas", create: "만들기" },
    gdpr: GDPR_EN,
    creator: CREATOR_EN,
  },
  zh: {
    likert: {
      stronglyDisagree: "非常不同意",
      disagree: "不同意",
      slightlyDisagree: "有点不同意",
      neutral: "中立",
      slightlyAgree: "有点同意",
      agree: "同意",
      stronglyAgree: "非常同意",
      anchorLow: "− 低一致",
      anchorHigh: "+ 高一致",
      instructions: "−3 到 +3 的七级量表。颜色为辅助信息，请参考数字与 +/− 符号。",
    },
    common: { localeLabel: "语言", send: "发送", sending: "发送中..." },
    nav: NAV_ZH,
    rubelPlay: PLAY_ZH,
    plugBridge: PLUG_BRIDGE_ZH,
    discoverFunnel: DISCOVER_FUNNEL_ZH,
    compilerIntro: COMPILER_INTRO_ZH,
    feed: FEED_EN,
    header: { ...HEADER_EN, brandTitle: "LibertyCanvas", create: "创建" },
    gdpr: GDPR_EN,
    creator: CREATOR_EN,
  },
  ar: {
    likert: {
      stronglyDisagree: "لا أوافق بشدة",
      disagree: "لا أوافق",
      slightlyDisagree: "لا أوافق قليلاً",
      neutral: "محايد",
      slightlyAgree: "أوافق قليلاً",
      agree: "أوافق",
      stronglyAgree: "أوافق بشدة",
      anchorLow: "− توافق أقل",
      anchorHigh: "+ توافق أعلى",
      instructions:
        "مقياس من −3 إلى +3. الألوان للتوضيح فقط؛ اعتمد على الأرقام ورموز +/−. استخدم أسهم لوحة المفاتيح و Enter أو Space للاختيار.",
    },
    common: {
      localeLabel: "اللغة",
      send: "إرسال",
      sending: "جارٍ الإرسال...",
    },
    nav: NAV_EN,
    rubelPlay: PLAY_EN,
    plugBridge: PLUG_BRIDGE_EN,
    discoverFunnel: DISCOVER_FUNNEL_EN,
    compilerIntro: COMPILER_INTRO_EN,
    feed: FEED_EN,
    header: HEADER_EN,
    gdpr: GDPR_EN,
    creator: CREATOR_EN,
  },
  he: {
    likert: {
      stronglyDisagree: "ממש לא מסכים",
      disagree: "לא מסכים",
      slightlyDisagree: "קצת לא מסכים",
      neutral: "ניטרלי",
      slightlyAgree: "קצת מסכים",
      agree: "מסכים",
      stronglyAgree: "מסכים מאוד",
      anchorLow: "− התאמה נמוכה",
      anchorHigh: "+ התאמה גבוהה",
      instructions:
        "סולם מ־−3 עד +3. הצבעים לעזרה בלבד; הסתמך על מספרים וסימני +/−. השתמש בחיצים וב-Enter או Space לבחירה.",
    },
    common: {
      localeLabel: "שפה",
      send: "שליחה",
      sending: "שולח...",
    },
    nav: NAV_EN,
    rubelPlay: PLAY_EN,
    plugBridge: PLUG_BRIDGE_EN,
    discoverFunnel: DISCOVER_FUNNEL_EN,
    compilerIntro: COMPILER_INTRO_EN,
    feed: FEED_EN,
    header: HEADER_EN,
    gdpr: GDPR_EN,
    creator: CREATOR_EN,
  },
  de: {
    likert: {
      stronglyDisagree: "Stimme überhaupt nicht zu",
      disagree: "Stimme nicht zu",
      slightlyDisagree: "Stimme eher nicht zu",
      neutral: "Neutral",
      slightlyAgree: "Stimme eher zu",
      agree: "Stimme zu",
      stronglyAgree: "Stimme voll und ganz zu",
      anchorLow: "− Geringe Übereinstimmung",
      anchorHigh: "+ Hohe Übereinstimmung",
      instructions:
        "Siebenstufige Skala von −3 bis +3. Farben sind unterstützend; orientiere dich an Zahlen und +/−-Symbolen. Pfeiltasten und Enter oder Leertaste zum Auswählen.",
    },
    common: {
      localeLabel: "Sprache",
      send: "Senden",
      sending: "Wird gesendet...",
    },
    nav: NAV_EN,
    rubelPlay: PLAY_EN,
    plugBridge: PLUG_BRIDGE_EN,
    discoverFunnel: DISCOVER_FUNNEL_EN,
    compilerIntro: COMPILER_INTRO_EN,
    feed: FEED_EN,
    header: HEADER_EN,
    gdpr: GDPR_EN,
    creator: CREATOR_EN,
  },
  fr: {
    likert: {
      stronglyDisagree: "Pas du tout d'accord",
      disagree: "Pas d'accord",
      slightlyDisagree: "Plutôt pas d'accord",
      neutral: "Neutre",
      slightlyAgree: "Plutôt d'accord",
      agree: "D'accord",
      stronglyAgree: "Tout à fait d'accord",
      anchorLow: "− Faible accord",
      anchorHigh: "+ Fort accord",
      instructions:
        "Échelle à sept points de −3 à +3. Les couleurs sont indicatives ; utilisez les chiffres et les symboles +/−. Flèches et Entrée ou Espace pour sélectionner.",
    },
    common: {
      localeLabel: "Langue",
      send: "Envoyer",
      sending: "Envoi...",
    },
    nav: {
      ...NAV_EN,
      hub: "Explorer",
      create: "Créer",
      createShort: "Créer",
    },
    rubelPlay: PLAY_FR,
    plugBridge: PLUG_BRIDGE_EN,
    discoverFunnel: DISCOVER_FUNNEL_EN,
    compilerIntro: COMPILER_INTRO_EN,
    feed: FEED_EN,
    header: { ...HEADER_EN, create: "Créer" },
    gdpr: GDPR_EN,
    creator: CREATOR_EN,
  },
};

export function getMessages(locale: Locale): LocaleMessages {
  return MESSAGES[locale];
}

export function getLikertLabel(
  locale: Locale,
  value: number,
): string {
  const likert = getMessages(locale).likert;

  switch (value) {
    case -3:
      return likert.stronglyDisagree;
    case -2:
      return likert.disagree;
    case -1:
      return likert.slightlyDisagree;
    case 0:
      return likert.neutral;
    case 1:
      return likert.slightlyAgree;
    case 2:
      return likert.agree;
    case 3:
      return likert.stronglyAgree;
    default:
      return likert.neutral;
  }
}
