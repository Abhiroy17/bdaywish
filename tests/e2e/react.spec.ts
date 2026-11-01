import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('React hydrates cleanly and new interactive scenes work by touch', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Order Sweet mocha' }).tap();
  await expect(page.locator('.coffee-receipt')).toContainText('Sweet mocha');
  await expect(page.locator('#coffee-note')).toContainText('Something sweet');
  await page.locator('#shuffle-date').tap();
  await expect(page.locator('.date-deck [role="status"]')).toContainText('Idea 6 of 6');
  await expect(page.locator('.date-card')).toHaveCount(1);
  await expect(page.locator('.date-card')).toContainText('little adventure');
  for (const star of await page.locator('.promise-star').all()) await star.tap();
  await expect(page.locator('#constellation-status')).toContainText('5 of 5');
  await expect(page.locator('.promise-message')).toContainText('one beautiful, imperfect season');
  for (const path of await page.locator('.constellation-lines path').all()) await expect(path).toHaveCSS('opacity', '1');
  await page.locator('.constellation').screenshot({ path: testInfo.outputPath('promise-constellation.png') });
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(scan.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
  expect(errors).toEqual([]);
});

test('replay resets all bonus interactions while keeping music choice', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Order Bold espresso' }).click();
  await page.locator('#shuffle-date').click();
  await page.locator('.promise-star').first().click();
  await page.locator('#reset-stars').click();
  await expect(page.locator('#constellation-status')).toContainText('0 of 5');
  await page.locator('.promise-star').first().click();
  await page.locator('#instrumental-toggle').click();
  // AudioContext.resume() is asynchronous on Linux WebKit; capture only settled playback.
  if (await page.evaluate(() => typeof AudioContext !== 'undefined')) {
    await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', 'true');
  } else {
    await expect(page.locator('#toast')).toContainText('Music is unavailable');
    await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', 'false');
  }
  const playing = await page.locator('#instrumental-toggle').getAttribute('aria-pressed');
  await page.locator('#replay').click();
  await expect(page.locator('#home')).toBeFocused();
  await expect(page.locator('#constellation-status')).toContainText('0 of 5');
  await expect(page.locator('.date-deck [role="status"]')).toContainText('Idea 1 of 6');
  await expect(page.getByRole('button', { name: 'Order Cozy latte' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', playing!);
});

test('reduced-motion keyboard users get the same bonus content without particles', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Order Bold espresso' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.coffee-receipt')).toContainText('Bold espresso');
  await page.locator('#shuffle-date').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('.date-deck [role="status"]')).toContainText('Idea 6 of 6');
  await page.locator('.promise-star').first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.promise-message')).toContainText('Your corner');
  await page.locator('#credits-sparkle').click();
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('featured song requests Spotify only after consent and stops from the header', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url()); });
  // Verify our integration, not the provider's account-dependent playback or availability.
  await page.route('https://open.spotify.com/**', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><title>Controlled music player</title><body><p>Isolated Spotify test double.</p></body></html>' }));
  await page.goto('/');
  await page.locator('#enter-music').click();
  await expect(page.locator('#song-player')).toBeFocused();
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(external).toEqual([]);
  await expect(page.locator('#song-title')).toHaveText('Love Story');
  await expect(page.locator('.streaming-alternative')).toContainText('Love Story (Taylor’s Version)');
  await expect(page.locator('#song-privacy')).toContainText('preview');
  await page.locator('#load-song').tap();
  await expect(page.locator('iframe')).toHaveAttribute('src', 'https://open.spotify.com/embed/track/3CeCwYWvdfXbZLXFhBrbnf?theme=0');
  await expect.poll(() => external.length).toBe(1);
  await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', 'false');
  await page.locator('#replay').click();
  await expect(page.locator('iframe')).toHaveCount(1);
  await page.getByRole('button', { name: 'Stop music', exact: true }).tap();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.locator('#load-song').click();
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('blocked Spotify does not block the birthday or the external song link', async ({ page }) => {
  await page.route('https://open.spotify.com/**', (route) => route.abort('failed'));
  await page.goto('/');
  await expect(page.getByText('Pisces soul', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Mulank 2', { exact: true })).toHaveCount(0);
  await page.locator('.trait-note summary').first().click();
  await expect(page.locator('.trait-note[open]')).toContainText('imagination');
  await page.locator('#load-song').click();
  await expect(page.getByRole('link', { name: /Open in Spotify/ })).toHaveAttribute('href', 'https://open.spotify.com/track/3CeCwYWvdfXbZLXFhBrbnf');
  await page.locator('#stop-music').click();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.locator('.letter-envelope summary').click();
  await expect(page.locator('.letter-paper')).toContainText('Pisces');
  await page.locator('#replay').click();
  await expect(page.locator('.trait-note[open]')).toHaveCount(0);
});