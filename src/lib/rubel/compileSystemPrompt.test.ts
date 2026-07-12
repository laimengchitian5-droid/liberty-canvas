import { describe, expect, it } from "vitest";
import {
  compileSystemPrompt,
  resolveEmpathyLevel,
} from "@/lib/rubel/compileSystemPrompt";
import type { Result } from "@/types/rubel";

const sampleResult: Result = {
  id: "result-cat",
  name: "Whimsical Black Cat Type",
  baselineProfile: { openness: -3, empathy_need: -2, ego: 2 },
  aiConfig: {
    tone: "gal",
    activeTherapyMode: "unconditional_praise",
  },
};

const sampleProfile = { openness: -4, empathy_need: -1, ego: 1 };

describe("compileSystemPrompt", () => {
  it("outputs ChatCompletion-compatible agent injection header", () => {
    const compiled = compileSystemPrompt(sampleResult, sampleProfile);

    expect(compiled.systemPrompt).toContain(
      "Role: You are an immersive virtual companion character.",
    );
    expect(compiled.systemPrompt).toContain("Personality Model: Gal");
    expect(compiled.systemPrompt).toContain("hyper_supportive strict filter");
    expect(compiled.systemPrompt).toContain(
      "Output constraints: Match the user's input language automatically. Never break character.",
    );
    expect(compiled.personaLabel).toBe("Whimsical Black Cat Type");
  });

  it("maps strict coaching to direct_accountability empathy level", () => {
    const compiled = compileSystemPrompt(
      {
        ...sampleResult,
        aiConfig: {
          tone: "tsundere",
          activeTherapyMode: "strict_coaching",
        },
      },
      sampleProfile,
    );

    expect(compiled.systemPrompt).toContain("Personality Model: Tsundere");
    expect(compiled.systemPrompt).toContain("direct_accountability strict filter");
    expect(compiled.systemPrompt).toContain("accountability-focused");
  });

  it("embeds computed trait profile in system prompt", () => {
    const compiled = compileSystemPrompt(sampleResult, sampleProfile);

    expect(compiled.systemPrompt).toContain("openness=-4");
    expect(compiled.systemPrompt).toContain("empathy_need=-1");
    expect(compiled.systemPrompt).toContain("ego=1");
  });

  it("includes diagnosis complete opening directive", () => {
    const compiled = compileSystemPrompt(sampleResult, sampleProfile);

    expect(compiled.openingUserMessage).toContain("[DIAGNOSIS_COMPLETE]");
    expect(compiled.systemPrompt).toContain("Opening behavior");
  });
});

describe("resolveEmpathyLevel", () => {
  it("maps therapy modes to empathy levels", () => {
    expect(resolveEmpathyLevel("unconditional_praise")).toBe("hyper_supportive");
    expect(resolveEmpathyLevel("strict_coaching")).toBe("direct_accountability");
    expect(resolveEmpathyLevel("emotional_mirror")).toBe("reflective_mirroring");
  });
});
