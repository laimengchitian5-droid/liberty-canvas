import { describe, expect, it } from "vitest";
import { extractJsonObject } from "@/lib/station/identityConductor/extractJsonObject";
import { routeExpressLineFromAnswer } from "@/lib/station/identityConductor/routeExpressLine";
import { buildConductorFallbackResponse } from "@/lib/station/identityConductor/conductorFallback";
import { runIdentityConductor } from "@/lib/station/identityConductor/runIdentityConductor";
import {
  ConductorAiResponseSchema,
  ConductorRequestSchema,
  ConductorResponseSchema,
} from "@/types/conductor";

describe("ConductorRequestSchema", () => {
  it("accepts canonical userAnswer", () => {
    const parsed = ConductorRequestSchema.safeParse({
      locale: "ja",
      userAnswer: "やさしい琥珀の空気",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.userAnswer).toBe("やさしい琥珀の空気");
    }
  });

  it("accepts legacy answer alias", () => {
    const parsed = ConductorRequestSchema.safeParse({
      locale: "en",
      answer: "cool silver focus",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.userAnswer).toBe("cool silver focus");
    }
  });

  it("rejects empty payload", () => {
    expect(
      ConductorRequestSchema.safeParse({ locale: "ja" }).success,
    ).toBe(false);
  });
});

describe("ConductorAiResponseSchema", () => {
  it("rejects empty teaser", () => {
    expect(
      ConductorAiResponseSchema.safeParse({
        acknowledge: "ok",
        teaser: "",
      }).success,
    ).toBe(false);
  });
});

describe("extractJsonObject", () => {
  it("parses fenced JSON", () => {
    const value = extractJsonObject(
      '```json\n{"acknowledge":"a","teaser":"b"}\n```',
    );
    expect(value).toEqual({ acknowledge: "a", teaser: "b" });
  });
});

describe("runIdentityConductor fallback path", () => {
  it("always returns a valid ConductorResponse with deterministic slug", async () => {
    const result = await runIdentityConductor({
      locale: "ja",
      userAnswer: "推しが沼で熱中している",
    });

    expect(result.expressLineSlug).toBe("oshikatsu");
    expect(ConductorResponseSchema.safeParse(result).success).toBe(true);
    expect(result.ctaHref).toContain("/diagnosis/play/oshikatsu");
    expect(result.ctaHref).toContain("ref=identity-conductor");
  });

  it("routes romance independently of AI", () => {
    expect(routeExpressLineFromAnswer("恋愛の絆が揺れている")).toBe("romance");
  });

  it("fatal HA fallback never invents global-identity-core", () => {
    const fatal = buildConductorFallbackResponse({
      locale: "en",
      userAnswer: "quiet introvert calm",
    });
    expect(fatal.expressLineSlug).toBe("big-five");
    expect(fatal.expressLineSlug).not.toBe("global-identity-core");
    expect(fatal.ctaHref).toContain("/diagnosis/play/big-five");
    expect(ConductorResponseSchema.safeParse(fatal).success).toBe(true);
  });
});
