import type { Page } from '@playwright/test';

/** Model a browser blocking the first autoplay attempt; retries use real MP3 playback. */
export async function blockOpeningPlayback(page: Page) {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    let first = true;
    HTMLMediaElement.prototype.play = function () {
      if (first) {
        first = false;
        return Promise.reject(new DOMException('A tap is required', 'NotAllowedError'));
      }
      return play.call(this);
    };
  });
}