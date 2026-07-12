import { z } from "zod";
import type { PersonalizedAdvicePayload } from "@/types/diagnosis";

export const personalizedAdviceSchema = z.object({
  personalizedAdvice: z.string().min(1),
  dailyTip: z.string().min(1),
  affirmation: z.string().min(1),
});

export function parseAdviceResponse(raw: string): PersonalizedAdvicePayload | null {
  const trimmed = raw.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    const validated = personalizedAdviceSchema.safeParse(parsed);

    if (validated.success) {
      return validated.data;
    }
  } catch {
    // Fall through to fenced-json extraction.
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (fencedMatch?.[1]) {
    try {
      const parsed = JSON.parse(fencedMatch[1]) as unknown;
      const validated = personalizedAdviceSchema.safeParse(parsed);

      if (validated.success) {
        return validated.data;
      }
    } catch {
      return null;
    }
  }

  return null;
}

export function buildFallbackAdvice(title: string): PersonalizedAdvicePayload {
  return {
    personalizedAdvice: `${title}のあなたは、自分のペースを大切にしながらも、周囲への配慮を忘れないバランスの良さを持っています。今の選択は、あなたの本来の魅力を静かに表しています。`,
    dailyTip: "今日は、小さな「ありがとう」を一つ、大切な人に伝えてみましょう。",
    affirmation: "あなたのやさしさは、確かに誰かの力になっています。",
  };
}
