import { expect, test } from "@playwright/test";

test.describe("Liberty result dashboard", () => {
  test("result page renders from vector query", async ({ page }) => {
    await page.goto("/result?vector=4,5,6,3,5,4,6,5&seed=Stella");

    await expect(page.getByText(/心の色を読みとっています|ステラ|Stella|やわらかい|Soft glow|AI全肯定/i).first()).toBeVisible({
      timeout: 15_000,
    });

    await expect(
      page.getByRole("button", { name: /アートを保存・シェア|画像を生成中/i }),
    ).toBeVisible({ timeout: 20_000 });
  });
});
