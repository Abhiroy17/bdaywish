import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('complete birthday journey without mandatory music', async ({ page }, testInfo) => {
  // Seven animated chapters plus a full-page screenshot exceed 30s on Windows WebKit.
  // Keep individual assertion timeouts unchanged; only this end-to-end journey gets more time.
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Debarpita Turns 28/);
  await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', 'false');
  await page.screenshot({ path: testInfo.outputPath('birthday-home.png'), fullPage: true });
  await page.locator('.door-knock').click();
  await expect(page.locator('#toast')).toContainText('favourite person');
  await page.locator('#enter-quiet').click();
  await expect(page.locator('#credits')).toBeFocused();
  await page.locator('#coffee-mug').click();
  await expect(page.locator('#coffee-note')).toContainText('reserved for you');
  await page.locator('.memory summary').first().click();
  await expect(page.locator('.memory').first()).toHaveAttribute('open', '');
  await page.locator('.reason summary').first().click();
  await expect(page.locator('#reason-progress')).toContainText('1 of 28');
  await page.locator('#read-reasons').click();
  await expect(page.locator('.reason[open]')).toHaveCount(28);
  await page.locator('#make-wish').click();
  await expect(page.locator('.candle[aria-pressed="true"]')).toHaveCount(2);
  await expect(page.locator('#wish-status')).toContainText('universe');
  await page.locator('.letter-envelope summary').click();
  await expect(page.locator('.letter-paper')).toBeVisible();
  await expect(page.locator('.letter-signature')).toContainText('Abhijit');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator('#replay').click();
  await expect(page.locator('#home')).toBeFocused();
  await expect(page.locator('.reason[open]')).toHaveCount(0);
  await expect(page.locator('#make-wish')).toBeEnabled();
  expect(errors).toEqual([]);
});

test('optional instrumental is opt-in, can be muted and never autoplays', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', 'false');
  await page.locator('#instrumental-toggle').click();
  if (await page.evaluate(() => typeof AudioContext !== 'undefined')) {
    await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('.sound-button').click();
  } else {
    // Playwright's Windows WebKit build has no Web Audio; verify the actual fallback.
    await expect(page.locator('#toast')).toContainText('Music is unavailable');
  }
  await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('reduced motion and keyboard access never gate the letter', async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  // WebKit defaults to tabbing form controls only, following Safari's preference.
  if (browserName === 'webkit') await page.locator('.skip-link').focus();
  else await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await page.locator('.letter-envelope summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.letter-paper')).toBeVisible();
  await page.locator('#make-wish').click();
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.candle[aria-pressed="true"]')).toHaveCount(2);
});

test('no horizontal overflow and accessible closed/open scenes', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const closed = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(closed.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
  await page.locator('#read-reasons').click();
  await page.locator('.letter-envelope summary').click();
  const opened = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(opened.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
});

test('static content survives disabled JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('h1')).toContainText('Debarpita');
  await page.locator('.reason summary').first().click();
  await expect(page.locator('.reason').first().locator('p')).toBeVisible();
  await page.locator('.memory summary').first().click();
  await expect(page.locator('.memory').first().locator('p')).toBeVisible();
  await expect(page.locator('.letter-paper')).toBeVisible();
  await expect(page.locator('#shuffle-date')).toBeHidden();
  await page.locator('.trait-note summary').first().click();
  await expect(page.locator('.trait-note[open]')).toContainText('little worlds');
  await expect(page.getByRole('link', { name: /Open in Spotify/ })).toBeVisible();
  await context.close();
});

test('relative assets work on a hosting subpath with no third-party requests', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  // Model a static host mounting dist/ at /birthday/, without rewriting its HTML.
  await page.route('**/birthday/**', async (route) => {
    const url = new URL(route.request().url());
    url.pathname = url.pathname.replace(/^\/birthday\//, '/');
    const response = await route.fetch({ url: url.href });
    await route.fulfill({ response });
  });
  await page.goto('/birthday/');
  await expect(page.locator('.sound-button')).toHaveAttribute('title', /Love Story/);
  await page.locator('#make-wish').click();
  await expect(page.locator('#wish-status')).toContainText('universe');
  await page.evaluate(() => document.fonts.ready);
  expect(requests.some((url) => url.includes('/birthday/assets/'))).toBe(true);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});