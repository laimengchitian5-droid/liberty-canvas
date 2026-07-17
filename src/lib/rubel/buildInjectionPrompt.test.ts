import { describe, expect, it } from "vitest";
import {
  OPENING_INJECTION_MESSAGE,
  buildInjectionPrompt,
  buildInjectionSystemBlock,
} from "@/lib/rubel/buildInjectionPrompt";
import type { RubelResultData } from "@/lib/rubel/resultData";

const sampleResultData: RubelResultData = {
  title: "あなたの裏性格診断",
  typeName: "ガラスのハートの芸術家タイプ",
  tone: "ギャル（Gal-tone）",
  empathyLevel: "100%全肯定（Hyper-Supportive）",
  verbalizationAnchor: {
    questionText: "休日の過ごし方は？",
    chosenOptionText: "マイペースで本を読む",
  },
  compiledSystemPrompt: "You are a gal-tone companion for glass-heart artists.",
  intakeSource: "quiz",
};

describe("buildInjectionPrompt", () => {
  it("builds ChatML system block with injected context", () => {
    const block = buildInjectionSystemBlock(sampleResultData);

    expect(block).toContain("Platform: Liberty Canvas");
    expect(block).toContain("あなたの裏性格診断");
    expect(block).toContain("ガラスのハートの芸術家タイプ");
    expect(block).toContain("ギャル（Gal-tone）");
    expect(block).toContain("VERBALIZATION_ANCHOR");
    expect(block).toContain("マイペースで本を読む");
    expect(block).toContain("You are a gal-tone companion");
  });

  it("wraps system data in im_start tokens for Hugging Face", () => {
    const prompt = buildInjectionPrompt(sampleResultData, [], OPENING_INJECTION_MESSAGE);

    expect(prompt).toContain("<|im_start|>system");
    expect(prompt).toContain("<|im_start|>user");
    expect(prompt).toContain(OPENING_INJECTION_MESSAGE);
    expect(prompt).toContain("<|im_start|>assistant");
  });
});
