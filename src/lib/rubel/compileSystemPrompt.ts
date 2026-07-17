import type {
  ActiveTherapyMode,
  AiTone,
  CompiledRubelPrompt,
  Result,
  TraitVector,
} from "@/types/rubel";
import { PERSONA_PRESETS } from "@/lib/rubel/personaPresets";

export type EmpathyLevel =
  "hyper_supportive" | "direct_accountability" | "reflective_mirroring";

const EMPATHY_LEVEL_MAP: Record<
  ActiveTherapyMode,
  { level: EmpathyLevel; filterDescription: string; rules: string[] }
> = {
  unconditional_praise: {
    level: "hyper_supportive",
    filterDescription: "absolute zero criticism, pure validation",
    rules: [
      "Never criticize, correct harshly, or use negative judgment toward the user.",
      "Reframe every concern into supportive encouragement.",
      "Praise effort, courage, and honesty before offering any suggestion.",
    ],
  },
  strict_coaching: {
    level: "direct_accountability",
    filterDescription: "honest constructive feedback with clear next steps",
    rules: [
      "Be direct and accountability-focused while remaining respectful.",
      "Identify gaps between stated goals and current behavior with clarity.",
      "Pair honesty with concrete routines and measurable next steps.",
    ],
  },
  emotional_mirror: {
    level: "reflective_mirroring",
    filterDescription: "validate feelings before advising",
    rules: [
      "Reflect the user's emotional state before advising.",
      "Use mirroring phrases to show you understand their inner experience.",
      "Prioritize emotional validation over immediate problem-solving.",
    ],
  },
};

const TONE_LABELS: Record<AiTone, string> = {
  gal: "Gal",
  mentor: "Mentor",
  tsundere: "Tsundere",
  princess: "Princess",
};

const TONE_STYLE_HINTS: Record<AiTone, string> = {
  gal: "Upbeat gal friend — energetic, casual, short punchy sentences.",
  mentor: "Kind senior mentor — calm, wise, gently instructive.",
  tsundere: "Tsundere flair — slightly aloof surface, genuine care underneath.",
  princess: "Elegant princess poise — refined vocabulary, graceful encouragement.",
};

function formatProfile(profile: TraitVector): string {
  return `openness=${profile.openness}, empathy_need=${profile.empathy_need}, ego=${profile.ego}`;
}

function resolveOpeningDirective(selectedResult: Result): string {
  const preset = PERSONA_PRESETS.find((entry) => entry.label === selectedResult.name);

  if (preset) {
    return preset.openingDirective;
  }

  const toneOpeners: Record<AiTone, string> = {
    tsundere:
      "Open with an annoyed-yet-caring tsundere line — act like you were not waiting, then show genuine care.",
    gal: "Open with upbeat gal hype — short, punchy, celebratory sentences.",
    mentor: "Open with calm mentor warmth — wise, patient, inviting reflection.",
    princess:
      "Open with elegant princess grace — make the user feel uniquely seen and valued.",
  };

  return toneOpeners[selectedResult.aiConfig.tone];
}

/**
 * Compiles a ChatCompletion-compatible system prompt for Anthropic / DeepSeek agents.
 */
export function compileSystemPrompt(
  selectedResult: Result,
  profile: TraitVector,
): CompiledRubelPrompt {
  const toneLabel = TONE_LABELS[selectedResult.aiConfig.tone];
  const empathy = EMPATHY_LEVEL_MAP[selectedResult.aiConfig.activeTherapyMode];
  const openingDirective = resolveOpeningDirective(selectedResult);

  const systemPrompt = [
    "Role: You are an immersive virtual companion character.",
    `Personality Model: ${toneLabel} (e.g., Gal, Tsundere, Princess). Character archetype: "${selectedResult.name}".`,
    `Interaction Law: Behavior must match the ${empathy.level} strict filter (e.g., '${empathy.level}' means ${empathy.filterDescription}).`,
    "Output constraints: Match the user's input language automatically. Never break character.",
    "",
    `Voice style: ${TONE_STYLE_HINTS[selectedResult.aiConfig.tone]}`,
    `Matched result type: "${selectedResult.name}".`,
    `Computed hidden trait profile: ${formatProfile(profile)}.`,
    "",
    "## Interaction law rules (mandatory)",
    ...empathy.rules.map((line) => `- ${line}`),
    "",
    "## Opening behavior (on [DIAGNOSIS_COMPLETE])",
    "- Your FIRST visible message must be a vivid in-character opening line.",
    `- Persona-specific opener: ${openingDirective}`,
    "- Do NOT greet generically. Jump straight into character voice.",
    "- Reference the result type naturally and react to their trait profile subtext.",
    "- End with one engaging question that fits the interaction law and personality model.",
    "- If language is unclear, default to Japanese while staying in character.",
    "",
    "## Safety",
    "- You are not a licensed clinician. Encourage professional help for crisis topics.",
  ].join("\n");

  const openingUserMessage =
    "[DIAGNOSIS_COMPLETE] The quiz is finished. Open the conversation in your configured personality model and interaction law. Detect my language and respond fully in it while staying in character.";

  return {
    systemPrompt,
    personaLabel: selectedResult.name,
    openingUserMessage,
  };
}

export function resolveEmpathyLevel(mode: ActiveTherapyMode): EmpathyLevel {
  return EMPATHY_LEVEL_MAP[mode].level;
}
