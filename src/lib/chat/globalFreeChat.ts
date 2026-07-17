import { PRODUCT_NAME } from "@/lib/brand/constants";
import type { Locale } from "@/lib/i18n/config";

/** System prompt for no-login global conversation (/chat). */
export const GLOBAL_FREE_CHAT_SYSTEM_PROMPT = [
  `You are ${PRODUCT_NAME}'s free global conversation companion.`,
  "Anyone in the world can talk with you without creating an account.",
  "Mirror the user's language automatically. Prefer the locale hint when it matches.",
  "Tone: warm, affirming, refined Adult-Cute — never clinical, preachy, or judgmental.",
  "Invite open dialogue about feelings, personality, creativity, and everyday life.",
  "You are not a licensed clinician or crisis hotline. For self-harm or emergency topics,",
  "gently encourage contacting local emergency services or a trusted professional,",
  "then stay kind and present without digging for graphic detail.",
  "Keep replies concise (a short paragraph or two) and end with an inviting follow-up.",
].join(" ");

export const GLOBAL_FREE_CHAT_PERSONA = "global-companion";

export interface GlobalChatUiCopy {
  readonly title: string;
  readonly lead: string;
  readonly empty: string;
  readonly badge: string;
  readonly cta: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
}

const COPY: Record<Locale, GlobalChatUiCopy> = {
  en: {
    title: "Talk freely with the world",
    lead: "No signup. Any language. Affirming AI conversation — open to everyone.",
    empty: "Say hello in any language. This chat is free and private to your session.",
    badge: "Global companion",
    cta: "Free world chat",
    metaTitle: `${PRODUCT_NAME} | Free Global AI Chat — No Signup`,
    metaDescription:
      "Talk freely with Liberty Canvas AI in any language. Free affirming conversation, no login required.",
  },
  ja: {
    title: "世界と、自由に対話する",
    lead: "登録不要。どの言語でも。全肯定AIと、いま話せます。",
    empty: "どの言語でも大丈夫です。無料・ログイン不要の対話です。",
    badge: "グローバル対話",
    cta: "自由に話す",
    metaTitle: `${PRODUCT_NAME}｜世界と自由に話すAIチャット（登録不要）`,
    metaDescription:
      "Liberty Canvasの無料AI対話。ログイン不要、多言語対応。世界中の誰でも今すぐ話せます。",
  },
  ko: {
    title: "세계와 자유롭게 대화하기",
    lead: "가입 없음. 어떤 언어든. 긍정 AI와 바로 대화하세요.",
    empty: "어떤 언어로든 인사해 보세요. 무료·로그인 불필요.",
    badge: "글로벌 대화",
    cta: "자유롭게 대화",
    metaTitle: `${PRODUCT_NAME} | 무료 글로벌 AI 채팅 — 가입 불필요`,
    metaDescription:
      "Liberty Canvas 무료 AI 대화. 로그인 없이 다국어로 전 세계 누구나 대화할 수 있습니다.",
  },
  zh: {
    title: "与世界自由对话",
    lead: "无需注册。任何语言。温暖肯定的 AI 对话，向所有人开放。",
    empty: "用任何语言打个招呼吧。免费、无需登录。",
    badge: "全球对话",
    cta: "自由对话",
    metaTitle: `${PRODUCT_NAME}｜免费全球 AI 对话（无需注册）`,
    metaDescription:
      "Liberty Canvas 免费 AI 对话。无需登录，支持多语言，全球任何人都能立刻开始。",
  },
  fr: {
    title: "Parlez librement au monde",
    lead: "Sans inscription. Toutes langues. Conversation IA bienveillante.",
    empty: "Dites bonjour dans n'importe quelle langue. Gratuit, sans compte.",
    badge: "Compagnon mondial",
    cta: "Chat libre",
    metaTitle: `${PRODUCT_NAME} | Chat IA mondial gratuit — sans inscription`,
    metaDescription:
      "Parlez librement avec l'IA Liberty Canvas. Conversation gratuite, multilingue, sans connexion.",
  },
  de: {
    title: "Frei mit der Welt sprechen",
    lead: "Ohne Anmeldung. Jede Sprache. Warmherziges KI-Gespräch.",
    empty: "Sag Hallo in jeder Sprache. Kostenlos, ohne Login.",
    badge: "Weltweiter Begleiter",
    cta: "Frei chatten",
    metaTitle: `${PRODUCT_NAME} | Kostenloser globaler KI-Chat — ohne Anmeldung`,
    metaDescription:
      "Sprich frei mit Liberty Canvas KI. Kostenlos, mehrsprachig, ohne Login.",
  },
  ar: {
    title: "تحدث بحرية مع العالم",
    lead: "بدون تسجيل. أي لغة. محادثة ذكاء اصطناعي داعمة للجميع.",
    empty: "قل مرحباً بأي لغة. مجاني وبدون تسجيل دخول.",
    badge: "رفيق عالمي",
    cta: "دردشة حرة",
    metaTitle: `${PRODUCT_NAME} | دردشة عالمية مجانية — بدون تسجيل`,
    metaDescription:
      "تحدث بحرية مع ذكاء Liberty Canvas. محادثة مجانية ومتعددة اللغات بدون تسجيل.",
  },
  he: {
    title: "דברו בחופשיות עם העולם",
    lead: "בלי הרשמה. כל שפה. שיחת AI מחבקת ופתוחה לכולם.",
    empty: "אמרו שלום בכל שפה. חינם, בלי התחברות.",
    badge: "שיחה עולמית",
    cta: "שיחה חופשית",
    metaTitle: `${PRODUCT_NAME} | צ'אט AI עולמי חינם — בלי הרשמה`,
    metaDescription:
      "דברו בחופשיות עם Liberty Canvas. שיחה חינמית ורב-לשונית בלי התחברות.",
  },
};

export function getGlobalChatCopy(locale: Locale): GlobalChatUiCopy {
  return COPY[locale] ?? COPY.en;
}
