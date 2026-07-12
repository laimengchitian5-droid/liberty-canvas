import type { DiagnosisResult, PersonalityCategory } from "@/types/diagnosis";
import { PERSONALITY_CATEGORIES } from "@/types/diagnosis";
import { DIAGNOSIS_RESULT_CATALOG } from "@/lib/diagnosis/resultCatalog";
import { DIAGNOSTIC_QUESTION_COUNT } from "@/types/diagnosis";
import { getSiteUrl } from "@/lib/site/url";

export const DIAGNOSIS_SHARE_HASHTAG = "#心の色診断";

export type ShareCopyVariant = "headline" | "emotional";

const VARIANT_STORAGE_KEY = "lc-share-variant";

export function isPersonalityCategory(value: string): value is PersonalityCategory {
  return (PERSONALITY_CATEGORIES as readonly string[]).includes(value);
}

export function getDiagnosisResult(category: PersonalityCategory): DiagnosisResult {
  return DIAGNOSIS_RESULT_CATALOG[category];
}

export function buildDiagnosisPageUrl(ref?: string): string {
  const base = `${getSiteUrl()}/diagnosis`;
  if (!ref?.trim()) {
    return base;
  }
  return `${base}?ref=${encodeURIComponent(ref.trim())}`;
}

export function buildDiagnosisResultPageUrl(category: PersonalityCategory): string {
  return `${getSiteUrl()}/diagnosis/result/${category}`;
}

export function buildDiagnosisOgImageUrl(category?: PersonalityCategory): string {
  const base = `${getSiteUrl()}/api/og/diagnosis`;
  if (!category) {
    return base;
  }
  return `${base}?type=${encodeURIComponent(category)}`;
}

export function resolveShareCopyVariant(): ShareCopyVariant {
  if (typeof window === "undefined") {
    return "headline";
  }

  try {
    const stored = sessionStorage.getItem(VARIANT_STORAGE_KEY);

    if (stored === "headline" || stored === "emotional") {
      return stored;
    }

    const variant: ShareCopyVariant = Math.random() < 0.5 ? "headline" : "emotional";
    sessionStorage.setItem(VARIANT_STORAGE_KEY, variant);
    return variant;
  } catch {
    return "headline";
  }
}

function clampShareText(text: string): string {
  if (text.length <= 120) {
    return text;
  }

  return `${text.slice(0, 118)}…`;
}

export function buildDiagnosisShareText(
  result: DiagnosisResult,
  variant: ShareCopyVariant = "headline",
): string {
  const url = buildDiagnosisResultPageUrl(result.dominantCategory);

  if (variant === "emotional") {
    const emotional = `わたしの心の色は「${result.title}」でした ${DIAGNOSIS_SHARE_HASHTAG}\n${url}`;
    return clampShareText(emotional);
  }

  const headline = `「${result.title}」— ${result.subtitle}`;
  const body = `${headline} | ${DIAGNOSTIC_QUESTION_COUNT}問の心の色診断 ${DIAGNOSIS_SHARE_HASHTAG}`;
  const combined = `${body}\n${url}`;

  return clampShareText(combined);
}

export const DIAGNOSIS_RESULT_LINKS = PERSONALITY_CATEGORIES.map((category) => ({
  category,
  href: `/diagnosis/result/${category}`,
  title: DIAGNOSIS_RESULT_CATALOG[category].title,
}));
