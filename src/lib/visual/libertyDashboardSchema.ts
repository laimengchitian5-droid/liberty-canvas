import { z } from "zod";
import { extractJsonObject } from "@/lib/ai/extractJsonObject";
import type {
  AIAnalysisEngineResult,
  LibertyDashboardLocale,
} from "@/types/libertyDashboard";
import { intensityFromVector, toCognitiveArtVector } from "@/lib/visual/cognitiveArt";

export { extractJsonObject } from "@/lib/ai/extractJsonObject";

export const libertyInternalReasoningSchema = z.object({
  personaProfileEnglish: z.string().min(1).max(4000),
  vectorInterpretation: z.string().min(1).max(4000),
  culturalAdaptationNotes: z.string().min(1).max(4000),
});

export const libertyLocalizedOutputSchema = z.object({
  characterName: z.string().min(1).max(80),
  aiAdvice: z.string().min(1).max(2000),
  energyLabel: z.string().min(1).max(120),
});

export const aiAnalysisEngineResultSchema = z.object({
  internalReasoning: libertyInternalReasoningSchema,
  localizedOutput: libertyLocalizedOutputSchema,
});

export type ParsedAIAnalysisEngineResult = z.infer<typeof aiAnalysisEngineResultSchema>;

export function parseAIAnalysisEngineResult(
  raw: string,
): AIAnalysisEngineResult | null {
  const payload = extractJsonObject(raw);
  if (payload === null) {
    return null;
  }

  const parsed = aiAnalysisEngineResultSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

const FALLBACK_NAMES_JA = [
  "ステラ・ノーヴァ",
  "ルナ・ヴェール",
  "オーロラ・ミスト",
  "コスモ・ペタル",
  "シエル・ブルーム",
] as const;

function pickFallbackName(vector: readonly number[]): string {
  const sum = vector.reduce((acc, v) => acc + Math.round(v), 0);
  return FALLBACK_NAMES_JA[sum % FALLBACK_NAMES_JA.length]!;
}

const SHARED_REASONING = {
  personaProfileEnglish:
    "Warm Adult-Cute cosmic persona derived from soft color-energy balance; entertainment framing only.",
} as const;

type FallbackCopy = {
  readonly characterName: string;
  readonly aiAdvice: string;
  readonly energyLabel: string;
  readonly culturalAdaptationNotes: string;
};

function fallbackCopyForLocale(
  locale: LibertyDashboardLocale,
  axes: readonly number[],
): FallbackCopy {
  switch (locale) {
    case "ja":
      return {
        characterName: pickFallbackName(axes),
        aiAdvice:
          "あなたの色には、やさしい余白がちゃんとあります。今日も自分のペースで大丈夫。その柔らかさは、確かな強さです。",
        energyLabel: "やわらかい輝き",
        culturalAdaptationNotes:
          "Localize as empathetic Japanese です・ます; cosmic, affirming, never clinical.",
      };
    case "ko":
      return {
        characterName: "스텔라 노바",
        aiAdvice:
          "당신의 색에는 부드러운 여유가 있어요. 오늘도 당신만의 속도로 괜찮아요. 그 다정함이 진짜 힘입니다.",
        energyLabel: "부드러운 빛",
        culturalAdaptationNotes: "Warm Korean, affirming, cosmic-cute, never clinical.",
      };
    case "zh":
      return {
        characterName: "斯特拉·新星",
        aiAdvice:
          "你的色彩里，藏着温柔的留白。今天也按自己的节奏就好——那份柔软，正是力量。",
        energyLabel: "柔和辉光",
        culturalAdaptationNotes: "Simplified Chinese, warm and affirming, never clinical.",
      };
    case "fr":
      return {
        characterName: "Stella Nova",
        aiAdvice:
          "Tes couleurs portent déjà une douceur tranquille. Avance à ton rythme — cette délicatesse est une vraie force.",
        energyLabel: "Lueur douce",
        culturalAdaptationNotes: "Natural French, warm Adult-Cute, never clinical.",
      };
    case "de":
      return {
        characterName: "Stella Nova",
        aiAdvice:
          "In deinen Farben liegt schon eine stille Güte. Geh in deinem Tempo — diese Sanftheit ist echte Stärke.",
        energyLabel: "Sanftes Leuchten",
        culturalAdaptationNotes: "Natural German, warm Adult-Cute, never clinical.",
      };
    case "ar":
      return {
        characterName: "ستيلا نوفا",
        aiAdvice:
          "ألوانك تحمل لطفًا هادئًا بالفعل. امضِ بوتيرتك — هذا اللين قوة حقيقية.",
        energyLabel: "توهج ناعم",
        culturalAdaptationNotes: "Natural Arabic (RTL-aware phrasing), affirming, never clinical.",
      };
    case "he":
      return {
        characterName: "סטלה נובה",
        aiAdvice:
          "בצבעים שלך כבר יש עדינות שקטה. לכי בקצב שלך — הרכות הזו היא כוח אמיתי.",
        energyLabel: "זוהר רך",
        culturalAdaptationNotes: "Natural Hebrew (RTL-aware phrasing), affirming, never clinical.",
      };
    case "en":
    default:
      return {
        characterName: "Stella Nova",
        aiAdvice:
          "Your colors already hold a quiet kindness. Keep moving at your own pace — that softness is a real strength.",
        energyLabel: "Soft glow",
        culturalAdaptationNotes: "Keep affirming, non-clinical, cosmic-cute tone in English.",
      };
  }
}

/** Deterministic Adult-Cute fallback when AI keys are missing or parse fails. */
export function buildFallbackLibertyDashboard(
  vector: readonly number[],
  locale: LibertyDashboardLocale = "ja",
): AIAnalysisEngineResult {
  const axes = toCognitiveArtVector(vector);
  const energy = intensityFromVector(axes);
  const copy = fallbackCopyForLocale(locale, axes);

  return {
    internalReasoning: {
      personaProfileEnglish: SHARED_REASONING.personaProfileEnglish,
      vectorInterpretation: `Eight-axis art vector averages near ${energy}/100 color energy.`,
      culturalAdaptationNotes: copy.culturalAdaptationNotes,
    },
    localizedOutput: {
      characterName: copy.characterName,
      aiAdvice: copy.aiAdvice,
      energyLabel: copy.energyLabel,
    },
  };
}
