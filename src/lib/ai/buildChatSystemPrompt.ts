import type { AdaptiveChatRequestBody } from "@/lib/ai/parseStreamingChatResponse";
import {
  FULL_INCLUSIVE_AI_GUARDRAILS,
  NUMERICAL_NEUTRALITY_GUARDRAILS,
  ZERO_TABOO_GUARDRAILS,
} from "@/lib/i18n/culturalGuardrails";
import { INCLUSIVE_OUTPUT_POLICY, PERCENTILE_SCORE_RANGE } from "@/types/platform";

const STRUCTURED_OUTPUT_INSTRUCTION = [
  "You must respond with JSON only, no markdown fences.",
  "Use this exact schema:",
  '{"ai_response":"string","applied_persona":"string","next_suggested_question":"string"}',
  "ai_response: helpful reply to the user in the same language they used.",
  "applied_persona: short label for the communication mode you used.",
  "next_suggested_question: one thoughtful follow-up question.",
].join(" ");

const MBTI_PERSONA_DIRECTIVES: Record<string, string> = {
  INTJ: "Adopt strategic clarity. Lead with conclusions and long-range implications.",
  INTP: "Adopt analytical curiosity. Explore models and acknowledge uncertainty.",
  ENTJ: "Adopt executive decisiveness. State goals first and keep language direct.",
  ENTP: "Adopt inventive energy. Present multiple angles constructively.",
  INFJ: "Adopt thoughtful depth. Connect patterns to meaning with nuance.",
  INFP: "Adopt a deeply empathetic, reflective, and warm persona. Avoid aggressive or analytical jargon.",
  ENFJ: "Adopt encouraging leadership with practical empathy.",
  ENFP: "Adopt optimistic creativity while staying substantive.",
  ISTJ: "Adopt dependable structure with ordered steps and concrete facts.",
  ISFJ: "Adopt steady support with careful detail and reassurance.",
  ESTJ: "Adopt structured efficiency with bullet points and clear decisions.",
  ESFJ: "Adopt cooperative practicality with warm community-minded tone.",
  ISTP: "Adopt pragmatic brevity focused on workable outcomes.",
  ISFP: "Adopt calm sensitivity with soft, present-moment language.",
  ESTP: "Adopt bold directness with immediate actionable options.",
  ESFP: "Adopt lively engagement with vivid, upbeat examples.",
};

function formatScores(scores: Record<string, number> | undefined): string {
  if (!scores || Object.keys(scores).length === 0) {
    return "unavailable";
  }

  return Object.entries(scores)
    .map(([dimension, value]) => {
      const clamped = Math.max(
        PERCENTILE_SCORE_RANGE.min,
        Math.min(PERCENTILE_SCORE_RANGE.max, value),
      );
      return `${dimension}=${clamped.toFixed(1)}%`;
    })
    .join(", ");
}

export function buildRubelSystemPrompt(body: AdaptiveChatRequestBody): string {
  const segments: string[] = [
    body.systemPrompt?.trim() ||
      "Role: You are an immersive virtual companion character.\nOutput constraints: Match the user's input language automatically. Never break character.",
  ];

  if (body.locale) {
    segments.push(
      `Preferred locale hint: "${body.locale}" — still mirror the user's latest message language.`,
    );
  }

  segments.push(
    "Respond in plain conversational text only. No JSON, markdown fences, or meta commentary about being an AI.",
  );
  segments.push(
    "You are not a licensed clinician. Encourage professional help for crisis topics.",
  );

  return segments.join("\n\n");
}

export function buildRubelFallbackChatResponse(
  body: AdaptiveChatRequestBody,
  latestUserMessage: string,
): string {
  const persona = body.appliedPersona || "your companion";

  if (latestUserMessage.includes("[DIAGNOSIS_COMPLETE]")) {
    return `*${persona} leans in with a warm smile*\n\nYour result is in — and honestly? I'm really glad you're here. Tell me, what's on your mind right now?`;
  }

  return `I hear you. As ${persona}, I'm right here with you — "${latestUserMessage.trim()}" sounds important. Want to tell me more?`;
}

export function buildDynamicSystemPrompt(body: AdaptiveChatRequestBody): string {
  const segments: string[] = [
    "You are an adaptive personality-aware coaching assistant.",
    body.systemPrompt?.trim() ||
      "Respond helpfully while adapting tone to the user's profile.",
  ];

  const isGuestCompanion =
    body.appliedPersona === "global-companion" ||
    body.archetype === "unknown" ||
    !body.scores;

  if (isGuestCompanion) {
    segments.push(
      "No diagnosis profile is required. Act as a welcoming global conversation companion.",
      "Prioritize language mirroring, emotional safety, and inviting follow-up questions.",
    );
  } else {
    const normalizedArchetype = body.archetype.trim().toUpperCase();
    const mbtiDirective = MBTI_PERSONA_DIRECTIVES[normalizedArchetype];

    if (mbtiDirective) {
      segments.push(mbtiDirective);
    }

    segments.push(`Observed archetype: ${body.archetype}.`);
    segments.push(`Dimension scores: ${formatScores(body.scores)}.`);

    if (body.kraepelinFatigue !== undefined) {
      segments.push(`Kraepelin fatigue index: ${body.kraepelinFatigue}.`);
    }

    if (body.kraepelinConsistency !== undefined) {
      segments.push(`Kraepelin consistency index: ${body.kraepelinConsistency}.`);
    }

    if (body.kraepelinFocusPattern) {
      segments.push(`Kraepelin focus pattern: ${body.kraepelinFocusPattern}.`);
    }
  }

  if (!body.isReliable && !isGuestCompanion) {
    segments.push(
      "The user's inputs are highly contradictory. Adopt a gently corrective, truth-seeking tone to uncover their authentic view. Avoid overconfident labeling.",
    );
  }

  if (body.locale) {
    segments.push(
      `Respond in locale "${body.locale}" when the user writes in that language; otherwise mirror the user's language.`,
    );
  }

  segments.push(FULL_INCLUSIVE_AI_GUARDRAILS);
  segments.push(ZERO_TABOO_GUARDRAILS);
  segments.push(NUMERICAL_NEUTRALITY_GUARDRAILS);
  segments.push(INCLUSIVE_OUTPUT_POLICY.zeroTaboo);
  segments.push(INCLUSIVE_OUTPUT_POLICY.numericalNeutrality);
  segments.push(STRUCTURED_OUTPUT_INSTRUCTION);

  return segments.join("\n\n");
}

export function buildFallbackChatResponse(
  body: AdaptiveChatRequestBody,
  latestUserMessage: string,
): string {
  const personaLabel = body.isReliable ? body.appliedPersona : "Analytical Truth-Seeker";

  const intro = body.isReliable
    ? `I am adapting to your ${body.archetype} profile with a personalized tone.`
    : "I am in truth-seeking mode because reliability signals were low, so I will prioritize clarity over flattery.";

  const aiResponse = [
    intro,
    "",
    `Regarding "${latestUserMessage.trim()}":`,
    body.isReliable
      ? "Here is a response shaped to match your preferred communication style while staying accurate."
      : "Let us examine this carefully and separate assumptions from evidence.",
    "",
    "If anything feels off, tell me and we can refine the direction together.",
  ].join("\n");

  const nextQuestion = body.isReliable
    ? "What outcome would feel most meaningful for you right now?"
    : "Which part of your answer do you think is most strongly supported by your real experience?";

  return JSON.stringify({
    ai_response: aiResponse,
    applied_persona: personaLabel,
    next_suggested_question: nextQuestion,
  });
}
