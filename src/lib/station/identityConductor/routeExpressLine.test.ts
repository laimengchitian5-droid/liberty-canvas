import { describe, expect, it } from "vitest";
import { routeExpressLineFromAnswer } from "@/lib/station/identityConductor/routeExpressLine";

describe("routeExpressLineFromAnswer", () => {
  it("routes romance / bond vibes", () => {
    expect(routeExpressLineFromAnswer("職場の人間関係がやさしく揺れている")).toBe(
      "romance",
    );
  });

  it("routes shadow / cosmic vibes to genz", () => {
    expect(routeExpressLineFromAnswer("夜更かしのシャドウが近い")).toBe("genz");
  });

  it("routes OCEAN / logic vibes to big-five", () => {
    expect(routeExpressLineFromAnswer("論理と集中で整えたい")).toBe("big-five");
  });

  it("fail-closes empty answers to personality-spectrum", () => {
    expect(routeExpressLineFromAnswer("   ")).toBe("personality-spectrum");
  });
});
