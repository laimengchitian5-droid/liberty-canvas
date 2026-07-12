import { resolveEmpathyLevel, type EmpathyLevel } from "@/lib/rubel/compileSystemPrompt";
import type { ActiveTherapyMode, AiTone } from "@/types/rubel";

const TONE_INJECTION_LABELS: Record<AiTone, string> = {
  gal: "ギャル（Gal-tone）",
  mentor: "メンター（Mentor-tone）",
  tsundere: "ツンデレ（Tsundere-tone）",
  princess: "プリンセス（Princess-tone）",
};

const EMPATHY_INJECTION_LABELS: Record<EmpathyLevel, string> = {
  hyper_supportive: "100%全肯定（Hyper-Supportive）",
  direct_accountability: "厳しめコーチング（Strict）",
  reflective_mirroring: "感情ミラー（Reflective）",
};

export function resolveToneInjectionLabel(tone: AiTone): string {
  return TONE_INJECTION_LABELS[tone];
}

export function resolveEmpathyInjectionLabel(mode: ActiveTherapyMode): string {
  return EMPATHY_INJECTION_LABELS[resolveEmpathyLevel(mode)];
}
