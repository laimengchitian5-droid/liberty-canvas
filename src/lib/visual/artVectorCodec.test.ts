import { describe, expect, it } from "vitest";
import {
  buildLibertyResultPath,
  parseArtVectorParam,
  serializeArtVectorParam,
} from "@/lib/visual/artVectorCodec";

describe("artVectorCodec", () => {
  it("round-trips an 8-axis vector", () => {
    const source = [4, 5, 6, 3, 5, 4, 6, 5];
    const encoded = serializeArtVectorParam(source);
    expect(encoded).toBe("4,5,6,3,5,4,6,5");
    expect(parseArtVectorParam(encoded)).toEqual(source);
  });

  it("rejects invalid params", () => {
    expect(parseArtVectorParam(null)).toBeNull();
    expect(parseArtVectorParam("a,b")).toBeNull();
    expect(parseArtVectorParam("")).toBeNull();
  });

  it("builds /result paths (never /chat)", () => {
    const path = buildLibertyResultPath({
      vector: [4, 5, 6, 3, 5, 4, 6, 5],
      seed: "ステラ",
    });
    expect(path.startsWith("/result?")).toBe(true);
    expect(path).toContain("vector=");
    expect(decodeURIComponent(path)).toContain("4,5,6,3,5,4,6,5");
    expect(path).not.toContain("/chat");
  });
});
