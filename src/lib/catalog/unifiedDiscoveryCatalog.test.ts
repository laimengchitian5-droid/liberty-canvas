import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getInsightsSecret,
  isInsightsAccessAllowed,
} from "@/lib/auth/verifyInsightsAccess";
import { groupUnifiedDiscoveryCatalog } from "@/lib/catalog/unifiedDiscoveryCatalog";

describe("verifyInsightsAccess", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows development without secret", () => {
    vi.stubEnv("NODE_ENV", "development");

    expect(isInsightsAccessAllowed({ headerKey: null })).toBe(true);
  });

  it("matches header key to configured secret", () => {
    vi.stubEnv("LC_INSIGHTS_SECRET", "test-secret");
    vi.stubEnv("NODE_ENV", "production");

    expect(isInsightsAccessAllowed({ headerKey: "test-secret" })).toBe(true);
    expect(isInsightsAccessAllowed({ headerKey: "wrong" })).toBe(false);
  });

  it("returns null secret when unset", () => {
    vi.unstubAllEnvs();
    const previous = process.env.LC_INSIGHTS_SECRET;
    delete process.env.LC_INSIGHTS_SECRET;
    expect(getInsightsSecret()).toBeNull();
    if (previous !== undefined) {
      process.env.LC_INSIGHTS_SECRET = previous;
    }
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
