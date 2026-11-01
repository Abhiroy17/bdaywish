# The One Where Debarpita Turns 28

A romantic, FRIENDS-inspired birthday episode for **Debarpita**, from **Abhijit**, for **2 November 2026**. A **React 19 + TypeScript** website with **Motion for React** and **canvas-confetti**, pre-rendered to fully static hosting output. Mobile/tablet-first, with personalized notes and the **user-provided Love Story MP3** as the primary soundtrack. No backend or site account. Content, the MP3, and an optional original instrumental work without third-party requests; the alternative official Spotify player connects externally only after explicit consent.

Primary viewing devices: **Samsung Galaxy Tab and a Nothing phone**. Android Chrome is the priority; the design adapts to the browser's available width rather than a hardcoded device model. Exact Tab model and phone display settings are unconfirmed.

## Quick start

Use Node.js 24 LTS and a recent npm. Install dependencies with `npm ci`, then run `npm run dev`. Open the URL printed by Vite. This is a Vite project: serve it over HTTP rather than double-clicking the source HTML.

For phone/tablet testing on the same trusted Wi-Fi, run `npm run dev -- --host 0.0.0.0` and open the displayed network URL on the device. Windows Firewall may require local-network permission. Do not expose the development server to the public internet.

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run typecheck` | Strict TypeScript checks, including tests/configuration |
| `npm run lint` | ESLint |
| `npm test` | Hermetic unit tests |
| `npm run test:coverage` | Enforce ≥80% lines, branches, statements, and functions per application module |
| `npm run build` | Generate deployable static output in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npx playwright install chromium webkit` | Install browser test engines once |
| `npm run test:e2e` | Phone/tablet browser journeys and axe accessibility checks; build first |
| `npm audit --audit-level=high` | Dependency security gate |

No environment variables or API keys are required. Only local mute preference is persisted, with graceful storage-denied handling. No birthday date lock; she can revisit at any time.

## The episode

1. **The apartment door:** original lavender room and orange sofa, with a spring-driven 3D door. Knock for a secret message; enter with music or quietly.
2. **Starring you:** birthday opening credits, physics-based confetti, and the supplied **Love Story** MP3 with tap-to-play and native seek/pause controls. The official **Love Story (Taylor’s Version)** Spotify player remains an alternative behind a click-to-load privacy notice, alongside a clearly labeled original instrumental.
3. **Our little corner:** pick up the cup for a note or choose one of three coffee orders. Each order reveals different affectionate prose and an animated café receipt.
4. **Little moments:** illustrated photo placeholders and tap-to-open scrapbook cards; native swipe/arrow navigation. A bonus date-night deck shuffles through six future date ideas, with spring-based card entrance/exit animations.
5. **28 reasons:** affectionate notes behind hearts, spring layout transitions, discovery progress, and an open-all option. Four additional native trait cards celebrate imagination, tenderness, thoughtful gestures, and quiet strength. Large open-all layouts avoid animating every card at once.
6. **Make a wish:** tap each number candle or the wish button; bounded canvas confetti, no microphone access.
7. **Love, always:** an animated envelope and full birthday letter, plus five tappable promise stars. Connecting adjacent stars draws a constellation. Finish with a final wish and replay, which resets all bonus interactions without changing the music choice.

All activities are optional. The skip link leads straight to the letter. Native details elements keep notes and memories usable without JavaScript; the full letter is open in the static HTML and enhanced into an envelope when JavaScript runs. Bonus interactive widgets are hidden in the no-JavaScript fallback. Reduced-motion users get the same interactive content with instantaneous state changes, no spatial animation, and no confetti. Touch, mouse, and keyboard activation are supported; no dragging, long press, or permission prompt is required.

## Personalize before sharing

Edit **`src/content/birthday.ts`**:

- `name`, `sender`, `age`, and ISO `date` hold the occasion.
- `memories` holds photo titles, captions, optional `src` and descriptive `alt` text.
- `reasons` contains the 28 original draft messages (count must match `age`).
- `letter` contains the original romantic draft, paragraph by paragraph.
- `personality` contains the user-supplied Pisces identity, Mulank 2, and four editable trait notes. These are poetic inspirations, not evidence-based personality claims. The birthday stays **2 November**; the app does not calculate or infer a sun sign from that date. Pisces can be a personally supplied identity rather than a Western sun-sign calculation.

The opening no longer displays the **“Pisces soul”** or **“Mulank 2”** badges. The personalized trait notes and letter remain unchanged by this visual cleanup.

The draft avoids inventing specific shared events. Review it so it sounds like you. Four illustration placeholders are intentionally present until you add real photos.

To add a photo, put it in `public/images/`, set that memory's `src` to a relative path such as `images/our-photo.webp`, add a meaningful `alt`, and replace the placeholder caption. Aim for 1200px-wide WebP/JPEG files under 250 KB, strip EXIF/location metadata, and use photos you have permission to share. Offscreen photographs load lazily and failed photos show a readable fallback.

The document title/description in [index.html](index.html) are personalized too; update those if reusing the project for someone else. Scene-specific original prose and chapter labels now live in the React scene components. Edit [src/content/surprises.ts](src/content/surprises.ts) for the coffee notes, six date ideas, and five promises. These are suggestions and original drafts, not claims about past shared events. Restart the development server after content edits if the pre-rendered HTML looks stale, and rebuild before publishing.

## Featured song, original instrumental, and artwork

The primary soundtrack is the **user-provided** [public/audio/taylor-swift-love-story.mp3](public/audio/taylor-swift-love-story.mp3), copied byte-for-byte from the preserved original [taylor-swift-love-story.mp3](taylor-swift-love-story.mp3). No recording was downloaded for this integration. The file is **9,836,461 bytes (about 9.84 MB)** and browsers report approximately **3:56** duration. Its recording/version has **not been independently verified**, so the local player is labeled **Love Story**, not Taylor’s Version. Ensure appropriate rights to host/share the recording before publishing it; no rights are established by possessing a file.

Local metadata and the relative asset path are configured in [src/content/music.ts](src/content/music.ts). To replace the soundtrack, replace the public audio asset and update that configuration as needed, then rebuild. [src/components/SongPlayer.tsx](src/components/SongPlayer.tsx) renders the local player and optional alternatives.

- **Come on in** starts the supplied MP3 directly from the tap gesture and takes her to the song card. **Enter quietly** stops all in-page sources. The idle header **Our song** opens the card without starting playback.
- The native audio element has **`preload="none"` and no autoplay**. Playback begins only through a deliberate action; page load/reload does not start it. Native controls support seeking, volume, and pause/resume and remain usable without JavaScript. The supplied song does not loop automatically.
- **Play Love Story / Pause Love Story** preserves playback position. Buffering and errors have readable status messages; a failed load can be retried without preventing access to birthday content.
- Starting any in-page source stops the others: MP3, original instrumental, and embedded Spotify cannot intentionally overlap. Native audio play events also stop the alternatives.
- The header becomes **Stop music** while the MP3 is loading/playing, an embedded player is loaded, or the instrumental is active. It pauses local audio and removes the Spotify iframe. Backgrounding/page exit does the same; returning requires another deliberate tap. Visual replay preserves the music choice and local playback position.

The optional streaming alternative is [Love Story (Taylor’s Version) by Taylor Swift](https://open.spotify.com/track/3CeCwYWvdfXbZLXFhBrbnf), using the verified official Spotify track `3CeCwYWvdfXbZLXFhBrbnf`. This verified streaming identity does not identify the supplied MP3's version.

- **Load Spotify player** explicitly connects to Spotify. Its player must then be activated with its own play control; neither opening the page nor playing the local MP3 loads Spotify.
- Spotify may provide a **preview**; full-track playback depends on account, region, platform restrictions, and browser support. The visible **Open in Spotify** link is always available, including without JavaScript and when embedding is blocked. Full playback is not guaranteed by this website.
- An external Spotify tab/app is separate: playback there is controlled by Spotify, not by this page’s stop button.

**“A Little More of Us”** is an original, approximately 19-second looping instrumental arrangement in `src/lib/audio.ts`. It is synthesized locally with soft triangle-wave melody, sine chords/bass, and light pitched percussion. It uses no audio downloads, samples, or TV theme melody. The theme recording is not bundled.

This optional fallback starts only through **Play original instrumental instead**, and is explicitly labeled **not Taylor’s song**. Unsupported Web Audio fails quietly with an explanation; the letter and activities do not depend on music.

Artwork is original SVG/CSS in `src/art.ts` and the stylesheets, not show stills, cast photos, or a copied logo. Self-hosted **DM Sans**, **Cormorant Garamond**, and **Caveat** are distributed via Fontsource under their included open font licenses. This is an unofficial personal tribute, not affiliated with the TV show or its owners.

## Architecture

- [vite.config.ts](vite.config.ts): React build integration and pre-rendering in development and production.
- [src/render.ts](src/render.ts): validates content and calls React DOM's server renderer. Editable text is escaped by React.
- [src/main.ts](src/main.ts): hydrates the existing static HTML with the same React tree; releases the root during hot replacement.
- [src/App.tsx](src/App.tsx): seven-scene React application, header, footer, and Motion configuration.
- [src/components/Opening.tsx](src/components/Opening.tsx), [src/components/CoffeeAndMemories.tsx](src/components/CoffeeAndMemories.tsx), [src/components/ReasonsAndWish.tsx](src/components/ReasonsAndWish.tsx), [src/components/Letter.tsx](src/components/Letter.tsx): semantic, state-driven birthday scenes.
- [src/components/Surprises.tsx](src/components/Surprises.tsx): coffee orders, date-card deck, and constellation interactions.
- [src/components/SongPlayer.tsx](src/components/SongPlayer.tsx) and [src/content/music.ts](src/content/music.ts): native MP3 player, separate local/streaming metadata, and consent-gated official Spotify alternative.
- [src/components/primitives.tsx](src/components/primitives.tsx): shared viewport reveals, animated door, and original artwork. Raw HTML insertion is restricted to locally authored SVG, never editable messages.
- [src/hooks/useBirthday.ts](src/hooks/useBirthday.ts): audio consent, notes, candles, replay, bounded confetti/timers, and event/observer cleanup. React owns interaction state; native carousel and visibility helpers are attached through effects.
- [src/hooks/useLocalSong.ts](src/hooks/useLocalSong.ts): native media playback state, buffering/errors/retry, stale-play cancellation, alternative-source coordination, and resource cleanup.
- [src/content/birthday.ts](src/content/birthday.ts) and [src/content/surprises.ts](src/content/surprises.ts): editable occasion and bonus content.
- [src/lib/audio.ts](src/lib/audio.ts): user-activated Web Audio scheduling, cancellation, pause, and teardown.
- [src/lib/carousel.ts](src/lib/carousel.ts): native swipe scrolling, geometry-based arrow navigation, boundary states, and rotation/resize updates.
- [src/lib/motion.ts](src/lib/motion.ts): visible-scene animation lifecycle and reduced-motion preference.
- [src/lib/preferences.ts](src/lib/preferences.ts): guarded browser storage.
- [src/styles/interactions.css](src/styles/interactions.css): touch-friendly bonus scenes alongside the original responsive styles.

**Rendering decision:** the same React tree produces HTML at build time and hydrates in the browser. This is not a blank client-only SPA and needs no runtime Node server. Both the HTML and JavaScript contain personal content; hosting privacy precautions still apply. Server and first-client animation styles agree even when the client requests reduced motion. The letter closes only after hydration.

**Animation decision:** Motion for React (the successor to Framer Motion) handles spring transforms, layout transitions, viewport reveals, SVG path drawing, and `AnimatePresence` card exits. `LazyMotion` with the `m` components and `domMax` provides the required layout features. canvas-confetti replaces the handmade particle system with a single bounded burst per activation; replay and teardown cancel it. Native horizontal scrolling is deliberately retained instead of hijacking touch gestures.

Unit tests use React Testing Library, mocked audio/storage/observers/timers, and mocked particle rendering. The coverage gate includes both TypeScript and TSX; only the browser bootstrap is excluded and covered by real-browser tests.

## Verification and limitations

Automated checks cover content escaping/validation, all 28 notes, candle completion, replay, original-audio scheduling, pending resume cancellation, storage denial, missing media, observers, reduced motion, and cleanup. Browser projects cover 390×844 Chromium, 360×800 WebKit, 768×1024 WebKit, and 1024×768 Chromium, plus Android-class 412×915 phone and 800×1280 tablet Chromium profiles. The latter are representative CSS viewports, not claimed hardware specifications. All profiles run no-JavaScript and keyboard journeys and closed/expanded accessibility checks.

**Windows Playwright WebKit has no Web Audio API**, so its original-instrumental fallback is tested while synthesized playback is tested in Chromium. **Native MP3 playback works and is tested in both Chromium and WebKit.** WebKit's media backend bypasses Playwright request interception; its missing-MP3 test uses a genuinely missing local URL and restores the real source to verify recovery. Chromium also tests recovery after an intercepted 404 at the unchanged source URL. Safari defaults to tabbing form controls unless full keyboard navigation is enabled, so WebKit tests explicitly focus the skip link before keyboard activation. These emulators do not replace physical-device testing.

Before sending, manually check **Chrome on her Samsung Galaxy Tab and Nothing phone**: tap to start sound, mute, background/resume, portrait/landscape, tablet split-screen, TalkBack navigation, and comfortable text zoom. If she normally uses Samsung Internet or opens links inside WhatsApp, check that browser too; open in Chrome if its in-app audio behavior differs. Actual speaker volume, Bluetooth routing and device audio policies cannot be validated in desktop automation. Safari remains covered for compatibility but is not the primary target.

The personalized build ships roughly **133 KB gzipped JavaScript total**, including React, Motion, canvas-confetti, and personal content; about **10.1 KB gzipped CSS**; and local fonts. The **9.84 MB MP3 is separate**, with `preload="none"`; playing it adds an audio transfer and mobile data cost. Spotify transfers additional provider-controlled resources only after consent. Pre-rendered content remains visible before hydration. Personal photographs can increase transfer size. No Lighthouse score or physical-device frame-rate claim is made without measurement.

Verified after local MP3 integration and removal of the opening identity badges: **30 unit tests** and **90 browser tests across six profiles** passed. Application coverage is **100% lines, 99.29% statements, 98.71% branches, and 98.41% functions**, with all per-file gates passing. Typecheck, lint, and production build pass. No dependencies were added for this change; the previous production audit was clean, with moderate development-only tooling advisories documented below.

Browser checks include clean React hydration, touch coffee orders, animated date cards, promise connections/reset, replay, native swipes, 48px controls (allowing only compositor floating-point rounding), music consent, keyboard/reduced-motion behavior, no-JavaScript trait/letter content, and closed/expanded axe checks. Rotation/split-screen checks cover 915×412, 1280×800, 800×1280, 360×740, and 320×740 layouts. Relative subpath hosting and same-origin-only requests **before Spotify consent** remain verified. Spotify wrapper tests use an isolated provider response or a blocked request; they verify consent, URL, stop/unload, reload, and fallback behavior, not account-dependent real song playback. The full seven-scene screenshot journey has a 60-second budget for Windows WebKit; individual assertion timeouts and zero retries are unchanged. A reusable VS Code **Preview birthday website** task starts the local server.

[tests/unit/local-song.test.tsx](tests/unit/local-song.test.tsx) isolates native media methods and events, including failed playback, reload/retry, stale results, cancellation, and teardown. [tests/e2e/local-song.spec.ts](tests/e2e/local-song.spec.ts) exercises real MP3 playback, seek/pause/resume, source exclusion, replay, quiet reload, simulated backgrounding, and missing-resource recovery on every browser profile.

### Check on the actual Android devices

1. Keep the computer and device on the **same trusted Wi-Fi**. The localhost preview address only works on the computer, not on her phone/tablet.
2. Run the VS Code task **Preview on Android (trusted Wi-Fi)**. It builds and serves only the production output on port 4174. Open the displayed **Network** URL in Chrome on the device. This exposes the preview to devices on that local network; do not use it on public Wi-Fi or port-forward it.
3. Use the phone's **media** volume slider (ringtone volume is separate). Tap **Come on in** to start the MP3, then test pause/resume and seeking using the native controls. Try **Enter quietly** and confirm it stays silent. If choosing Spotify instead, tap **Load Spotify player**, then its own play control; check preview/full-song availability. Try the separately labeled original instrumental too. The site never overrides volume or forces autoplay.
4. Swipe the scrapbook sideways, tap a few hearts, turn the device, then open the cake and letter. Rotating/resizing keeps already opened notes and extinguished candles intact.
5. Briefly switch apps or lock the screen. The embedded player is unloaded and local sound pauses. After returning, deliberately resume the MP3, reload Spotify, or restart the instrumental. If the external Spotify app is playing, use its own controls.
6. Stop the network-preview task when finished. A permanent link still requires publishing the static build to a host.

On touch devices, controls are at least 48px, the full letter uses 16px text, and mouse-hover effects are disabled. Scrapbook arrows reflect the beginning/end and recalculate on resize; native swiping and pinch zoom are not intercepted. No user-agent sniffing or orientation lock is used.

Tooling notes: TypeScript is on a lint-compatible 5.9 release. Vitest 4 is pinned to its major because Vitest 5 produced a Windows coverage temporary-directory lock. An older npm 11.1 resolver also failed on its optional peer graph; use current npm if reinstalling dependencies. Prefer Node 24 LTS over Node 26's experimental Web Storage behavior for tests.

## Deployment

Build with `npm run build` and publish **only `dist/`** to any static HTTPS host.

- **Netlify / Cloudflare Pages:** build command `npm run build`, output directory `dist`.
- **Vercel:** use the Vite preset, or the same build command/output directory; no server functions needed.
- **GitHub Pages:** publish the contents of `dist/` using a Pages workflow or your preferred deployment process. `base: './'` keeps bundled asset references relative, so root hosting and a project URL such as `/birthday/` work without rebuilding with a different base. Always use the folder's trailing-slash URL. Navigation uses in-page anchors, not client routes; no SPA rewrite is needed.

### GitHub Pages

The [deployment workflow](.github/workflows/ci.yml) validates every push and pull request. After all checks pass on `main`, it publishes only `dist/` through GitHub Pages. Pull requests and other branches cannot deploy. A manual **Run workflow** is also available on `main`.

Repository setup: in **Settings → Pages → Build and deployment**, select **GitHub Actions**. The intended repository is **Abhiroy17/bdaywish**, with the site at **https://abhiroy17.github.io/bdaywish/** once its first deployment succeeds. GitHub Pages is public; a private repository alone does not make the site private, and private-repository Pages requires an eligible GitHub plan.

The workflow uses Node.js 24, the committed npm lockfile, and the built-in GitHub token with read-only permissions for validation and narrowly scoped Pages/OIDC permissions for deployment. No personal access token or application secrets are needed in the workflow. Deployment is serialized and waits for typecheck, lint, coverage, dependency audit, build, and browser tests. For updates, push to `main` and check **Actions → Birthday website checks and Pages** before sharing the URL.

Original media files in the repository root, dependency folders, local environment files, and generated reports are excluded by [.gitignore](.gitignore). Prepared assets under `public/` are intentionally included and publicly accessible after deployment. Original files remain on the local computer.

### Privacy and security

Every deployed photo, message, and audio file is accessible to anyone who can access its URL. The public MP3 is copied into the production output; confirm hosting/sharing rights before deployment. `noindex, nofollow` discourages search indexing but **is not access control**. For genuine privacy, use hosting-level password/access protection. Do not put secrets, credentials, or private documents in source or `public/`; avoid publishing the source repository if its history includes private assets.

The site itself adds no analytics, uploads, or device-permission requests. React and animation dependencies, fonts, and illustrations are local. **Spotify is an opt-in third party**: loading its frame or following its external link sends requests to Spotify and may involve its cookies, analytics, account, and regional policies. No Spotify iframe, SDK, preconnect, album image, or tracking request is created before consent. The embed uses a no-referrer policy; the external link uses `noopener noreferrer`. Consent is not persisted, and no Spotify credentials are collected by this site.

At the last dependency verification, production dependencies had **zero vulnerabilities**; development tooling had 11 moderate transitive minimatch advisories with no compatible non-breaking fix in the selected latest lint stack. The CI audit gate rejects high/critical vulnerabilities, including dev dependencies. Do not use a forced major-version audit fix without revalidation.

## CI and release notes

[.github/workflows/ci.yml](.github/workflows/ci.yml) installs from the lockfile, typechecks, lints, enforces per-file coverage, audits high/critical dependencies, builds, and runs Chromium/WebKit journeys with accessibility checks. Reports are retained for seven days. Successful `main` runs then deploy the static build to GitHub Pages.

**GitHub Pages deployment:** added gated automatic/manual deployment with least-privilege permissions and serialized releases; excluded root-level original personal media from Git while retaining prepared website assets. Darkened the lobster button's tap hint to meet WCAG AA text contrast, caught by the existing browser accessibility regression tests before publishing.

**Deployment regression check:** updated the secret-message unit test to assert the current “My best friend, my favourite person” message rather than the replaced lobster wording. The interaction and deployed copy are unchanged.

**1.0.0:** Seven personalized scenes, 28 notes, four editable scrapbook placeholders, original instrumental and artwork, candle wish celebration, full birthday letter, responsive touch UI, reduced-motion and no-JavaScript support, and automated validation.

**Android refinement:** Galaxy Tab/Nothing-phone viewing priority, enlarged touch controls and text, safe-area and short-landscape header refinements, touch-safe hover behavior, native-swipe carousel boundary handling, and dedicated Android Chromium coverage.

**React & Motion enhancement:** migrated the complete scene tree and interaction state to React with static HTML hydration. Added Motion spring/viewport/layout/card/path animations, canvas-confetti celebrations, three coffee orders with animated receipts, six date-night cards, five connected promise stars, and a soundtrack player. Preserved original music, editable photos, accessibility, no-JavaScript notes/letter, Android touch behavior, and full visual replay. Added TSX coverage, React Hooks linting, hydration checks, and browser journeys for every bonus interaction.

**Pisces, Mulank 2 & Love Story:** added user-supplied celestial identity badges, four native trait notes, and gentleness/imagination-inspired letter, reasons, coffee, and promise copy. Featured the verified official **Love Story (Taylor’s Version)** Spotify player behind explicit consent, with preview/account disclosure, external fallback, one-tap stopping, and no overlap with the optional original instrumental. Added isolated player/privacy tests and preserved the 2 November birthday.

**Provided MP3 & opening cleanup:** integrated the supplied Love Story file as the primary tap-to-play soundtrack, with native no-JavaScript controls, seeking, pause/resume, background stopping, loading/error/retry states, and mutual exclusion with Spotify and the original instrumental. Preserved the original supplied file and kept recording-version verification separate from the official Spotify metadata. Removed the opening “Pisces soul” and “Mulank 2” badges and their unused styles; personalized trait notes and letter remain. Added native-media unit tests and real playback/recovery journeys across all six browser profiles.