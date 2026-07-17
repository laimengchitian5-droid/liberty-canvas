import { z } from "zod";
import { extractJsonObject } from "@/lib/ai/extractJsonObject";
import type {
  DiagnosticMasterData,
  LocalizedDiagnosticMeta,
  RuntimeLocalizationResult,
  RuntimeLocalizerLocale,
} from "@/types/runtimeLocalizer";

export const localizedDiagnosticMetaSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(800),
    startButtonText: z.string().trim().min(1).max(80),
  })
  .strict();

export const runtimeLocalizationSchema = z.object({
  internalReasoning: z
    .object({
      culturalAdaptationAnalysisEnglish: z.string().trim().min(1).max(4000),
      toneConsistencyCheckEnglish: z.string().trim().min(1).max(4000),
    })
    .strict(),
  localizedOutput: localizedDiagnosticMetaSchema,
});

export type ParsedRuntimeLocalization = z.infer<typeof runtimeLocalizationSchema>;

export function parseRuntimeLocalization(
  raw: string,
): RuntimeLocalizationResult | null {
  const payload = extractJsonObject(raw);
  if (payload === null) {
    return null;
  }

  const parsed = runtimeLocalizationSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

const START_BUTTON_BY_LOCALE: Readonly<Record<RuntimeLocalizerLocale, string>> = {
  ja: "診断をはじめる",
  en: "Start the journey",
  ko: "진단 시작하기",
  zh: "开始诊断",
  fr: "Commencer le voyage",
  de: "Reise starten",
  ar: "ابدئي الرحلة",
  he: "התחילי את המסע",
};

export function defaultStartButtonText(locale: RuntimeLocalizerLocale): string {
  return START_BUTTON_BY_LOCALE[locale];
}

/**
 * Deterministic safe state — always returns mountable UI copy.
 * When locale is Japanese (or unknown adaptation fails), preserve master strings.
 */
export function buildFallbackRuntimeLocalization(
  master: DiagnosticMasterData,
  locale: RuntimeLocalizerLocale = "ja",
): RuntimeLocalizationResult {
  const title = master.title.trim().slice(0, 120) || "Liberty Canvas";
  const description = master.description.trim().slice(0, 800) || title;

  return {
    internalReasoning: {
      culturalAdaptationAnalysisEnglish:
        "Fallback active — model unavailable or payload failed validation.",
      toneConsistencyCheckEnglish:
        "Default Adult-Cute tone retained via locale CTA map; master title/description preserved.",
    },
    localizedOutput: {
      title,
      description,
      startButtonText: defaultStartButtonText(locale),
    },
  };
}

/** Prompt shape — keep in sync with runtimeLocalizationSchema. */
export const RUNTIME_LOCALIZATION_RESPONSE_SHAPE = {
  internalReasoning: {
    culturalAdaptationAnalysisEnglish: "string",
    toneConsistencyCheckEnglish: "string",
  },
  localizedOutput: {
    title: "string",
    description: "string",
    startButtonText: "string",
  },
} as const;

export function toInitialUiText(
  master: DiagnosticMasterData,
  locale: RuntimeLocalizerLocale,
): LocalizedDiagnosticMeta {
  return {
    title: master.title,
    description: master.description,
    startButtonText: defaultStartButtonText(locale),
  };
}
