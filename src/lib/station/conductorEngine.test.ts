import { describe, expect, it } from "vitest";
import {
  buildConductorSystemPrompt,
  planConductorTurn,
  routeExpressLineFromAnswer,
} from "@/lib/station/conductorEngine";
import { CONDUCTOR_EXPRESS_SLUGS } from "@/types/conductor";

describe("conductorEngine", () => {
  it("never emits invented sketch slugs", () => {
    const samples = [
      "I feel active and 外向",
      "quiet 内向 evening",
      "workplace team stress",
      "推しが熱中",
      "",
    ];

    for (const sample of samples) {
      const slug = routeExpressLineFromAnswer(sample);
      expect(CONDUCTOR_EXPRESS_SLUGS).toContain(slug);
      expect(slug).not.toMatch(/mind-explorer|career-nexus|global-identity-core/);
    }
  });

  it("maps energy-high / energy-low bands to live Plug lines", () => {
    expect(routeExpressLineFromAnswer("active and outgoing")).toBe(
      "personality-spectrum",
    );
    expect(routeExpressLineFromAnswer("quiet introvert calm")).toBe("big-five");
  });

  it("keeps specialty rules ahead of energy bands", () => {
    expect(routeExpressLineFromAnswer("active 推し活")).toBe("oshikatsu");
  });

  it("locks express slug inside the system prompt", () => {
    const prompt = buildConductorSystemPrompt("ja", "big-five");
    expect(prompt).toContain('id="big-five"');
    expect(prompt).toContain("10-second");
    expect(prompt).not.toContain("mind-explorer");
  });

  it("plans a turn from ConductorRequest without non-null assertions", () => {
    const plan = planConductorTurn({
      locale: "ja",
      userAnswer: "職場の雰囲気が重い",
    });
    expect(plan.expressLineSlug).toBe("motivation-spectrum");
    expect(plan.systemPrompt).toContain("motivation-spectrum");
  });
});
