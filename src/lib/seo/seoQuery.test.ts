import { describe, expect, it } from "vitest";
import { filterUnifiedCatalogByQuery } from "@/lib/catalog/searchUnifiedCatalog";
import type { UnifiedDiscoveryEntry } from "@/lib/catalog/unifiedDiscoveryTypes";
import { buildHreflangAlternates } from "@/lib/seo/hreflang";
import { QUERY_PARAM_REGISTRY } from "@/lib/seo/queryParams";

const SAMPLE: UnifiedDiscoveryEntry[] = [
  {
    id: "1",
    slug: "neko",
    title: "あなたのネコ度診断",
    subtitle: "cat personality",
    eyebrow: "1問",
    estimatedMinutes: 1,
    themeColor: "#6366F1",
    href: "/play/neko",
    kind: "rubel-quick",
    questionCount: 1,
  },
  {
    id: "2",
    slug: "big-five",
    title: "Big Five OCEAN",
    subtitle: "学術系",
    eyebrow: "Plug",
    estimatedMinutes: 8,
    themeColor: "#8B5CF6",
    href: "/diagnosis/play/big-five",
    kind: "plug-official",
    questionCount: 24,
  },
];

describe("searchUnifiedCatalog", () => {
  it("matches semantic cat query to Japanese neko title", () => {
    const results = filterUnifiedCatalogByQuery(SAMPLE, "cat");
    expect(results.some((entry) => entry.slug === "neko")).toBe(true);
  });

  it("returns all entries for empty query", () => {
    expect(filterUnifiedCatalogByQuery(SAMPLE, "")).toHaveLength(2);
  });
});

describe("hreflang", () => {
  it("builds ja/en/ko/zh alternates", () => {
    const languages = buildHreflangAlternates("/diagnosis");
    expect(languages.ja).toContain("/diagnosis");
    expect(languages.en).toContain("lang=en");
    expect(languages["x-default"]).toBeDefined();
  });
});

describe("query param registry", () => {
  it("documents ref and planet params", () => {
    expect(QUERY_PARAM_REGISTRY.ref.analytics).toBe(true);
    expect(QUERY_PARAM_REGISTRY.planet.analytics).toBe(true);
  });
});
