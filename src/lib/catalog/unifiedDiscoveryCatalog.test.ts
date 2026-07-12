import { describe, expect, it } from "vitest";
import {
  getInsightsSecret,
  isInsightsAccessAllowed,
} from "@/lib/auth/verifyInsightsAccess";
import { groupUnifiedDiscoveryCatalog } from "@/lib/catalog/unifiedDiscoveryCatalog";

describe("verifyInsightsAccess", () => {
  it("allows development without secret", () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    expect(isInsightsAccessAllowed({ headerKey: null })).toBe(true);

    process.env.NODE_ENV = previous;
  });

  it("matches header key to configured secret", () => {
    const previous = process.env.LC_INSIGHTS_SECRET;
    process.env.LC_INSIGHTS_SECRET = "test-secret";
    process.env.NODE_ENV = "production";

    expect(
      isInsightsAccessAllowed({ headerKey: "test-secret" }),
    ).toBe(true);
    expect(
      isInsightsAccessAllowed({ headerKey: "wrong" }),
    ).toBe(false);

    process.env.LC_INSIGHTS_SECRET = previous;
    process.env.NODE_ENV = "test";
  });

  it("returns null secret when unset", () => {
    const previous = process.env.LC_INSIGHTS_SECRET;
    delete process.env.LC_INSIGHTS_SECRET;
    expect(getInsightsSecret()).toBeNull();
    process.env.LC_INSIGHTS_SECRET = previous;
  });
});

describe("groupUnifiedDiscoveryCatalog", () => {
  it("partitions entries by kind", () => {
    const grouped = groupUnifiedDiscoveryCatalog([
      {
        id: "1",
        slug: "a",
        title: "A",
        subtitle: "",
        eyebrow: "",
        estimatedMinutes: 5,
        themeColor: "#fff",
        href: "/a",
        kind: "plug-official",
        questionCount: 6,
      },
      {
        id: "2",
        slug: "b",
        title: "B",
        subtitle: "",
        eyebrow: "",
        estimatedMinutes: 1,
        themeColor: "#fff",
        href: "/b",
        kind: "rubel-quick",
        questionCount: 1,
      },
    ]);

    expect(grouped.plugOfficial).toHaveLength(1);
    expect(grouped.rubelQuick).toHaveLength(1);
    expect(grouped.plugCommunity).toHaveLength(0);
  });
});
