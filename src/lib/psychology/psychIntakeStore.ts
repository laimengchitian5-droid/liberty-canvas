import type { LandingLocale } from "@/lib/landing/landingLocales";
import type { PsychTopicSlug } from "@/lib/psychology/types";

export const PSYCH_INTAKE_STORAGE_KEY = "rubel-psych-intake-v1";

export interface PsychIntakeSeed {
  topic: PsychTopicSlug;
  locale: LandingLocale;
  userText: string;
  keyword: string;
  createdAt: number;
}

const MAX_AGE_MS = 30 * 60 * 1000;

export function writePsychIntakeSeed(seed: PsychIntakeSeed): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(PSYCH_INTAKE_STORAGE_KEY, JSON.stringify(seed));
}

export function consumePsychIntakeSeed(
  topic: PsychTopicSlug,
  locale: LandingLocale,
): PsychIntakeSeed | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(PSYCH_INTAKE_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PsychIntakeSeed;

    if (
      parsed.topic !== topic ||
      parsed.locale !== locale ||
      typeof parsed.userText !== "string" ||
      Date.now() - parsed.createdAt > MAX_AGE_MS
    ) {
      return null;
    }

    window.sessionStorage.removeItem(PSYCH_INTAKE_STORAGE_KEY);
    return {
      ...parsed,
      userText: parsed.userText.trim().slice(0, 2_000),
    };
  } catch {
    return null;
  }
}

export function mergePsychResultWithSeed<T extends {
  anchorQuestion: string;
  anchorAnswer: string;
}>(
  result: T,
  seed: PsychIntakeSeed | null,
  fallbackQuestion: string,
): T {
  if (!seed?.userText) {
    return result;
  }

  return {
    ...result,
    anchorQuestion: fallbackQuestion,
    anchorAnswer: seed.userText,
  };
}
