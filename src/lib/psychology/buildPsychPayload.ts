import { compileSystemPrompt } from "@/lib/rubel/compileSystemPrompt";
import type { RubelEnginePayload } from "@/lib/rubel/contracts/pipeline";
import {
  resolveEmpathyInjectionLabel,
  resolveToneInjectionLabel,
} from "@/lib/rubel/pipeline/labelHelpers";
import type { LandingLocale } from "@/lib/landing/landingLocales";
import type { PsychQuizResult, PsychTopicSlug } from "@/lib/psychology/types";
import type { Result } from "@/types/rubel";

const PSYCH_AI_CONFIG = {
  tone: "gal" as const,
  activeTherapyMode: "unconditional_praise" as const,
};

const PSYCH_BASELINE = { openness: 2, empathy_need: 4, ego: -1 };

function buildPsychResult(typeName: string): Result {
  return {
    id: "psych-result",
    name: typeName,
    baselineProfile: PSYCH_BASELINE,
    aiConfig: PSYCH_AI_CONFIG,
  };
}

function buildCompiledPrompt(typeName: string, detailLines: string[]) {
  const result = buildPsychResult(typeName);
  const compiled = compileSystemPrompt(result, PSYCH_BASELINE);

  return [
    compiled.systemPrompt,
    "",
    "[PSYCHOMETRIC DETAIL]",
    ...detailLines.map((line) => `- ${line}`),
    "",
    "Validate the user's exact chosen answer. Stay all-affirming. Mirror their language.",
  ].join("\n");
}

export function buildPsychEnginePayload(params: {
  topic: PsychTopicSlug;
  locale: LandingLocale;
  keyword: string;
  pageTitle: string;
  result: PsychQuizResult;
}): RubelEnginePayload {
  const { result, keyword, pageTitle } = params;

  return {
    title: pageTitle,
    typeName: result.typeName,
    tone: resolveToneInjectionLabel(PSYCH_AI_CONFIG.tone),
    empathyLevel: resolveEmpathyInjectionLabel(PSYCH_AI_CONFIG.activeTherapyMode),
    verbalizationAnchor: {
      questionText: result.anchorQuestion,
      chosenOptionText: result.anchorAnswer,
    },
    compiledSystemPrompt: buildCompiledPrompt(result.typeName, result.detailLines),
    intakeSource: "quiz",
    keyword,
  };
}
