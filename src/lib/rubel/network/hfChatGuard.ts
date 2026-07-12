/** Server + client guards for /api/rubel/hf-chat */

export const HF_MAX_PROMPT_CHARS = 12_000;
export const HF_MAX_FALLBACK_CHARS = 500;
export const HF_MAX_USER_MESSAGE_CHARS = 2_000;
export const HF_MAX_HISTORY_TURNS = 24;
export const HF_MAX_TURN_CHARS = 4_000;

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeHfText(value: string, maxLength: number): string {
  return value.replace(CONTROL_CHARS, "").trim().slice(0, maxLength);
}

export function clampInjectionHistory<T extends { role: string; content: string }>(
  history: T[],
): T[] {
  return history
    .slice(-HF_MAX_HISTORY_TURNS)
    .map((turn) => ({
      ...turn,
      content: sanitizeHfText(turn.content, HF_MAX_TURN_CHARS),
    }))
    .filter((turn) => turn.content.length > 0);
}

export function validateRawPromptRequest(body: {
  prompt?: unknown;
  fallbackText?: unknown;
}): { ok: true; prompt: string; fallbackText: string } | { ok: false; error: string } {
  if (typeof body.prompt !== "string" || !body.prompt.trim()) {
    return { ok: false, error: "prompt must be a non-empty string." };
  }

  const prompt = sanitizeHfText(body.prompt, HF_MAX_PROMPT_CHARS);

  if (!prompt) {
    return { ok: false, error: "prompt is empty after sanitization." };
  }

  const fallbackRaw =
    typeof body.fallbackText === "string" && body.fallbackText.trim()
      ? body.fallbackText
      : "マジでありがと！超エモい、もっと話して！";

  return {
    ok: true,
    prompt,
    fallbackText: sanitizeHfText(fallbackRaw, HF_MAX_FALLBACK_CHARS),
  };
}
