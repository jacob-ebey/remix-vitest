import { test, expect } from "@playwright/test";

test.describe("example", () => {
  test("changes name on submit", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await expect(
      await page.locator("h1", { hasText: "Hello, World!" })
    ).toBeVisible();

    await page.locator('input[name="name"]').fill("Test");
    await page.locator('button[type="submit"]').press("Enter");

    await expect(
      await page.locator("h1", { hasText: "Hello, Test!" })
    ).toBeVisible();
  });

  test("can navigate to the about page", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.locator("a[href='/about']").click();

    await expect(
      await page.locator("h1", { hasText: "About Page" })
    ).toBeVisible();
  });

  test("fails", () => {
    expect(true).toBe(false);
  });
});
