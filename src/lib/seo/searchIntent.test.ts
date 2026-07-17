import { describe, expect, it } from "vitest";
import {
  appendSearchRefToHref,
  buildSearchRef,
  inferQueryIntent,
  intentRankBoost,
} from "@/lib/seo/searchIntent";
import { searchUnifiedCatalog } from "@/lib/catalog/searchUnifiedCatalog";
import type { UnifiedDiscoveryEntry } from "@/lib/catalog/unifiedDiscoveryTypes";

const SAMPLE: UnifiedDiscoveryEntry[] = [
  {
    id: "1",
    slug: "romance",
    title: "恋愛宇宙診断",
    subtitle: "love personality",
    eyebrow: "Plug",
    estimatedMinutes: 8,
    themeColor: "#6366F1",
    href: "/diagnosis/play/romance",
    kind: "plug-official",
    questionCount: 20,
    searchIntent: "transactional",
    searchTags: ["love", "romance", "恋愛"],
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
    searchIntent: "informational",
    searchTags: ["big five", "ocean"],
  },
];

describe("searchIntent", () => {
  it("infers transactional intent from action queries", () => {
    expect(inferQueryIntent("free personality test")).toBe("transactional");
  });

  it("boosts plug-official for transactional queries", () => {
    expect(
      intentRankBoost("transactional", "transactional", "plug-official"),
    ).toBeGreaterThan(intentRankBoost("informational", "transactional", "plug-official"));
  });

  it("builds search ref slugs", () => {
    expect(buildSearchRef("romance")).toBe("search-romance");
    expect(appendSearchRefToHref("/diagnosis/play/romance", "romance")).toContain(
      "ref=search-romance",
    );
  });

  it("ranks romance for love semantic query", () => {
    const hits = searchUnifiedCatalog(SAMPLE, "love test");
    expect(hits[0]?.entry.slug).toBe("romance");
    expect(hits[0]?.queryIntent).toBe("transactional");
  });
});
