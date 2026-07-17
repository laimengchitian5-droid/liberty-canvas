import { describe, expect, it } from "vitest";
import { PRODUCT_NAME, PRODUCT_TAGLINE_EN } from "@/lib/brand/constants";
import {
  assertHomeSerpInvariants,
  buildHomeSerpCopy,
  buildHomeSerpTitleJa,
  buildHomeSoftwareAlternateNames,
  HOME_SERP_LIMITS,
} from "@/lib/seo/homeSerp";
import { buildHomeDescription, buildHomeTitle } from "@/lib/rubel/rubelSeo";
import { buildOrganizationEntity } from "@/lib/seo/schemaGraph";

describe("homeSerp contract", () => {
  it("leads with brand and stays within SERP budgets", () => {
    const copy = buildHomeSerpCopy();
    expect(copy.title.startsWith(PRODUCT_NAME)).toBe(true);
    expect(copy.title).toContain("AI Personality Test");
    expect(copy.description).toBe(PRODUCT_TAGLINE_EN);
    expect(copy.title.length).toBeLessThanOrEqual(HOME_SERP_LIMITS.titleMax);
    expect(copy.description.length).toBeLessThanOrEqual(HOME_SERP_LIMITS.descriptionMax);
    expect(() => assertHomeSerpInvariants(copy)).not.toThrow();
  });

  it("forbids trademark and system jargon on home surfaces", () => {
    const blob = [
      buildHomeTitle(),
      buildHomeDescription(),
      buildHomeSerpTitleJa(),
      ...buildHomeSoftwareAlternateNames(),
    ].join("\n");
    expect(blob).not.toMatch(/\b(MBTI|16Personalities|Likert|Kraepelin)\b/i);
  });

  it("exposes software alternateNames for entity disambiguation", () => {
    const names = buildHomeSoftwareAlternateNames();
    expect(names).toContain("AI personality test");
    expect(names).toContain("無料AI性格診断");

    const org = buildOrganizationEntity("https://liberty-canvas.vercel.app");
    expect(org.alternateName).toEqual(expect.arrayContaining(["AI personality test"]));
  });

  it("wires rubelSeo home builders to the contract", () => {
    expect(buildHomeTitle()).toBe(buildHomeSerpCopy().title);
    expect(buildHomeDescription()).toBe(buildHomeSerpCopy().description);
  });
});
