/* global Image, document */
import { Buffer } from 'node:buffer';
import { log } from 'node:console';
import { readFile, writeFile } from 'node:fs/promises';
import { URL } from 'node:url';
import { chromium } from '@playwright/test';

// Re-encode pixels locally: keep originals untouched and omit EXIF/location metadata.
const photos = [
  ['IMG_4950.jpeg', 'IMG_4950.webp'],
  ['4th pic.jpg', '4th-pic.webp'],
  ['IMG_5098.jpeg', 'IMG_5098.webp'],
  ['IMG_5117.jpeg', 'IMG_5117.webp'],
];
const root = new URL('../', import.meta.url);
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.route('**/*', (route) => route.abort());
  for (const [source, target] of photos) {
    const bytes = await readFile(new URL(source, root));
    const result = await page.evaluate(async (data) => {
      const image = new Image();
      image.src = `data:image/jpeg;base64,${data}`;
      await image.decode();
      const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      return { data: canvas.toDataURL('image/webp', .84).split(',')[1], width: canvas.width, height: canvas.height };
    }, bytes.toString('base64'));
    const output = Buffer.from(result.data, 'base64');
    await writeFile(new URL(`public/images/${target}`, root), output);
    log(`${target}: ${result.width}x${result.height}, ${output.length} bytes`);
  }
} finally {
  await browser.close();
}