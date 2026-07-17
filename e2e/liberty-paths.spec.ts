import { expect, test } from "@playwright/test";

test.describe("LibertyCanvas critical paths", () => {
  test("home loads and links to diagnosis catalog", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    const catalogLink = page.getByRole("link", {
      name: /カタログ|catalog|Catalog/i,
    });
    await expect(catalogLink.first()).toBeVisible();
  });

  test("diagnosis catalog lists official plug entries", async ({ page }) => {
    await page.goto("/diagnosis");
    await expect(
      page.getByRole("heading", { name: /診断カタログ|Catalog/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /personality|宇宙|Big Five|恋愛/i }).first(),
    ).toBeVisible();
  });

  test("plug play intro renders start button", async ({ page }) => {
    await page.goto("/diagnosis/play/personality-spectrum");
    await expect(
      page.getByRole("button", { name: /診断をはじめる|Start/i }),
    ).toBeVisible();
  });

  test("rubel play result links to plug bridge", async ({ page }) => {
    await page.goto("/play/rubel-introvert-level-v1");

    const option = page.getByRole("button").filter({ hasText: /.+/ }).first();
    await option.click();

    await expect(page.getByRole("link", { name: /宇宙|Cosmic|Plug|診断/i })).toBeVisible({
      timeout: 15_000,
    });

    const bridgeLink = page.getByRole("link", { name: /宇宙|Cosmic|Plug|診断/i }).first();
    const href = await bridgeLink.getAttribute("href");

    expect(href).toContain("/diagnosis/play/");
    expect(href).toContain("ref=rubel-bridge");
    expect(href).toContain("f=");
  });
});
