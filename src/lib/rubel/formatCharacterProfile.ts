import type { ActiveTherapyMode, AiTone, Result } from "@/types/rubel";

const TONE_DISPLAY: Record<AiTone, string> = {
  gal: "Gal",
  mentor: "Mentor",
  tsundere: "Tsundere",
  princess: "Princess",
};

const THERAPY_DISPLAY: Record<ActiveTherapyMode, string> = {
  unconditional_praise: "Praiser",
  strict_coaching: "Coach",
  emotional_mirror: "Mirror",
};

export function formatCharacterProfileLabel(result: Result): string {
  const tone = TONE_DISPLAY[result.aiConfig.tone];
  const therapy = THERAPY_DISPLAY[result.aiConfig.activeTherapyMode];

  return `${tone} ${therapy}`;
}

export function formatCharacterProfileHeadline(result: Result): string {
  return `${formatCharacterProfileLabel(result)} · ${result.name}`;
}

export function formatTherapyModeLabel(mode: ActiveTherapyMode): string {
  return mode.replace(/_/g, " ");
}
