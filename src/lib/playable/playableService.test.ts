import { describe, expect, it } from "vitest";
import {
  buildServiceCssVars,
  sanitizeCssColor,
} from "@/lib/playable/buildServiceCssVars";
import { resolveServiceFontClass } from "@/lib/playable/serviceFontClasses";
import {
  buildServiceTheme,
  createPlayableServiceManifest,
  PLAYABLE_SERVICE_MANIFESTS,
} from "@/lib/playable/serviceThemeRegistry";

describe("playable service isolation", () => {
  it("builds brand-aligned themes without any", () => {
    const play = buildServiceTheme("liberty-play");
    expect(play.primaryColor).toMatch(/^#/);
    expect(play.backgroundColor).toBe("#0b1220");

    const manifest = createPlayableServiceManifest<{ title: string }>({
      id: "cat-profile",
      brandId: "liberty-play",
      theme: { primaryColor: "#fb7185" },
    });

    expect(manifest.id).toBe("cat-profile");
    expect(manifest.theme.primaryColor).toBe("#fb7185");
    expect(manifest.defaultLocale).toBe("ja");
    expect(PLAYABLE_SERVICE_MANIFESTS.play.brandId).toBe("liberty-play");
  });

  it("sanitizes CSS colors and rejects injection payloads", () => {
    expect(sanitizeCssColor("#abc", "#000")).toBe("#abc");
    expect(sanitizeCssColor("rgb(1, 2, 3)", "#000")).toBe("rgb(1, 2, 3)");
    expect(sanitizeCssColor("url(javascript:alert(1))", "#000")).toBe("#000");
    expect(sanitizeCssColor("red; } body {", "#111")).toBe("#111");
  });

  it("only emits safe custom CSS variables on the isolation root", () => {
    const style = buildServiceCssVars({
      primaryColor: "#C9A09A",
      backgroundColor: "#FAF9F6",
      fontClass: "font-sans",
      customCssVariables: {
        "--lc-service-surface": "rgba(0,0,0,0.5)",
        "--evil": "1",
        "--lc-service-hack": "url(https://evil.test)",
      } as never,
    });

    const record = style as Record<string, string>;
    expect(record["--lc-service-primary"]).toBe("#C9A09A");
    expect(record["--lc-service-surface"]).toBe("rgba(0,0,0,0.5)");
    expect(record["--evil"]).toBeUndefined();
    expect(record["--lc-service-hack"]).toBeUndefined();
  });

  it("whitelists font classes", () => {
    expect(resolveServiceFontClass("font-sans-jp")).toBe("font-sans-jp");
    expect(resolveServiceFontClass("font-evil hack")).toBe("font-sans");
  });
});
