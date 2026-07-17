import { describe, expect, it } from "vitest";
import {
  buildFallbackGameContent,
  gameContentSchema,
  parseGameContent,
  resolveGameLocale,
  SEO_DESCRIPTION_MAX,
} from "@/lib/playable/gameContentSchema";
import { resolveServiceLocaleFontClass } from "@/lib/playable/serviceFontClasses";
import { RTL_LOCALES } from "@/lib/i18n/config";

describe("gameContentSchema", () => {
  it("accepts E-E-A-T shaped quiz payloads", () => {
    const parsed = parseGameContent({
      title: "Burnout Archetype",
      description: "Find your soft recovery style in five gentle questions.",
      questions: [
        {
          id: "q1",
          text: "When tired, what do you reach for first?",
          options: [
            { value: "rest", label: "Quiet rest" },
            { value: "talk", label: "A short chat" },
          ],
        },
      ],
    });

    expect(parsed?.title).toBe("Burnout Archetype");
    expect(parsed?.questions).toHaveLength(1);
  });

  it("rejects oversized SERP descriptions and single-option questions", () => {
    expect(
      gameContentSchema.safeParse({
        title: "Ok",
        description: "x".repeat(SEO_DESCRIPTION_MAX + 1),
        questions: [
          {
            id: "q1",
            text: "Q",
            options: [
              { value: "a", label: "A" },
              { value: "b", label: "B" },
            ],
          },
        ],
      }).success,
    ).toBe(false);

    expect(
      parseGameContent({
        title: "Ok",
        description: "Short",
        questions: [
          {
            id: "q1",
            text: "Q",
            options: [{ value: "a", label: "Only one" }],
          },
        ],
      }),
    ).toBeNull();
  });

  it("maps unsupported ISO tags onto app locales (197-country fallback net)", () => {
    expect(resolveGameLocale("es")).toBe("en");
    expect(resolveGameLocale("pt-BR")).toBe("en");
    expect(resolveGameLocale("zh-CN")).toBe("zh");
    expect(resolveGameLocale("ja-JP")).toBe("ja");
    expect(resolveGameLocale("xx")).toBe("ja");
  });

  it("builds locale-aware fallbacks within SEO bounds", () => {
    const ja = buildFallbackGameContent("ja");
    expect(ja.description.length).toBeLessThanOrEqual(SEO_DESCRIPTION_MAX);
    expect(ja.questions[0]?.options.length).toBeGreaterThanOrEqual(2);

    const en = buildFallbackGameContent("en");
    expect(en.title).toMatch(/Personality|Gentle/i);
  });

  it("resolves locale×service fonts and RTL membership in O(1)", () => {
    expect(resolveServiceLocaleFontClass("ja", "font-sans")).toBe("font-sans-jp");
    expect(resolveServiceLocaleFontClass("en", "font-mono")).toBe("font-mono");
    expect(RTL_LOCALES.has("ar")).toBe(true);
    expect(RTL_LOCALES.has("he")).toBe(true);
    expect(RTL_LOCALES.has("ja")).toBe(false);
  });
});
