import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("opens a menu by keyboard, keeps the shared header, and returns to discovery", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  await header.evaluate((element) => element.setAttribute("data-navigation-check", "retained"));
  const menuLink = page.getByRole("link", { name: "View menu for Spice Route" });
  await menuLink.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/restaurants\/spice-route$/);
  await expect(page).toHaveTitle("Spice Route menu | MealMind");
  await expect(header).toHaveCount(1);
  await expect(header).toHaveAttribute("data-navigation-check", "retained");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spice Route");
  await expect(page.getByRole("heading", { name: "Paneer Tikka Bowl" })).toBeVisible();
  await expect(page.getByText("$14.99", { exact: true })).toBeVisible();
  await page.getByRole("navigation", { name: "Menu categories" }).getByRole("link", { name: "Breads" }).click();
  await expect(page).toHaveURL(/#menu-breads$/);
  await expect(page.getByRole("heading", { name: "Breads", exact: true })).toBeInViewport();
  await header.getByRole("link", { name: "Explore restaurants" }).click();
  await expect(page).toHaveURL(/\/#discover$/);
  await expect(page.getByRole("searchbox")).toBeVisible();
});

test("supports direct menu visits, refreshes, metadata, and the closed empty menu", async ({ page }) => {
  for (const [id, name, dish] of [
    ["spice-route", "Spice Route", "Paneer Tikka Bowl"],
    ["bowl-theory", "Bowl Theory", "Avocado Roll"],
    ["pizza-corner", "Pizza Corner", "Margherita Pizza"],
    ["green-table", "Green Table", "Mediterranean Bowl"],
    ["taco-house", "Taco House", "Black Bean Tacos"],
  ]) {
    const response = await page.goto(`/restaurants/${id}`);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(`${name} menu | MealMind`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", `Explore the sample menu for ${name} on MealMind.`);
    await expect(page.getByRole("heading", { name: dish, exact: true })).toBeVisible();
    await expect(page.getByRole("main")).toHaveCount(1);
  }
  await page.reload();
  await expect(page.getByRole("heading", { name: "Black Bean Tacos" })).toBeVisible();
  await page.goto("/restaurants/morning-crumb");
  await expect(page).toHaveTitle("Morning Crumb menu | MealMind");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Morning Crumb");
  await expect(page.getByText("Currently closed", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The menu is still in the oven" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Menu categories" })).toHaveCount(0);
  await page.getByRole("link", { name: "Explore other restaurants" }).click();
  await expect(page.getByRole("searchbox")).toBeVisible();
});

test("handles unknown restaurant IDs and unmatched URLs with a useful return path", async ({ page }) => {
  for (const id of ["does-not-exist", "constructor"]) {
    await page.goto(`/restaurants/${id}`);
    await expect(page.getByRole("heading", { name: "Restaurant not found", exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
    await expect(page.getByRole("main")).toHaveCount(1);
    await page.getByRole("main").getByRole("link", { name: "Explore restaurants" }).click();
    await expect(page.getByRole("searchbox")).toBeVisible();
  }
  const response = await page.goto("/a-page-that-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found", exact: true })).toBeVisible();
});

test("menu and missing states support accessibility and narrow viewports", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/restaurants/spice-route");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  const photo = page.getByRole("img");
  await expect.poll(() => photo.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({ path: testInfo.outputPath("restaurant-menu.png"), fullPage: true });
  for (const path of ["/restaurants/spice-route", "/restaurants/morning-crumb", "/restaurants/missing", "/missing-page"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(scan.violations).toEqual([]);
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});
