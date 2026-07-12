import type { LandingLocale } from "@/lib/landing/landingLocales";
import { isLandingLocale } from "@/lib/landing/landingLocales";
import type { PsychTopicSlug } from "@/lib/psychology/types";

export const PSYCH_INTAKE_STORAGE_KEY = "rubel-psych-intake-v1";

const MAX_AGE_MS = 30 * 60 * 1000;
const MAX_USER_TEXT_LENGTH = 2_000;

const PSYCH_TOPIC_SLUGS: ReadonlySet<PsychTopicSlug> = new Set([
  "big-five",
  "enneagram",
]);

export interface PsychIntakeSeed {
  topic: PsychTopicSlug;
  locale: LandingLocale;
  userText: string;
  keyword: string;
  createdAt: number;
}

function isPsychTopicSlug(value: string): value is PsychTopicSlug {
  return PSYCH_TOPIC_SLUGS.has(value as PsychTopicSlug);
}

function isFreshTimestamp(createdAt: number): boolean {
  return Number.isFinite(createdAt) && Date.now() - createdAt <= MAX_AGE_MS;
}

function parsePsychIntakeSeed(raw: string | null): PsychIntakeSeed | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    const topic = record.topic;
    const locale = record.locale;
    const userText = record.userText;
    const keyword = record.keyword;
    const createdAt = record.createdAt;

    if (
      typeof topic !== "string" ||
      !isPsychTopicSlug(topic) ||
      typeof locale !== "string" ||
      !isLandingLocale(locale) ||
      typeof userText !== "string" ||
      typeof keyword !== "string" ||
      typeof createdAt !== "number" ||
      !isFreshTimestamp(createdAt)
    ) {
      return null;
    }

    return {
      topic,
      locale,
      keyword,
      createdAt,
      userText: userText.trim().slice(0, MAX_USER_TEXT_LENGTH),
    };
  } catch {
    return null;
  }
}

function readStoredSeed(): PsychIntakeSeed | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parsePsychIntakeSeed(
    window.sessionStorage.getItem(PSYCH_INTAKE_STORAGE_KEY),
  );
}

export function writePsychIntakeSeed(seed: PsychIntakeSeed): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(PSYCH_INTAKE_STORAGE_KEY, JSON.stringify(seed));
}

/** Read intake for Discover handoff UI without consuming. */
export function peekPsychIntakeSeed(
  expectedLocale?: LandingLocale,
): PsychIntakeSeed | null {
  const parsed = readStoredSeed();

  if (!parsed) {
    return null;
  }

  if (expectedLocale && parsed.locale !== expectedLocale) {
    return null;
  }

  return parsed;
}

export function consumePsychIntakeSeed(
  topic: PsychTopicSlug,
  locale: LandingLocale,
): PsychIntakeSeed | null {
  const parsed = readStoredSeed();

  if (!parsed || parsed.topic !== topic || parsed.locale !== locale) {
    return null;
  }

  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(PSYCH_INTAKE_STORAGE_KEY);
  }

  return parsed;
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
