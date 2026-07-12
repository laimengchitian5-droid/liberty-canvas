import { describe, expect, it } from "vitest";
import {
  formatCharacterProfileHeadline,
  formatCharacterProfileLabel,
} from "@/lib/rubel/formatCharacterProfile";
import type { Result } from "@/types/rubel";

const sampleResult: Result = {
  id: "r1",
  name: "Social Introvert",
  baselineProfile: { openness: 1, empathy_need: 3, ego: 1 },
  aiConfig: { tone: "tsundere", activeTherapyMode: "strict_coaching" },
};

describe("formatCharacterProfile", () => {
  it("builds compact profile label", () => {
    expect(formatCharacterProfileLabel(sampleResult)).toBe("Tsundere Coach");
  });

  it("builds headline with result name", () => {
    expect(formatCharacterProfileHeadline(sampleResult)).toBe(
      "Tsundere Coach · Social Introvert",
    );
  });
});
