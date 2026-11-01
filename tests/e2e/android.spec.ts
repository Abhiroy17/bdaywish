import { expect, test } from '@playwright/test';

test('Android touch controls are comfortable and do not retain mouse hover styling', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
  const controls = page.locator('button:visible:not(:disabled)');
  for (const control of await controls.all()) {
    const size = await control.boundingBox();
    // Translated compositor layers can report 47.99997 for an exact 48 CSS px.
    expect(size!.width + .001, await control.getAttribute('id') ?? 'button').toBeGreaterThanOrEqual(48);
    expect(size!.height + .001).toBeGreaterThanOrEqual(48);
  }
  await page.locator('#instrumental-toggle').tap();
  await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#make-wish').tap();
  await expect(page.locator('#wish-status')).toContainText('universe');
  expect(await page.locator('#make-wish').evaluate((element) => getComputedStyle(element).transform)).toBe('none');
  await page.locator('.sound-button').tap();
  await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', 'false');
});

test('scrapbook supports a real touch swipe without opening a card', async ({ page }) => {
  await page.goto('/');
  const track = page.locator('.memory-track');
  await track.scrollIntoViewIfNeeded();
  await expect(page.locator('#memory-prev')).toBeDisabled();
  await expect(page.locator('#memory-next')).toBeEnabled();
  const box = (await track.boundingBox())!;
  const x = box.x + box.width * .8;
  const y = box.y + Math.min(100, box.height / 2);
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let step = 1; step <= 8; step++) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - step * 25, y }] });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(20);
  await expect(page.locator('.memory[open]')).toHaveCount(0);
  await expect(page.locator('#memory-prev')).toBeEnabled();
  await track.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
  await expect(page.locator('#memory-next')).toBeDisabled();
  await page.locator('#memory-prev').tap();
  await expect(page.locator('#memory-next')).toBeEnabled();
});

test('rotation and tablet split-screen preserve birthday state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('.reason summary').first().tap();
  await page.locator('.candle').first().tap();
  for (const viewport of [
    { width: 915, height: 412 }, { width: 1280, height: 800 },
    { width: 800, height: 1280 }, { width: 360, height: 740 }, { width: 320, height: 740 },
  ]) {
    await page.setViewportSize(viewport);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.reason[open]')).toHaveCount(1);
    await expect(page.locator('.candle[aria-pressed="true"]')).toHaveCount(1);
    await expect(page.locator('#reason-progress')).toContainText('1 of 28');
  }
  await page.locator('.letter-envelope summary').tap();
  await expect(page.locator('.letter-paper')).toBeVisible();
});