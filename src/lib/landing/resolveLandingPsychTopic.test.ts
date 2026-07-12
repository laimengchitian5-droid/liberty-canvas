import { describe, expect, it } from "vitest";
import { resolveLandingPsychTopic } from "@/lib/landing/resolveLandingPsychTopic";

describe("resolveLandingPsychTopic", () => {
  it("maps explicit landing slugs to psych topics", () => {
    expect(resolveLandingPsychTopic("enneagram-nine-types")).toBe("enneagram");
    expect(resolveLandingPsychTopic("big-five-ocean")).toBe("big-five");
  });

  it("defaults personality spectrum slugs to big-five intake", () => {
    expect(resolveLandingPsychTopic("mbti-personality-types")).toBe("big-five");
  });
});
