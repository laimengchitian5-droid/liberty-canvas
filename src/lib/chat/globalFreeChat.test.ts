import { describe, expect, it } from "vitest";
import {
  GLOBAL_FREE_CHAT_PERSONA,
  GLOBAL_FREE_CHAT_SYSTEM_PROMPT,
  getGlobalChatCopy,
} from "@/lib/chat/globalFreeChat";
import { buildDynamicSystemPrompt } from "@/lib/ai/buildChatSystemPrompt";

describe("global free chat", () => {
  it("exposes welcoming prompt without requiring diagnosis", () => {
    expect(GLOBAL_FREE_CHAT_PERSONA).toBe("global-companion");
    expect(GLOBAL_FREE_CHAT_SYSTEM_PROMPT).toMatch(/without creating an account/i);
    expect(GLOBAL_FREE_CHAT_SYSTEM_PROMPT).toMatch(/not a licensed clinician/i);
  });

  it("localizes UI copy for core locales", () => {
    expect(getGlobalChatCopy("ja").cta).toContain("自由");
    expect(getGlobalChatCopy("en").metaTitle).toContain("No Signup");
  });

  it("uses guest companion path in dynamic prompt", () => {
    const prompt = buildDynamicSystemPrompt({
      messages: [{ role: "user", content: "hola" }],
      systemPrompt: GLOBAL_FREE_CHAT_SYSTEM_PROMPT,
      appliedPersona: GLOBAL_FREE_CHAT_PERSONA,
      isReliable: true,
      archetype: "unknown",
      mode: "adaptive",
      locale: "es",
    });

    expect(prompt).toMatch(/global conversation companion/i);
    expect(prompt).not.toMatch(/Kraepelin fatigue/);
  });
});
