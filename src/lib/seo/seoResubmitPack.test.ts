import { describe, expect, it } from "vitest";
import { getLandingCopy } from "@/lib/landing/landingCopy";
import {
  buildLandingMetadata,
  buildLandingPageDefinition,
  listAllLandingPages,
  listIndexableLandingPages,
} from "@/lib/landing/landingCatalog";
import {
  isUpcomingSpecialtyLandingSlug,
  listIndexableLandingTopicSlugs,
  shouldIndexLandingSlug,
} from "@/lib/landing/landingIndexPolicy";
import {
  buildResubmitSitemapEntries,
  renderResubmitSitemapXml,
} from "@/lib/seo/buildResubmitSitemap";

describe("Discover SEO brand + index policy", () => {
  it("uses Liberty Discover in SERP titles (no Canvas / LibertyCanvas)", () => {
    for (const slug of [
      "big-five-ocean",
      "enneagram-nine-types",
      "sixteen-personalities",
      "mbti-personality-types",
      "introvert-personality",
    ] as const) {
      const copy = getLandingCopy(slug, "en");
      expect(copy.title).toContain("Liberty Discover");
      expect(copy.title).not.toMatch(/Liberty\s*Canvas/i);
    }
  });

  it("marks upcoming specialty landings as non-indexable", () => {
    expect(isUpcomingSpecialtyLandingSlug("us-corn-frontier")).toBe(true);
    expect(isUpcomingSpecialtyLandingSlug("jp-sakamai-craft")).toBe(false);
    expect(shouldIndexLandingSlug("world-specialty-soul")).toBe(true);
  });

  it("noindexes upcoming specialty and canonicals to world hub", () => {
    const page = buildLandingPageDefinition("en", "us-corn-frontier");
    expect(page).toBeTruthy();
    const meta = buildLandingMetadata(page!);
    expect(meta.robots).toMatchObject({ index: false, follow: true });
    expect(String(meta.alternates?.canonical)).toContain(
      "/discover/en/world-specialty-soul",
    );
  });

  it("indexes live specialty landings", () => {
    const page = buildLandingPageDefinition("ja", "jp-sakamai-craft");
    const meta = buildLandingMetadata(page!);
    expect(meta.robots).toMatchObject({ index: true, follow: true });
  });

  it("excludes upcoming pages from indexable listing (84 = 14×6)", () => {
    expect(listAllLandingPages()).toHaveLength(120);
    expect(listIndexableLandingTopicSlugs()).toHaveLength(14);
    expect(listIndexableLandingPages()).toHaveLength(84);
  });
});

describe("buildResubmitSitemap", () => {
  it("renders xml without upcoming specialty country URLs", () => {
    const entries = buildResubmitSitemapEntries("https://example.com");
    const xml = renderResubmitSitemapXml(entries);
    expect(xml).toContain("https://example.com/discover/ja/world-specialty-soul");
    expect(xml).toContain("https://example.com/discover/ja/jp-sakamai-craft");
    expect(xml).not.toContain("/us-corn-frontier");
    expect(xml).not.toContain("/ca-maple-resilience");
    expect(entries.length).toBeGreaterThan(50);
  });
});
