# Your photographs

The scrapbook uses these optimized copies, in the supplied order:

| Preserved source | Deployed copy | Dimensions | Bytes |
| --- | --- | --- | --- |
| [IMG_4950.jpeg](../../IMG_4950.jpeg) | [IMG_4950.webp](IMG_4950.webp) | 900×1200 | 95,214 |
| [4th pic.jpg](../../4th%20pic.jpg) | [4th-pic.webp](4th-pic.webp) | 1200×900 | 69,078 |
| [IMG_5098.jpeg](../../IMG_5098.jpeg) | [IMG_5098.webp](IMG_5098.webp) | 900×1200 | 124,602 |
| [IMG_5117.jpeg](../../IMG_5117.jpeg) | [IMG_5117.webp](IMG_5117.webp) | 900×1200 | 162,882 |

Total: **451,776 bytes**. [The preparation script](../../scripts/prepare-photos.mjs) uses installed Playwright Chromium to decode images and export WebP pixels locally (quality 0.84, longest edge 1200px, no upscaling). It makes no network requests and omits the originals' EXIF/location metadata. Run `node scripts/prepare-photos.mjs` from the project root to regenerate the copies; original files are never modified.

In [the birthday content](../../src/content/birthday.ts), set each memory's relative `src`, descriptive `alt`, title, and caption. Do not start `src` with `/`; paths stay relative for subpath hosting. Photos load lazily and fit inside portrait frames without cropping. Original illustrations remain the fallback for unconfigured or unavailable photos.

Everything in this directory is copied into the publicly served build. Only include photographs you intend to share. Remove location/EXIF metadata first; never add credentials or private documents here.