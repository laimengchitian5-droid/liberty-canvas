import { describe, expect, it } from "vitest";
import {
  buildDiscoverHubPath,
  buildGlobalNavItems,
} from "@/components/navigation/buildGlobalNavItems";
import { getMessages } from "@/lib/i18n/messages";

const PATHS = {
  canvasHub: "/",
  discoverHub: "/discover/ja",
  plugEngine: "/diagnosis/play/personality-spectrum",
  playHub: "/play",
  stationHub: "/station/ja",
  stationDashboard: "/station/ja/dashboard",
  plugCatalog: "/diagnosis",
  forgeHub: "/create",
};

describe("buildGlobalNavItems", () => {
  it("maps sketch labels onto live routes (no dead paths)", () => {
    const items = buildGlobalNavItems(getMessages("ja").nav, PATHS);
    const hrefs = items.map((item) => item.href);

    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/discover/ja");
    expect(hrefs).toContain("/play");
    expect(hrefs).toContain("/station/ja");
    expect(hrefs).toContain("/station/ja/dashboard");
    expect(hrefs).not.toContain("/home");
    expect(hrefs).not.toContain("/ai-diagnostic");
    expect(hrefs).not.toContain("/my-achievements");
    expect(hrefs).not.toContain("/play-room");
  });

  it("uses locale-aware discover hub", () => {
    expect(buildDiscoverHubPath("en")).toBe("/discover/en");
    expect(buildDiscoverHubPath("ja")).toBe("/discover/ja");
  });

  it("marks station hub active without matching dashboard", () => {
    const items = buildGlobalNavItems(getMessages("ja").nav, PATHS);
    const station = items.find((item) => item.href === "/station/ja");
    expect(station?.isActive("/station/ja")).toBe(true);
    expect(station?.isActive("/station/ja/dashboard")).toBe(false);
  });
});
