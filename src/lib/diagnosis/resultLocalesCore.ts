export type ResultLocale = "ja" | "en" | "ko" | "zh";

export interface ResultLocaleMessages {
  cosmicEyebrow: string;
  narrativeTitle: string;
  narrativeLead: string;
  traitsProfileTitle: string;
  traitsProfileLead: string;
  compatibilityTitle: string;
  galleryTitle: string;
  galleryLead: string;
  galleryOwned: string;
  galleryPreview: string;
  adviceTitle: string;
  adviceLead: string;
  adviceTipLabel: string;
  adviceAffirmationLabel: string;
  shareInsightsTitle: string;
  offlineBadge: string;
}

const MESSAGES: Readonly<Record<ResultLocale, ResultLocaleMessages>> = {
  ja: {
    cosmicEyebrow: "コズミック・プラネット・アーキタイプ",
    narrativeTitle: "性格ナラティブ・レポート",
    narrativeLead:
      "5因子の宇宙エネルギーから読み解いた、あなただけの行動傾向レポートです。",
    traitsProfileTitle: "5因子プロファイル",
    traitsProfileLead: "学術的な5因子モデル（OCEAN）に基づく、あなたの特性バランスです。",
    compatibilityTitle: "ユニバーサル・相性（宇宙の相性診断）",
    galleryTitle: "6惑星ギャラリー",
    galleryLead:
      "宇宙には6種類の惑星タイプがあります。あなたの星と、他の星との相性をのぞいてみましょう。",
    galleryOwned: "これがあなたの宇宙キャラクターです",
    galleryPreview: "プレビュー表示中 — タップで他の星タイプを比較できます",
    adviceTitle: "AI コズミック・アドバイス",
    adviceLead:
      "あなたの惑星タイプと5因子から、今日のあなたへ向けたパーソナルメッセージをお届けします。",
    adviceTipLabel: "今日の宇宙ヒント",
    adviceAffirmationLabel: "星からのメッセージ",
    shareInsightsTitle: "シェア計測サマリー",
    offlineBadge: "オフライン保存済み",
  },
  en: {
    cosmicEyebrow: "Cosmic Planet Archetype",
    narrativeTitle: "Personality Narrative Report",
    narrativeLead:
      "A behavioral report derived from your five-factor cosmic energy profile.",
    traitsProfileTitle: "Five-Factor Profile",
    traitsProfileLead:
      "Your trait balance based on the academic OCEAN five-factor model.",
    compatibilityTitle: "Universal Compatibility",
    galleryTitle: "Six Planet Gallery",
    galleryLead:
      "Six planet types exist in this cosmos. Explore how your star relates to the others.",
    galleryOwned: "This is your cosmic character",
    galleryPreview: "Preview mode — tap to compare other planet types",
    adviceTitle: "AI Cosmic Advice",
    adviceLead: "Personal guidance based on your planet type and five-factor profile.",
    adviceTipLabel: "Today's cosmic tip",
    adviceAffirmationLabel: "Message from your star",
    shareInsightsTitle: "Share analytics summary",
    offlineBadge: "Saved for offline",
  },
  ko: {
    cosmicEyebrow: "코스믹 플래닛 아키타입",
    narrativeTitle: "성격 내러티브 리포트",
    narrativeLead: "5요인 우주 에너지로 읽어낸 당신만의 행동 성향 리포트입니다.",
    traitsProfileTitle: "5요인 프로필",
    traitsProfileLead: "OCEAN 5요인 모델에 기반한 특성 밸런스입니다.",
    compatibilityTitle: "유니버설 궁합",
    galleryTitle: "6행성 갤러리",
    galleryLead: "우주에는 6가지 행성 타입이 있습니다. 다른 별과의 궁합을 살펴보세요.",
    galleryOwned: "이것이 당신의 우주 캐릭터입니다",
    galleryPreview: "미리보기 — 탭하여 다른 행성 타입과 비교",
    adviceTitle: "AI 코스믹 어드바이스",
    adviceLead: "행성 타입과 5요인을 바탕으로 한 맞춤 메시지입니다.",
    adviceTipLabel: "오늘의 우주 힌트",
    adviceAffirmationLabel: "별이 전하는 메시지",
    shareInsightsTitle: "공유 분석 요약",
    offlineBadge: "오프라인 저장됨",
  },
  zh: {
    cosmicEyebrow: "宇宙星球原型",
    narrativeTitle: "性格叙事报告",
    narrativeLead: "根据五因子宇宙能量解读的专属行为倾向报告。",
    traitsProfileTitle: "五因子档案",
    traitsProfileLead: "基于 OCEAN 五因子模型的特性平衡。",
    compatibilityTitle: "宇宙相性",
    galleryTitle: "六星球图鉴",
    galleryLead: "宇宙中有六种星球类型。看看你的星与其他星的相性吧。",
    galleryOwned: "这是你的宇宙角色",
    galleryPreview: "预览中 — 点击比较其他星球类型",
    adviceTitle: "AI 宇宙建议",
    adviceLead: "根据星球类型与五因子生成的个性化消息。",
    adviceTipLabel: "今日宇宙提示",
    adviceAffirmationLabel: "来自星星的讯息",
    shareInsightsTitle: "分享统计摘要",
    offlineBadge: "已离线保存",
  },
};

function readCookieLocale(): ResultLocale | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(/(?:^|;\s*)personality-quiz-locale-v1=([^;]+)/);
  const value = (match?.[1] ?? "").trim().slice(0, 2);

  if (value === "en" || value === "ko" || value === "zh" || value === "ja") {
    return value;
  }

  return null;
}

export function resolveResultLocale(): ResultLocale {
  if (typeof window === "undefined") {
    return "ja";
  }

  const cookieLocale = readCookieLocale();

  if (cookieLocale) {
    return cookieLocale;
  }

  const lang = (document.documentElement.lang || navigator.language || "ja")
    .slice(0, 2)
    .toLowerCase();

  if (lang === "en" || lang === "ko" || lang === "zh") {
    return lang;
  }

  return "ja";
}

export function getResultLocaleMessages(locale: ResultLocale): ResultLocaleMessages {
  return MESSAGES[locale];
}
