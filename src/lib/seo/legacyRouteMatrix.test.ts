import { describe, expect, it } from "vitest";
import {
  buildLegacyRedirectUrl,
  resolveLegacyDiagnosisRedirect,
} from "@/lib/seo/legacyRouteMatrix";

describe("legacyRouteMatrix", () => {
  it("maps GSC enneagram legacy path to motivation-spectrum play", () => {
    expect(resolveLegacyDiagnosisRedirect("/diagnosis/enneagram")).toBe(
      "/diagnosis/play/motivation-spectrum",
    );
  });

  it("preserves lang query and adds ref on redirect build", () => {
    const source = new URL(
      "https://liberty-canvas.vercel.app/diagnosis/enneagram?lang=ko",
    );
    const target = buildLegacyRedirectUrl(
      source,
      "/diagnosis/play/motivation-spectrum",
    );

    expect(target.pathname).toBe("/diagnosis/play/motivation-spectrum");
    expect(target.searchParams.get("lang")).toBe("ko");
    expect(target.searchParams.get("ref")).toBe("gsc-legacy");
  });

  it("does not overwrite an existing ref", () => {
    const source = new URL(
      "https://liberty-canvas.vercel.app/diagnosis/big-five?ref=discover-ja",
    );
    const target = buildLegacyRedirectUrl(source, "/diagnosis/play/big-five");

    expect(target.searchParams.get("ref")).toBe("discover-ja");
  });
});
