import { describe, expect, it } from "vitest";
import { multilingualSearch } from "@/lib/rubel/multilingualSearch";
import { JA_NEKO_DIAGNOSIS, SAMPLE_CAT_DOG_DIAGNOSIS } from "@/lib/rubel/seedDiagnoses";

describe("multilingualSearch", () => {
  const catalog = [JA_NEKO_DIAGNOSIS, SAMPLE_CAT_DOG_DIAGNOSIS];

  it('surfaces Japanese neko diagnosis when searching "cat" in English', () => {
    const results = multilingualSearch("cat", catalog);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.diagnosisId).toBe("rubel-neko-ja-v1");
    expect(results[0]?.matchedTokens.length).toBeGreaterThan(0);
  });

  it('matches "ネコ" query against English cat diagnosis keywords', () => {
    const results = multilingualSearch("ネコ", catalog);

    expect(results.some((entry) => entry.diagnosisId === "rubel-cat-dog-v1")).toBe(
      true,
    );
  });

  it("returns empty ranked list when nothing matches", () => {
    const results = multilingualSearch("xqzwxqvn", catalog);

    expect(results).toHaveLength(0);
  });
});
