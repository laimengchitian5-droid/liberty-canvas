import { describe, expect, it, beforeEach } from "vitest";
import {
  clearRuntimeLocalizerCache,
  localizeDiagnosticContent,
} from "@/lib/visual/dynamicLocalizer";
import {
  buildFallbackRuntimeLocalization,
  defaultStartButtonText,
  parseRuntimeLocalization,
  runtimeLocalizationSchema,
} from "@/lib/visual/runtimeLocalizerSchema";
import { runtimeLocalizeRequestSchema } from "@/lib/validation/runtimeLocalizeRequestSchema";

const MASTER = {
  title: "あなたの心の色診断",
  description: "5つのやさしい質問から、あなたらしさを見つけます。",
} as const;

describe("runtime localization envelope", () => {
  beforeEach(() => {
    clearRuntimeLocalizerCache();
  });

  it("parses strict JSON matching the runtime interface", () => {
    const raw = JSON.stringify({
      internalReasoning: {
        culturalAdaptationAnalysisEnglish: "Warm CTA fits EN soft launch tone.",
        toneConsistencyCheckEnglish: "Adult-Cute retained; no clinical claim.",
      },
      localizedOutput: {
        title: "Your Heart Color Reading",
        description: "Five gentle questions reveal your soft signature.",
        startButtonText: "Start the journey",
      },
    });

    const parsed = parseRuntimeLocalization(raw);
    expect(parsed?.localizedOutput.startButtonText).toBe("Start the journey");
  });

  it("parses fenced JSON and rejects incomplete payloads", () => {
    const raw = `\`\`\`json
{"internalReasoning":{"culturalAdaptationAnalysisEnglish":"A","toneConsistencyCheckEnglish":"B"},"localizedOutput":{"title":"T","description":"D","startButtonText":"Go"}}
\`\`\``;
    expect(parseRuntimeLocalization(raw)?.localizedOutput.title).toBe("T");
    expect(parseRuntimeLocalization('{"localizedOutput":{}}')).toBeNull();
  });

  it("builds locale-aware CTA fallbacks without forcing Japanese buttons", () => {
    const en = buildFallbackRuntimeLocalization(MASTER, "en");
    expect(en.localizedOutput.title).toBe(MASTER.title);
    expect(en.localizedOutput.startButtonText).toBe("Start the journey");
    expect(defaultStartButtonText("ko")).toContain("진단");
    expect(defaultStartButtonText("fr")).toMatch(/Commencer/i);
  });

  it("short-circuits Japanese without needing a model", async () => {
    const result = await localizeDiagnosticContent(MASTER, "ja");
    expect(result.provider).toBe("identity");
    expect(result.usedFallback).toBe(false);
    expect(result.data.localizedOutput.title).toBe(MASTER.title);
    expect(result.data.localizedOutput.startButtonText).toBe("診断をはじめる");
  });

  it("strips API meta when validating UI payload", () => {
    const withMeta = {
      internalReasoning: {
        culturalAdaptationAnalysisEnglish: "ok",
        toneConsistencyCheckEnglish: "ok",
      },
      localizedOutput: {
        title: "Title",
        description: "Desc",
        startButtonText: "Begin",
      },
      meta: { provider: "fallback", usedFallback: true, cacheHit: false },
    };

    expect(runtimeLocalizationSchema.safeParse(withMeta).success).toBe(true);
  });

  it("validates request bounds", () => {
    expect(
      runtimeLocalizeRequestSchema.safeParse({
        master: MASTER,
        lang: "en",
      }).success,
    ).toBe(true);

    expect(
      runtimeLocalizeRequestSchema.safeParse({
        master: { title: " ", description: "x" },
        lang: "en",
      }).success,
    ).toBe(false);

    expect(
      runtimeLocalizeRequestSchema.safeParse({
        master: MASTER,
        lang: "xx",
      }).success,
    ).toBe(false);
  });
});
