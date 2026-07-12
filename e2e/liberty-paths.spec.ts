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
});
