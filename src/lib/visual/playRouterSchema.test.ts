import { describe, expect, it, beforeEach } from "vitest";
import {
  clearPlayRouterCache,
  generatePlayRouterBulk,
} from "@/lib/visual/generatePlayRouterBulk";
import {
  buildFallbackPlayRouterBulk,
  mergeRoutesWithDeterministicPaths,
  parsePlayRouterBulk,
  playRouterBulkSchema,
} from "@/lib/visual/playRouterSchema";
import { sanitizePlayPath } from "@/lib/visual/sanitizePlayPath";
import { playRouterRequestSchema } from "@/lib/validation/playRouterRequestSchema";

const RAW = [
  {
    id: "c-3",
    rawTitle: "What's Your Burnout Archetype?",
    rawPath: "/play/rubel-burnout-v1",
  },
  {
    id: "c-4",
    rawTitle: "あなたのネコ度診断",
    rawPath: "/play/cat-profile",
  },
] as const;

describe("play router sanitization", () => {
  beforeEach(() => {
    clearPlayRouterCache();
  });

  it("keeps /play as canonical Rubel runtime (does not force /app)", () => {
    expect(sanitizePlayPath("/play/rubel-burnout-v1")).toBe("/play/rubel-burnout-v1");
    expect(sanitizePlayPath("/app/forge-tool-1")).toBe("/app/forge-tool-1");
    expect(sanitizePlayPath("/diagnosis/play/big-five")).toBe(
      "/diagnosis/play/big-five",
    );
  });

  it("rewrites legacy diagnosis paths and rejects external injection", () => {
    expect(sanitizePlayPath("/diagnosis/big-five")).toBe("/diagnosis/play/big-five");
    expect(sanitizePlayPath("/quiz/cat-profile")).toBe("/play/cat-profile");
    expect(sanitizePlayPath("https://evil.example/play/x")).toBeNull();
    expect(sanitizePlayPath("//evil.example/play/x")).toBeNull();
    expect(sanitizePlayPath("/play/../etc/passwd")).toBeNull();
  });

  it("ignores AI-invented paths and re-binds deterministic targets", () => {
    const merged = mergeRoutesWithDeterministicPaths(
      [
        {
          id: "c-3",
          localizedTitle: "Burnout Archetype",
          localizedLocations: "Tokyo / New York / London",
          localizedTrendingTag: "Trending",
          targetCleanPath: "/app/hijacked-path",
        },
      ],
      RAW,
      "en",
    );

    expect(merged[0]?.targetCleanPath).toBe("/play/rubel-burnout-v1");
    expect(merged[0]?.localizedTitle).toBe("Burnout Archetype");
    expect(merged).toHaveLength(2);
  });

  it("parses fenced JSON and builds locale-aware fallbacks", () => {
    const raw = `\`\`\`json
{"internalReasoning":{"slugContextDeconstructionEnglish":"A","routingSanitizationJustificationEnglish":"B"},"localizedOutput":{"sanitizedRoutes":[{"id":"c-3","localizedTitle":"T","localizedLocations":"L","localizedTrendingTag":"Trending","targetCleanPath":"/play/rubel-burnout-v1"}]}}
\`\`\``;
    expect(parsePlayRouterBulk(raw)?.localizedOutput.sanitizedRoutes[0]?.id).toBe(
      "c-3",
    );

    const ja = buildFallbackPlayRouterBulk(RAW, "ja");
    expect(ja.localizedOutput.sanitizedRoutes[0]?.localizedTrendingTag).toBe("急上昇");
    expect(ja.localizedOutput.sanitizedRoutes[0]?.targetCleanPath).toBe(
      "/play/rubel-burnout-v1",
    );

    const fr = buildFallbackPlayRouterBulk(RAW, "fr");
    expect(fr.localizedOutput.sanitizedRoutes[0]?.localizedTrendingTag).toBe(
      "En vogue",
    );
  });

  it("strips API meta on schema parse", () => {
    expect(
      playRouterBulkSchema.safeParse({
        internalReasoning: {
          slugContextDeconstructionEnglish: "ok",
          routingSanitizationJustificationEnglish: "ok",
        },
        localizedOutput: {
          sanitizedRoutes: [
            {
              id: "c-3",
              localizedTitle: "T",
              localizedLocations: "L",
              localizedTrendingTag: "Trending",
              targetCleanPath: "/play/x",
            },
          ],
        },
        meta: { provider: "fallback" },
      }).success,
    ).toBe(true);
  });

  it("returns deterministic fallback without a model", async () => {
    const result = await generatePlayRouterBulk(RAW, "en");
    expect(result.data.localizedOutput.sanitizedRoutes.length).toBe(2);
    expect(
      result.data.localizedOutput.sanitizedRoutes.every((r) =>
        r.targetCleanPath.startsWith("/play/"),
      ),
    ).toBe(true);
  });

  it("validates request bounds", () => {
    expect(
      playRouterRequestSchema.safeParse({ cards: RAW, lang: "ja" }).success,
    ).toBe(true);
    expect(playRouterRequestSchema.safeParse({ cards: [], lang: "ja" }).success).toBe(
      false,
    );
    expect(
      playRouterRequestSchema.safeParse({ cards: RAW, lang: "xx" }).success,
    ).toBe(false);
  });
});
