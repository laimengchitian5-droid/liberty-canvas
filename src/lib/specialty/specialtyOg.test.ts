import { describe, expect, it } from "vitest";
import { resolveSpecialtyOgMeta } from "@/lib/specialty/specialtyOgMeta";
import { isSpecialtyPlugSlug } from "@/lib/specialty/specialtyHubCatalog";

describe("specialtyOg", () => {
  it("resolves world entry landing meta", () => {
    const meta = resolveSpecialtyOgMeta("world-specialty-soul");
    expect(meta?.isWorldEntry).toBe(true);
    expect(meta?.flagEmoji).toBe("🌍");
    expect(meta?.hashtag).toBe("#世界名産ソウル診断");
  });

  it("resolves world result meta from B archetype id", () => {
    const meta = resolveSpecialtyOgMeta(
      "world-specialty-soul",
      "lc-specialty-fr-terroir-poet",
    );
    expect(meta?.flagEmoji).toBe("🇫🇷");
    expect(meta?.archetypeTitle).toBe("テロワールの詩人");
  });

  it("resolves country deep-dive meta", () => {
    const meta = resolveSpecialtyOgMeta("uk-maturation-highlander");
    expect(meta?.countryNameJa).toBe("イギリス");
    expect(meta?.isWorldEntry).toBe(false);
  });
});

describe("specialtyHubCatalog", () => {
  it("detects specialty plug slugs", () => {
    expect(isSpecialtyPlugSlug("world-specialty-soul")).toBe(true);
    expect(isSpecialtyPlugSlug("fr-terroir-poet")).toBe(true);
    expect(isSpecialtyPlugSlug("personality-spectrum")).toBe(false);
  });
});
