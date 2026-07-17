import { describe, expect, it } from "vitest";
import {
  buildPlatformGameMetadata,
  canonicalUrlToPath,
  resolvePlatformCanonicalUrl,
} from "@/lib/playable/buildPlatformGameMetadata";
import type { GameContent } from "@/lib/playable/gameContentSchema";
import { getSiteUrl } from "@/lib/site/url";

const CONTENT: GameContent = {
  title: "Burnout Archetype",
  description: "A gentle quiz about recovery style.",
  questions: [
    {
      id: "q1",
      text: "When tired, what helps first?",
      options: [
        { value: "a", label: "Rest" },
        { value: "b", label: "Talk" },
      ],
    },
  ],
};

describe("buildPlatformGameMetadata", () => {
  it("builds title, canonical, and hreflang without broken vercel.app{loc} URLs", () => {
    const meta = buildPlatformGameMetadata({
      content: CONTENT,
      canonicalUrl: "/play/rubel-burnout-v1",
      manifest: { id: "liberty-play-runtime", brandId: "liberty-play" },
    });

    const site = getSiteUrl();
    expect(meta.title).toContain("Burnout Archetype");
    expect(meta.alternates?.canonical).toBe(`${site}/play/rubel-burnout-v1`);
    expect(meta.alternates?.languages?.en).toContain(`${site}/play/rubel-burnout-v1`);
    expect(meta.alternates?.languages?.en).toContain("lang=en");
    expect(meta.alternates?.languages?.["x-default"]).toBe(
      `${site}/play/rubel-burnout-v1`,
    );
    expect(JSON.stringify(meta.alternates?.languages)).not.toContain(
      "vercel.app{",
    );
  });

  it("rejects external canonical hijacks", () => {
    expect(resolvePlatformCanonicalUrl("https://evil.example/play/x")).toBe(
      getSiteUrl(),
    );
    expect(resolvePlatformCanonicalUrl("//evil.example/x")).toBe(getSiteUrl());
    expect(canonicalUrlToPath("/play/cat-profile")).toBe("/play/cat-profile");
  });
});
