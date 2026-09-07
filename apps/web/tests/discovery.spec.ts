import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "What soundsgood right now?",
  );
});

test("filters the collection and recovers from combined no-results filters", async ({
  page,
}) => {
  await expect(page.getByRole("article")).toHaveCount(6);
  const search = page.getByRole("searchbox", {
    name: "Find your next favorite",
  });
  await search.fill("  sPiCe  ");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Spice Route" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Italian", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("0 restaurants");
  await expect(
    page.getByRole("heading", { name: "Nothing here just yet" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explore all restaurants" }).click();
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();
  await expect(page.getByRole("article")).toHaveCount(6);
  await page.getByRole("checkbox", { name: "Open now" }).check();
  await expect(page.getByRole("article")).toHaveCount(5);
  await expect(
    page.getByRole("heading", { name: "Morning Crumb" }),
  ).toHaveCount(0);
});

test("preserves saved IDs through filtering and manages focus after removal", async ({
  page,
}) => {
  const save = page.getByRole("button", {
    name: "Save Spice Route",
    exact: true,
  });
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Italian", exact: true }).click();
  await expect(save).toHaveCount(0);
  await page.getByRole("button", { name: "All cuisines" }).click();
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("checkbox", { name: "Saved only" }).check();
  await expect(page.getByRole("article")).toHaveCount(1);
  await save.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("article")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Your saved picks", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "Your next favorite is out there" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explore all restaurants" }).click();
  await save.click();
  await page.reload();
  await expect(save).toHaveAttribute("aria-pressed", "false");
});

test("supports keyboard navigation with named controls and a skip link", async ({
  page,
}) => {
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "All cuisines" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Indian", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("article")).toHaveCount(1);
});

test("loads local photos, renders fallbacks, and has no detected WCAG AA violations", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.reload();
  await expect(
    page.getByText("Demo collection", { exact: true }),
  ).toBeVisible();
  const bakery = page.getByRole("article", { name: "Morning Crumb" });
  await expect(bakery.getByText("New", { exact: true })).toBeVisible();
  await expect(bakery.getByText("Currently closed")).toBeVisible();
  await expect(bakery.getByText("Something good is baking")).toBeVisible();
  for (const photo of await page.getByRole("img").all()) {
    await photo.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        photo.evaluate((element) => (element as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  }
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath("home.png"),
    fullPage: true,
  });
});

test("keeps narrow screens within the viewport and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  const save = page.getByRole("button", {
    name: "Save Spice Route",
    exact: true,
  });
  const size = await save.boundingBox();
  expect(size?.width).toBeGreaterThanOrEqual(44);
  expect(size?.height).toBeGreaterThanOrEqual(44);
  const cuisine = page.getByRole("button", { name: "Italian", exact: true });
  expect(
    await cuisine.evaluate(
      (element) => getComputedStyle(element).transitionDuration,
    ),
  ).toBe("0s");
});
