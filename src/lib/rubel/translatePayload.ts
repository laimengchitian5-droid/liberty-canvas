import { lookupTranslation } from "@/lib/rubel/i18n/translationRegistry";
import type { Diagnosis, Result } from "@/types/rubel";
import type { LocaleCode, LocalizedDiagnosisMeta } from "@/types/rubel-i18n";

export interface TranslatedDiagnosisBundle {
  diagnosis: Diagnosis;
  meta: LocalizedDiagnosisMeta;
}

function translateString(
  text: string,
  sourceLanguage: LocaleCode,
  targetLanguage: LocaleCode,
): string {
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  return lookupTranslation(text, sourceLanguage, targetLanguage) ?? text;
}

function translateResult(
  result: Result,
  sourceLanguage: LocaleCode,
  targetLanguage: LocaleCode,
): Result {
  return {
    ...result,
    name: translateString(result.name, sourceLanguage, targetLanguage),
  };
}

/**
 * Client-side mock translation framework.
 * Translates display strings while preserving IDs and scoring logic.
 */
export function translatePayload(
  diagnosis: Diagnosis,
  targetLang: LocaleCode,
): TranslatedDiagnosisBundle {
  const sourceLanguage = diagnosis.language;

  if (sourceLanguage === targetLang) {
    return {
      diagnosis,
      meta: {
        sourceLanguage,
        displayLanguage: targetLang,
        wasTranslated: false,
      },
    };
  }

  const translated: Diagnosis = {
    ...diagnosis,
    title: translateString(diagnosis.title, sourceLanguage, targetLang),
    language: targetLang,
    searchKeywords: diagnosis.searchKeywords,
    questions: diagnosis.questions.map((question) => ({
      ...question,
      text: translateString(question.text, sourceLanguage, targetLang),
      options: question.options.map((option) => ({
        ...option,
        text: translateString(option.text, sourceLanguage, targetLang),
      })),
    })),
    results: diagnosis.results.map((result) =>
      translateResult(result, sourceLanguage, targetLang),
    ),
  };

  return {
    diagnosis: translated,
    meta: {
      sourceLanguage,
      displayLanguage: targetLang,
      wasTranslated: true,
    },
  };
}

export function translateHubTitle(
  title: string,
  sourceLanguage: LocaleCode,
  targetLanguage: LocaleCode,
): string {
  return translateString(title, sourceLanguage, targetLanguage);
}
