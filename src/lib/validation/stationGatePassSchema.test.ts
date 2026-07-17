import { describe, expect, it } from "vitest";
import { stationGatePassSchema } from "@/lib/validation/stationGatePassSchema";

describe("stationGatePassSchema", () => {
  it("accepts known platforms and visit types", () => {
    expect(
      stationGatePassSchema.safeParse({
        platformId: "big-five",
        visitType: "external",
      }).success,
    ).toBe(true);
  });

  it("rejects unknown platforms and extra keys", () => {
    expect(
      stationGatePassSchema.safeParse({
        platformId: "cat-test",
        visitType: "internal",
      }).success,
    ).toBe(false);

    expect(
      stationGatePassSchema.safeParse({
        platformId: "enneagram",
        visitType: "external",
        encryptionSecret: "leak",
      }).success,
    ).toBe(false);
  });
});
