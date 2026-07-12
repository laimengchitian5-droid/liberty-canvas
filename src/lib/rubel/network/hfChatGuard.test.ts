import { describe, expect, it } from "vitest";
import {
  clampInjectionHistory,
  HF_MAX_PROMPT_CHARS,
  sanitizeHfText,
  validateRawPromptRequest,
} from "@/lib/rubel/network/hfChatGuard";

describe("hfChatGuard", () => {
  it("sanitizes control characters and clamps length", () => {
    const dirty = "hello\u0000world";
    expect(sanitizeHfText(dirty, 100)).toBe("helloworld");
    expect(sanitizeHfText("x".repeat(HF_MAX_PROMPT_CHARS + 50), HF_MAX_PROMPT_CHARS).length).toBe(
      HF_MAX_PROMPT_CHARS,
    );
  });

  it("validates raw prompt requests", () => {
    expect(validateRawPromptRequest({ prompt: "  hi  ", fallbackText: "fb" })).toEqual({
      ok: true,
      prompt: "hi",
      fallbackText: "fb",
    });

    expect(validateRawPromptRequest({ prompt: "" }).ok).toBe(false);
  });

  it("clamps history turns", () => {
    const history = Array.from({ length: 30 }, (_, index) => ({
      role: "user" as const,
      content: `turn-${index}`,
    }));

    expect(clampInjectionHistory(history)).toHaveLength(24);
  });
});
