import { expect, test } from '@playwright/test';

test('provided MP3 plays on tap, seeks, pauses, resumes, and stops in the background', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => { if (request.url().includes('.mp3')) requests.push(request.url()); });
  await page.goto('/');
  const media = page.locator('#local-song');
  await expect(media).toHaveAttribute('preload', 'none');
  await page.locator('#enter-quiet').click();
  await expect(page.locator('#credits')).toBeFocused();
  expect(requests).toEqual([]);
  expect(await media.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await page.locator('#play-local-song').tap();
  await expect(page.locator('#local-song-status')).toContainText('Now playing');
  await expect.poll(() => media.evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(.1);
  expect(await media.evaluate((audio: HTMLAudioElement) => audio.duration)).toBeGreaterThan(60);
  await media.evaluate((audio: HTMLAudioElement) => { audio.currentTime = 30; });
  await expect.poll(() => media.evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThanOrEqual(30);
  await page.locator('#play-local-song').tap();
  await expect(page.locator('#local-song-status')).toContainText('Paused');
  expect(await media.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await page.locator('#play-local-song').tap();
  await expect(page.locator('#local-song-status')).toContainText('Now playing');
  expect(await media.evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThanOrEqual(30);
  await page.getByRole('button', { name: 'Stop music', exact: true }).tap();
  expect(await media.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await page.locator('#enter-music').click();
  await expect(page.locator('#local-song-status')).toContainText('Now playing');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('#local-song-status')).toContainText('Paused');
  expect(await media.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await page.reload();
  expect(await page.locator('#local-song').evaluate((audio: HTMLAudioElement) => audio.paused && audio.currentTime === 0)).toBe(true);
});

test('native media controls and alternative sources never play over one another', async ({ page }) => {
  await page.route('https://open.spotify.com/**', (route) => route.fulfill({ contentType: 'text/html', body: '<p>Isolated streaming player.</p>' }));
  await page.goto('/');
  const media = page.locator('#local-song');
  await page.locator('#load-song').tap();
  await expect(page.locator('iframe')).toHaveCount(1);
  // This exercises native play events independently of our custom play button.
  await media.evaluate((audio: HTMLAudioElement) => audio.play());
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('#local-song-status')).toContainText('Now playing');
  await page.locator('#load-song').tap();
  expect(await media.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await page.locator('#play-local-song').tap();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.locator('#instrumental-toggle').click();
  expect(await media.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  await page.locator('#play-local-song').tap();
  await expect(page.locator('#instrumental-toggle')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#local-song-status')).toContainText('Now playing');
  await page.locator('#replay').click();
  expect(await media.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(false);
});

test('missing MP3 fails gently and can retry once the asset is available', async ({ page, browserName }) => {
  const mp3 = '**/audio/taylor-swift-love-story.mp3';
  if (browserName !== 'webkit') await page.route(mp3, (route) => route.fulfill({ status: 404, body: 'Missing audio fixture' }));
  await page.goto('/');
  // Windows WebKit's media backend bypasses page routing; use a genuinely missing URL.
  if (browserName === 'webkit') await page.locator('#local-song').evaluate((audio: HTMLAudioElement) => { audio.src = '/audio/missing-song-fixture.mp3'; });
  await page.locator('#play-local-song').tap();
  await expect(page.locator('#local-song-status')).toContainText('couldn’t play');
  await expect(page.locator('#play-local-song')).toBeEnabled();
  await expect(page.getByRole('link', { name: /Open in Spotify/ })).toBeVisible();
  await page.locator('.letter-envelope summary').click();
  await expect(page.locator('.letter-paper')).toBeVisible();
  if (browserName === 'webkit') await page.locator('#local-song').evaluate((audio: HTMLAudioElement) => { audio.src = '/audio/taylor-swift-love-story.mp3'; });
  else await page.unroute(mp3);
  await page.locator('#play-local-song').tap();
  await expect(page.locator('#local-song-status')).toContainText('Now playing');
});