import type {
  InjectionChatTurn,
  RubelEnginePayload,
} from "@/lib/rubel/contracts/pipeline";

export type { InjectionChatTurn };

export function buildInjectionSystemBlock(payload: RubelEnginePayload): string {
  const anchor = payload.verbalizationAnchor;
  const anchorBlock = anchor
    ? [
        "[VERBALIZATION_ANCHOR — IMMUTABLE]",
        `Question: "${anchor.questionText}"`,
        `User chose exactly: "${anchor.chosenOptionText}"`,
        "This verbatim choice is ground truth. Reference it in your reply. Never invent a different answer.",
        "",
      ].join("\n")
    : "";

  const keywordLine = payload.keyword
    ? `- Discovery Keyword: ${payload.keyword}`
    : "";

  return [
    "[CONTEXT DATA]",
    "- Platform: Rubel Canvas (Lu + Bel = Liberate Beautiful souls)",
    `- Intake Source: ${payload.intakeSource}`,
    `- Current Quiz: ${payload.title}`,
    `- Archetype Result: ${payload.typeName}`,
    keywordLine,
    "",
    anchorBlock,
    "[BEHAVIOR RULES]",
    `- Persona Tone: ${payload.tone}`,
    `- Empathy Filter: ${payload.empathyLevel}`,
    "- Stay in character. Respond concisely in the user's language.",
    "",
    "[PERSONA KERNEL]",
    payload.compiledSystemPrompt,
  ]
    .filter(Boolean)
    .join("\n");
}

function wrapQwenChat(system: string, user: string): string {
  return [
    `<|im_start|>system\n${system}`,
    `<|im_start|>user\n${user}`,
    "<|im_start|>assistant\n",
  ].join("\n");
}

export function buildInjectionPrompt(
  payload: RubelEnginePayload,
  history: InjectionChatTurn[],
  userMessage: string,
): string {
  const systemBlock = buildInjectionSystemBlock(payload);

  if (history.length === 0) {
    return wrapQwenChat(systemBlock, userMessage);
  }

  const transcript = history
    .map((turn) => `<|im_start|>${turn.role}\n${turn.content}`)
    .join("\n");

  return [
    `<|im_start|>system\n${systemBlock}`,
    transcript,
    `<|im_start|>user\n${userMessage}`,
    "<|im_start|>assistant\n",
  ].join("\n");
}

export const OPENING_INJECTION_MESSAGE =
  "[DIAGNOSIS_COMPLETE] The single-question quiz just finished. Open with a vivid, empathetic greeting that names the Archetype Result AND quotes the user's exact chosen answer from VERBALIZATION_ANCHOR. End with one warm question. Japanese unless the anchor is clearly English.";

export function buildPersonalizedFallback(
  payload: RubelEnginePayload,
  userMessage: string,
): string {
  const anchorQuote = payload.verbalizationAnchor?.chosenOptionText;

  return anchorQuote
    ? `「${anchorQuote}」って選んだ${payload.typeName}のあなた、マジで分かる！${userMessage} — もっと聞かせて？`
    : `${payload.typeName}のあなたへ——${userMessage}、全力で応援するから、もうちょっと教えて？`;
}
