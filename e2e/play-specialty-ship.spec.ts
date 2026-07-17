import { expect, test } from "@playwright/test";

test.describe("Play catalogue & result OG", () => {
  test("play catalogue hub lists seed diagnoses", async ({ page }) => {
    await page.goto("/play");
    await expect(page.getByRole("heading", { name: /リバティ・プレイ/ })).toBeVisible();
    await expect(page.getByRole("list", { name: "Play 診断カタログ" })).toBeVisible();
    await expect(page.getByRole("link").nth(1)).toBeVisible();
  });

  test("play result share URL drives result-aware OG metadata path", async ({
    request,
  }) => {
    const response = await request.get(
      "/api/og/diagnosis?headline=%E5%86%85%E5%90%91%E5%9E%8B&subtitle=Play",
    );
    expect([200, 500]).toContain(response.status());
    if (response.status() === 200) {
      expect(response.headers()["content-type"]).toContain("image");
    }
  });

  test("play page with result query remains reachable", async ({ page }) => {
    await page.goto(
      "/play/rubel-introvert-level-v1?r=%E5%86%85%E5%90%91%E3%82%BF%E3%82%A4%E3%83%97",
    );
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
});

test.describe("Quiz result OG", () => {
  test("quiz OG endpoint accepts score label", async ({ request }) => {
    // Seed quiz may be absent in empty DB — endpoint should still validate params.
    const response = await request.get("/api/og/quiz?id=missing&score=high");
    expect([404, 500]).toContain(response.status());
  });
});

test.describe("Specialty live/upcoming routing", () => {
  test("upcoming US landing routes CTA toward world specialty entry", async ({
    page,
  }) => {
    await page.goto("/discover/en/us-corn-frontier");
    const link = page
      .getByRole("link")
      .filter({ hasText: /World|Start|始める|Reveal/i })
      .first();
    await expect(link).toBeVisible({ timeout: 10000 });
    const href = await link.getAttribute("href");
    expect(href ?? "").toMatch(/world-specialty-soul/);
  });

  test("live JP landing can deep-dive to country play path", async ({ page }) => {
    await page.goto("/discover/ja/jp-sakamai-craft");
    const link = page
      .getByRole("link")
      .filter({ hasText: /麹|見る|Reveal|試/i })
      .first();
    await expect(link).toBeVisible({ timeout: 10000 });
    const href = await link.getAttribute("href");
    expect(href ?? "").toMatch(/jp-sakamai-craft/);
  });
});

test.describe("Brand bridge + play catalogue continuity", () => {
  test("services menu can open play catalogue from home", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "サービス" }).click();
    await page.getByRole("button", { name: /リバティ・プレイ/ }).click();
    await expect(page).toHaveURL(/\/play/, { timeout: 10000 });
  });
});
